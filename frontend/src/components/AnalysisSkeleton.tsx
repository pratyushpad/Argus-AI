"use client";

import { motion } from "framer-motion";
import { Scan } from "lucide-react";

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-10 text-center">
        <motion.div className="relative inline-flex mb-5">
          <motion.div
            className="relative p-4 rounded-full bg-white/[0.06] border border-white/[0.08]"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Scan className="w-7 h-7 text-[#60a5fa]/60" />
          </motion.div>
        </motion.div>

        <motion.p
          className="text-[15px] font-medium text-white/80 mb-1"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Analyzing image...
        </motion.p>
        <p className="text-[13px] text-white/30 mb-6">
          Running YOLOv8 inference and violation detection
        </p>

        <div className="max-w-xs mx-auto">
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-[#2563eb]/40"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: "50%" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="h-4 w-4 rounded bg-white/[0.06] mx-auto mb-3 animate-shimmer" />
            <div className="h-6 w-10 rounded bg-white/[0.06] mx-auto mb-2 animate-shimmer" />
            <div className="h-3 w-14 rounded bg-white/[0.04] mx-auto animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
