"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  Check,
  Database,
  Download,
  Github,
  Info,
  LogOut,
  RotateCcw,
  Settings2,
  Shield,
  Trash2,
  UserRound,
} from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";
import { clearHistory, getHistory } from "@/lib/history";
import { getPreferences, resetPreferences, savePreferences } from "@/lib/preferences";
import { MagicCard } from "@/components/ui/magic-card";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { NumberTicker } from "@/components/ui/number-ticker";

function Toggle({ value, onChange }: { value: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={value}
      className={`relative h-7 w-12 rounded-[4px] border transition-colors ${
        value ? "border-white bg-white" : "border-white/12 bg-black"
      }`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 420, damping: 30 }}
        className={`absolute top-1 h-5 w-5 rounded-[2px] ${value ? "bg-black" : "bg-white"}`}
      />
    </button>
  );
}

function CardHeader({
  icon: Icon,
  eyebrow,
  title,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-white/8 pb-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-black/45 text-white/72">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/28">{eyebrow}</p>
        <h2 className="mt-0.5 font-display text-2xl text-white">{title}</h2>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [historyCount, setHistoryCount] = useState(0);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const prefs = getPreferences();
    setNotifications(prefs.notifications);
    setAutoSave(prefs.autoSave);
    setHistoryCount(getHistory().length);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const updatePreference = (next: { notifications?: boolean; autoSave?: boolean }) => {
    const nextValue = {
      notifications: next.notifications ?? notifications,
      autoSave: next.autoSave ?? autoSave,
    };
    setNotifications(nextValue.notifications);
    setAutoSave(nextValue.autoSave);
    savePreferences(nextValue);
    setToast("Preferences saved");
  };

  const handleExport = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      preferences: getPreferences(),
      history: getHistory(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `argus-workspace-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Workspace exported");
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistoryCount(0);
    setConfirmClear(false);
    setToast("History cleared");
  };

  const handleResetPreferences = () => {
    resetPreferences();
    const defaults = getPreferences();
    setNotifications(defaults.notifications);
    setAutoSave(defaults.autoSave);
    setToast("Preferences reset to defaults");
  };

  return (
    <div className="space-y-5 pb-20 md:pb-0">
      {/* Uniform 3-column grid */}
      <div className="grid gap-5 lg:grid-cols-3 auto-rows-[minmax(220px,auto)]">

        {/* Profile */}
        <MagicCard className="p-6">
          <CardHeader icon={UserRound} eyebrow="Account" title="Profile" />
          <div className="mt-5 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[8px] border border-white/10 bg-black/45 text-lg font-semibold text-white">
              {user ? user.name.charAt(0).toUpperCase() : <UserRound className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-white">{user ? user.name : "Guest workspace"}</p>
              <p className="mt-1 truncate text-sm text-white/42">
                {user ? user.email : "Local-only mode — data stays in this browser."}
              </p>
              {user?.mode && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-black/45 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/40">
                  <Shield className="h-3 w-3" />
                  {user.mode === "guest" ? "Guest" : "Google"}
                </div>
              )}
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[8px] border border-white/8 bg-black/45 px-3 py-3">
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-white/30">Saved runs</p>
              <p className="mt-1 font-display text-2xl text-white"><NumberTicker value={historyCount} /></p>
            </div>
            <div className="rounded-[8px] border border-white/8 bg-black/45 px-3 py-3">
              <p className="text-[0.6rem] uppercase tracking-[0.22em] text-white/30">Mode</p>
              <p className="mt-1 font-display text-2xl text-white">{user?.mode === "guest" ? "Guest" : user ? "Auth" : "Local"}</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            {user ? (
              <button onClick={signOut} className="btn-ghost-framer text-sm">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            ) : (
              <Link href="/auth/login" className="btn-ghost-framer text-sm">
                Sign in
              </Link>
            )}
          </div>
        </MagicCard>

        {/* Preferences */}
        <MagicCard className="p-6">
          <CardHeader icon={Bell} eyebrow="Preferences" title="Behavior toggles" />
          <div className="mt-5 space-y-3">
            <div className="flex items-start justify-between gap-4 rounded-[8px] border border-white/8 bg-black/45 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-white">Autosave analyses</p>
                <p className="mt-1 text-xs leading-5 text-white/42">
                  Completed runs are added to history automatically.
                </p>
              </div>
              <Toggle value={autoSave} onChange={() => updatePreference({ autoSave: !autoSave })} />
            </div>
            <div className="flex items-start justify-between gap-4 rounded-[8px] border border-white/8 bg-black/45 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-white">Completion notifications</p>
                <p className="mt-1 text-xs leading-5 text-white/42">
                  Show a toast when a detection or demo load finishes.
                </p>
              </div>
              <Toggle value={notifications} onChange={() => updatePreference({ notifications: !notifications })} />
            </div>
          </div>
        </MagicCard>

        {/* Data */}
        <MagicCard className="p-6">
          <CardHeader icon={Database} eyebrow="Data" title="Export and cleanup" />
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between gap-4 rounded-[8px] border border-white/8 bg-black/45 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-white">Export workspace JSON</p>
                <p className="mt-1 text-xs text-white/42">
                  Includes preferences and {historyCount} stored {historyCount === 1 ? "analysis" : "analyses"}.
                </p>
              </div>
              <button onClick={handleExport} className="btn-ghost-framer shrink-0 text-sm">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-[8px] border border-white/8 bg-black/45 px-4 py-4">
              <div>
                <p className="text-sm font-medium text-white">Clear stored history</p>
                <p className="mt-1 text-xs text-white/42">
                  Removes all saved analysis records from local storage.
                </p>
              </div>
              <button onClick={() => setConfirmClear(true)} className="btn-ghost-framer shrink-0 text-sm">
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        </MagicCard>

        {/* Reset + About — full row */}
        <MagicCard className="p-6 lg:col-span-3">
          <div className="grid gap-6 md:grid-cols-2 md:items-start">
            <div>
              <CardHeader icon={RotateCcw} eyebrow="Reset" title="Return to defaults" />
              <p className="mt-4 text-sm leading-6 text-white/48">
                Resets behavioral settings only — stored history is not affected.
              </p>
              <button onClick={handleResetPreferences} className="btn-ghost-framer mt-4 text-sm">
                <Settings2 className="h-4 w-4" />
                Reset preferences
              </button>
            </div>
            <div>
              <CardHeader icon={Info} eyebrow="About" title="Argus AI" />
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03]">
                  <Logo size={18} className="text-white" />
                </div>
                <p className="text-sm text-white/42">
                  Next.js · FastAPI · YOLOv8 · 23 detection classes
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href="https://github.com/Pratyushpad27/ML-Predictor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-framer text-sm"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <Link href="/platform" className="btn-ghost-framer text-sm">
                  <Info className="h-4 w-4" />
                  System page
                </Link>
              </div>
            </div>
          </div>
        </MagicCard>
      </div>

      <AlertDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear stored history?"
        description="This permanently removes every saved analysis from this browser's local storage. Preferences are unaffected."
        confirmLabel="Clear history"
        destructive
        onConfirm={handleClearHistory}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="fixed bottom-24 right-5 z-50 flex items-center gap-2 rounded-[6px] border border-white/10 bg-white px-4 py-3 text-sm font-medium text-black shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:bottom-8 md:right-8"
          >
            <Check className="h-4 w-4" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
