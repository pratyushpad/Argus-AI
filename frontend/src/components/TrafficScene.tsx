"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

/* ─── Detections — positioned for DASHCAM (driver's POV looking ahead) ─── */
const DETECTIONS = [
  { id: "car-ahead",   label: "car",       conf: 0.94, x: 34, y: 26, w: 18, h: 28, color: "#2563eb" },
  { id: "truck-right", label: "truck",     conf: 0.89, x: 62, y: 22, w: 16, h: 32, color: "#2563eb" },
  { id: "car-far",     label: "car",       conf: 0.82, x: 44, y: 20, w: 8,  h: 10, color: "#2563eb" },
  { id: "light",       label: "red_light", conf: 0.92, x: 44, y: 4,  w: 6,  h: 10, color: "#ef4444" },
  { id: "person",      label: "person",    conf: 0.87, x: 76, y: 30, w: 5,  h: 20, color: "#eab308" },
];

function BBox({ x, y, w, h, label, conf, color, delay }: {
  x: number; y: number; w: number; h: number;
  label: string; conf: number; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay, ease: [0.16, 1, 0.3, 1] }}
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}
    >
      <div className="absolute inset-0 border rounded-sm" style={{ borderColor: color + "88" }} />
      {/* Corner marks */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2" style={{ borderColor: color }} />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2" style={{ borderColor: color }} />
      {/* Label */}
      <div
        className="absolute -top-4 left-0 px-1 py-0.5 rounded text-[8px] font-mono font-bold whitespace-nowrap"
        style={{ background: color + "20", color, border: `1px solid ${color}40` }}
      >
        {label} {(conf * 100).toFixed(0)}%
      </div>
    </motion.div>
  );
}

/* ─── Scan Line (indigo instead of emerald) ─── */
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px pointer-events-none"
      style={{ background: "linear-gradient(90deg, transparent, rgba(94,106,210,0.5), transparent)" }}
      animate={{ top: ["0%", "100%"] }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
    />
  );
}

/* ─── Traffic Light ─── */
function TrafficLight({ on }: { on: "red" | "green" }) {
  return (
    <div className="flex flex-col items-center gap-0.5 p-1 rounded bg-[#12121a] border border-white/[0.08]">
      <div className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
        style={{ background: on === "red" ? "#ef4444" : "#1a1a1f", boxShadow: on === "red" ? "0 0 6px #ef4444" : "none" }} />
      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2010" }} />
      <div className="w-2.5 h-2.5 rounded-full transition-colors duration-500"
        style={{ background: on === "green" ? "#22c55e" : "#1a1a1f", boxShadow: on === "green" ? "0 0 6px #22c55e" : "none" }} />
    </div>
  );
}

