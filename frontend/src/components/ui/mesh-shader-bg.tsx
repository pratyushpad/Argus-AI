"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

export function MeshShaderBg({
  className,
  speed = 0.25,
  colors = ["#000000", "#0a0a14", "#1a1a2e", "#2563eb"],
}: {
  className?: string;
  speed?: number;
  colors?: string[];
}) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <MeshGradient className="w-full h-full" colors={colors} speed={speed} />
    </div>
  );
}
