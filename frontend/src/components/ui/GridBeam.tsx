"use client";

export default function GridBeam() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      {/* Vertical beams */}
      <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent animate-beam-1" />
      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent animate-beam-2" />
      <div className="absolute left-3/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent animate-beam-3" />
      {/* Horizontal accent */}
      <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-beam-h" />
    </div>
  );
}
