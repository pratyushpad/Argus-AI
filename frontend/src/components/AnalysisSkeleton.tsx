"use client";

import { Scan } from "lucide-react";

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Progress card */}
      <div className="glass rounded-2xl p-8 text-center glow-red">
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse-soft" />
          <div className="relative p-3 rounded-full bg-red-500/10 border border-red-500/20">
            <Scan className="w-7 h-7 text-red-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-200 mb-1">Analyzing image...</p>
        <p className="text-[12px] text-slate-500 mb-5">
          Running YOLOv8 inference and violation detection
        </p>

        {/* Progress bar */}
        <div className="max-w-xs mx-auto">
          <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-red-500/60 to-red-400/40 animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Skeleton stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="h-4 w-4 rounded bg-white/[0.06] mx-auto mb-3 animate-shimmer" />
            <div className="h-7 w-12 rounded bg-white/[0.06] mx-auto mb-2 animate-shimmer" />
            <div className="h-3 w-16 rounded bg-white/[0.04] mx-auto animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Skeleton violations */}
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded bg-white/[0.06] animate-shimmer" />
              <div className="flex-1 space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-14 rounded bg-white/[0.06] animate-shimmer" />
                  <div className="h-4 w-28 rounded bg-white/[0.04] animate-shimmer" />
                </div>
                <div className="h-3 w-52 rounded bg-white/[0.04] animate-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
