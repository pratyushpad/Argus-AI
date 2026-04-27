"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Scan,
  Clock,
  BarChart3,
  Settings,
  Home,
  Command,
  ArrowRight,
} from "lucide-react";

interface Action {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const actions: Action[] = [
    { id: "analyze", label: "Detection", description: "Upload and analyze an image", icon: <Scan className="w-4 h-4" />, action: () => router.push("/analyze"), category: "Navigate" },
    { id: "history", label: "History", description: "View past analyses", icon: <Clock className="w-4 h-4" />, action: () => router.push("/history"), category: "Navigate" },
    { id: "analytics", label: "Analytics", description: "Charts and insights", icon: <BarChart3 className="w-4 h-4" />, action: () => router.push("/analytics"), category: "Navigate" },
    { id: "settings", label: "Settings", description: "Preferences & profile", icon: <Settings className="w-4 h-4" />, action: () => router.push("/settings"), category: "Navigate" },
    { id: "home", label: "Landing Page", description: "Go to homepage", icon: <Home className="w-4 h-4" />, action: () => router.push("/"), category: "Navigate" },
  ];

  const filtered = query
    ? actions.filter((a) =>
        a.label.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase())
      )
    : actions;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      filtered[selectedIndex].action();
      setOpen(false);
    }
  };

  // Group by category
  const grouped = filtered.reduce<Record<string, Action[]>>((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-lg"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#0c1220] shadow-2xl shadow-black/60 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                <Search className="w-5 h-5 text-white/30 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search commands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-[15px] text-white/90 placeholder:text-white/25 focus:outline-none"
                />
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] text-white/30 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[320px] overflow-y-auto py-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="px-5 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                      {category}
                    </p>
                    {items.map((action) => {
                      const globalIndex = filtered.indexOf(action);
                      return (
                        <button
                          key={action.id}
                          onClick={() => {
                            action.action();
                            setOpen(false);
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors cursor-pointer ${
                            globalIndex === selectedIndex
                              ? "bg-[#2563eb]/10 text-white"
                              : "text-white/60 hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className={globalIndex === selectedIndex ? "text-[#60a5fa]" : "text-white/30"}>
                            {action.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-medium">{action.label}</p>
                            <p className="text-[11px] text-white/30 truncate">{action.description}</p>
                          </div>
                          {globalIndex === selectedIndex && (
                            <ArrowRight className="w-3.5 h-3.5 text-[#60a5fa]/60 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-[14px] text-white/30">No results found</p>
                  </div>
                )}
              </div>

              {/* Footer hint */}
              <div className="px-5 py-3 border-t border-white/[0.04] flex items-center gap-4 text-[10px] text-white/20">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] font-mono">esc</kbd>
                  close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
