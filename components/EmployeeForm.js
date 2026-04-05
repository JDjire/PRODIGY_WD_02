"use client";

import { useState } from "react";
import Link from "next/link";

const empty = { name: "", email: "", position: "", department: "" };

export default function EmployeeForm({
  initial = empty,
  submitLabel,
  onSubmit,
  cancelHref = "/employees",
}) {
  const [values, setValues] = useState({ ...empty, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function field(name, label, props = {}) {
    return (
      <div>
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-slate-300"
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          value={values[name]}
          onChange={(e) =>
            setValues((v) => ({ ...v, [name]: e.target.value }))
          }
          disabled={loading}
          className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2.5 text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50"
          {...props}
        />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-5 rounded-xl border border-surface-border bg-surface-elevated/50 p-6 shadow-lg shadow-black/20 md:p-8"
    >
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
        >
          {error}
        </div>
      ) : null}
      {field("name", "Full name", { required: true, autoComplete: "name" })}
      {field("email", "Email", {
        type: "email",
        required: true,
        autoComplete: "email",
      })}
      {field("position", "Position", { required: true })}
      {field("department", "Department", { required: true })}
      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? "Saving…" : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="inline-flex items-center rounded-lg border border-surface-border px-5 py-2.5 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
