"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import ResultsPanel from "@/components/ResultsPanel";
import AnalysisSkeleton from "@/components/AnalysisSkeleton";
import { detectViolations } from "@/lib/api";
import { DEMO_RESULT } from "@/lib/demo-data";
import { DetectionResponse } from "@/types/detection";
import {
  Shield,
  Loader2,
  RotateCcw,
  Scan,
  Zap,
  Eye,
  AlertTriangle,
  Play,
  ArrowRight,
  Github,
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
    <div className="min-h-screen bg-[#020617] text-white bg-grain">
      {/* Ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-[100px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-md" />
              <div className="relative p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">TrafficGuard AI</h1>
              <p className="text-[11px] text-slate-500 font-mono">v1.0 / YOLOv8</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <button
              onClick={handleDemo}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 cursor-pointer"
            >
              <Play className="w-3 h-3" />
              Demo
            </button>
            <a
              href="https://github.com/Pratyushpad27/ML-Predictor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg hover:bg-white/[0.04] text-slate-500 hover:text-slate-300 transition-all duration-200 cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              Source
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero Section */}
          {!result && !isLoading && (
            <section className="pt-20 pb-16 animate-fade-in">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/[0.08] border border-red-500/20 text-red-400 text-xs font-medium mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Computer Vision
                </div>

                <h2 className="text-4xl md:text-[3.25rem] font-bold tracking-tight leading-[1.1] mb-5">
                  <span className="text-gradient">Detect Traffic Violations</span>
                  <br />
                  <span className="text-slate-500">from Dashcam Images</span>
                </h2>

                <p className="text-base text-slate-400 leading-relaxed max-w-lg mx-auto mb-10">
                  Upload a dashcam photo and let our YOLOv8 model identify vehicles,
                  traffic signs, and flag potential violations instantly.
                </p>

                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12 stagger-children">
                  <FeatureCard
                    icon={<Eye className="w-4.5 h-4.5 text-blue-400" />}
                    title="23 Object Classes"
                    description="Vehicles, signs, lights, pedestrians"
                    accent="blue"
                  />
                  <FeatureCard
                    icon={<AlertTriangle className="w-4.5 h-4.5 text-red-400" />}
                    title="Violation Detection"
                    description="Red light, no-entry, speed zones"
                    accent="red"
                  />
                  <FeatureCard
                    icon={<Zap className="w-4.5 h-4.5 text-amber-400" />}
                    title="Real-Time Inference"
                    description="Fast YOLOv8 object detection"
                    accent="amber"
                  />
                </div>
              </div>

              {/* Upload area */}
              <div className="max-w-2xl mx-auto">
                <ImageUploader onFileSelect={handleFileSelect} isLoading={isLoading} />

                {file && (
                  <div className="mt-4 animate-fade-in">
                    <button
                      onClick={handleAnalyze}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 font-medium transition-all duration-200 text-white glow-red cursor-pointer group"
                    >
                      <Scan className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                      Analyze Image
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Loading */}
          {isLoading && (
            <section className="pt-16 pb-16 max-w-2xl mx-auto animate-fade-in">
              <AnalysisSkeleton />
            </section>
          )}

          {/* Error */}
          {error && (
            <div className="max-w-2xl mx-auto mt-4 rounded-xl bg-red-500/[0.08] border border-red-500/20 p-4 text-sm text-red-400 animate-fade-in-scale">
              {error}
            </div>
          )}

          {/* Results */}
          {result && (
            <section className="pt-8 pb-16 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold tracking-tight">Analysis Results</h2>
                  {isDemo && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      DEMO
                    </span>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-slate-400 hover:text-slate-200 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  New Analysis
                </button>
              </div>
              <ResultsPanel result={result} />
            </section>
          )}

          {/* Tech Stack (only on landing) */}
          {!result && !isLoading && (
            <section className="border-t border-white/[0.04] py-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <p className="text-[11px] font-mono text-slate-600 uppercase tracking-widest mb-6 text-center">
                Built with
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500">
                {["YOLOv8", "FastAPI", "Next.js", "Tailwind CSS", "Google Cloud"].map((tech) => (
                  <span key={tech} className="text-sm font-medium hover:text-slate-300 transition-colors duration-200 cursor-default">
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-5">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-600 gap-2">
          <p>TrafficGuard AI</p>
          <p className="font-mono">YOLOv8 + FastAPI + Next.js</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: "blue" | "red" | "amber";
}) {
  const glowMap = {
    blue: "group-hover:shadow-blue-500/[0.06]",
    red: "group-hover:shadow-red-500/[0.06]",
    amber: "group-hover:shadow-amber-500/[0.06]",
  };

  return (
    <div className={`group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-left hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 cursor-default ${glowMap[accent]} hover:shadow-2xl`}>
      <div className="mb-2.5">{icon}</div>
      <h3 className="font-medium text-[13px] text-slate-200 mb-1">{title}</h3>
      <p className="text-[12px] text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
