"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowRight,
  Radar,
  ScanSearch,
  Shield,
  History,
  ChartColumn,
  Workflow,
  FileSearch,
  Settings2,
} from "lucide-react";
import MarketingHeader from "@/components/MarketingHeader";
import MarketingFooter from "@/components/MarketingFooter";
import TrafficScene from "@/components/TrafficScene";
import { HeroGeometric } from "@/components/ui/elegant-shape";
import { Spotlight } from "@/components/ui/spotlight";
import { Marquee } from "@/components/ui/marquee";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";

const DETECTION_CLASSES = [
  "car", "truck", "bus", "motorcycle", "bicycle", "person", "traffic light",
  "stop sign", "yield sign", "speed limit", "no entry", "pedestrian crossing",
  "school zone", "construction", "lane marking", "fire hydrant", "parking meter",
  "bench", "rail", "trailer", "ambulance", "police", "delivery van",
];

const FEATURE_PANELS = [
  {
    title: "Real detection workspace",
    body: "Upload a frame, run YOLOv8 inference, inspect every object, and export the annotated result without leaving the app.",
    icon: ScanSearch,
  },
  {
    title: "Structured violation engine",
    body: "Detections are cross-checked through rule logic so results read like an operational review, not a demo overlay.",
    icon: Shield,
  },
  {
    title: "Persistent review trail",
    body: "Every run can be saved to local history, revisited in analytics, and exported for handoff or audit.",
    icon: History,
  },
];

const SYSTEM_STRIPS = [
  { label: "Detection classes", value: "23", detail: "vehicles, signs, signals, pedestrians" },
  { label: "Inference target", value: "<35ms", detail: "GPU path for responsive review" },
  { label: "Dataset coverage", value: "5,254", detail: "labeled dashcam training images" },
  { label: "Workspace pages", value: "4", detail: "detection, history, analytics, settings" },
];

const PAGE_LINKS = [
  {
    href: "/platform",
    title: "System page",
    eyebrow: "Detailed product spec",
    copy: "Breaks down the model pipeline, rule engine, outputs, classes, and operating instructions.",
  },
  {
    href: "/analyze",
    title: "Detection workspace",
    eyebrow: "Functional application",
    copy: "Upload frames, run detection, review history and analytics — all in one consistent product shell.",
  },
];

const RUNBOOK = [
  { step: "01", title: "Upload", text: "Drop a JPG, PNG, or WebP frame into the detection workspace." },
  { step: "02", title: "Review", text: "Inspect annotated output, confidence values, and rule-level findings." },
  { step: "03", title: "Track", text: "Saved analyses appear inside history and feed the analytics layer." },
  { step: "04", title: "Tune", text: "Preferences control autosave behavior and completion notifications." },
];

