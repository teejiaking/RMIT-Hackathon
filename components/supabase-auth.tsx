"use client";
import { useState, type FormEvent } from "react";
import { ArrowRight, Mail, LockKeyhole } from "lucide-react";
export default function SupabaseAuth({
  configured,
  onAuthenticated,
}: {
  configured: boolean;
  onAuthenticated: () => Promise<void>;
}) {
  const [signup, setSignup] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const form = event.currentTarget,
      data = new FormData(form);
    try {
      const response = await fetch(
        "/api/auth/supabase/" + (signup ? "signup" : "login"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.get("email"),
            password: data.get("password"),
            ...(signup ? { name: data.get("name") } : {}),
          }),
        },
      );
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Sign-in could not complete.");
      form.reset();
      if (signup && result.confirmationRequired) {
        setMessage(result.message);
        setSignup(false);
      } else await onAuthenticated();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Sign-in could not complete.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="supabase-auth">
      {!configured && (
        <div className="notice info">
          <Mail size={19} />
          <span>
            <strong>Connect your Supabase project</strong>
            <br />
            Set the project URL and publishable key in the server’s .env file.
            Real sign-in will be enabled when those settings are available.
          </span>
        </div>
      )}
      <div className="auth-tabs" role="group" aria-label="Account action">
        <button
          type="button"
          aria-pressed={!signup}
          onClick={() => {
            setSignup(false);
            setError("");
          }}
          className={!signup ? "selected" : ""}
        >
          Sign in
        </button>
        <button
          type="button"
          aria-pressed={signup}
          onClick={() => {
            setSignup(true);
            setError("");
          }}
          className={signup ? "selected" : ""}
        >
          Create student account
        </button>
      </div>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="notice info" role="status">
          {message}
        </div>
      )}
      <form onSubmit={submit}>
        {signup && (
          <label>
            Full name
            <input
              required
              name="name"
              autoComplete="name"
              minLength={2}
              maxLength={100}
              disabled={busy}
              placeholder="Your name"
            />
          </label>
        )}
        <label>
          Email address
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            maxLength={254}
            disabled={busy}
            placeholder="you@university.edu"
          />
        </label>
        <label>
          Password
          <input
            required
            type="password"
            name="password"
            autoComplete={signup ? "new-password" : "current-password"}
            minLength={signup ? 6 : 1}
            maxLength={256}
            disabled={busy}
          />
        </label>
        {signup && (
          <p className="footnote">
            Use at least 6 characters. Confirm your email before signing in. New
            accounts are students; staff roles are assigned by the project
            operator.
          </p>
        )}
        <button
          className="button primary full-width"
          disabled={busy || !configured}
        >
          {busy
            ? "Please wait…"
            : signup
              ? "Create student account"
              : "Sign in securely"}
          <ArrowRight size={16} />
        </button>
      </form>
      <p className="auth-assurance">
        <LockKeyhole size={14} /> Identity checked with Supabase on every
        protected request.
      </p>
    </div>
  );
}
