"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AnalysisRecord,
  getHistory,
  deleteAnalysis,
  clearHistory,
  formatTimestamp,
} from "@/lib/history";
import {
  Clock,
  Trash2,
  Shield,
  AlertTriangle,
  Eye,
  Scan,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Drawer } from "@/components/ui/drawer";
import { AlertDialog } from "@/components/ui/alert-dialog";

function getSeverityBadge(violationCount: number, highSeverity: number) {
  if (violationCount === 0) return { label: "Clean", cls: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" };
  if (highSeverity > 0) return { label: "High Risk", cls: "bg-rose-500/10 border-rose-500/20 text-rose-400" };
  return { label: "Warning", cls: "bg-amber-500/10 border-amber-500/20 text-amber-400" };
}

const TOOLTIP_STYLE = {
  backgroundColor: "#111114",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.8)",
  fontSize: "12px",
  padding: "8px 12px",
};

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  const filtered = records.filter((r) =>
    r.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteAnalysis(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleClearAll = () => {
    clearHistory();
    setRecords([]);
    setSelectedId(null);
    setConfirmClear(false);
  };

  const selected = records.find((r) => r.id === selectedId);

  const totalViolations = records.reduce((s, r) => s + r.result.summary.violation_count, 0);
  const totalObjects = records.reduce((s, r) => s + r.result.summary.total_objects, 0);

  return (
    <div className="space-y-5 pb-20 md:pb-0">
      <div>
        {records.length === 0 ? (
          /* ─── EMPTY STATE — full viewport hero ─── */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.02] px-6 py-20 text-center"
          >
            <div className="pointer-events-none absolute inset-0 gradient-mesh-soft opacity-60" />
            <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-grid-fade opacity-40" />
            <div className="relative">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/45">
                <Clock className="h-8 w-8 text-blue-400/70" />
              </div>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.025em] text-white">
                No analyses yet
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/45">
                Your detection history lives here. Upload a frame, run analysis, and saved
                runs will appear with thumbnails, severity, and full result detail.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/analyze" className="btn-indigo text-sm">
                  <Scan className="h-4 w-4" />
                  Run your first analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/platform" className="text-sm text-white/55 transition-colors hover:text-white">
                  How detection works →
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {/* Sticky header — KPI strip stays visible while results scroll */}
            <div className="sticky top-[110px] z-30 -mx-2 rounded-[14px] border border-white/8 bg-black/70 px-2 py-3 backdrop-blur-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Analyses", value: records.length, color: "text-blue-400" },
                { label: "Violations", value: totalViolations, color: totalViolations > 0 ? "text-rose-400" : "text-emerald-400" },
                { label: "Objects", value: totalObjects, color: "text-blue-400" },
                { label: "Last run", value: records[0] ? formatTimestamp(records[0].timestamp) : "—", color: "text-white/80", isText: true },
              ].map((stat) => (
                <MagicCard key={stat.label} className="p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/30">{stat.label}</p>
                  <p className={`mt-2 font-display text-[28px] font-bold leading-none ${stat.color}`}>
                    {stat.isText ? stat.value : <NumberTicker value={stat.value as number} />}
                  </p>
                </MagicCard>
              ))}
            </div>

            </div>
            {/* /Sticky header */}

            {/* Toolbar with Clear all */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm-ui text-white/25 hover:text-rose-400/70 border border-default hover:border-rose-500/20 transition-all duration-200 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                Clear all
              </button>
            </div>

            {/* Legacy strip removed (kept anchor) */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="hidden"
            >
              {[
                { label: "Analyses", value: records.length, color: "text-blue-400" },
                { label: "Violations", value: totalViolations, color: totalViolations > 0 ? "text-rose-400" : "text-emerald-400" },
                { label: "Objects", value: totalObjects, color: "text-blue-400" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full card-base"
                >
                  <span className={`text-base-ui font-bold font-mono ${stat.color}`}>{stat.value}</span>
                  <span className="text-xs-ui text-white/30">{stat.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                placeholder="Search by filename…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#0e0e11] border border-default text-[14px] text-white/80 placeholder:text-white/15 focus:outline-none focus:border-blue-500/30 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-white/[0.06] text-white/20 hover:text-white/50 transition-all duration-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>

            {/* Grid — full width, drawer opens for detail */}
            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                <AnimatePresence>
                  {filtered.map((record, i) => {
                    const badge = getSeverityBadge(
                      record.result.summary.violation_count,
                      record.result.summary.high_severity
                    );
                    const isSelected = record.id === selectedId;
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedId(isSelected ? null : record.id)}
                        className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "border-blue-500/20 bg-blue-500/[0.03]"
                            : "border-default bg-[#0e0e11] hover:border-white/[0.12] hover:bg-white/[0.025]"
                        }`}
                      >
                        {/* Thumbnail 16:9 */}
                        <div className="w-20 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] overflow-hidden shrink-0">
                          {record.thumbnail ? (
                            <img
                              src={record.thumbnail}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Scan className="w-4 h-4 text-white/15" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <p className="text-base-ui font-bold text-white/80 truncate">
                              {record.fileName}
                            </p>
                            {record.isDemo && (
                              <span className="text-[9px] font-mono text-white/20 px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.04] shrink-0">
                                demo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="text-xs-ui text-white/25">{formatTimestamp(record.timestamp)}</span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                            <span className="flex items-center gap-1 text-xs-ui text-white/25">
                              <Eye className="w-3 h-3" />
                              {record.result.summary.total_objects}
                            </span>
                          </div>
                        </div>

                        {/* Delete on hover */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-white/15 hover:text-rose-400/70 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer shrink-0"
                          aria-label="Delete analysis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filtered.length === 0 && search && (
                  <div className="text-center py-14">
                    <p className="text-base-ui text-white/25">No results for &ldquo;{search}&rdquo;</p>
                  </div>
                )}
              </div>

            </div>

            {/* Drawer detail */}
            <Drawer
              open={!!selected}
              onClose={() => setSelectedId(null)}
              title={selected?.fileName ?? ""}
            >
              {selected && (
                <div>
                  <p className="text-xs text-white/40">{formatTimestamp(selected.timestamp)}</p>
                  <div className="mt-4 space-y-5">
                        {/* Stat row — 4 mini cards */}
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: "Objects", value: selected.result.summary.total_objects, color: "text-white/70" },
                            {
                              label: "Violations",
                              value: selected.result.summary.violation_count,
                              color: selected.result.summary.violation_count > 0 ? "text-rose-400" : "text-emerald-400",
                            },
                            { label: "High", value: selected.result.summary.high_severity, color: "text-rose-400/80" },
                            { label: "Medium", value: selected.result.summary.medium_severity, color: "text-amber-400/80" },
                          ].map((stat) => (
                            <div
                              key={stat.label}
                              className="text-center p-3 rounded-xl bg-white/[0.025] border border-subtle"
                            >
                              <p className={`text-xl-ui font-bold font-mono ${stat.color}`}>{stat.value}</p>
                              <p className="text-[9px] text-white/25 uppercase tracking-wider mt-0.5">{stat.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Violations list */}
                        {selected.result.violations.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-base-ui font-semibold text-white/70 px-0.5">Violations</p>
                            {selected.result.violations.map((v, i) => (
                              <div
                                key={i}
                                className={`p-3 rounded-xl border ${
                                  v.severity === "high"
                                    ? "border-rose-500/12 bg-rose-500/[0.04]"
                                    : v.severity === "medium"
                                    ? "border-amber-500/12 bg-amber-500/[0.04]"
                                    : "border-blue-500/12 bg-blue-500/[0.04]"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md border ${
                                      v.severity === "high"
                                        ? "bg-rose-500/10 text-rose-400/90 border-rose-500/15"
                                        : v.severity === "medium"
                                        ? "bg-amber-500/10 text-amber-400/90 border-amber-500/15"
                                        : "bg-blue-500/10 text-blue-400/90 border-blue-500/15"
                                    }`}
                                  >
                                    {v.severity}
                                  </span>
                                  <span className="text-sm-ui text-white/60 font-medium">
                                    {v.type.replace(/_/g, " ")}
                                  </span>
                                </div>
                                <p className="text-xs-ui text-white/40">{v.description}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-5 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03]">
                            <Shield className="w-5 h-5 text-emerald-400/60 mb-1" />
                            <p className="text-sm-ui text-emerald-400/70 font-medium">No violations detected</p>
                          </div>
                        )}

                        {/* Detections table with confidence bars */}
                        <div>
                          <p className="text-base-ui font-semibold text-white/70 mb-2 px-0.5">
                            Detections ({selected.result.detections.length})
                          </p>
                          <div className="space-y-1">
                            {selected.result.detections.map((d, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.025] border border-white/[0.04] text-sm-ui"
                              >
                                <span className="text-white/55">{d.class_name}</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-14 h-1 rounded-full bg-white/[0.07] overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        d.confidence > 0.7
                                          ? "bg-emerald-400"
                                          : d.confidence > 0.4
                                          ? "bg-amber-400"
                                          : "bg-rose-400"
                                      }`}
                                      style={{ width: `${d.confidence * 100}%` }}
                                    />
                                  </div>
                                  <span className="font-mono text-xs-ui text-white/30 w-8 text-right">
                                    {(d.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                  </div>
                </div>
              )}
            </Drawer>
          </div>
        )}
      </div>

      <AlertDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Clear all history?"
        description="This permanently removes every saved analysis from this browser's local storage."
        confirmLabel="Clear all"
        destructive
        onConfirm={handleClearAll}
      />
    </div>
  );
}
