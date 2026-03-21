"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DetectionResponse } from "@/types/detection";
import ViolationCard from "./ViolationCard";
import GlowingCard from "@/components/ui/GlowingCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { Download, Eye, Shield, Car, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  result: DetectionResponse;
}

export default function ResultsPanel({ result }: Props) {
  const { detections, violations, annotated_image, summary } = result;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? detections : detections.slice(0, 6);

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${annotated_image}`;
    link.download = "trafficguard-result.png";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Annotated Image */}
      {annotated_image ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlowingCard>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04]">
              <div className="flex items-center gap-2 text-[13px] font-medium text-slate-300">
                <Eye className="w-4 h-4 text-slate-500" />
                Detection Result
              </div>
              <motion.button
                onClick={downloadImage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.06] transition-all cursor-pointer"
              >
                <Download className="w-3 h-3" />
                Download
              </motion.button>
            </div>
            <img
              src={`data:image/png;base64,${annotated_image}`}
              alt="Detection result with annotated bounding boxes"
              className="w-full object-contain bg-black/40"
            />
          </GlowingCard>
        </motion.div>
      ) : (
        <GlowingCard>
          <div className="p-12 text-center">
            <div className="inline-flex p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] mb-4">
              <Eye className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-sm text-slate-500">Annotated image available with live detection</p>
          </div>
        </GlowingCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Car className="w-5 h-5 text-blue-400" />, label: "Objects", value: summary.total_objects, glow: "rgba(59,130,246,0.1)" },
          { icon: <Shield className="w-5 h-5 text-red-400" />, label: "Violations", value: summary.violation_count, glow: "rgba(239,68,68,0.1)" },
          { icon: <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />, label: "High", value: summary.high_severity, glow: "rgba(239,68,68,0.08)" },
          { icon: <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />, label: "Medium", value: summary.medium_severity, glow: "rgba(234,179,8,0.08)" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlowingCard glowColor={stat.glow}>
              <div className="p-4 text-center">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <AnimatedCounter value={stat.value} className="text-2xl font-bold text-white font-mono" />
                <div className="text-[10px] text-slate-500 uppercase tracking-[0.15em] mt-1">{stat.label}</div>
              </div>
            </GlowingCard>
          </motion.div>
        ))}
      </div>

      {/* Violations */}
      {violations.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-3">
            Violations ({violations.length})
          </p>
          <div className="space-y-2.5">
            {violations.map((v, i) => (
              <ViolationCard key={i} violation={v} index={i} />
            ))}
          </div>
        </div>
      )}

      {violations.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 rounded-2xl bg-emerald-500/[0.03] border border-emerald-500/10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex p-3 rounded-2xl bg-emerald-500/10 mb-3"
          >
            <Shield className="w-7 h-7 text-emerald-400" />
          </motion.div>
          <p className="text-emerald-400 font-medium">No violations detected</p>
          <p className="text-[12px] text-slate-500 mt-1">All clear in this image</p>
        </motion.div>
      )}

      {/* Detections Table */}
      <div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] mb-3">
          All Detections ({detections.length})
        </p>
        <GlowingCard glowColor="rgba(255,255,255,0.04)">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="px-5 py-3 text-left font-medium text-slate-500 text-[10px] uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500 text-[10px] uppercase tracking-wider">Confidence</th>
                <th className="px-5 py-3 text-left font-medium text-slate-500 text-[10px] uppercase tracking-wider hidden md:table-cell">Bbox</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {visible.map((d, i) => (
                  <motion.tr
                    key={`${d.class_name}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-2.5 text-slate-300">{d.class_name}</td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-20 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              d.confidence > 0.7 ? "bg-emerald-400" :
                              d.confidence > 0.4 ? "bg-amber-400" : "bg-red-400"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${d.confidence * 100}%` }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                          />
                        </div>
                        <span className="font-mono text-[12px] text-slate-400 w-10">
                          {(d.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-slate-600 font-mono text-[10px] hidden md:table-cell">
                      [{d.bbox.map((b) => b.toFixed(2)).join(", ")}]
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {detections.length > 6 && (
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-3 text-[12px] text-slate-500 hover:text-slate-300 border-t border-white/[0.03] transition-colors cursor-pointer"
            >
              {showAll ? (
                <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Show all {detections.length} <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </motion.button>
          )}
        </GlowingCard>
      </div>
    </div>
  );
}
