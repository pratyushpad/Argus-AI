"use client";

import { Violation } from "@/types/detection";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const SEVERITY_CONFIG = {
  high: {
    icon: AlertTriangle,
    bg: "bg-red-500/[0.06]",
    border: "border-red-500/20",
    badge: "bg-red-500/20 text-red-400",
    iconColor: "text-red-400",
    glow: "hover:shadow-red-500/[0.04]",
  },
  medium: {
    icon: AlertCircle,
    bg: "bg-amber-500/[0.06]",
    border: "border-amber-500/20",
    badge: "bg-amber-500/20 text-amber-400",
    iconColor: "text-amber-400",
    glow: "hover:shadow-amber-500/[0.04]",
  },
  low: {
    icon: Info,
    bg: "bg-blue-500/[0.06]",
    border: "border-blue-500/20",
    badge: "bg-blue-500/20 text-blue-400",
    iconColor: "text-blue-400",
    glow: "hover:shadow-blue-500/[0.04]",
  },
};

export default function ViolationCard({ violation }: { violation: Violation }) {
  const config = SEVERITY_CONFIG[violation.severity];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-all duration-200 ${config.glow} hover:shadow-2xl`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon className={`w-4.5 h-4.5 ${config.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${config.badge}`}>
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
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-500"
              >
                {obj}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
