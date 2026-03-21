"use client";

import { motion } from "framer-motion";

interface Props {
  color: string;
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
}

export default function FloatingOrb({
  color,
  size,
  top,
  left,
  right,
  bottom,
  delay = 0,
}: Props) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${size * 0.6}px)`,
        top,
        left,
        right,
        bottom,
      }}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, -10, 5, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
        opacity: [0.4, 0.6, 0.3, 0.5, 0.4],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      aria-hidden="true"
    />
  );
}
