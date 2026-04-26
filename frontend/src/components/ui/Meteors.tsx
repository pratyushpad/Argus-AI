"use client";

import { useState, useEffect } from "react";

interface Props {
  count?: number;
}

export default function Meteors({ count = 20 }: Props) {
  const [meteors, setMeteors] = useState<
    { id: number; left: string; delay: string; duration: string; size: number }[]
  >([]);

  useEffect(() => {
    setMeteors(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${Math.random() * 3 + 2}s`,
        size: Math.random() * 1.5 + 0.5,
      }))
    );
  }, [count]);

  if (meteors.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden="true">
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
            className="block rounded-full bg-gradient-to-b from-white to-transparent"
            style={{
              width: `${m.size}px`,
              height: `${m.size * 60}px`,
              opacity: 0.7,
            }}
          />
        </span>
      ))}
    </div>
  );
}
