"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Clock3,
  Command,
  LogOut,
  ScanSearch,
  Settings2,
  UserRound,
  ArrowLeft,
  Activity,
  Shield,
} from "lucide-react";
import Logo from "@/components/Logo";
import CommandPalette from "@/components/CommandPalette";
import { useAuth } from "@/lib/auth";
import { getHistory } from "@/lib/history";

const NAV_ITEMS = [
  {
    href: "/analyze",
    label: "Detection",
    description: "upload and inspect results",
    icon: ScanSearch,
  },
  {
    href: "/history",
    label: "History",
    description: "saved analyses and detail views",
    icon: Clock3,
  },
  {
    href: "/analytics",
    label: "Analytics",
    description: "aggregate patterns and charts",
    icon: BarChart3,
  },
  {
    href: "/settings",
    label: "Settings",
    description: "preferences and data controls",
    icon: Settings2,
  },
];

const PAGE_COPY: Record<string, { title: string; description: string }> = {
  "/analyze": {
    title: "Detection workspace",
    description: "Upload a frame, run analysis, and review the annotated output.",
  },
  "/history": {
    title: "History archive",
    description: "Browse saved analyses, compare scans, and reopen prior findings.",
  },
  "/analytics": {
    title: "Analytics",
    description: "See trends across stored analyses and confidence distributions.",
  },
  "/settings": {
    title: "Preferences",
    description: "Tune autosave behavior, notifications, and exported data.",
  },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    setHistoryCount(getHistory().length);
  }, [pathname]);

  const pageMeta = useMemo(() => PAGE_COPY[pathname] ?? PAGE_COPY["/analyze"], [pathname]);

  return (
    <div className="relative min-h-screen bg-black text-white md:flex">
      <div className="pointer-events-none fixed inset-0 -z-10 gradient-mesh opacity-60" />
      <CommandPalette />

      <aside className="hidden w-[260px] shrink-0 border-r border-white/8 bg-[linear-gradient(180deg,#050505_0%,#0a0a0a_100%)] md:sticky md:top-0 md:flex md:h-screen md:flex-col md:overflow-y-auto">
        <div className="border-b border-white/8 px-5 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03]">
              <Logo size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display text-base font-semibold text-white leading-none">Argus AI</h1>
              <p className="mt-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/35">Road Vision</p>
            </div>
          </Link>
          <div className="mt-5 flex items-center justify-between rounded-[8px] border border-white/8 bg-white/[0.02] px-3 py-2.5">
            <span className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              Live
            </span>
            <span className="font-display text-sm font-semibold text-white">{historyCount} saved</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4">
          <p className="px-2 pb-2 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-white/30">
            Workspace
          </p>
          <div className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-[6px] px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-white/[0.06] text-white"
                      : "text-white/55 hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-rail"
                      className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-r bg-blue-400"
                      transition={{ type: "spring", stiffness: 360, damping: 30 }}
                    />
                  )}
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-blue-400" : "text-white/45"}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-white/8 p-3">
          <div className="flex items-center gap-2.5 rounded-[6px] px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/45 text-xs font-semibold text-white">
              {user ? user.name.charAt(0).toUpperCase() : <UserRound className="h-3.5 w-3.5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-white/85">
                {user ? user.name : "Guest"}
              </p>
              <p className="truncate text-[0.65rem] text-white/35">
                {user ? user.email : "local-only mode"}
              </p>
            </div>
            {user ? (
              <button
                onClick={signOut}
                title="Sign out"
                className="rounded-[5px] p-1.5 text-white/40 hover:bg-white/[0.05] hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            ) : (
              <Link
                href="/auth/login"
                title="Sign in"
                className="rounded-[5px] p-1.5 text-white/40 hover:bg-white/[0.05] hover:text-white"
              >
                <UserRound className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
          <Link
            href="/"
            className="mt-1 flex items-center gap-2 rounded-[5px] px-2 py-1.5 text-[0.7rem] text-white/40 transition-colors hover:bg-white/[0.03] hover:text-white"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to site
          </Link>
        </div>
      </aside>

      <div className="min-h-screen flex-1 min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-40 border-b border-white/8 bg-black/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div className="min-w-0">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/28">
                {pathname.replace("/", "") || "dashboard"}
              </p>
              <h2 className="mt-1 font-display text-[1.85rem] leading-none text-white">{pageMeta.title}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/42">{pageMeta.description}</p>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/52">
                <Command className="h-4 w-4" />
                Quick actions
                <span className="rounded-md border border-white/10 bg-black/45 px-2 py-1 font-mono text-xs text-white/38">
                  ⌘K
                </span>
              </div>
              <Link href="/analyze" className="btn-indigo text-sm">
                Run detection
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-[calc(100vh-110px)] max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">{children}</main>

        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/8 bg-black/90 px-2 py-2 backdrop-blur-xl md:hidden">
          <div className="grid grid-cols-4 gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-[8px] px-2 py-2 text-[0.68rem] ${
                    isActive ? "bg-white text-black" : "text-white/44"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