const HERO_SIGNAL_CARDS = [
  { label: "Inference", value: "32ms", detail: "responsive review loop" },
  { label: "Rules", value: "8+", detail: "scene logic checks" },
  { label: "Archive", value: "local", detail: "history and analytics" },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.28em] text-white/42">
      <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
      {children}
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingHeader />

      <main>
        {/* Hero — two columns, calm, no gradient text */}
        <section
          ref={heroRef}
          className="relative overflow-hidden border-b border-white/8"
        >
          <div className="pointer-events-none absolute inset-0 gradient-mesh-soft" />
          <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-grid-fade opacity-50" />

          <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-28">
            <motion.div
              style={{ y: heroY }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionLabel>Computer vision for road evidence</SectionLabel>

              <h1 className="mt-7 max-w-3xl font-display text-[clamp(2.8rem,6.4vw,5.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
                A focused interface
                <br className="hidden sm:block" /> for traffic detection.
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-[1.05rem]">
                Upload a dashcam frame, run YOLOv8 inference, and review every detected
                object and traffic violation in one workspace built for review — not a demo.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="/analyze" className="btn-indigo text-sm">
                  Start detecting
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/platform"
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  See how it works →
                </Link>
              </div>

              <div className="mt-12 grid max-w-lg gap-3 sm:grid-cols-2">
                <div className="rounded-[10px] border border-white/8 bg-white/[0.02] px-5 py-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Detection classes</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">23</p>
                  <p className="mt-1 text-xs leading-5 text-white/40">vehicles, signs, signals, pedestrians</p>
                </div>
                <div className="rounded-[10px] border border-white/8 bg-white/[0.02] px-5 py-4">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-white/35">Inference target</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-white">&lt;35ms</p>
                  <p className="mt-1 text-xs leading-5 text-white/40">GPU path for responsive review</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[14px] border border-white/10 bg-white/[0.02] p-3 shadow-[0_30px_120px_rgba(0,0,0,0.55)]"
            >
              <div className="mb-3 flex items-center justify-between rounded-[8px] border border-white/8 bg-black px-4 py-3 text-[0.68rem] uppercase tracking-[0.24em] text-white/40">
                <span>Live simulation</span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.7)]" />
                  realtime overlay
                </span>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-white/8">
                <TrafficScene />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Class marquee */}
        <section className="border-b border-white/8 bg-black/60 py-6">
          <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/30">Detection vocabulary</p>
              <p className="text-xs text-white/30"><NumberTicker value={23} /> classes · YOLOv8</p>
            </div>
            <Marquee>
              {DETECTION_CLASSES.map((cls) => (
                <span
                  key={cls}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-1.5 text-sm text-white/65"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3b82f6]" />
                  {cls}
                </span>
              ))}
            </Marquee>
          </div>
        </section>

        <section className="border-b border-white/8">
          <div className="mx-auto grid max-w-7xl gap-0 px-5 sm:px-8 lg:grid-cols-3">
            {FEATURE_PANELS.map(({ title, body, icon: Icon }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group border-b border-white/8 py-8 last:border-b-0 lg:border-b-0 lg:border-r lg:px-6 lg:py-14 last:lg:border-r-0"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03] text-white transition-colors group-hover:bg-white group-hover:text-black">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-6 font-display text-3xl leading-tight text-white">{title}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/48">{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-b border-white/8 py-32">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <SectionLabel>System framing</SectionLabel>
              <h2 className="mt-6 font-display text-[clamp(2.2rem,4vw,4.8rem)] leading-[0.95] tracking-[-0.05em] text-white">
                Designed like
                <br />
                a product, not
                <br />
                a prompt output.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/50">
                The new layout borrows the editorial pacing, big type, and spatial grid
                you referenced, while keeping the interface monochrome with only small
                purple signal accents.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {SYSTEM_STRIPS.map((item, index) => {
                const numeric = item.value.match(/\d+/);
                const num = numeric ? parseInt(numeric[0]) : null;
                const before = numeric ? item.value.slice(0, item.value.indexOf(numeric[0])) : "";
                const after = numeric ? item.value.slice(item.value.indexOf(numeric[0]) + numeric[0].length) : "";
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <MagicCard className="p-6">
                      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/30">{item.label}</p>
                      <p className="mt-4 font-display text-5xl leading-none text-white">
                        {num !== null ? <>{before}<NumberTicker value={num} />{after}</> : item.value}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-white/48">{item.detail}</p>
                    </MagicCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/8 py-32">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <SectionLabel>Working flow</SectionLabel>
                <Workflow className="h-5 w-5 text-white/26" />
              </div>
              <div className="mt-8 space-y-4">
                {RUNBOOK.map((item) => (
                  <div key={item.step} className="rounded-[8px] border border-white/8 bg-black/45 p-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs tracking-[0.22em] text-[#3b82f6]">{item.step}</span>
                      <h3 className="font-display text-2xl text-white">{item.title}</h3>
                    </div>
                    <p className="mt-3 max-w-md text-sm leading-7 text-white/48">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5">
              <div className="rounded-[12px] border border-white/10 bg-white/[0.03] p-6">
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Detector", icon: Radar },
                    { label: "Rule logic", icon: FileSearch },
                    { label: "Analytics", icon: ChartColumn },
                    { label: "Preferences", icon: Settings2 },
                  ].map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="inline-flex items-center gap-2 rounded-[6px] border border-white/10 bg-black/45 px-4 py-2 text-sm text-white/58"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  ))}
                </div>
                <h3 className="mt-8 font-display text-4xl leading-tight text-white">
                  Each page now has a purpose inside the product journey.
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/48">
                  The landing page explains why the product exists, the system page
                  explains how it works, and the workspace pages handle actual analysis
                  and review. That split makes the app feel intentional rather than
                  visually repetitive.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {PAGE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group rounded-[10px] border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/30">{item.eyebrow}</p>
                    <h3 className="mt-4 font-display text-3xl text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/48">{item.copy}</p>
                    <div className="mt-8 inline-flex items-center gap-2 text-sm text-white/72">
                      Open page
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-32">
          <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
            <SectionLabel>Ready to use</SectionLabel>
            <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.94] tracking-[-0.05em] text-white">
              Open the workspace.
              <br />
              Run a detection.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/50">
              Built to be used, not just viewed. Open the detection workspace and run
              your first scan in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/analyze" className="btn-indigo">
                Open workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/platform" className="btn-ghost-framer">
                Read how it works
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
