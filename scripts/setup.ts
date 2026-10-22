import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
if (!existsSync(".env")) {
  let env = readFileSync(".env.example", "utf8");
  if (!process.argv.includes("--supabase"))
    env = env
      .replace('AUTH_MODE="supabase"', 'AUTH_MODE="demo"')
      .replace(
        'DATABASE_URL="file:./trustvault-supabase.db"',
        'DATABASE_URL="file:./trustvault.db"',
      )
      .replace(
        'STORAGE_DIR="./private-storage-supabase"',
        'STORAGE_DIR="./private-storage"',
      );
  env = env
    .replace(
      'SESSION_SECRET=""',
      `SESSION_SECRET="${randomBytes(48).toString("hex")}"`,
    )
    .replace(
      'DOCUMENT_ENCRYPTION_KEY=""',
      `DOCUMENT_ENCRYPTION_KEY="${randomBytes(32).toString("hex")}"`,
    );
  writeFileSync(".env", env, { mode: 0o600 });
  console.log("Created local .env with random server-only keys.");
} else console.log("Existing .env preserved.");
