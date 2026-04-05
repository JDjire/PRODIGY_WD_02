"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function EmployeesClient() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(async () => {
    setLoadError("");
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load");
      }
      setEmployees(data.employees || []);
    } catch (e) {
      setLoadError(e.message || "Failed to load employees");
      toast.error("Could not load employees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const departments = useMemo(() => {
    const set = new Set();
    employees.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set).sort();
  }, [employees]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return employees.filter((e) => {
      if (department && e.department !== department) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
      );
    });
  }, [employees, search, department]);

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/employees/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }
      toast.success("Employee removed");
      setDeleteTarget(null);
      setEmployees((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    } catch (e) {
      toast.error(e.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Search
            </label>
            <input
              id="search"
              type="search"
              placeholder="Name, email, role, department…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-elevated/50 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>
          <div className="sm:w-48">
            <label
              htmlFor="dept"
              className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Department
            </label>
            <select
              id="dept"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-lg border border-surface-border bg-surface-elevated/50 px-3 py-2 text-sm text-slate-100 outline-none transition-all duration-200 focus:border-accent focus:ring-2 focus:ring-accent/20"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Link
          href="/employees/add"
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all duration-200 hover:bg-accent-hover"
        >
          Add employee
        </Link>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {loadError}{" "}
          <button
            type="button"
            onClick={load}
            className="ml-2 font-medium text-red-100 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-elevated/30 shadow-xl shadow-black/20">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-accent" />
              Loading employees…
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-medium text-slate-300">
              No employees yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {employees.length === 0
                ? "Create your first employee record to get started."
                : "No matches for your search or filter."}
            </p>
            {employees.length === 0 ? (
              <Link
                href="/employees/add"
                className="mt-6 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Add employee
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-elevated/80 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Position</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-surface-border/80 transition-colors duration-200 hover:bg-white/[0.04]"
                  >
                    <td className="px-4 py-3 font-medium text-slate-100">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{row.email}</td>
                    <td className="px-4 py-3 text-slate-300">{row.position}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-surface-border bg-surface/80 px-2.5 py-0.5 text-xs text-slate-300">
                        {row.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/employees/edit/${row.id}`}
                        className="mr-3 text-accent transition-colors hover:text-accent-hover"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({ id: row.id, name: row.name })
                        }
                        className="text-red-400 transition-colors hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={!!deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        onConfirm={confirmDelete}
        employeeName={deleteTarget?.name || ""}
        loading={deleteLoading}
      />
    </div>
  );
}
