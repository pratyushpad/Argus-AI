"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex w-full overflow-hidden",
        "[mask-image:linear-gradient(90deg,transparent,white_8%,white_92%,transparent)]",
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 gap-4 pr-4 animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
