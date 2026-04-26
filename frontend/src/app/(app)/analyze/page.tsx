"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  FolderOutput,
  RotateCcw,
  ScanSearch,
  Shield,
  Sparkles,
  Activity,
  History,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";
import ResultsPanel from "@/components/ResultsPanel";
import AnalysisSkeleton from "@/components/AnalysisSkeleton";
import { detectViolations } from "@/lib/api";
import { DEMO_RESULT } from "@/lib/demo-data";
import { DetectionResponse } from "@/types/detection";
import { createThumbnail, saveAnalysis, getHistory, formatTimestamp, AnalysisRecord } from "@/lib/history";
import { AppPreferences, getPreferences } from "@/lib/preferences";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function loadPreferences(): AppPreferences {
  return getPreferences();
}

function useModelStatus() {
  const [modelLoaded, setModelLoaded] = useState<boolean | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((d) => setModelLoaded(d.model_loaded === true))
      .catch(() => setModelLoaded(false));
  }, []);

  return modelLoaded;
}

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [toast, setToast] = useState<string>("");
  const [preferences, setPreferences] = useState<AppPreferences>(loadPreferences);
  const [historyCount, setHistoryCount] = useState(0);
  const [lastRunAt, setLastRunAt] = useState<number | null>(null);
  const [recentRuns, setRecentRuns] = useState<AnalysisRecord[]>([]);
  const modelLoaded = useModelStatus();

  useEffect(() => {
    const history = getHistory();
    setHistoryCount(history.length);
    setLastRunAt(history[0]?.timestamp ?? null);
    setRecentRuns(history.slice(0, 3));
  }, [result]);

  useEffect(() => {
    const sync = () => setPreferences(loadPreferences());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const handleFileSelect = (nextFile: File) => {
    setFile(nextFile);
    setResult(null);
    setError(null);
    setIsDemo(false);
  };

  const maybeSaveAnalysis = useCallback(
    async (analysisResult: DetectionResponse, sourceFile: File | null, demo: boolean) => {
      if (!preferences.autoSave) return;
      const thumbnail = sourceFile ? await createThumbnail(sourceFile) : "";
      saveAnalysis({
        fileName: sourceFile?.name ?? "demo-sample.jpg",
        fileSize: sourceFile?.size ?? 0,
        thumbnail,
        result: analysisResult,
        isDemo: demo,
      });
    },
    [preferences.autoSave]
  );

  const maybeNotify = (message: string) => {
    if (preferences.notifications) setToast(message);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await detectViolations(file);
      setResult(data);
      await maybeSaveAnalysis(data, file, false);
      maybeNotify("Analysis complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while running detection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = async () => {
    setIsDemo(true);
    setFile(null);
    setError(null);
    setResult(DEMO_RESULT);
    await maybeSaveAnalysis(DEMO_RESULT, null, true);
    maybeNotify("Demo loaded");
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setIsDemo(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">

      {/* Status strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: Activity,
            label: "Model",
            text: modelLoaded === null ? "Checking…" : modelLoaded ? "Online" : "Offline",
            color: modelLoaded === null ? "text-white/40" : modelLoaded ? "text-green-400" : "text-rose-400",
          },
          { icon: History, label: "Saved runs", num: historyCount, color: "text-white" },
          {
            icon: FolderOutput,
            label: "Autosave",
            text: preferences.autoSave ? "On" : "Off",
            color: preferences.autoSave ? "text-green-400" : "text-white/40",
          },
          {
            icon: Clock3,
            label: "Last run",
            text: lastRunAt ? formatTimestamp(lastRunAt) : "None yet",
            color: "text-white",
          },
        ].map(({ icon: Icon, label, text, num, color }) => (
          <MagicCard key={label} className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-white/8 bg-black/45">
                <Icon className="h-4 w-4 text-white/50" />
              </div>
              <div className="min-w-0">
                <p className="text-[0.65rem] uppercase tracking-[0.22em] text-white/30">{label}</p>
                <p className={`mt-0.5 text-sm font-medium truncate ${color}`}>
                  {typeof num === "number" ? <NumberTicker value={num} /> : text}
                </p>
              </div>
            </div>
          </MagicCard>
        ))}
      </div>

      {/* Main detection panel — left sticks while right scrolls */}
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        {/* Upload / results — sticky so the user can scroll the right column without losing context */}
        <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/28">Upload panel</p>
              <h2 className="mt-2 font-display text-4xl text-white">Frame intake</h2>
            </div>
            <div className="flex gap-2">
              {result && (
                <button onClick={handleReset} className="btn-ghost-framer text-sm">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              )}
              {file && !result && !isLoading && (
                <ShimmerButton onClick={handleAnalyze}>
                  Run analysis
                  <ArrowRight className="h-4 w-4" />
                </ShimmerButton>
              )}
            </div>
          </div>

          <div className="mt-6">
            {!result && !isLoading && (
              <div className="space-y-4">
                <div className="rounded-[10px] border border-white/8 bg-black/45 p-4">
                  <ImageUploader onFileSelect={handleFileSelect} isLoading={isLoading} />
                </div>
                <button onClick={handleDemo} className="btn-ghost-framer w-full justify-center">
                  <Sparkles className="h-4 w-4" />
                  Load sample result
                </button>
              </div>
            )}

            {isLoading && (
              <div className="rounded-[10px] border border-white/8 bg-black/45 p-4">
                <AnalysisSkeleton />
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-white/8 bg-black/45 px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white text-black">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-display text-2xl text-white">Analysis complete</p>
                    <p className="mt-0.5 text-sm text-white/44">
                      {isDemo ? "Demo mode" : "Live detection"} · {result.summary.total_objects} objects ·{" "}
                      {result.summary.violation_count} violations
                    </p>
                  </div>
                </div>
                <ResultsPanel result={result} />
              </div>
            )}
          </div>
        </div>

        {/* Right: workflow + recent runs */}
        <div className="flex flex-col gap-5">
          {/* Quick capabilities row */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: ScanSearch, label: "Detection", value: "YOLOv8 · 23 classes" },
              { icon: Shield, label: "Violations", value: "8+ rule checks" },
              { icon: BellRing, label: "Alerts", value: preferences.notifications ? "Enabled" : "Disabled" },
              { icon: FolderOutput, label: "Autosave", value: preferences.autoSave ? "Enabled" : "Disabled" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-[10px] border border-white/8 bg-white/[0.02] p-4">
                <Icon className="h-4 w-4 text-white/45" />
                <p className="mt-3 text-[0.65rem] uppercase tracking-[0.22em] text-white/30">{label}</p>
                <p className="mt-1 text-sm text-white/72">{value}</p>
              </div>
            ))}
          </div>

          {/* How-to steps */}
          <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/28">Workflow</p>
            <div className="mt-4 space-y-2">
              {[
                "Upload a JPG, PNG, or WebP frame under 10 MB.",
                "Run the model — results include detections + violations.",
                "Review the annotated image and violation table.",
                "If autosave is on, the run feeds history and analytics.",
              ].map((item, i) => (
                <div key={i} className="flex gap-3 rounded-[8px] border border-white/8 bg-black/45 px-4 py-3">
                  <span className="font-mono text-xs tracking-[0.22em] text-[#3b82f6] shrink-0">0{i + 1}</span>
                  <p className="text-sm leading-6 text-white/50">{item}</p>
                </div>
              ))}
            </div>
            <Link href="/settings" className="mt-4 inline-flex items-center gap-2 text-sm text-white/42 hover:text-white transition-colors">
              Manage preferences in Settings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Recent runs — fills the rest of the column */}
          <div className="flex-1 rounded-[12px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/28">Recent runs</p>
              <Link href="/history" className="text-xs text-white/42 hover:text-white transition-colors inline-flex items-center gap-1">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recentRuns.length === 0 ? (
              <p className="mt-4 text-sm text-white/40">No runs yet — upload a frame to start filling history.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {recentRuns.map((run) => (
                  <div key={run.id} className="flex items-center gap-3 rounded-[8px] border border-white/8 bg-black/45 p-3">
                    {run.thumbnail ? (
                      <img src={run.thumbnail} alt="" className="h-10 w-14 shrink-0 rounded-[4px] object-cover" />
                    ) : (
                      <div className="h-10 w-14 shrink-0 rounded-[4px] border border-white/8 bg-black/40" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white/85">{run.fileName}</p>
                      <p className="text-[0.7rem] text-white/40">
                        {formatTimestamp(run.timestamp)} · {run.result.summary.total_objects} obj · {run.result.summary.violation_count} viol
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="rounded-[8px] border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-300"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="fixed bottom-24 right-5 z-50 rounded-[6px] border border-white/10 bg-white px-4 py-3 text-sm font-medium text-black shadow-[0_24px_60px_rgba(0,0,0,0.5)] md:bottom-8 md:right-8"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
