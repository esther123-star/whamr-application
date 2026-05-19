/**
 * upload-to-r2.js
 * Uploads the entire Whamr media library to Cloudflare R2.
 *
 * Setup:
 *   1. Copy ../.env.r2.example to ../.env.r2 and fill in your credentials
 *   2. npm install  (inside this scripts/ folder)
 *   3. node upload-to-r2.js
 *
 * Features:
 *   - Skips files already uploaded (reads from upload-manifest.json)
 *   - Shows live progress: "[ 12/341 ] Uploading Dance/Billy Madison Dance.mp4"
 *   - Retries failed uploads up to 3 times
 *   - Writes upload-manifest.json on completion (used by generate-catalog.js)
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.r2") });

const { S3Client, HeadObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const fs   = require("fs");
const path = require("path");
const mime = require("mime-types");

// ── Config ────────────────────────────────────────────────────────────────────

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
  MEDIA_SOURCE,
} = process.env;

const REQUIRED = ["R2_ACCOUNT_ID","R2_ACCESS_KEY_ID","R2_SECRET_ACCESS_KEY","R2_BUCKET_NAME","R2_PUBLIC_URL","MEDIA_SOURCE"];
const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`\n❌  Missing env vars: ${missing.join(", ")}`);
  console.error("    Copy .env.r2.example → .env.r2 and fill in your values.\n");
  process.exit(1);
}

const MEDIA_BASE    = MEDIA_SOURCE;
const MANIFEST_FILE = path.join(__dirname, "upload-manifest.json");
const MEDIA_EXTS    = new Set([".mp4", ".webp", ".gif", ".jpg", ".jpeg", ".png"]);
const MAX_RETRIES   = 3;
const CONCURRENCY   = 4; // upload N files in parallel

// ── S3 / R2 client ────────────────────────────────────────────────────────────

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function scanFiles(dir, base = dir, segments = []) {
  const results = [];
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return results; }
  for (const entry of entries) {
    const full = path.join(dir, entry);
    let stat;
    try { stat = fs.statSync(full); } catch { continue; }
    if (stat.isDirectory()) {
      results.push(...scanFiles(full, base, [...segments, entry]));
    } else {
      const ext = path.extname(entry).toLowerCase();
      if (!MEDIA_EXTS.has(ext)) continue;
      const relPath = [...segments, entry].join("/");
      results.push({ fullPath: full, relPath, size: stat.size });
    }
  }
  return results;
}

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch {
    return { uploaded: {}, failed: [] };
  }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

async function keyExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

function formatSize(bytes) {
  if (bytes < 1024)       return `${bytes} B`;
  if (bytes < 1024 ** 2)  return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3)  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function pad(n, total) {
  return String(n).padStart(String(total).length, " ");
}

async function uploadFile(file, idx, total, manifest) {
  const { fullPath, relPath, size } = file;
  const key         = relPath;
  const contentType = mime.lookup(relPath) || "application/octet-stream";

  // Skip if already uploaded
  if (manifest.uploaded[key]) {
    console.log(`  [ ${pad(idx, total)}/${total} ] ✓ skip   ${relPath}`);
    return;
  }

  // Skip if already on R2 (from a previous run without manifest)
  if (await keyExists(key)) {
    console.log(`  [ ${pad(idx, total)}/${total} ] ✓ exists ${relPath}`);
    manifest.uploaded[key] = { size, url: `${R2_PUBLIC_URL}/${key}`, ts: Date.now() };
    saveManifest(manifest);
    return;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const tag = attempt > 1 ? ` (retry ${attempt})` : "";
      process.stdout.write(`  [ ${pad(idx, total)}/${total} ] ↑ upload ${relPath} ${formatSize(size)}${tag}\n`);

      const upload = new Upload({
        client: s3,
        params: {
          Bucket:      R2_BUCKET_NAME,
          Key:         key,
          Body:        fs.createReadStream(fullPath),
          ContentType: contentType,
          CacheControl:"public, max-age=31536000, immutable",
        },
        queueSize:  4,
        partSize:   5 * 1024 * 1024, // 5 MB parts
      });

      await upload.done();
      manifest.uploaded[key] = { size, url: `${R2_PUBLIC_URL}/${key}`, ts: Date.now() };
      saveManifest(manifest);
      return;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.error(`  [ ${pad(idx, total)}/${total} ] ✗ FAILED  ${relPath}: ${err.message}`);
        manifest.failed.push({ key, error: err.message, ts: Date.now() });
        saveManifest(manifest);
      }
    }
  }
}

async function runQueue(tasks, concurrency) {
  const queue = [...tasks];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const task = queue.shift();
      if (task) await task();
    }
  });
  await Promise.all(workers);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🚀  Whamr → Cloudflare R2 Upload");
  console.log(`    Bucket : ${R2_BUCKET_NAME}`);
  console.log(`    Source : ${MEDIA_BASE}`);
  console.log(`    Public : ${R2_PUBLIC_URL}\n`);

  if (!fs.existsSync(MEDIA_BASE)) {
    console.error(`❌  Media source not found: ${MEDIA_BASE}`);
    process.exit(1);
  }

  const files    = scanFiles(MEDIA_BASE);
  const manifest = loadManifest();

  console.log(`    Found  : ${files.length} media files`);
  const alreadyDone = Object.keys(manifest.uploaded).length;
  console.log(`    Cached : ${alreadyDone} already uploaded\n`);

  const startTime = Date.now();

  const tasks = files.map((file, i) =>
    () => uploadFile(file, i + 1, files.length, manifest)
  );

  await runQueue(tasks, CONCURRENCY);

  const elapsed  = ((Date.now() - startTime) / 1000).toFixed(1);
  const uploaded = Object.keys(manifest.uploaded).length;
  const failed   = manifest.failed.filter(f => !manifest.uploaded[f.key]).length;
  const totalBytes = Object.values(manifest.uploaded).reduce((s, v) => s + (v.size || 0), 0);

  console.log("\n─────────────────────────────────────────");
  console.log(`✅  Done in ${elapsed}s`);
  console.log(`    Uploaded : ${uploaded} files  (${formatSize(totalBytes)})`);
  if (failed) console.log(`    Failed   : ${failed} files  (see upload-manifest.json)`);
  console.log(`    Manifest : scripts/upload-manifest.json`);
  console.log("\n    Next step: node generate-catalog.js\n");
}

main().catch(err => {
  console.error("\n❌ Unexpected error:", err.message);
  process.exit(1);
});
