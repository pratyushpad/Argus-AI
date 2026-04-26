"use client";

import { motion } from "framer-motion";
import { Violation } from "@/types/detection";
import { AlertTriangle, AlertCircle, Info, ChevronDown } from "lucide-react";
import { useState } from "react";

const SEVERITY = {
  high: {
    icon: AlertTriangle,
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    bar: "bg-rose-500",
    barBg: "bg-rose-500/10",
    glow: "group-hover:shadow-[0_0_20px_rgba(244,63,94,0.08)]",
    border: "border-rose-500/10 hover:border-rose-500/25",
    pct: 100,
  },
  medium: {
    icon: AlertCircle,
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    bar: "bg-amber-500",
    barBg: "bg-amber-500/10",
    glow: "group-hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]",
    border: "border-amber-500/10 hover:border-amber-500/25",
    pct: 60,
  },
  low: {
    icon: Info,
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    bar: "bg-blue-500",
    barBg: "bg-blue-500/10",
    glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]",
    border: "border-blue-500/10 hover:border-blue-500/25",
    pct: 30,
  },
};

export default function ViolationCard({ violation, index = 0 }: { violation: Violation; index?: number }) {
  const cfg = SEVERITY[violation.severity];
  const Icon = cfg.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 28 }}
      className={`group rounded-2xl border bg-white/[0.018] transition-all duration-300 overflow-hidden cursor-default ${cfg.border} ${cfg.glow}`}>

      {/* Severity bar */}
      <div className={`h-0.5 w-full ${cfg.barBg}`}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${cfg.pct}%` }}
          transition={{ delay: index * 0.06 + 0.2, duration: 0.6 }}
          className={`h-full ${cfg.bar} opacity-60`} />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${cfg.badge}`}>
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                {violation.severity}
              </span>
              <span className="text-[13px] font-semibold text-white/80 truncate">
                {violation.type.replace(/_/g, " ")}
              </span>
            </div>

            <p className="text-[12px] text-white/45 leading-relaxed mb-3">{violation.description}</p>

            {/* Involved objects */}
            <div className="flex flex-wrap gap-1.5">
              {violation.involved_objects.map((obj, i) => (
                <span key={i}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40">
                  {obj}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
