"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "◆" },
  { href: "/employees", label: "Employees", icon: "▤" },
  { href: "/employees/add", label: "Add Employee", icon: "+" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-surface-border bg-surface-elevated/80 backdrop-blur-sm">
      <div className="border-b border-surface-border px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
          EMS
        </p>
        <p className="mt-1 text-lg font-semibold text-white">
          Employee Hub
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-accent/15 text-accent shadow-[inset_0_0_0_1px_rgba(59,130,246,0.25)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <span className="w-5 text-center text-xs opacity-80">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-surface-border p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-300"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
