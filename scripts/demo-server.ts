import "dotenv/config";
import { createServer } from "node:http";
import next from "next";
const origin = new URL(process.env.APP_ORIGIN || "http://127.0.0.1:3000");
if (
  process.env.AUTH_MODE !== "demo" ||
  origin.protocol !== "http:" ||
  origin.hostname !== "127.0.0.1" ||
  !origin.port
)
  throw new Error(
    "The local demo server requires AUTH_MODE=demo and APP_ORIGIN=http://127.0.0.1:PORT.",
  );
// An explicit, loopback-only preview launcher. Ordinary npm start keeps demo disabled.
Object.assign(process.env, {
  NODE_ENV: "production",
  TRUSTVAULT_LOOPBACK_DEMO: "1",
});
const app = next({
  dev: false,
  dir: process.cwd(),
  hostname: "127.0.0.1",
  port: Number(origin.port),
});
await app.prepare();
const handler = app.getRequestHandler();
const server = createServer((req, res) => {
  if (
    req.headers.host !== origin.host ||
    !["127.0.0.1", "::ffff:127.0.0.1"].includes(req.socket.remoteAddress || "")
  ) {
    res.writeHead(403, { "Cache-Control": "no-store" });
    res.end("Local demonstration only.");
    return;
  }
  handler(req, res);
});
server.listen(Number(origin.port), "127.0.0.1", () =>
  console.log(
    `TrustVault LOCAL DEMO ready at ${origin.origin} (compiled app, loopback only).`,
  ),
);
function stop() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
