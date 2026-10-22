"use client";
import { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  FolderLock,
  Inbox,
  Link2,
  Building2,
  Landmark,
  Activity,
  ArrowRight,
  LockKeyhole,
  FileText,
  Menu,
} from "lucide-react";
import { assess, fieldLabels } from "@/lib/guardian";

const navigation = [
  ["overview", "Overview", LayoutDashboard],
  ["vault", "Document vault", FolderLock],
  ["requests", "Requests", Inbox],
  ["sharing", "Sharing centre", Link2],
  ["portal", "Recipient portal", Building2],
  ["governance", "Governance", Landmark],
  ["activity", "Activity log", Activity],
] as const;
type Page = (typeof navigation)[number][0];
const requested = [
  "enrolmentStatus",
  "passportNumber",
  "homeAddress",
  "insurancePolicyNumber",
];
const attributes: Record<string, string> = {
  enrolmentStatus: "Currently enrolled · synthetic example",
  passportNumber: "DEMO-PASSPORT-000",
  homeAddress: "123 Example Street · fictional address",
  insurancePolicyNumber: "DEMO-POLICY-000",
};
const assessment = assess(
  "Verify student status for accommodation",
  requested,
  168,
);

export default function PublicWorkspace({
  onSignIn,
}: {
  onSignIn: () => void;
}) {
  const [page, setPage] = useState<Page>("overview");
  const [mobile, setMobile] = useState(false);
  const [fields, setFields] = useState(["enrolmentStatus"]);
  const [grant, setGrant] = useState<{
    fields: string[];
    expiresAt: number;
    revoked: boolean;
  } | null>(null);
  const [shared, setShared] = useState<Record<string, string> | null>(null);
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<{ action: string; at: string }[]>([]);
  const [hours, setHours] = useState(24);
  function go(next: Page) {
    setPage(next);
    setMobile(false);
    setMessage("");
    window.scrollTo({ top: 0 });
  }
  function record(action: string) {
    setEvents((previous) => [
      { action, at: new Date().toLocaleTimeString() },
      ...previous,
    ]);
  }
  function accessExample() {
    if (!grant || grant.revoked || grant.expiresAt <= Date.now()) {
      setShared(null);
      setMessage(
        "Access denied: no active preview permission. Approve an example request first.",
      );
      record("Example recipient access denied");
      return;
    }
    setShared(
      Object.fromEntries(
        grant.fields.map((field) => [field, attributes[field]]),
      ),
    );
    setMessage(
      "The example recipient can see only the attributes you selected.",
    );
    record("Example approved attributes viewed");
  }
  return (
    <div className="app-shell public-workspace">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside id="guest-sidebar" className={`sidebar ${mobile ? "open" : ""}`}>
        <button
          className="brand public-brand"
          onClick={() => go("overview")}
          aria-label="TrustVault overview"
        >
          <span className="brand-mark">
            <ShieldCheck size={24} />
          </span>
          TrustVault
          <span className="brand-dot" />
        </button>
        <div className="workspace-label">EXPLORE TRUSTVAULT</div>
        <nav aria-label="Public navigation">
          {navigation.map(([id, label, Icon]) => (
            <button
              key={id}
              aria-current={page === id ? "page" : undefined}
              className={`nav-item ${page === id ? "selected" : ""}`}
              onClick={() => go(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="privacy-card">
            <div className="row">
              <LockKeyhole size={20} />
              <strong>Your vault stays private</strong>
            </div>
            <p>
              Sign in when you want to save documents and manage your own
              permissions.
            </p>
          </div>
          <div className="profile">
            <span className="avatar">V</span>
            <div className="grow">
              <strong>Visitor</strong>
              <small>No account needed</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="row">
            <button
              className="icon-button mobile-menu"
              aria-label="Toggle navigation"
              aria-expanded={mobile}
              aria-controls="guest-sidebar"
              onClick={() => setMobile(!mobile)}
            >
              <Menu size={23} />
            </button>
            <span className="breadcrumb">Public preview</span>
          </div>
          <button className="button primary" onClick={onSignIn}>
            Sign in / Create account <ArrowRight size={15} />
          </button>
        </header>
        <div className="demo-bar">
          <span>
            <ShieldCheck size={15} /> GUEST PREVIEW
          </span>
          <p>
            Fictional examples only. Preview actions stay in this tab and reset
            on reload.
          </p>
        </div>
        <main id="main-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">YOUR INFORMATION. YOUR DECISION.</div>
              <h1>
                {page === "overview"
                  ? "Explore your privacy, without the sign-in"
                  : navigation.find(([id]) => id === page)?.[1]}
              </h1>
              <p>
                Browse freely. Your personal vault is available after you sign
                in.
              </p>
            </div>
          </div>
          {message && (
            <div className="notice info" role="status">
              {message}
            </div>
          )}
          {page === "overview" && (
            <>
              <section className="guardian-banner">
                <div className="grow">
                  <div className="eyebrow">LESS EXPOSURE. MORE CONTROL.</div>
                  <h2>
                    Share what’s needed.
                    <br />
                    Keep the rest to yourself.
                  </h2>
                  <p>
                    See how TrustVault helps a student question an excessive
                    accommodation request, choose what to share, and revoke
                    future access.
                  </p>
                  <button className="button" onClick={() => go("requests")}>
                    Try a request review <ArrowRight size={16} />
                  </button>
                </div>
                <ShieldCheck className="guardian-symbol" size={110} />
              </section>
              <section className="stats-grid" aria-label="Preview overview">
                {[
                  ["3", "Synthetic documents", "vault"],
                  ["1", "Example request", "requests"],
                  [
                    grant && !grant.revoked ? "1" : "0",
                    "Preview permissions",
                    "sharing",
                  ],
                ].map(([value, label, target]) => (
                  <button
                    key={label}
                    className="panel stat-card public-stat"
                    onClick={() => go(target as Page)}
                  >
                    <span className="muted">{label}</span>
                    <strong className="stat-value">{value}</strong>
                    <span className="small">
                      Explore <ArrowRight size={13} />
                    </span>
                  </button>
                ))}
              </section>
              <section className="panel public-panel">
                <h2>One clear journey</h2>
                <ol className="public-steps">
                  <li>Keep original documents in your private vault.</li>
                  <li>Review who is asking, why, and for how long.</li>
                  <li>
                    Approve selected attributes, then revoke future access
                    whenever you need.
                  </li>
                </ol>
                <button className="text-button" onClick={() => go("vault")}>
                  Explore example documents <ArrowRight size={15} />
                </button>
              </section>
            </>
          )}
          {page === "vault" && (
            <>
              <div className="document-grid">
                {[
                  [
                    "Student enrolment certificate",
                    "Currently enrolled",
                    "Enrolment confirmation",
                  ],
                  [
                    "Passport demonstration document",
                    "DEMO-PASSPORT-000",
                    "Fictional passport number",
                  ],
                  [
                    "Insurance certificate",
                    "DEMO-POLICY-000",
                    "Fictional policy number",
                  ],
                ].map(([title, value, label]) => (
                  <article key={title} className="panel document-card">
                    <div className="file-icon">
                      <FileText size={23} />
                    </div>
                    <h2>{title}</h2>
                    <span className="badge teal">Synthetic example</span>
                    <div className="attribute-box">
                      <div>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    </div>
                    <p className="source-note muted">
                      Public example attributes. These are not uploaded files,
                      verified records, or redacted PDFs.
                    </p>
                  </article>
                ))}
              </div>
              <div className="panel public-panel">
                <h2>Ready for your own vault?</h2>
                <p>
                  Sign in to upload synthetic PDF, PNG, or JPEG documents and
                  keep them attached to your verified account.
                </p>
                <button className="button primary" onClick={onSignIn}>
                  Sign in to upload <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
          {page === "requests" && (
            <section className="panel public-panel public-request">
              <span className="badge amber">Simulated organisation</span>
              <h2>CampusNest accommodation portal</h2>
              <p>
                <strong>Purpose:</strong> Verify student status for
                accommodation. Requested duration: 7 days.
              </p>
              <div className="guardian-panel high">
                <h3>
                  <ShieldCheck size={19} /> Document Request Guardian · High
                  risk
                </h3>
                <span className="analysis-label">{assessment.mode}</span>
                <p>{assessment.explanation}</p>
                <p>
                  <strong>Potentially excessive:</strong>{" "}
                  {assessment.excessiveFields
                    .map((field) => fieldLabels[field])
                    .join(", ")}
                  .
                </p>
                <p>
                  <strong>Suggested minimum:</strong> Enrolment confirmation for
                  24 hours.
                </p>
                <small>{assessment.advisory}</small>
              </div>
              <h3>Choose the attributes to approve</h3>
              <p className="small muted">
                This exercise changes only fictional data in this browser tab.
                It creates no account or real permission.
              </p>
              {requested.map((field) => (
                <label
                  className={`consent-field ${fields.includes(field) ? "checked" : ""}`}
                  key={field}
                >
                  <input
                    type="checkbox"
                    checked={fields.includes(field)}
                    onChange={(event) =>
                      setFields((previous) =>
                        event.target.checked
                          ? [...previous, field]
                          : previous.filter((item) => item !== field),
                      )
                    }
                  />
                  <span>{fieldLabels[field]}</span>
                </label>
              ))}
              <label className="public-duration">
                Preview access duration
                <select
                  value={hours}
                  onChange={(event) => setHours(Number(event.target.value))}
                >
                  <option value={1}>1 hour</option>
                  <option value={24}>24 hours</option>
                </select>
              </label>
              <button
                className="button primary"
                disabled={!fields.length}
                onClick={() => {
                  setGrant({
                    fields: [...fields],
                    expiresAt: Date.now() + hours * 3600000,
                    revoked: false,
                  });
                  setShared(null);
                  record("Example consent approved for selected attributes");
                  go("sharing");
                }}
              >
                Approve preview selection <ArrowRight size={15} />
              </button>
            </section>
          )}
          {page === "sharing" && (
            <section className="panel public-panel">
              <h2>
                {grant ? "Your example permission" : "Nothing shared yet"}
              </h2>
              {grant ? (
                <>
                  <p>
                    Recipient: CampusNest simulation ·{" "}
                    <strong>
                      {grant.revoked
                        ? "Revoked"
                        : grant.expiresAt <= Date.now()
                          ? "Expired"
                          : "Active"}
                    </strong>
                  </p>
                  <p>
                    Approved:{" "}
                    {grant.fields.map((field) => fieldLabels[field]).join(", ")}
                  </p>
                  <p>Expires: {new Date(grant.expiresAt).toLocaleString()}</p>
                  <div className="row public-actions">
                    <button className="button" onClick={() => go("portal")}>
                      Open recipient preview <ArrowRight size={15} />
                    </button>
                    {!grant.revoked && (
                      <button
                        className="button danger"
                        onClick={() => {
                          setGrant({ ...grant, revoked: true });
                          setShared(null);
                          record("Example permission revoked");
                          setMessage(
                            "Revoked. The next preview access will be denied. Information already copied cannot be recalled.",
                          );
                        }}
                      >
                        Revoke preview access
                      </button>
                    )}
                  </div>
                  <p className="small muted">
                    Real permissions require authenticated accounts and are
                    checked by the server on every access.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Review a fictional request and approve selected attributes
                    to try sharing.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => go("requests")}
                  >
                    Review example request
                  </button>
                </>
              )}
            </section>
          )}
          {page === "portal" && (
            <section className="panel public-panel">
              <span className="badge teal">
                Recipient preview · fictional data
              </span>
              <h2>What CampusNest can see</h2>
              <p>
                Request the preview information to see only your approved
                selection.
              </p>
              <button className="button primary" onClick={accessExample}>
                Access preview information <ArrowRight size={15} />
              </button>
              {shared && (
                <dl className="public-attributes">
                  {Object.entries(shared).map(([field, value]) => (
                    <div key={field}>
                      <dt>{fieldLabels[field]}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <p className="small muted">
                This public illustration has no verified recipient identity.
                Real recipient access requires sign-in and server authorization.
              </p>
            </section>
          )}
          {page === "governance" && (
            <section className="panel public-panel">
              <Landmark size={30} />
              <h2>Two people. One accountable decision.</h2>
              <p>
                TrustVault’s application-level governance requires an
                independent administrator to approve a proposed sharing-policy
                change. The proposer cannot approve it, and pending or rejected
                changes leave policy unchanged.
              </p>
              <ol className="public-steps">
                <li>An administrator submits an immutable proposal.</li>
                <li>
                  A different administrator reviews and approves or rejects it.
                </li>
                <li>
                  Approval applies the change once, and later grants use the
                  current policy.
                </li>
              </ol>
              <p className="small muted">
                This page explains the workflow; it exposes no private proposals
                or policy controls.
              </p>
              <button className="button primary" onClick={onSignIn}>
                Sign in to your workspace
              </button>
            </section>
          )}
          {page === "activity" && (
            <section className="panel public-panel">
              <h2>Activity in this preview</h2>
              <p className="small muted">
                Only your actions in this tab appear here. No account activity
                is fetched.
              </p>
              {events.length ? (
                <ol className="public-event-list">
                  {events.map((event, index) => (
                    <li key={index}>
                      <span>{event.action}</span>
                      <time>{event.at}</time>
                    </li>
                  ))}
                </ol>
              ) : (
                <>
                  <p>No preview actions yet. Try reviewing a request.</p>
                  <button className="button" onClick={() => go("requests")}>
                    Review example request
                  </button>
                </>
              )}
            </section>
          )}
          <footer className="public-footer">
            <LockKeyhole size={14} /> Public examples are separate from private
            accounts. Sign in to save changes.
          </footer>
        </main>
      </div>
    </div>
  );
}
