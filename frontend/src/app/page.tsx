"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";
import ResultsPanel from "@/components/ResultsPanel";
import AnalysisSkeleton from "@/components/AnalysisSkeleton";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingOrb from "@/components/FloatingOrb";
import TextReveal from "@/components/TextReveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import GlowingCard from "@/components/ui/GlowingCard";
import Meteors from "@/components/ui/Meteors";
import GridBeam from "@/components/ui/GridBeam";
import LampEffect from "@/components/ui/LampEffect";
import BentoGrid from "@/components/ui/BentoGrid";
import MovingBorder from "@/components/ui/MovingBorder";
import { detectViolations } from "@/lib/api";
import { DEMO_RESULT } from "@/lib/demo-data";
import { DetectionResponse } from "@/types/detection";
import {
  Shield,
  RotateCcw,
  Scan,
  Zap,
  Eye,
  AlertTriangle,
  Play,
  ArrowRight,
  Github,
  Radar,
  Car,
  Activity,
  Camera,
  MapPin,
  Gauge,
  Users,
  Layers,
  Cpu,
} from "lucide-react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<DetectionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    setIsDemo(false);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await detectViolations(file);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = () => {
    setIsDemo(true);
    setFile(null);
    setError(null);
    setResult(DEMO_RESULT);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setIsDemo(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <AnimatedBackground />
      <Meteors count={15} />

      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <FloatingOrb color="rgba(239,68,68,0.07)" size={500} top="-15%" right="-10%" delay={0} />
        <FloatingOrb color="rgba(59,130,246,0.05)" size={400} top="50%" left="-10%" delay={4} />
        <FloatingOrb color="rgba(168,85,247,0.04)" size={350} bottom="-10%" right="15%" delay={8} />
      </div>

      {/* ============ NAVBAR ============ */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 glass"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={handleReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-red-500/40 rounded-xl blur-xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                <Shield className="w-4 h-4 text-red-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">TrafficGuard AI</h1>
              <p className="text-[9px] text-slate-500 font-mono tracking-[0.15em] uppercase">Computer Vision</p>
            </div>
          </motion.div>

          <nav className="flex items-center gap-2">
            <MovingBorder duration={3000} className="rounded-xl">
              <motion.button
                onClick={handleDemo}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 text-xs px-4 py-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                Live Demo
              </motion.button>
            </MovingBorder>
            <motion.a
              href="https://github.com/Pratyushpad27/ML-Predictor"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl hover:bg-white/[0.04] text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4" />
            </motion.a>
          </nav>
        </div>
      </motion.header>

      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {/* ============ HERO ============ */}
            {!result && !isLoading && (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -30 }}
              >
                {/* LAMP + HEADLINE */}
                <section className="pt-20 pb-8 relative">
                  <GridBeam />
                  <LampEffect>
                    <div className="text-center max-w-3xl mx-auto">
                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <MovingBorder duration={5000} className="inline-flex rounded-full mb-8">
                          <div className="flex items-center gap-2.5 px-5 py-2">
                            <motion.span
                              className="w-2 h-2 rounded-full bg-red-400"
                              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-red-400/90 text-xs font-medium tracking-wide">POWERED BY YOLOv8</span>
                          </div>
                        </MovingBorder>
                      </motion.div>

                      {/* Title */}
                      <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                        <TextReveal text="Detect Traffic" className="text-glow" delay={0.3} />
                        <br />
                        <TextReveal text="Violations Instantly" className="text-slate-500" delay={0.6} />
                      </h2>

                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.7 }}
                        className="text-base md:text-lg text-slate-400/80 leading-relaxed max-w-xl mx-auto mb-12"
                      >
                        Upload a dashcam image. Our AI identifies vehicles, traffic signs,
                        and pedestrians — then flags violations in real time.
                      </motion.p>
                    </div>
                  </LampEffect>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex items-center justify-center gap-8 md:gap-16 mb-16"
                  >
                    {[
                      { val: 23, label: "CLASSES", suffix: "" },
                      { val: 5254, label: "IMAGES", suffix: "" },
                      { val: 8, label: "RULES", suffix: "+" },
                    ].map((stat, i) => (
                      <div key={stat.label} className="text-center">
                        <AnimatedCounter
                          value={stat.val}
                          suffix={stat.suffix}
                          className="text-3xl md:text-4xl font-bold text-white font-mono"
                        />
                        <p className="text-[10px] text-slate-600 mt-1 tracking-[0.2em]">{stat.label}</p>
                      </div>
                    ))}
                  </motion.div>
                </section>

                {/* ============ BENTO FEATURES ============ */}
                <section className="pb-16">
                  <BentoGrid
                    items={[
                      {
                        title: "Object Detection",
                        description: "YOLOv8 detects 23 classes — cars, trucks, motorcycles, pedestrians, traffic lights, and 18 types of signs",
                        icon: <Radar className="w-5 h-5 text-red-400" />,
                        className: "md:col-span-2 md:row-span-2",
                        visual: (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {["car", "truck", "person", "red light", "stop sign", "speed limit", "motorcycle", "+16 more"].map((cls) => (
                              <span key={cls} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-slate-500">
                                {cls}
                              </span>
                            ))}
                          </div>
                        ),
                      },
                      {
                        title: "Red Light Detection",
                        description: "Flags vehicles near red traffic lights with high severity",
                        icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
                        visual: (
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-red-400">HIGH SEVERITY</span>
                          </div>
                        ),
                      },
                      {
                        title: "Pedestrian Safety",
                        description: "Alerts when people are in close proximity to vehicles",
                        icon: <Users className="w-5 h-5 text-amber-400" />,
                        visual: (
                          <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-amber-400">PROXIMITY ALERT</span>
                          </div>
                        ),
                      },
                      {
                        title: "Speed Zones",
                        description: "Identifies vehicles in speed limit areas (20-120 km/h)",
                        icon: <Gauge className="w-5 h-5 text-blue-400" />,
                      },
                      {
                        title: "Sign Recognition",
                        description: "No-entry, no-turn, no-stopping, no-overtaking, and more",
                        icon: <MapPin className="w-5 h-5 text-purple-400" />,
                      },
                      {
                        title: "Annotated Results",
                        description: "Color-coded bounding boxes with violation severity and downloadable output",
                        icon: <Layers className="w-5 h-5 text-emerald-400" />,
                      },
                    ]}
                  />
                </section>

                {/* ============ UPLOAD ============ */}
                <section className="pb-20 relative">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mx-auto"
                  >
                    <div className="text-center mb-8">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 text-[11px] font-mono text-slate-500 uppercase tracking-[0.15em] mb-2"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Upload & Analyze
                      </motion.div>
                    </div>

                    <ImageUploader onFileSelect={handleFileSelect} isLoading={isLoading} />

                    {file && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5"
                      >
                        <motion.button
                          onClick={handleAnalyze}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-medium text-white cursor-pointer group relative overflow-hidden"
                          style={{
                            background: "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)",
                            boxShadow: "0 0 50px -12px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
                          }}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                          <Scan className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90 relative z-10" />
                          <span className="relative z-10">Analyze Image</span>
                          <ArrowRight className="w-4 h-4 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 relative z-10" />
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                </section>

                {/* ============ TECH STACK ============ */}
                <section className="border-t border-white/[0.04] py-24 relative overflow-hidden">
                  <div className="absolute inset-0 animate-aurora opacity-30" />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                  >
                    <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.25em] mb-10 text-center">
                      Technology Stack
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                      {[
                        { name: "YOLOv8", sub: "Object Detection", icon: <Radar className="w-5 h-5" /> },
                        { name: "FastAPI", sub: "Python Backend", icon: <Zap className="w-5 h-5" /> },
                        { name: "Next.js", sub: "React Frontend", icon: <Layers className="w-5 h-5" /> },
                        { name: "Google Cloud", sub: "Deployment", icon: <Cpu className="w-5 h-5" /> },
                      ].map((tech, i) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <GlowingCard glowColor="rgba(255,255,255,0.06)">
                            <div className="p-5 text-center">
                              <div className="text-slate-500 flex justify-center mb-3 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                                {tech.icon}
                              </div>
                              <p className="font-semibold text-sm text-slate-200">{tech.name}</p>
                              <p className="text-[11px] text-slate-600 mt-0.5">{tech.sub}</p>
                            </div>
                          </GlowingCard>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </section>
              </motion.div>
            )}

            {/* ============ LOADING ============ */}
            {isLoading && (
              <motion.section
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pt-20 pb-16 max-w-2xl mx-auto"
              >
                <AnalysisSkeleton />
              </motion.section>
            )}

            {/* ============ RESULTS ============ */}
            {result && (
              <motion.section
                key="results"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-10 pb-16"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 12 }}
                      className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                    >
                      <Eye className="w-5 h-5 text-emerald-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Analysis Complete</h2>
                      {isDemo && (
                        <span className="text-[9px] font-mono text-amber-400/80 uppercase tracking-[0.2em]">Demo Data</span>
                      )}
                    </div>
                  </div>
                  <MovingBorder duration={4000} className="rounded-xl">
                    <motion.button
                      onClick={handleReset}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      New Analysis
                    </motion.button>
                  </MovingBorder>
                </div>
                <ResultsPanel result={result} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-2xl mx-auto mt-4 rounded-2xl bg-red-500/[0.06] border border-red-500/20 p-5 text-sm text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.03] py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-[10px] text-slate-700 font-mono">
          <p>TRAFFICGUARD AI</p>
          <p>BUILT WITH YOLOV8 + FASTAPI + NEXT.JS</p>
        </div>
      </footer>
    </div>
  );
}
