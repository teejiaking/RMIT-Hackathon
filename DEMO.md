# TrustVault: two-minute demonstration

Before presenting: run `npm run build`, start `npm run demo`, run `npm run demo:reset` in another terminal, and reload http://127.0.0.1:3000. Have `examples/synthetic-upload.pdf` ready in the file picker. All people, organisations, identifiers and documents are synthetic. `npm run dev` is available for source editing; the compiled demo avoids development-server manifest races on this Windows host.

| Time | Action and narration |
| --- | --- |
| 0:00–0:15 | Choose **Maya Chen**. “Students repeatedly send full documents when a service needs only a confirmation. TrustVault makes the decision visible and reversible.” Show vault counts and the Local demo mode label. |
| 0:15–0:30 | **Upload document** → title “Synthetic upload demo” → select `examples/synthetic-upload.pdf` → **Encrypt & upload**. Open the vault. “Original files are encrypted on the server and only the owner can preview them. Uploads are clearly marked as not extracted or verified.” |
| 0:30–0:55 | **Overview → Review requests** opens the excessive CampusNest request. “They need student status but asked for a passport number, address and insurance policy number. Our rules-based Guardian flags those three fields and suggests enrolment confirmation.” Keep only the enrolment checkbox checked, enter **12** hours and approve. “This shares a synthetic attribute, not a redacted PDF.” |
| 0:55–1:15 | Header identity switch → **Alex Morgan · Recipient**. Open the newest **View shared information**. Show only “Enrolment confirmation: Currently enrolled.” “The server returned exactly the approved field. Original files and other identifiers are absent.” Close the dialog. |
| 1:15–1:35 | Switch to **Maya Chen**, open **Sharing centre**, revoke the newest 12-hour grant. Switch back to **Alex**, choose **Check access** on that revoked grant. Show denial. “Every access rechecks identity, expiry, revocation and current policy. Revocation blocks future access; it cannot erase earlier copies.” |
| 1:35–1:55 | Switch to **Jordan Lee**, open **Governance**. Show the pending 7-day → 14-day proposal and the unchanged 7-day applied policy. Jordan cannot approve their own proposal. Switch to **Sam Rivera**, open **Governance**, **Approve & apply**. Show the new policy version and 14-day maximum. |
| 1:55–2:00 | “Two distinct administrators, one immutable proposal, one transactional application. This is application-level governance. TideCloak real authentication is wired through its documented verifier; this presentation uses clearly labelled local demo accounts.” |

If there is extra time: in the recipient portal, test the seeded expired and revoked grants; both deny access. Submit a new recipient request, then reject it as Maya. Open Activity log to show successful and denied outcomes. Local identity switching is a demonstration aid, not production authentication.