/* ─── Vehicle (rear view — seen from behind on the road ahead) ─── */
function VehicleAhead({ x, y, w, h, color, taillights = true }: {
  x: number; y: number; w: number; h: number; color: string; taillights?: boolean;
}) {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%` }}>
      {/* Body */}
      <div className="absolute inset-0 rounded-t-sm rounded-b-[1px]" style={{ background: color }}>
        {/* Rear window */}
        <div className="absolute top-[8%] left-[12%] right-[12%] h-[30%] rounded-t-sm"
          style={{ background: "rgba(147,197,253,0.12)" }} />
        {/* Taillights */}
        {taillights && (
          <>
            <div className="absolute bottom-[5%] left-[5%] w-[12%] h-[8%] rounded-full"
              style={{ background: "rgba(239,68,68,0.9)", boxShadow: "0 0 4px rgba(239,68,68,0.6)" }} />
            <div className="absolute bottom-[5%] right-[5%] w-[12%] h-[8%] rounded-full"
              style={{ background: "rgba(239,68,68,0.9)", boxShadow: "0 0 4px rgba(239,68,68,0.6)" }} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Main Dashcam Scene ─── */
export default function TrafficScene() {
  const [showBoxes, setShowBoxes] = useState(false);
  const [lightState, setLightState] = useState<"red" | "green">("red");

  useEffect(() => {
    const boxTimer = setTimeout(() => setShowBoxes(true), 600);
    const lightInterval = setInterval(() => {
      setLightState(s => s === "red" ? "green" : "red");
    }, 3500);
    return () => { clearTimeout(boxTimer); clearInterval(lightInterval); };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#080810] overflow-hidden select-none" style={{ minHeight: 220 }}>
      {/* ── Sky / horizon ── */}
      <div className="absolute inset-x-0 top-0 h-[35%]" style={{
        background: "linear-gradient(180deg, #08080f 0%, #0e0e1c 60%, #14142a 100%)"
      }} />

      {/* ── Road surface (driver's POV, stretching ahead) ── */}
      <div className="absolute inset-x-0 bottom-0 h-[65%]" style={{
        background: "linear-gradient(180deg, #18182a 0%, #121220 40%, #0e0e18 100%)"
      }} />

      {/* ── Road perspective lines (converging to vanishing point) ── */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Road edges */}
        <line x1="48" y1="35" x2="5" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" />
        <line x1="52" y1="35" x2="95" y2="100" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" />
        {/* Lane dividers */}
        <line x1="49" y1="35" x2="30" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.15" strokeDasharray="2 3" />
        <line x1="51" y1="35" x2="70" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.15" strokeDasharray="2 3" />
        {/* Center line */}
        <line x1="50" y1="35" x2="50" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="0.2" strokeDasharray="3 4" />
      </svg>

      {/* ── Lane markings scrolling toward camera ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[35, 50, 65].map((x) => (
          <motion.div key={x}
            className="absolute w-[1px]"
            style={{
              left: `${x}%`,
              top: "35%",
              height: "65%",
              background: "repeating-linear-gradient(to bottom, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 8px, transparent 8px, transparent 20px)",
            }}
            animate={{ y: [0, 20] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* ── Vehicles ahead (rear view — driver sees backs of cars) ── */}
      <VehicleAhead x={36} y={30} w={14} h={24} color="#1a2440" />
      <VehicleAhead x={63} y={26} w={12} h={28} color="#2a1a3a" />
      <VehicleAhead x={44} y={22} w={6}  h={8}  color="#1a2a2a" taillights={false} />

      {/* ── Traffic light (ahead, above road) ── */}
      <div className="absolute" style={{ left: "46%", top: "6%" }}>
        <TrafficLight on={lightState} />
      </div>

      {/* ── Pedestrian on sidewalk (right side) ── */}
      <div className="absolute" style={{ left: "77%", top: "32%", width: "3%", height: "16%" }}>
        <div className="w-full h-full rounded-full" style={{ background: "#2a2a3a" }}>
          <div className="absolute top-0 left-[20%] right-[20%] h-[30%] rounded-full" style={{ background: "#3a3a4a" }} />
        </div>
      </div>

      {/* ── Dashboard silhouette (bottom) ── */}
      <div className="absolute inset-x-0 bottom-0 h-[14%] pointer-events-none" style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(5,5,6,0.85) 40%, #050506 100%)"
      }}>
        {/* Steering wheel hint */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[30%] h-[80%]">
          <div className="absolute inset-0 border-t-2 border-l border-r rounded-t-full"
            style={{ borderColor: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>

      {/* ── HUD Overlay ── */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Windshield frame corners */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/[0.06] rounded-tl" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/[0.06] rounded-tr" />
        <div className="absolute bottom-[15%] left-2 w-4 h-4 border-b border-l border-white/[0.06] rounded-bl" />
        <div className="absolute bottom-[15%] right-2 w-4 h-4 border-b border-r border-white/[0.06] rounded-br" />

        {/* Scan line */}
        <ScanLine />

        {/* Detection boxes */}
        <AnimatePresence>
          {showBoxes && DETECTIONS.map((d, i) => (
            <BBox key={d.id} {...d} delay={i * 0.1} />
          ))}
        </AnimatePresence>

        {/* Top-center: LIVE badge */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          <span className="text-[9px] font-mono text-[#8A8F98] uppercase tracking-widest">LIVE · 32ms</span>
        </div>

        {/* Top-left: Model info */}
        <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/30">
          <span className="text-[8px] font-mono text-[#8A8F98]/50">YOLOv8s · 640×640</span>
        </div>

        {/* Bottom-left: Speed indicator */}
        <div className="absolute bottom-[16%] left-3 flex items-end gap-1">
          <span className="text-[18px] font-mono font-semibold text-[#EDEDEF]/30 leading-none">45</span>
          <span className="text-[8px] font-mono text-[#8A8F98]/40 mb-0.5">km/h</span>
        </div>

        {/* Bottom-right: Detection count + FPS */}
        <div className="absolute bottom-[16%] right-3 flex flex-col items-end gap-0.5">
          <span className="text-[8px] font-mono text-[#8A8F98]/40">5 objects · 2 violations</span>
          <span className="text-[8px] font-mono text-[#8A8F98]/30">1920×1080 · 30 FPS</span>
        </div>

        {/* Violation badge */}
        <AnimatePresence>
          {showBoxes && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg border border-rose-500/25 bg-rose-500/10 backdrop-blur-sm"
            >
              <span className="text-[9px] font-mono font-bold text-rose-400 uppercase tracking-widest">⚠ Violation</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timestamp */}
        <div className="absolute top-[90%] left-1/2 -translate-x-1/2">
          <span className="text-[8px] font-mono text-[#8A8F98]/25 tracking-wider">
            2026-03-22 · 10:04:32
          </span>
        </div>
      </div>

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 45%, transparent 40%, rgba(5,5,6,0.6) 100%)"
      }} />
    </div>
  );
}
