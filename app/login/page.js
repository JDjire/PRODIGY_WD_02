"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // NextAuth client parses the response with `new URL(data.url)`; a relative
      // callbackUrl (e.g. "/dashboard") throws in the browser and breaks sign-in.
      const raw = searchParams.get("callbackUrl") || "/dashboard";
      const callbackUrl = new URL(raw, window.location.origin).href;

      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        const msg =
          res.error === "CredentialsSignin"
            ? "Invalid email or password."
            : res.error === "DatabaseUnavailable"
              ? "Cannot reach the database. Check MongoDB is running and MONGODB_URI in .env.local."
              : `Sign in failed (${res.error}).`;
        setError(msg);
        toast.error("Sign in failed");
        return;
      }
      if (!res?.ok) {
        setError("Sign in failed. Please try again.");
        toast.error("Sign in failed");
        return;
      }
      toast.success("Welcome back");
      window.location.href = res.url || callbackUrl;
    } catch {
      setError("Something went wrong. Try again.");
      toast.error("Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-2xl border border-surface-border bg-surface-elevated/60 p-8 shadow-2xl shadow-black/30 backdrop-blur-sm transition-all duration-300">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Sign in to continue
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Employee Management System
          </p>
          <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-slate-500">
            Use <span className="text-slate-400">ADMIN_EMAIL</span> and{" "}
            <span className="text-slate-400">ADMIN_PASSWORD</span> from{" "}
            <span className="text-slate-400">.env.local</span>. First time? Run{" "}
            <code className="text-slate-400">npm run seed</code>.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
            >
              {error}
            </div>
          ) : null}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-slate-100 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-slate-100 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-3 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-200 hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
