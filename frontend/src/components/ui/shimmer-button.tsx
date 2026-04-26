"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const ShimmerButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function ShimmerButton({ className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[8px]",
          "px-5 py-2.5 text-sm font-semibold text-white",
          "bg-[linear-gradient(110deg,#2563eb_0%,#3b82f6_45%,#60a5fa_55%,#2563eb_100%)]",
          "bg-[length:200%_100%] animate-[accent-shimmer_3.2s_linear_infinite]",
          "shadow-[0_0_0_1px_rgba(37,99,235,0.45),0_8px_28px_rgba(37,99,235,0.35)]",
          "transition-transform active:translate-y-px",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          className
        )}
      >
        <span className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.35),transparent_60%)]" />
        {children}
      </button>
    );
  }
);
