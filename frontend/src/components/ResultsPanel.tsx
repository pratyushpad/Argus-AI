"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DetectionResponse } from "@/types/detection";
import ViolationCard from "./ViolationCard";
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
    link.download = "argus-result.png";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Annotated Image */}
      {annotated_image ? (
        <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-white/[0.02]">
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-[13px] text-white/50">
              <Eye className="w-4 h-4 text-white/30" />
              Detection Result
            </div>
            <button
              onClick={downloadImage}
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white border border-white/[0.06] transition-all cursor-pointer"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
          <img
            src={`data:image/png;base64,${annotated_image}`}
            alt="Detection result with annotated bounding boxes"
            className="w-full object-contain bg-black"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 text-center">
          <Eye className="w-8 h-8 text-white/15 mx-auto mb-3" />
          <p className="text-[13px] text-white/30">Annotated image available with live detection</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Car className="w-5 h-5 text-white/40" />, label: "Objects", value: summary.total_objects },
          { icon: <Shield className="w-5 h-5 text-white/40" />, label: "Violations", value: summary.violation_count },
          { icon: <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />, label: "High", value: summary.high_severity },
          { icon: <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />, label: "Medium", value: summary.medium_severity },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center"
          >
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <p className="text-2xl font-bold text-white font-mono">{stat.value}</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Violations */}
      {violations.length > 0 && (
        <div>
          <p className="text-[13px] text-white/40 font-medium mb-3">
            Violations ({violations.length})
          </p>
          <div className="space-y-2">
            {violations.map((v, i) => (
              <ViolationCard key={i} violation={v} index={i} />
            ))}
          </div>
        </div>
      )}

      {violations.length === 0 && (
        <div className="text-center py-10 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03]">
          <Shield className="w-7 h-7 text-emerald-400/60 mx-auto mb-2" />
          <p className="text-emerald-400/80 font-medium text-[14px]">No violations detected</p>
          <p className="text-[12px] text-white/30 mt-1">All clear in this image</p>
        </div>
      )}

      {/* Detections Table */}
      <div>
        <p className="text-[13px] text-white/40 font-medium mb-3">
          All Detections ({detections.length})
        </p>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-5 py-3 text-left font-medium text-white/45 text-[11px] uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left font-medium text-white/45 text-[11px] uppercase tracking-wider">Confidence</th>
                <th className="px-5 py-3 text-left font-medium text-white/45 text-[11px] uppercase tracking-wider hidden md:table-cell">Bbox</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {visible.map((d, i) => (
                  <motion.tr
                    key={`${d.class_name}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-2.5 text-white/60">{d.class_name}</td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              d.confidence > 0.7 ? "bg-emerald-400" :
                              d.confidence > 0.4 ? "bg-amber-400" : "bg-red-400"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${d.confidence * 100}%` }}
                            transition={{ delay: i * 0.03, duration: 0.4 }}
                          />
                        </div>
                        <span className="font-mono text-[12px] text-white/40">
                          {(d.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-white/35 font-mono text-[10px] hidden md:table-cell">
                      [{d.bbox.map((b) => b.toFixed(2)).join(", ")}]
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {detections.length > 6 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-3 text-[12px] text-white/45 hover:text-white/70 border-t border-white/[0.04] transition-colors cursor-pointer"
            >
              {showAll ? (
                <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Show all {detections.length} <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
