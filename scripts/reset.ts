import "dotenv/config";
import { seed } from "./seed";
if (process.env.AUTH_MODE !== "demo" || process.env.NODE_ENV === "production")
  throw new Error("Reset is available only in local demo mode.");
await seed();
