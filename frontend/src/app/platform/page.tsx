"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  Shield,
  Gauge,
  Waypoints,
  Layers2,
  ScanSearch,
  FileJson,
  Settings2,
  FolderOutput,
  Radar,
  ChartColumn,
} from "lucide-react";
import MarketingHeader from "@/components/MarketingHeader";
import MarketingFooter from "@/components/MarketingFooter";
import PipelineDiagram from "@/components/PipelineDiagram";

const PIPELINE = [
  {
    title: "Input handling",
    description: "Users upload a road frame in JPG, PNG, or WebP. The frontend prepares the payload and sends it to the FastAPI detector.",
    icon: Boxes,
  },
  {
    title: "YOLOv8 detection",
    description: "The backend runs inference across trained road classes such as cars, trucks, traffic lights, pedestrians, and signs.",
    icon: BrainCircuit,
  },
  {
    title: "Violation logic",
    description: "A rule layer evaluates object relationships, severity, and scene context to identify traffic issues worth surfacing.",
    icon: Shield,
  },
  {
    title: "Result delivery",
    description: "The response includes detections, violation summaries, and an annotated image that can be reviewed or exported.",
    icon: FolderOutput,
  },
];

const DETAIL_CARDS = [
  {
    title: "What the model sees",
    body: "Cars, trucks, pedestrians, road signs, signals, and scene objects are returned as structured detections with confidence and bounding boxes.",
    icon: ScanSearch,
  },
  {
    title: "What the rules produce",
    body: "Violations are grouped by severity with descriptions and the objects involved, so the review layer reads clearly instead of feeling raw.",
    icon: Shield,
  },
  {
    title: "What gets stored",
    body: "History saves file details, generated thumbnails, the structured response, and whether the run came from demo mode.",
    icon: FileJson,
  },
  {
    title: "What users can tune",
    body: "Settings control autosave behavior and in-app notifications, giving the app real preferences instead of cosmetic toggles.",
    icon: Settings2,
  },
];

const INSTRUCTIONS = [
  "Open the detection page and drag in a supported image format.",
  "Run analysis to call the backend or use the sample data path for a local showcase.",
  "Review the annotated frame, detections table, and rule output together.",
  "Open history to revisit prior runs and analytics to inspect aggregate trends.",
];

const SYSTEM_MODULES = [
  { label: "Detector", value: "YOLOv8", detail: "object classes and confidence output" },
  { label: "Rules", value: "Severity", detail: "scene relationships and violation logic" },
  { label: "History", value: "Stored", detail: "saved analyses feed downstream pages" },
  { label: "Analytics", value: "Charts", detail: "aggregate trends from the archive" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.28em] text-white/42">
      <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
      {children}
    </div>
  );
}

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingHeader />

      <main>
        <section className="relative overflow-hidden border-b border-white/8">
          <div className="pointer-events-none absolute inset-0 gradient-mesh-soft" />
          <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-grid-fade opacity-40" />
          <div className="relative mx-auto grid max-w-7xl gap-20 px-6 py-28 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-24 lg:py-36">
            <div>
              <SectionLabel>Detailed system page</SectionLabel>
              <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.4rem)] leading-[0.95] tracking-[-0.05em] text-white">
                How the
                <br />
                model works,
                <br />
                page by page.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/54">
                This page explains the actual application flow: the upload path, the
                detector, the rule engine, the response shape, and the parts of the
                workspace that make those results useful.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "mAP50", value: "92.7%", icon: Gauge },
                  { label: "pipeline", value: "4 stages", icon: Waypoints },
                  { label: "modules", value: "detector + rules", icon: Layers2 },
                  { label: "output", value: "image + JSON", icon: FileJson },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-[10px] border border-white/10 bg-white/[0.03] p-5">
                    <Icon className="h-5 w-5 text-white/38" />
                    <p className="mt-5 text-[0.68rem] uppercase tracking-[0.28em] text-white/30">{label}</p>
                    <p className="mt-3 font-display text-4xl text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — pipeline diagram + module bento */}
            <div className="flex flex-col gap-5">
              <PipelineDiagram />

              <div className="grid grid-cols-2 gap-4">
                {SYSTEM_MODULES.map((item) => (
                  <div key={item.label} className="rounded-[10px] border border-white/10 bg-black/45 p-5">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/28">{item.label}</p>
                    <p className="mt-3 font-display text-3xl text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-white/42">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="max-w-2xl">
              <SectionLabel>Pipeline</SectionLabel>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.95] tracking-[-0.05em] text-white">
                Four operating layers.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/50">
                The app is intentionally broken into clear stages so the experience feels
                understandable and inspectable instead of mysterious.
              </p>
            </div>

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {PIPELINE.map(({ title, description, icon: Icon }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-white/10 bg-black/45 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#3b82f6]">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-3xl text-white">{title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/48">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-32">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <SectionLabel>Feature detail</SectionLabel>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4.4rem)] leading-[0.95] tracking-[-0.05em] text-white">
                What each
                <br />
                page is doing.
              </h2>
              <p className="mt-4 max-w-md text-base leading-7 text-white/48">
                This redesign turns the product into a clean sequence: discover it,
                understand it, run it, review it, and manage it.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {DETAIL_CARDS.map(({ title, body, icon: Icon }) => (
                <div key={title} className="rounded-[10px] border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 bg-black/45 text-white/72">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 font-display text-3xl leading-tight text-white">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/48">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-32">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6">
              <SectionLabel>Runbook</SectionLabel>
              <h2 className="mt-6 font-display text-[clamp(2rem,4vw,4rem)] leading-[0.98] tracking-[-0.04em] text-white">
                Instructions for using the app.
              </h2>
              <div className="mt-8 space-y-4">
                {INSTRUCTIONS.map((item, index) => (
                  <div key={item} className="flex gap-4 rounded-[8px] border border-white/8 bg-black/45 p-4">
                    <span className="font-mono text-xs tracking-[0.24em] text-[#3b82f6]">0{index + 1}</span>
                    <p className="text-sm leading-7 text-white/56">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6">
              <SectionLabel>Outputs</SectionLabel>
              <h2 className="mt-6 font-display text-4xl leading-tight text-white">
                What the response gives you back.
              </h2>
              <div className="mt-8 grid gap-4">
                {[
                  "Annotated image for visual review and download",
                  "Detection list with class names, confidence, and bounding boxes",
                  "Violation summary split by severity",
                  "History entry that feeds the dashboard and analytics pages",
                ].map((item) => (
                  <div key={item} className="rounded-[8px] border border-white/8 bg-black/45 px-4 py-3 text-sm leading-7 text-white/54">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/analyze" className="btn-indigo">
                  Open workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/analyze" className="btn-ghost-framer">
                  Run detection
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
