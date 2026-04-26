"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scan, BarChart3, Download, Clock } from "lucide-react";

const TABS = [
  {
    id: "detection",
    label: "Detection",
    icon: <Scan className="w-4 h-4" />,
    headline: "Real-time object detection",
    body: "YOLOv8s processes every frame in under 35ms, identifying 23 classes — vehicles, pedestrians, traffic signs, and signals. Custom-trained on 5,254 dashcam images.",
    stats: [
      { label: "mAP50", value: "92.7%" },
      { label: "Classes", value: "23" },
      { label: "Inference", value: "<35ms" },
    ],
    visual: (
      <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="ml-2 text-[11px] text-white/25 font-mono">detection_stream.py</span>
        </div>
        <div className="p-4 font-mono text-[11px] leading-relaxed space-y-1.5">
          {[
            { cls: "car", conf: "94%", color: "#22c55e" },
            { cls: "red_light", conf: "92%", color: "#ef4444" },
            { cls: "person", conf: "87%", color: "#eab308" },
            { cls: "stop_sign", conf: "96%", color: "#2563eb" },
            { cls: "truck", conf: "89%", color: "#22c55e" },
          ].map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-white/20">{String(i + 1).padStart(3, "0")}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: d.color + "22", color: d.color }}>{d.cls}</span>
              <span className="text-white/35">{d.conf}</span>
              <span className="ml-auto text-white/20">detected</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "analysis",
    label: "Analysis",
    icon: <BarChart3 className="w-4 h-4" />,
    headline: "Intelligent violation rules engine",
    body: "8+ built-in rules cross-reference detected objects — red light runners, proximity violations, illegal maneuvers. Each produces a structured report with severity and evidence.",
    stats: [
      { label: "Rules", value: "8+" },
      { label: "Severity levels", value: "3" },
      { label: "False-positive rate", value: "<2%" },
    ],
    visual: (
      <div className="space-y-3">
        {[
          { type: "Red Light Violation", severity: "high", color: "#ef4444", desc: "Vehicle detected crossing while signal is red." },
          { type: "Pedestrian Right-of-Way", severity: "medium", color: "#eab308", desc: "Vehicle within 2m of active crosswalk." },
          { type: "No Entry Zone", severity: "high", color: "#ef4444", desc: "Vehicle detected entering restricted zone." },
        ].map((v, i) => (
          <div key={i} className="rounded-lg border border-white/[0.06] bg-[#0f0f0f] p-3.5 flex gap-3 items-start">
            <span className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: v.color, boxShadow: `0 0 8px ${v.color}60` }} />
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[13px] font-semibold text-white/90">{v.type}</span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: v.color + "22", color: v.color }}>{v.severity}</span>
              </div>
              <p className="text-[11px] text-white/40">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "export",
    label: "Export",
    icon: <Download className="w-4 h-4" />,
    headline: "Annotated output ready to use",
    body: "Download the annotated image with bounding boxes, class labels, and confidence scores baked in. Full JSON report included for integration into your existing systems.",
    stats: [
      { label: "Formats", value: "PNG + JSON" },
      { label: "Annotations", value: "Bounding boxes" },
      { label: "Report", value: "Structured" },
    ],
    visual: (
      <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
          <span className="text-[11px] text-white/25 font-mono">output.json</span>
          <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">ready</span>
        </div>
        <div className="p-4 font-mono text-[11px] leading-relaxed">
          <span className="text-white/20">{"{"}</span><br />
          <span className="pl-4 text-[#60a5fa]/80">{'"violations"'}</span><span className="text-white/20">{": ["}</span><br />
          <span className="pl-8 text-white/20">{"{"}</span><br />
          <span className="pl-12 text-blue-400/60">{'"type"'}</span><span className="text-white/20">{": "}</span>
          <span className="text-amber-400/70">{'"Red Light"'}</span><span className="text-white/20">{","}</span><br />
          <span className="pl-12 text-blue-400/60">{'"severity"'}</span><span className="text-white/20">{": "}</span>
          <span className="text-rose-400/70">{'"high"'}</span><span className="text-white/20">{","}</span><br />
          <span className="pl-12 text-blue-400/60">{'"confidence"'}</span><span className="text-white/20">{": "}</span>
          <span className="text-green-400/70">{'"92%"'}</span><br />
          <span className="pl-8 text-white/20">{"}"}</span><br />
          <span className="pl-4 text-white/20">{"],"}</span><br />
          <span className="pl-4 text-[#60a5fa]/80">{'"detections"'}</span><span className="text-white/20">{": 7,"}</span><br />
          <span className="pl-4 text-[#60a5fa]/80">{'"inference_ms"'}</span><span className="text-white/20">{": 32"}</span><br />
          <span className="text-white/20">{"}"}</span>
        </div>
      </div>
    ),
  },
  {
    id: "history",
    label: "History",
    icon: <Clock className="w-4 h-4" />,
    headline: "Track every analysis over time",
    body: "Every run is logged to your personal history. Browse past analyses, compare violation trends, and export aggregate reports for reporting or insurance purposes.",
    stats: [
      { label: "Storage", value: "Persistent" },
      { label: "Searchable", value: "Yes" },
      { label: "Analytics", value: "Built-in" },
    ],
    visual: (
      <div className="rounded-xl border border-white/[0.07] bg-[#0f0f0f] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between">
          <span className="text-[11px] text-white/25 font-mono">analysis_history</span>
          <span className="text-[11px] text-[#2563eb]/70">24 records</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[
            { name: "intersection_cam_01.jpg", time: "2m ago", violations: 2, status: "high" },
            { name: "highway_footage_a.png", time: "14m ago", violations: 0, status: "safe" },
            { name: "crosswalk_morning.jpg", time: "1h ago", violations: 1, status: "medium" },
          ].map((r, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: r.status === "high" ? "#ef4444" : r.status === "medium" ? "#eab308" : "#22c55e" }} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white/70 truncate">{r.name}</p>
                <p className="text-[10px] text-white/30">{r.time}</p>
              </div>
              <span className="text-[11px] font-mono text-white/40">{r.violations} violations</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function FeatureTabs() {
  const [active, setActive] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === active)!;

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-white/[0.07] mb-10 overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              active === t.id ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            {t.icon}
            {t.label}
            {active === t.id && (
              <motion.div layoutId="tab-indicator" className="tab-indicator" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: text */}
          <div>
            <h3 className="font-display text-2xl font-700 text-white mb-4 leading-snug">{tab.headline}</h3>
            <p className="text-white/50 text-base leading-relaxed mb-8">{tab.body}</p>
            <div className="grid grid-cols-3 gap-4">
              {tab.stats.map((s) => (
                <div key={s.label} className="border border-white/[0.07] rounded-lg p-3">
                  <div className="font-display text-xl font-bold text-white mb-0.5">{s.value}</div>
                  <div className="text-[11px] text-white/35 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: visual */}
          <div>{tab.visual}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
