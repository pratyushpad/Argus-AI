"use client";

import { motion } from "framer-motion";
import { Violation } from "@/types/detection";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const SEVERITY_CONFIG = {
  high: {
    icon: AlertTriangle,
    glow: "rgba(239, 68, 68, 0.12)",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    iconColor: "text-red-400",
    pulse: "bg-red-500",
  },
  medium: {
    icon: AlertCircle,
    glow: "rgba(234, 179, 8, 0.12)",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    iconColor: "text-amber-400",
    pulse: "bg-amber-500",
  },
  low: {
    icon: Info,
    glow: "rgba(59, 130, 246, 0.12)",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    iconColor: "text-blue-400",
    pulse: "bg-blue-500",
  },
};

export default function ViolationCard({ violation, index = 0 }: { violation: Violation; index?: number }) {
  const config = SEVERITY_CONFIG[violation.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#0a0f1e]/80 backdrop-blur-sm p-4 cursor-default group"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 0% 50%, ${config.glow}, transparent 60%)` }}
      />
      <div className="relative z-10 flex items-start gap-3">
        <motion.div
          className="mt-0.5"
          whileHover={{ rotate: 15 }}
        >
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${config.badge} flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.pulse} animate-pulse`} />
              {violation.severity}
            </span>
            <span className="text-[13px] font-medium text-slate-300 truncate">
              {violation.type.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-[12px] text-slate-400 leading-relaxed mb-2.5">{violation.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {violation.involved_objects.map((obj, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-slate-500"
              >
                {obj}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
