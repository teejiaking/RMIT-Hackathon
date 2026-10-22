# TrustVault: two-minute guest-preview narration

Use the **local site** at `http://127.0.0.1:3000/`. The repository's published Vercel homepage currently returns `404 DEPLOYMENT_NOT_FOUND`; do not use that link for the demonstration until the Vercel project/domain is corrected. Start the local site with `npm start` after building. Use fictional data only.

## Paste into ElevenLabs (narration only)

TrustVault helps students share less of their personal information, while still proving what a service actually needs. This public preview lets anyone try the journey without creating an account.

Here is a synthetic document vault: an enrolment certificate, a passport example, and an insurance certificate. These are fictional attributes for the demonstration. They are not verified documents or redacted PDFs.

Now imagine an accommodation portal called CampusNest asking to verify student status. It requests an enrolment confirmation, but also a full passport number, home address, and insurance policy number for seven days. That is more information than its stated purpose seems to require.

The Document Request Guardian uses clearly labelled rules-based analysis. It flags those three sensitive fields and suggests just the enrolment confirmation, with a shorter time limit. Its assessment is advice, not a legal decision.

I leave only enrolment confirmation selected, shorten the preview to one hour, and approve. In the sharing centre, the permission shows exactly which attribute was selected and when access ends.

Let's see the recipient's view. CampusNest sees only the approved enrolment confirmation. The passport number, address, and insurance number are absent. When I revoke the permission and try access again, the next request is denied. Revocation stops future access; it cannot erase information someone already copied.

Finally, TrustVault's governance requires a second administrator to approve a policy change. The proposer cannot approve their own change, and a pending proposal has no effect. This guest exercise stays in this browser tab. Signed-in accounts use server checks for the real vault and sharing workflow.

## Screen actions

| Time | What to do on screen |
| --- | --- |
| 0:00–0:15 | Open the local homepage. Let the **Guest preview** label and overview stay visible. |
| 0:15–0:30 | Click **Document vault**. Show the three fictional document cards. |
| 0:30–0:58 | Click **Requests**. Pause on CampusNest's purpose, requested fields, and the **Document Request Guardian** panel. |
| 0:58–1:15 | Keep **Enrolment confirmation** checked; leave the other fields unchecked. Choose **1 hour**, then click **Approve preview selection**. |
| 1:15–1:28 | On **Sharing centre**, point to the approved field and expiry. Click **Open recipient preview**, then **Access preview information**. |
| 1:28–1:42 | Pause on the single returned attribute. Click **Sharing centre**, then **Revoke preview access**. |
| 1:42–1:50 | Click **Open recipient preview** and **Access preview information** again. Show the access-denied message. |
| 1:50–2:00 | Click **Governance**. Point to the two-person approval explanation and close on the sign-in button. |

Read the narration at about **130 words per minute**. Record the voice first, then align screen actions to its actual timing. Before recording, reload the page so the guest preview starts with no permission. Do not use **Sign in / Create account** during this walkthrough; that opens the separate real-account flow.
