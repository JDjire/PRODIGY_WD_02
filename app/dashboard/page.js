import DashboardShell from "@/components/DashboardShell";
import { getAuthSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";

export const dynamic = "force-dynamic";

async function StatCards() {
  await connectDB();
  const total = await Employee.countDocuments();
  const departments = await Employee.distinct("department");
  const deptCount = departments.filter(Boolean).length;

  const cards = [
    { label: "Total employees", value: total, hint: "Across all departments" },
    {
      label: "Departments",
      value: deptCount,
      hint: "Unique department tags",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="group rounded-xl border border-surface-border bg-surface-elevated/40 p-6 shadow-lg shadow-black/20 transition-all duration-200 hover:border-accent/30 hover:shadow-accent/5"
        >
          <p className="text-sm font-medium text-slate-400">{c.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white transition-transform duration-200 group-hover:scale-[1.02]">
            {c.value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{c.hint}</p>
        </div>
      ))}
      <div className="rounded-xl border border-dashed border-surface-border bg-surface-elevated/20 p-6 transition-colors duration-200 hover:border-accent/20">
        <p className="text-sm font-medium text-slate-400">Quick actions</p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li>
            <a
              href="/employees"
              className="text-accent transition-colors hover:text-accent-hover"
            >
              View all employees →
            </a>
          </li>
          <li>
            <a
              href="/employees/add"
              className="text-accent transition-colors hover:text-accent-hover"
            >
              Add a new employee →
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  const email = session?.user?.email ?? "";

  return (
    <DashboardShell
      title="Dashboard"
      subtitle={email ? `Signed in as ${email}` : "Overview"}
    >
      <StatCards />
    </DashboardShell>
  );
}
