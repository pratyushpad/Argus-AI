"use client";

import { DetectionResponse } from "@/types/detection";
import ViolationCard from "./ViolationCard";
import { Download, Eye, Shield, Car, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Props {
  result: DetectionResponse;
}

export default function ResultsPanel({ result }: Props) {
  const { detections, violations, annotated_image, summary } = result;
  const [showAllDetections, setShowAllDetections] = useState(false);

  const visibleDetections = showAllDetections ? detections : detections.slice(0, 6);

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${annotated_image}`;
    link.download = "trafficguard-result.png";
    link.click();
  };

  return (
    <div className="space-y-5 stagger-children">
      {/* Annotated Image */}
      {annotated_image ? (
        <div className="glass rounded-2xl overflow-hidden glow-red">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-300">
              <Eye className="w-4 h-4 text-slate-500" />
              Detection Result
            </div>
            <button
              onClick={downloadImage}
              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.06] transition-all duration-200 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
          <img
            src={`data:image/png;base64,${annotated_image}`}
            alt="Detection result with annotated bounding boxes"
            className="w-full object-contain bg-black/30"
          />
        </div>
      ) : (
        <div className="glass rounded-2xl p-10 text-center">
          <div className="inline-flex p-3 rounded-xl bg-white/[0.03] mb-3">
            <Eye className="w-6 h-6 text-slate-600" />
          </div>
          <p className="text-sm text-slate-500">Annotated image available with live detection</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Car className="w-4.5 h-4.5 text-blue-400" />}
          label="Objects"
          value={summary.total_objects}
          glow="blue"
        />
        <StatCard
          icon={<Shield className="w-4.5 h-4.5 text-red-400" />}
          label="Violations"
          value={summary.violation_count}
          glow="red"
        />
        <StatCard
          icon={<span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />}
          label="High"
          value={summary.high_severity}
          glow="red"
        />
        <StatCard
          icon={<span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />}
          label="Medium"
          value={summary.medium_severity}
          glow="amber"
        />
      </div>

      {/* Violations */}
      {violations.length > 0 && (
        <div>
          <h3 className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-3">
            Violations ({violations.length})
          </h3>
          <div className="space-y-2.5">
            {violations.map((v, i) => (
              <ViolationCard key={i} violation={v} />
            ))}
          </div>
        </div>
      )}

      {violations.length === 0 && (
        <div className="text-center py-10 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10 glow-green">
          <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 mb-3">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-emerald-400 font-medium text-sm">No violations detected</p>
          <p className="text-[12px] text-slate-500 mt-1">All clear in this image</p>
        </div>
      )}

      {/* Detections Table */}
      <div>
        <h3 className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-3">
          All Detections ({detections.length})
        </h3>
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left font-medium text-slate-500 text-[11px] uppercase tracking-wider">Class</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 text-[11px] uppercase tracking-wider">Confidence</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500 text-[11px] uppercase tracking-wider hidden md:table-cell">Bbox</th>
              </tr>
            </thead>
            <tbody>
              {visibleDetections.map((d, i) => (
                <tr
                  key={i}
                  className="border-t border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-150"
                >
                  <td className="px-4 py-2.5 text-slate-300">{d.class_name}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            d.confidence > 0.7
                              ? "bg-emerald-400"
                              : d.confidence > 0.4
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${d.confidence * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-[12px] text-slate-400 w-12">
                        {(d.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 font-mono text-[11px] hidden md:table-cell">
                    [{d.bbox.map((b) => b.toFixed(2)).join(", ")}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {detections.length > 6 && (
            <button
              onClick={() => setShowAllDetections(!showAllDetections)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] text-slate-500 hover:text-slate-300 border-t border-white/[0.04] hover:bg-white/[0.02] transition-all duration-200 cursor-pointer"
            >
              {showAllDetections ? (
                <>Show less <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Show all {detections.length} detections <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  glow: "blue" | "red" | "amber";
}) {
  return (
    <div className={`glass rounded-xl p-4 text-center transition-all duration-200 hover:bg-white/[0.04] ${
      glow === "blue" ? "hover:shadow-blue-500/[0.04]" :
      glow === "red" ? "hover:shadow-red-500/[0.04]" :
      "hover:shadow-amber-500/[0.04]"
    } hover:shadow-2xl`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}
