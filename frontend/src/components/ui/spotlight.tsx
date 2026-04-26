"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({
  className,
  size = 600,
  color = "rgba(124,114,255,0.18)",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      el.style.setProperty("--sx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--sy", `${e.clientY - rect.top}px`);
      el.style.opacity = "1";
    };
    const onLeave = () => (el.style.opacity = "0");
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);
    return () => {
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0", className)}
      style={{
        background: `radial-gradient(${size}px circle at var(--sx,50%) var(--sy,50%), ${color}, transparent 60%)`,
      }}
    />
  );
}
