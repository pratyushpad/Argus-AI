"use client";

import { motion } from "framer-motion";
import { Boxes, BrainCircuit, Shield, FolderOutput } from "lucide-react";

const STAGES = [
  { icon: Boxes, label: "Upload", detail: "JPG · PNG · WebP", color: "#3b82f6" },
  { icon: BrainCircuit, label: "YOLOv8", detail: "23 classes", color: "#22c55e" },
  { icon: Shield, label: "Rule engine", detail: "8+ checks", color: "#f59e0b" },
  { icon: FolderOutput, label: "Response", detail: "JSON + image", color: "#3b82f6" },
];

const METRICS = [
  { label: "mAP50", value: "92.7%" },
  { label: "Inference", value: "<35ms" },
  { label: "Stages", value: "4" },
  { label: "Classes", value: "23" },
];

export default function PipelineDiagram() {
  return (
    <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-5 space-y-5">
      <div className="flex items-center justify-between rounded-[8px] border border-white/8 bg-black px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/34">
        <span>Pipeline diagram</span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_18px_rgba(124,114,255,0.75)]" />
          4-stage inference
        </span>
      </div>

      {/* Stages */}
      <div className="relative flex flex-col gap-2">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <div key={stage.label}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="flex items-center gap-4 rounded-[10px] border border-white/8 bg-black/50 px-4 py-3"
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-white/10"
                  style={{ backgroundColor: `${stage.color}18` }}
                >
                  <Icon className="h-4 w-4" style={{ color: stage.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/84">{stage.label}</p>
                  <p className="text-xs text-white/38">{stage.detail}</p>
                </div>
                <span className="font-mono text-[0.65rem] tracking-[0.22em] text-white/28">
                  0{i + 1}
                </span>
              </motion.div>

              {/* Connector */}
              {i < STAGES.length - 1 && (
                <div className="ml-6 flex items-center gap-2 py-1">
                  <div className="w-px h-4 bg-white/10 ml-4" />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.12 + 0.2, duration: 0.3 }}
                    className="h-px flex-1 origin-left"
                    style={{ backgroundColor: `${stage.color}30` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-2">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="rounded-[8px] border border-white/8 bg-black/45 px-3 py-3 text-center"
          >
            <p className="font-display text-xl text-white">{m.value}</p>
            <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-white/30">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
