/**
 * Set the CORS policy on the R2 bucket so the browser can read sticker bytes.
 *
 * Why this is required:
 *   The sticker pack export and "Send to WhatsApp" both need to read the raw
 *   bytes of each sticker in the browser (via <canvas>.toBlob or fetch().blob()).
 *   Cross-origin reads are blocked unless the media host returns
 *   `Access-Control-Allow-Origin`. R2's public bucket does NOT send CORS headers
 *   by default, so without this the canvas becomes "tainted" and export fails.
 *
 * Run once (re-run any time origins change):
 *   cd scripts
 *   npm install            # if you haven't already
 *   npm run cors
 *
 * Requires .env.r2 with R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY
 * / R2_BUCKET_NAME. The API token must be allowed to edit bucket configuration
 * (Object Read & Write is NOT enough — use "Admin Read & Write" or a token
 * scoped with bucket settings permission).
 *
 * Optionally restrict origins (comma-separated) instead of the default "*":
 *   CORS_ALLOWED_ORIGINS=https://whamr.app,http://localhost:3000 npm run cors
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env.r2") });

const {
  S3Client,
  PutBucketCorsCommand,
  GetBucketCorsCommand,
} = require("@aws-sdk/client-s3");

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;

const REQUIRED = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME"];
const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Missing env vars in .env.r2: " + missing.join(", "));
  process.exit(1);
}

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const corsConfig = {
  Bucket: R2_BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedOrigins: allowedOrigins,
        AllowedMethods: ["GET", "HEAD"],
        AllowedHeaders: ["*"],
        ExposeHeaders: ["Content-Length", "Content-Type"],
        MaxAgeSeconds: 3600,
      },
    ],
  },
};

(async () => {
  console.log(`Setting CORS on bucket "${R2_BUCKET_NAME}" for origins: ${allowedOrigins.join(", ")}`);
  await s3.send(new PutBucketCorsCommand(corsConfig));

  const got = await s3.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET_NAME }));
  console.log("✓ CORS applied. Current rules:");
  console.log(JSON.stringify(got.CORSRules, null, 2));
  console.log("\nNote: changes can take a minute to propagate on the public r2.dev URL.");
})().catch((err) => {
  console.error("Failed to set CORS:", err.name, "-", err.message);
  if (/AccessDenied|Forbidden|NotImplemented/i.test(err.name + err.message)) {
    console.error(
      "\nThe API token likely lacks permission to edit bucket configuration.\n" +
        "Create a token with Admin Read & Write (or bucket-settings scope) and retry."
    );
  }
  process.exit(1);
});
