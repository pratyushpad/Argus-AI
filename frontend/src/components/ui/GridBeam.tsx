"use client";

export default function GridBeam() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
      {/* Vertical beams */}
      <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent animate-beam-1" />
      <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-blue-500/15 to-transparent animate-beam-2" />
      <div className="absolute left-3/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-purple-500/10 to-transparent animate-beam-3" />
      {/* Horizontal accent */}
      <div className="absolute top-1/3 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/10 to-transparent animate-beam-h" />
    </div>
  );
}
