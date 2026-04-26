"use client";

import { cn } from "@/lib/utils";

export function AnimatedBeam({
  className,
  vertical = false,
  duration = 2.4,
}: {
  className?: string;
  vertical?: boolean;
  duration?: number;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        vertical ? "h-12 w-px" : "h-px w-full",
        "bg-gradient-to-r from-transparent via-white/10 to-transparent",
        className
      )}
    >
      <div
        className={cn(
          "absolute",
          vertical
            ? "inset-x-[-3px] top-0 h-6 bg-gradient-to-b from-transparent via-blue-400 to-transparent"
            : "inset-y-[-3px] left-0 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
        )}
        style={{
          animation: `${vertical ? "beam-v" : "beam-h"} ${duration}s linear infinite`,
        }}
      />
      <style jsx>{`
        @keyframes beam-h {
          0% { transform: translateX(-100%); opacity: 0; }
          15%, 85% { opacity: 1; }
          100% { transform: translateX(2000%); opacity: 0; }
        }
        @keyframes beam-v {
          0% { transform: translateY(-100%); opacity: 0; }
          15%, 85% { opacity: 1; }
          100% { transform: translateY(800%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
