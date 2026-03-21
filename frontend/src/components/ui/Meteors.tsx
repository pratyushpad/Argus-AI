"use client";

import { useMemo } from "react";

interface Props {
  count?: number;
}

export default function Meteors({ count = 20 }: Props) {
  const meteors = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
      size: Math.random() * 1.5 + 0.5,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {meteors.map((m) => (
        <span
          key={m.id}
          className="absolute animate-meteor"
          style={{
            top: "-5%",
            left: m.left,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        >
          <span
            className="block rounded-full bg-gradient-to-b from-red-400 to-transparent"
            style={{
              width: `${m.size}px`,
              height: `${m.size * 60}px`,
              opacity: 0.6,
            }}
          />
        </span>
      ))}
    </div>
  );
}
