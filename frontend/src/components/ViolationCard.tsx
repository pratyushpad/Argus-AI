"use client";

import { Violation } from "@/types/detection";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";

const SEVERITY_CONFIG = {
  high: {
    icon: AlertTriangle,
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    badge: "bg-red-500",
    text: "text-red-400",
  },
  medium: {
    icon: AlertCircle,
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    badge: "bg-yellow-500",
    text: "text-yellow-400",
  },
  low: {
    icon: Info,
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500",
    text: "text-blue-400",
  },
};

export default function ViolationCard({ violation }: { violation: Violation }) {
  const config = SEVERITY_CONFIG[violation.severity];
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-4 transition-all hover:scale-[1.01]`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-0.5 ${config.text}`} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${config.badge}`}>
              {violation.severity.toUpperCase()}
            </span>
            <span className="text-sm font-medium text-gray-300">
              {violation.type.replace(/_/g, " ")}
            </span>
          </div>
          <p className="text-sm text-gray-400">{violation.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {violation.involved_objects.map((obj, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400"
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
