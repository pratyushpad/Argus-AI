"use client";

import { Loader2 } from "lucide-react";

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Progress indicator */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
        <Loader2 className="w-10 h-10 mx-auto mb-3 text-red-400 animate-spin" />
        <p className="text-sm font-medium text-gray-300">Analyzing image...</p>
        <p className="text-xs text-gray-500 mt-1">
          Running YOLOv8 detection and violation checks
        </p>
        <div className="mt-4 max-w-xs mx-auto">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-red-500/60 animate-pulse-glow w-2/3" />
          </div>
        </div>
      </div>

      {/* Skeleton stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="h-5 w-5 rounded bg-white/10 mx-auto mb-2" />
            <div className="h-7 w-10 rounded bg-white/10 mx-auto mb-1" />
            <div className="h-3 w-14 rounded bg-white/10 mx-auto" />
          </div>
        ))}
      </div>

      {/* Skeleton violations */}
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-48 rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
