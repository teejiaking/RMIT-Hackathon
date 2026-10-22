# TrustVault

**A private student document vault that turns broad document requests into explicit, limited, revocable consent.**

## Supabase real-account update

The active configuration now uses Supabase Auth instead of demo identities. Email/password signup, email confirmation, password sign-in, HttpOnly cookie sessions, route-level refresh, live `getUser` verification and local sign-out are implemented. New verified users receive the Student role only. Recipient/administrator roles are provisioned by the server operator using immutable Supabase Auth IDs, and user-editable metadata never authorizes access. Real students can add owner-scoped fictional samples to exercise selective sharing. SQLite/Prisma and encrypted server-side file storage remain in use; no Supabase tables or storage buckets were migrated. Governance remains application-level dual approval.

Project `umyierhvfoqkgsubuhvs` is configured locally with the user-supplied publishable key in ignored `.env`. Its Auth settings endpoint returned HTTP 200 with email signup enabled and confirmation required. No service-role key or real account creation was used during testing. The expanded 32-test suite passes; successful Supabase automated auth tests use provider fixtures through the installed SDK. Users complete their own real email signup/confirmation in the interface. See SUPABASE.md for installation, account provisioning and limitations. The original local demo and TideCloak adapter remain optional alternatives.

## Problem

Accommodation and similar services may request full documents when they need only proof of enrolment. Students need a practical way to understand the request, choose the information to disclose, limit access, and see what happened afterward.

## Implemented prototype

A responsive navy/teal/white dashboard, private document vault, request review, Guardian advisory panel, consent controls, sharing centre, simulated recipient portal, governance panel and timestamped activity log. All primary controls perform server-backed operations. Four clearly labelled local identities cover a student, recipient and two independent administrators.

Small synthetic PDF/PNG/JPEG files are checked server-side and encrypted using AES-256-GCM outside public assets. Original previews are owner-only. Structured synthetic sample attributes enable selective sharing; uploads are explicitly not extracted or verified. Recipients receive only approved attributes through authenticated, non-cacheable routes. There are no public document links or full-document sharing features.

Student approval can select attributes and shorten access. Every recipient access checks authenticated identity, grant/document/request ownership relationships, approved fields, expiry, revocation and current applicable policy, and records a content-free success or denial event. Revocation blocks subsequent application access and cannot erase copies.

The **Document Request Guardian** uses a deterministic server-side rules engine labelled **Rules-based demo analysis**. For the seeded accommodation request it flags full passport number, home address and insurance policy number as potentially excessive, suggests enrolment confirmation, and reduces the recommended duration to 24 hours. It is advisory, not a legal finding or safety guarantee. No LLM credentials were available; no document contents or values are sent to a model.

## Architecture

Next.js App Router, TypeScript, React, Tailwind CSS and Prisma/SQLite. Six core logical tables hold users, documents, requests, grants, access events and administrative proposals; a seventh holds the versioned current policy. Server-side authorization lives in `lib/auth.ts` and `lib/service.ts`. Files use random UUID names and authenticated encryption in private storage. Database constraints, immutable-proposal triggers and transactions protect workflow integrity.

The maximum sharing duration starts at 168 hours. An administrator proposes an immutable policy change; a different administrator approves or rejects it. Pending/rejected proposals never change policy. Approval updates status, policy version and audit event atomically and exactly once. Duplicate and self-approvals fail. Subsequent grants use the approved policy, and access also rechecks current policy. Administrative roles do not grant document access.

## TideCloak status and attribution

Current official documentation and installed package sources were inspected. The adapter uses `verifyTideCloakToken` from `@tidecloak/nextjs/server` (SDK 0.14.40; verifier 0.14.33), pins issuer/client, validates signed tokens and maps verified subjects and roles to provisioned accounts. Standard OIDC code+PKCE sign-in and HttpOnly application cookies are implemented. Local cryptographic verifier tests pass. **No live realm, credentials or services were supplied; live authentication and advanced realm exchange modes remain unverified.** Exact activation steps, roles, redirect URI, environment variables and provisioning commands are in README.md.

The optional offline presentation uses explicitly labelled **local demo mode**, disabled in ordinary production startup. A separate explicit compiled-demo launcher only serves loopback clients with a matching Host header. The active configuration uses real Supabase accounts instead. TideCloak documents native QEA for IAM administrative operations. This prototype's SQLite sharing-duration workflow is **application-level dual approval**, not native QEA/Fabric enforcement. Encryption is server-side AES, not Tide end-to-end encryption. It does not prevent database owners or host administrators from bypassing application controls.

Official references: [SDK API](https://docs.tide.org/Languages/NextJS/tidecloak-nextjs-reference), [JWT verifier](https://docs.tide.org/Languages/NextJS/VerifyJWT), [native management governance](https://docs.tide.org/API/Management%20API).

## Simulations and limits

Document contents and sample identities/organisations remain synthetic; Supabase account holders use their real verified email identities. No blockchain, payments, real universities, OCR, live LLM analysis, redacted PDFs or production security claims are included. JSON synthetic metadata remains readable in SQLite; binary originals are encrypted. The server holds decryption keys. There is no malware scanning, application rate limiting or automated key rotation. Supabase sessions refresh through the route handlers and support current-session sign-out; the optional TideCloak adapter does not implement refresh or upstream logout. Advanced Tide SWE/DPoP realm modes need live integration testing. Optional demo seed/reset is disabled in Supabase mode; security tests use an isolated database. No workspace rules required a Word `.doc` deliverable.

See DEMO.md for a two-minute presentation and VERIFICATION.md for actual validation outcomes.
