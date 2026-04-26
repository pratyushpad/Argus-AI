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
      className="absolute rounded-full pointer-events-none animate-morph"
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${size * 0.7}px)`,
        top,
        left,
        right,
        bottom,
      }}
      animate={{
        y: [0, -40, 0, 30, 0],
        x: [0, 20, -15, 8, 0],
        scale: [1, 1.15, 0.9, 1.1, 1],
        opacity: [0.3, 0.5, 0.2, 0.4, 0.3],
      }}
      transition={{
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      aria-hidden="true"
    />
  );
}
