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
  Camera,
  Zap,
  Eye,
  AlertTriangle,
  Cpu,
  Play,
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
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/20">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">TrafficGuard AI</h1>
              <p className="text-xs text-gray-500">YOLOv8 Violation Detection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDemo}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/10 transition"
            >
              <Play className="w-3 h-3" />
              Live Demo
            </button>
            <a
              href="https://github.com"
              target="_blank"
              className="text-xs text-gray-500 hover:text-gray-300 transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-12 pb-8">
        {!result && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium mb-4">
                <Camera className="w-3.5 h-3.5" />
                AI-Powered Detection
              </div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Detect Traffic Violations
                <br />
                <span className="text-gray-500">from Dashcam Images</span>
              </h2>
              <p className="text-gray-500 max-w-lg mx-auto">
                Upload a dashcam photo and our YOLOv8 model will detect vehicles,
                traffic signs, and flag potential violations in real-time.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <FeatureCard
                icon={<Eye className="w-5 h-5 text-blue-400" />}
                title="23-Class Detection"
                description="Detects vehicles, traffic lights, speed signs, pedestrians, and more"
              />
              <FeatureCard
                icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
                title="Violation Flagging"
                description="Red light running, no-entry, pedestrian risk, and speed zone alerts"
              />
              <FeatureCard
                icon={<Zap className="w-5 h-5 text-yellow-400" />}
                title="Real-Time Analysis"
                description="Powered by YOLOv8 for fast, accurate object detection"
              />
            </div>
          </>
        )}

        {/* Upload + Results */}
        <div className="space-y-6">
          {!result && <ImageUploader onFileSelect={handleFileSelect} isLoading={isLoading} />}

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {!result && file && !isLoading && (
            <div className="flex gap-3">
              <button
                onClick={handleAnalyze}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 font-medium transition text-white"
              >
                <Shield className="w-5 h-5" />
                Analyze Image
              </button>
            </div>
          )}

          {isLoading && <AnalysisSkeleton />}

          {result && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">Analysis Results</h2>
                  {isDemo && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      Demo Data
                    </span>
                  )}
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm text-gray-300 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Analysis
                </button>
              </div>
              <ResultsPanel result={result} />
            </>
          )}
        </div>
      </div>

      {/* Tech Stack Section */}
      {!result && (
        <section className="border-t border-white/10 mt-16">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <div className="flex items-center gap-2 mb-8">
              <Cpu className="w-5 h-5 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Built With
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TechBadge name="YOLOv8" detail="Object Detection" />
              <TechBadge name="FastAPI" detail="Backend API" />
              <TechBadge name="Next.js" detail="Frontend" />
              <TechBadge name="Google Cloud" detail="Deployment" />
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-6">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 gap-2">
          <p>Built with YOLOv8, FastAPI, and Next.js</p>
          <p>TrafficGuard AI - Traffic Violation Detection System</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.05] transition">
      <div className="mb-3">{icon}</div>
      <h3 className="font-semibold text-sm text-gray-200 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function TechBadge({ name, detail }: { name: string; detail: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center hover:bg-white/[0.05] transition">
      <p className="font-semibold text-sm text-gray-200">{name}</p>
      <p className="text-xs text-gray-500">{detail}</p>
    </div>
  );
}
