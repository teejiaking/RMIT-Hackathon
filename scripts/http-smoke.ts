import "dotenv/config";
import assert from "node:assert/strict";
const base = process.env.APP_ORIGIN || "http://127.0.0.1:3000";
async function login(userId: string) {
  const r = await fetch(base + "/api/demo/login", {
    method: "POST",
    headers: { origin: base, "content-type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  assert.equal(r.status, 200);
  return r.headers.get("set-cookie")!.split(";")[0];
}
async function request(route: string, cookie?: string, body?: unknown) {
  return fetch(base + "/api/" + route, {
    method: body ? "POST" : "GET",
    headers: {
      ...(cookie ? { cookie } : {}),
      origin: base,
      ...(body && !(body instanceof FormData)
        ? { "content-type": "application/json" }
        : {}),
    },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}
assert.equal((await request("overview")).status, 401);
const student = await login("student-maya"),
  recipient = await login("recipient-campus"),
  admin = await login("admin-jordan");
assert.equal(
  (await request("documents/doc-enrolment/preview", admin)).status,
  404,
);
const shared = await request("grants/grant-active/access", recipient);
assert.equal(shared.status, 200);
assert.match(shared.headers.get("cache-control")!, /no-store/);
assert.deepEqual(Object.keys((await shared.json()).attributes).sort(), [
  "enrolmentStatus",
  "fullName",
]);
assert.equal(
  (await request("grants/grant-expired/access", recipient)).status,
  403,
);
assert.equal(
  (await request("grants/grant-revoked/access", recipient)).status,
  403,
);
const bad = new FormData();
bad.set("title", "Unsupported example");
bad.set("kind", "other");
bad.set(
  "file",
  new File(["unsupported"], "synthetic.txt", { type: "text/plain" }),
);
assert.equal((await request("documents", student, bad)).status, 400);
const original = await request("documents/doc-enrolment/preview", student);
assert.equal(original.status, 200);
const bytes = await original.arrayBuffer();
const form = new FormData();
form.set("title", "HTTP smoke upload");
form.set("kind", "enrolment");
form.set(
  "file",
  new File([bytes], "synthetic.pdf", { type: "application/pdf" }),
);
assert.equal((await request("documents", student, form)).status, 201);
const r = await request("requests", recipient, {
  studentId: "student-maya",
  purpose: "Verify student status for the HTTP smoke demonstration.",
  documentKind: "enrolment",
  fields: ["enrolmentStatus", "passportNumber"],
  durationHours: 24,
});
assert.equal(r.status, 201);
const id = (await r.json()).id;
assert.equal(
  (
    await request(`requests/${id}/decide`, student, {
      decision: "APPROVE",
      fields: ["enrolmentStatus"],
      durationHours: 1,
    })
  ).status,
  200,
);
const overview = await (await request("overview", student)).json();
const g = overview.grants.find(
  (g: { requestId: string }) => g.requestId === id,
);
assert.ok(g);
const approved = await (
  await request(`grants/${g.id}/access`, recipient)
).json();
assert.deepEqual(approved.attributes, {
  enrolmentStatus: "Currently enrolled",
});
assert.equal((await request(`grants/${g.id}/revoke`, student, {})).status, 200);
assert.equal((await request(`grants/${g.id}/access`, recipient)).status, 403);
assert.equal(
  (
    await request("proposals/proposal-duration/review", admin, {
      decision: "APPROVE",
    })
  ).status,
  403,
);
const blocked = await fetch(base + "/api/requests", {
  method: "POST",
  headers: {
    cookie: recipient,
    origin: "https://attacker.example.test",
    "content-type": "application/json",
  },
  body: "{}",
});
assert.equal(blocked.status, 403);
console.log(
  "HTTP smoke passed: authentication, owner-only preview, no-store responses, selective consent, upload acceptance/rejection, expiry, revocation, CSRF, and proposer self-approval denial. Demo data was modified; run npm run demo:reset before presenting.",
);
