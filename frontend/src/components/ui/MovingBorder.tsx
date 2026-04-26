"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  borderColor?: string;
}

export default function MovingBorder({
  children,
  duration = 4000,
  className = "",
  borderColor = "rgba(255, 255, 255, 0.5)",
}: Props) {
  return (
    <div className={`relative rounded-2xl p-px overflow-hidden ${className}`}>
      {/* Animated conic gradient border */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 0deg, transparent 60%, ${borderColor} 80%, transparent 100%)`,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: duration / 1000, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner content */}
      <div className="relative rounded-[calc(1rem-1px)] bg-black z-10">
        {children}
      </div>
    </div>
  );
}
