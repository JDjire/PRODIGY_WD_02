"use client";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  employeeName,
  loading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        aria-label="Close dialog"
        onClick={loading ? undefined : onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-md rounded-xl border border-surface-border bg-surface-elevated p-6 shadow-2xl shadow-black/40 transition-all duration-200"
      >
        <h2 className="text-lg font-semibold text-white">Delete employee?</h2>
        <p className="mt-2 text-sm text-slate-400">
          This will permanently remove{" "}
          <span className="font-medium text-slate-200">{employeeName}</span>{" "}
          from the database. This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border border-surface-border px-4 py-2 text-sm font-medium text-slate-300 transition-colors duration-200 hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-500 disabled:opacity-50"
          >
            {loading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
