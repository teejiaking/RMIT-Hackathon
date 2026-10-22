import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
if (!existsSync(".env")) {
  let env = readFileSync(".env.example", "utf8");
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
