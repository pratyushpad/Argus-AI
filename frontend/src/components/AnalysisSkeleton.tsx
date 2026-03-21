"use client";

import { motion } from "framer-motion";
import { Scan } from "lucide-react";
import GlowingCard from "@/components/ui/GlowingCard";

export default function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      <GlowingCard>
        <div className="p-10 text-center">
          <motion.div
            className="relative inline-flex mb-5"
          >
            <motion.div
              className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl"
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="relative p-4 rounded-full bg-red-500/10 border border-red-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Scan className="w-8 h-8 text-red-400" />
            </motion.div>
          </motion.div>

          <motion.p
            className="text-sm font-medium text-slate-200 mb-1"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Analyzing image...
          </motion.p>
          <p className="text-[12px] text-slate-500 mb-6">
            Running YOLOv8 inference and violation detection
          </p>

          {/* Animated progress */}
          <div className="max-w-xs mx-auto">
            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-red-400 to-red-600"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "60%" }}
              />
            </div>
          </div>
        </div>
      </GlowingCard>

      {/* Skeleton cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlowingCard>
              <div className="p-4">
                <div className="h-4 w-4 rounded bg-white/[0.04] mx-auto mb-3 animate-shimmer" />
                <div className="h-7 w-12 rounded bg-white/[0.04] mx-auto mb-2 animate-shimmer" />
                <div className="h-3 w-16 rounded bg-white/[0.03] mx-auto animate-shimmer" />
              </div>
            </GlowingCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
