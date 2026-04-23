"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Phone,
  Bot,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/calls", label: "Call History", icon: Phone },
  { href: "/agent", label: "Agent Config", icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              PropConnect
            </h1>
            <p className="text-[11px] text-[var(--text-tertiary)] font-medium tracking-wide">
              Voice AI Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1">
        <p className="px-7 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
          Main Menu
        </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? "active" : ""}`}
            >
              <item.icon className="w-[18px] h-[18px]" />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <ChevronRight className="w-4 h-4 opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="glass-card p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="pulse-dot" />
            <span className="text-xs font-semibold text-emerald-400">
              System Active
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-tertiary)] leading-relaxed">
            Bolna Voice AI agent is online and ready to process calls.
          </p>
        </div>
        <button className="sidebar-link mt-2 w-full">
          <Settings className="w-[18px] h-[18px]" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
