"use client";

import { DetectionResponse } from "@/types/detection";
import ViolationCard from "./ViolationCard";
import { Download, Eye, Shield, Car } from "lucide-react";

interface Props {
  result: DetectionResponse;
}

export default function ResultsPanel({ result }: Props) {
  const { detections, violations, annotated_image, summary } = result;

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${annotated_image}`;
    link.download = "violation-detection-result.png";
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Annotated Image */}
      {annotated_image ? (
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Eye className="w-4 h-4" />
              Detection Result
            </div>
            <button
              onClick={downloadImage}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
          <img
            src={`data:image/png;base64,${annotated_image}`}
            alt="Detection result"
            className="w-full object-contain bg-black/20"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-8 text-center">
          <Eye className="w-8 h-8 mx-auto mb-3 text-gray-600" />
          <p className="text-sm text-gray-500">Annotated image preview available with live detection</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Car className="w-5 h-5 text-blue-400" />}
          label="Objects"
          value={summary.total_objects}
        />
        <StatCard
          icon={<Shield className="w-5 h-5 text-red-400" />}
          label="Violations"
          value={summary.violation_count}
        />
        <StatCard
          icon={<span className="w-3 h-3 rounded-full bg-red-500 inline-block" />}
          label="High"
          value={summary.high_severity}
        />
        <StatCard
          icon={<span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />}
          label="Medium"
          value={summary.medium_severity}
        />
      </div>

      {/* Violations */}
      {violations.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
            Violations Detected
          </h3>
          <div className="space-y-3">
            {violations.map((v, i) => (
              <ViolationCard key={i} violation={v} />
            ))}
          </div>
        </div>
      )}

      {violations.length === 0 && (
        <div className="text-center py-8 rounded-xl bg-green-500/10 border border-green-500/20">
          <Shield className="w-10 h-10 mx-auto mb-2 text-green-400" />
          <p className="text-green-400 font-medium">No violations detected</p>
          <p className="text-sm text-gray-500 mt-1">All clear in this image</p>
        </div>
      )}

      {/* Detections Table */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
          All Detections ({detections.length})
        </h3>
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-left">
                <th className="px-4 py-2.5 font-medium">Class</th>
                <th className="px-4 py-2.5 font-medium">Confidence</th>
                <th className="px-4 py-2.5 font-medium hidden md:table-cell">Position</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((d, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/5">
                  <td className="px-4 py-2.5 text-gray-300">{d.class_name}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`font-mono ${
                        d.confidence > 0.7
                          ? "text-green-400"
                          : d.confidence > 0.4
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {(d.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-gray-500 font-mono text-xs hidden md:table-cell">
                    [{d.bbox.map((b) => b.toFixed(2)).join(", ")}]
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
    </div>
  );
}
