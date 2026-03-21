"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export default function SpotlightCard({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] cursor-default ${className}`}
    >
      {/* Spotlight effect */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.06), transparent 60%)`,
          }}
        />
      )}
      {/* Border glow */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(239, 68, 68, 0.1), transparent 60%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
            borderRadius: "1rem",
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
