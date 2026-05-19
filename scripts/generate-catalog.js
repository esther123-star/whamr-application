/**
 * generate-catalog.js
 * Reads upload-manifest.json (produced by upload-to-r2.js) and generates
 * data/memes.json with R2 public URLs, AI categorisation, and dedup.
 *
 * Run after upload-to-r2.js:
 *   node generate-catalog.js
 *
 * Outputs: ../data/memes.json  (the file the Whamr static site reads)
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.r2") });

const fs   = require("fs");
const path = require("path");
const crypto = require("crypto");

const MANIFEST_FILE  = path.join(__dirname, "upload-manifest.json");
const OUTPUT_FILE    = path.join(__dirname, "../data/memes.json");
const R2_PUBLIC_URL  = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

// ── AI Categorisation rules ───────────────────────────────────────────────────

const CAT_RULES = [
  { cat: "dance",     kw: ["dance","dancing","groove","renegade","azonto","gwara","zanku","macarena","shuffle","disco","ballet","robot"] },
  { cat: "laughing",  kw: ["laugh","lol","laughing","giggle","chuckle","hilarious","haha","rofl","hysterical","maniacal","funny","snort"] },
  { cat: "sad",       kw: ["sad","cry","crying","tears","sob","sobbing","depress","unhappy","meltdown","grief","mourn","weep","heartbreak"] },
  { cat: "reactions", kw: ["react","reaction","shocked","scream","screaming","yikes","oop","noice","wow","omg","whoa","gasp","rage","hell no"] },
  { cat: "naija",     kw: ["naija","nigeria","nollywood","pawpaw","ibu","kosoko","ozokwo","akindele","funke","pidgin","yoruba","igbo","hausa","african","africa","aki","jide"] },
  { cat: "sports",    kw: ["sport","football","basketball","nfl","nba","soccer","goal","champion","brady","barkley","bayless","lebron","chiefs","coach","athlete","garoppolo"] },
  { cat: "awkward",   kw: ["awkward","cringe","embarrass","uncomfortable","weird","cooked","regret","nervous","oops"] },
  { cat: "birthday",  kw: ["birthday","happy birthday","bday","celebrate","celebration","cake","chiplette","party"] },
  { cat: "love",      kw: ["love","kiss","heart","romance","cute","adorable","crush","affection","hug","couple","darling","dear","blowing kiss","friggin love"] },
  { cat: "random",    kw: ["random","monday","deadline","wifi","adulting","chaos","coffee","business","grammar","fowl"] },
];

// Maps physical folder names to memes.json categories
const FOLDER_CAT = {
  "Dance":          "dance",
  "Reaction":       "reactions",
  "LOL":            "laughing",
  "Sad":            "sad",
  "Sport":          "sports",
  "Love":           "love",
  "Happy birthday": "birthday",
  "Excited":        "reactions",
  "Africa meme 1":  "naija",
  "Africa Meme 2":  "naija",
  "Trending Vlips": "random",
  "Vine Reaction":  "reactions",
  "Memes":          "random",
  "for landing mage": "random",
  "selected":       "random",
  "Sticker":        "stickers",
};

const NOISE = new Set(["the","and","for","with","that","this","from","meme","video","gif","lol","stk","its","you","are","not","was","were","has","his","her","they","can","will","but","when","how","what","who","why"]);

function categorise(filename, folderName) {
  const fc = FOLDER_CAT[folderName];
  if (fc && fc !== "random") return fc;

  const low = filename.toLowerCase();
  for (const { cat, kw } of CAT_RULES) {
    if (kw.some(k => low.includes(k))) return cat;
  }
  return "random";
}

function extractTags(filename) {
  const base  = filename.replace(/\.[^.]+$/, "");
  const words = base.split(/[\s\-_()[\]]+/)
    .filter(w => w.length > 2)
    .map(w => w.toLowerCase())
    .filter(w => !NOISE.has(w) && !/^\d+$/.test(w));
  return [...new Set(words)].slice(0, 6);
}

function makeId(key) {
  return "r" + crypto.createHash("md5").update(key).digest("hex").slice(0, 10);
}

function typeFromExt(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (ext === "mp4" || ext === "webm") return "mp4";
  if (ext === "gif")  return "gif";
  return "png";
}

function normaliseTitle(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .trim();
}

// ── Dedup ─────────────────────────────────────────────────────────────────────

function jaccardSim(a, b) {
  const sa = new Set(a.toLowerCase().split(/\s+/));
  const sb = new Set(b.toLowerCase().split(/\s+/));
  const inter = [...sa].filter(w => sb.has(w)).length;
  const union  = new Set([...sa, ...sb]).size;
  return union ? inter / union : 0;
}

function deduplicate(items, threshold = 0.9) {
  const seen   = [];
  const unique = [];
  let   skipped = 0;

  for (const item of items) {
    const match = seen.find(s => jaccardSim(s.title, item.title) >= threshold);
    if (match) { skipped++; continue; }
    seen.push(item);
    unique.push(item);
  }

  return { unique, skipped };
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log("\n📦  Whamr Catalog Generator (R2 edition)\n");

  if (!fs.existsSync(MANIFEST_FILE)) {
    console.error("❌  upload-manifest.json not found.");
    console.error("    Run upload-to-r2.js first.\n");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  const entries  = Object.entries(manifest.uploaded); // [key, { size, url, ts }]

  console.log(`    Manifest entries : ${entries.length}`);

  const items = [];

  for (const [key, meta] of entries) {
    // key = "Meme/Dance/Billy Madison Dance.mp4"  OR  "Sticker/Sticker/STK-xxx.webp"
    const parts      = key.split("/");
    const filename   = parts[parts.length - 1];
    const folderName = parts[parts.length - 2] || "";

    const title    = normaliseTitle(filename);
    const category = categorise(filename, folderName);
    const type     = typeFromExt(filename);
    const tags     = extractTags(filename);
    const src      = R2_PUBLIC_URL ? `${R2_PUBLIC_URL}/${key}` : meta.url;

    items.push({ id: makeId(key), title, type, src, category, tags });
  }

  // Sort: Naija first, then by category, then title
  const CAT_ORDER = ["naija","reactions","laughing","dance","birthday","love","sad","awkward","sports","random","stickers"];
  items.sort((a, b) => {
    const ai = CAT_ORDER.indexOf(a.category);
    const bi = CAT_ORDER.indexOf(b.category);
    if (ai !== bi) return ai - bi;
    return a.title.localeCompare(b.title);
  });

  const { unique, skipped } = deduplicate(items);

  // Category breakdown
  const byCat = {};
  unique.forEach(m => { byCat[m.category] = (byCat[m.category] || 0) + 1; });

  console.log(`    Total items      : ${items.length}`);
  console.log(`    Duplicates skipped: ${skipped}`);
  console.log(`    Unique items     : ${unique.length}\n`);
  console.log("    Category breakdown:");
  Object.entries(byCat).sort((a,b) => b[1]-a[1]).forEach(([cat, n]) => {
    console.log(`      ${cat.padEnd(14)} ${n}`);
  });

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2));
  console.log(`\n✅  Written → ${OUTPUT_FILE}`);
  console.log("    Next step: commit data/memes.json and push to GitHub.\n");
}

main();
