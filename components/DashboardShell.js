import Sidebar from "@/components/Sidebar";

export default function DashboardShell({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-surface text-slate-200">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="border-b border-surface-border bg-surface-elevated/40 px-6 py-6 backdrop-blur-sm transition-colors duration-200">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          ) : null}
        </header>
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
