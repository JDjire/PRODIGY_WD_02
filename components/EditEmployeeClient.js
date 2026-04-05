"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import EmployeeForm from "@/components/EmployeeForm";

export default function EditEmployeeClient({ id }) {
  const router = useRouter();
  const [initial, setInitial] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/employees/${id}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Not found");
        }
        if (!cancelled) {
          setInitial({
            name: data.employee.name,
            email: data.employee.email,
            position: data.employee.position,
            department: data.employee.department,
          });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load");
          toast.error("Could not load employee");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(values) {
    const res = await fetch(`/api/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Could not update employee");
    }
    toast.success("Employee updated");
    router.push("/employees");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-accent" />
          Loading…
        </span>
      </div>
    );
  }

  if (error || !initial) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-surface-border bg-surface-elevated/50 p-8 text-center">
        <p className="text-red-200">{error || "Employee not found"}</p>
        <Link
          href="/employees"
          className="mt-4 inline-block text-accent hover:text-accent-hover"
        >
          ← Back to list
        </Link>
      </div>
    );
  }

  return (
    <EmployeeForm
      key={id}
      initial={initial}
      submitLabel="Save changes"
      onSubmit={handleSubmit}
      cancelHref="/employees"
    />
  );
}
