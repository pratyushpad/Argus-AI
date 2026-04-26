"use client";

import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

interface TrafficSignBadgeProps {
  title?: string;
  caption?: string;
  compact?: boolean;
}

export default function TrafficSignBadge({
  title = "Live Rules",
  caption = "Violation engine",
  compact = false,
}: TrafficSignBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-[12px] border border-white/10 bg-white/[0.03] ${
        compact ? "p-4" : "p-6"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(112,96,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.65rem] uppercase tracking-[0.24em] text-white/35">
            {caption}
          </p>
          <h3 className={`${compact ? "mt-2 text-lg" : "mt-3 text-2xl"} font-display font-semibold text-white`}>
            {title}
          </h3>
        </div>
        <div className="rounded-[4px] border border-white/10 bg-black/40 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.28em] text-white/40">
          Active
        </div>
      </div>

      <div className={`relative ${compact ? "mt-6" : "mt-8"} flex items-center justify-center`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className={`${compact ? "h-28 w-28" : "h-40 w-40"} rotate-45 border border-dashed border-white/10`}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className={`absolute ${compact ? "h-20 w-20" : "h-28 w-28"} rotate-12 border border-white/12`}
        />
        <motion.div
          whileHover={{ scale: 1.03, rotate: -2 }}
          className={`absolute ${compact ? "h-16 w-16" : "h-24 w-24"} rotate-[8deg] rounded-[8px] border border-white/10 bg-black/80 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)]`}
          style={{
            clipPath:
              "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-white text-black">
            <ShieldAlert className={`${compact ? "h-6 w-6" : "h-10 w-10"}`} />
          </div>
        </motion.div>
      </div>

      <div className={`relative ${compact ? "mt-5" : "mt-8"} grid grid-cols-2 gap-3 text-xs`}>
        <div className="rounded-[8px] border border-white/8 bg-black/40 p-3">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/28">Signals</p>
          <p className="mt-2 text-xl font-semibold text-white">23</p>
        </div>
        <div className="rounded-[8px] border border-white/8 bg-black/40 p-3">
          <p className="text-[0.62rem] uppercase tracking-[0.22em] text-white/28">Latency</p>
          <p className="mt-2 text-xl font-semibold text-white">32ms</p>
        </div>
      </div>
    </motion.div>
  );
}
