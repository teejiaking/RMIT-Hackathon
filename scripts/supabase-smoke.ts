import "dotenv/config";
import assert from "node:assert/strict";
const origin = process.env.APP_ORIGIN || "http://127.0.0.1:3000";
assert.equal(
  process.env.AUTH_MODE,
  "supabase",
  "This smoke check requires Supabase mode. It never creates users or sends email.",
);
async function post(path: string, body: unknown) {
  return fetch(origin + "/api/" + path, {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
const response = await fetch(origin + "/api/session", { cache: "no-store" }),
  session = await response.json();
assert.equal(response.status, 200);
assert.equal(session.authMode, "supabase");
assert.equal(session.configured, true);
assert.equal(session.demo, false);
assert.deepEqual(session.identities, []);
assert.match(response.headers.get("cache-control")!, /no-store/);
assert.equal(
  (await post("demo/login", { userId: "student-maya" })).status,
  403,
);
assert.equal((await fetch(origin + "/api/overview")).status, 401);
assert.equal(
  (await fetch(origin + "/api/documents/doc-enrolment/preview")).status,
  401,
);
// Invalid input must be rejected before an outbound sign-up request or confirmation email.
assert.equal(
  (
    await post("auth/supabase/signup", {
      email: "not-an-email",
      password: "short",
      role: "ADMINISTRATOR",
    })
  ).status,
  400,
);
const login = await post("auth/supabase/login", {
  email: "trustvault-nonexistent@example.test",
  password: "invalid-test-password-only",
  role: "ADMINISTRATOR",
});
assert.equal(login.status, 401);
assert.match(login.headers.get("cache-control")!, /no-store/);
console.log(
  "Live Supabase HTTP checks passed: configuration and login screen state, demo disabled, unauthenticated access denied, invalid registration rejected locally, and invalid credentials rejected by the real Auth service. No users created or emails sent.",
);
