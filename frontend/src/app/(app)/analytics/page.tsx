"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getHistory, AnalysisRecord } from "@/lib/history";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertTriangle,
  Eye,
  Shield,
  ArrowRight,
  Scan,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const CHART_COLORS = [
  "#2563eb",
  "#3b82f6",
  "#eab308",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#ec4899",
];

const TOOLTIP_STYLE = {
  backgroundColor: "#111114",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  color: "rgba(255,255,255,0.8)",
  fontSize: "12px",
  padding: "8px 12px",
};

function analyzeData(records: AnalysisRecord[]) {
  // Object class distribution
  const classMap: Record<string, number> = {};
  const severityMap = { high: 0, medium: 0, low: 0 };
  const violationTypeMap: Record<string, number> = {};
  let totalConfidence = 0;
  let confCount = 0;

  for (const r of records) {
    for (const d of r.result.detections) {
      classMap[d.class_name] = (classMap[d.class_name] || 0) + 1;
      totalConfidence += d.confidence;
      confCount++;
    }
    for (const v of r.result.violations) {
      severityMap[v.severity]++;
      const type = v.type.replace(/_/g, " ");
      violationTypeMap[type] = (violationTypeMap[type] || 0) + 1;
    }
  }

  const classDistribution = Object.entries(classMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const severityData = [
    { name: "High", value: severityMap.high, color: "#ef4444" },
    { name: "Medium", value: severityMap.medium, color: "#eab308" },
    { name: "Low", value: severityMap.low, color: "#3b82f6" },
  ].filter((d) => d.value > 0);

  const violationTypes = Object.entries(violationTypeMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Timeline data (by day)
  const dayMap: Record<string, { objects: number; violations: number }> = {};
  for (const r of records) {
    const day = new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (!dayMap[day]) dayMap[day] = { objects: 0, violations: 0 };
    dayMap[day].objects += r.result.summary.total_objects;
    dayMap[day].violations += r.result.summary.violation_count;
  }
  const timelineData = Object.entries(dayMap).map(([date, data]) => ({
    date,
    ...data,
  }));

  // Confidence distribution buckets
  const confBuckets = [
    { range: "50-60%", min: 0.5, max: 0.6, count: 0 },
    { range: "60-70%", min: 0.6, max: 0.7, count: 0 },
    { range: "70-80%", min: 0.7, max: 0.8, count: 0 },
    { range: "80-90%", min: 0.8, max: 0.9, count: 0 },
    { range: "90-100%", min: 0.9, max: 1.0, count: 0 },
  ];
  for (const r of records) {
    for (const d of r.result.detections) {
      for (const b of confBuckets) {
        if (d.confidence >= b.min && d.confidence < (b.max === 1.0 ? 1.01 : b.max)) {
          b.count++;
          break;
        }
      }
    }
  }

  return {
    classDistribution,
    severityData,
    violationTypes,
    timelineData,
    confBuckets,
    avgConfidence: confCount > 0 ? totalConfidence / confCount : 0,
    totalDetections: confCount,
  };
}

export default function AnalyticsPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  const data = useMemo(() => analyzeData(records), [records]);

  const statCards = [
    {
      label: "Total Detections",
      value: data.totalDetections,
      description: "Objects identified across all runs",
      icon: <Eye className="w-4 h-4" />,
      iconCls: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      dot: "bg-blue-400",
    },
    {
      label: "Unique Classes",
      value: data.classDistribution.length,
      description: "Distinct object categories detected",
      icon: <PieChartIcon className="w-4 h-4" />,
      iconCls: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      dot: "bg-blue-400",
    },
    {
      label: "Avg Confidence",
      value: `${(data.avgConfidence * 100).toFixed(1)}%`,
      description: "Mean model confidence score",
      icon: <TrendingUp className="w-4 h-4" />,
      iconCls: "bg-[#2563eb]/10 border-[#2563eb]/20 text-[#60a5fa]",
      dot: "bg-[#2563eb]",
    },
    {
      label: "Violation Types",
      value: data.violationTypes.length,
      description: "Distinct violation categories found",
      icon: <AlertTriangle className="w-4 h-4" />,
      iconCls: "bg-rose-500/10 border-rose-500/20 text-rose-400",
      dot: "bg-rose-400",
    },
  ];

  return (
    <div className="space-y-5 pb-20 md:pb-0">
      <div className="space-y-5">
        {records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden rounded-[14px] border border-white/8 bg-white/[0.02] px-6 py-20 text-center"
          >
            <div className="pointer-events-none absolute inset-0 gradient-mesh-soft opacity-60" />
            <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-grid-fade opacity-40" />
            <div className="relative">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-black/45">
                <BarChart3 className="h-8 w-8 text-blue-400/70" />
              </div>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.025em] text-white">
                Charts populate as you run analyses
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/45">
                Class distribution, severity breakdown, confidence buckets, and timeline
                trends will appear here once detections are saved to history.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link href="/analyze" className="btn-indigo text-sm">
                  <Scan className="h-4 w-4" />
                  Start analyzing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/history" className="text-sm text-white/55 transition-colors hover:text-white">
                  Open history →
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Sticky KPI strip */}
            <div className="sticky top-[110px] z-30 -mx-2 rounded-[14px] border border-white/8 bg-black/70 px-2 py-3 backdrop-blur-xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <MagicCard key={stat.label} className="p-5">
                  <div className={`inline-flex p-2.5 rounded-xl border mb-3 ${stat.iconCls}`}>
                    {stat.icon}
                  </div>
                  <p className="text-[28px] font-bold font-mono text-white leading-none mb-1">
                    {typeof stat.value === "number"
                      ? <NumberTicker value={stat.value} />
                      : stat.value}
                  </p>
                  <p className="text-sm-ui text-white/55 font-medium">{stat.label}</p>
                  <p className="text-xs-ui text-white/28 mt-0.5">{stat.description}</p>
                </MagicCard>
              ))}
            </div>
            </div>
            {/* /Sticky KPI strip */}

            {/* Object Distribution — full width */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="rounded-2xl card-base overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-subtle flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <h3 className="text-base-ui font-semibold text-white/70">Object Distribution</h3>
              </div>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={360}>
                  <BarChart data={data.classDistribution.slice(0, 10)} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                      tickLine={false}
                      angle={-25}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis
                      tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                      tickLine={false}
                    />
                    <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {data.classDistribution.slice(0, 10).map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} fillOpacity={0.75} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Severity Donut + Confidence Area — 2-col */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Severity Donut */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.27 }}
                className="rounded-2xl card-base overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-subtle flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <h3 className="text-base-ui font-semibold text-white/70">Violation Severity</h3>
                </div>
                <div className="p-5">
                  {data.severityData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[240px]">
                      <Shield className="w-8 h-8 text-[#60a5fa]/30 mb-2" />
                      <p className="text-base-ui text-white/35">No violations recorded</p>
                    </div>
                  ) : (
                    <>
                      <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                          <Pie
                            data={data.severityData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={100}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {data.severityData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} fillOpacity={0.75} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={TOOLTIP_STYLE} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex items-center justify-center gap-5 mt-1">
                        {data.severityData.map((d) => (
                          <div key={d.name} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                            <span className="text-sm-ui text-white/45">{d.name} ({d.value})</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Confidence Area */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.31 }}
                className="rounded-2xl card-base overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-subtle flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  <h3 className="text-base-ui font-semibold text-white/70">Confidence Distribution</h3>
                </div>
                <div className="p-5">
                  <ResponsiveContainer width="100%" height={340}>
                    <AreaChart data={data.confBuckets} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="range"
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#2563eb"
                        fill="#2563eb"
                        fillOpacity={0.12}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Violation Types — horizontal bars */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="rounded-2xl card-base overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-subtle flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <h3 className="text-base-ui font-semibold text-white/70">Violation Types</h3>
              </div>
              <div className="p-5">
                {data.violationTypes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Shield className="w-8 h-8 text-[#60a5fa]/30 mb-2" />
                    <p className="text-base-ui text-white/35">No violations to show</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.violationTypes.map((vt, i) => {
                      const maxCount = data.violationTypes[0]?.count || 1;
                      const pct = (vt.count / maxCount) * 100;
                      return (
                        <div key={vt.name}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs-ui font-medium text-white/55 bg-white/[0.04] border border-white/[0.06] capitalize">
                              {vt.name}
                            </span>
                            <span className="text-sm-ui text-white/30 font-mono">{vt.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.4 + i * 0.08, duration: 0.55 }}
                              className="h-full rounded-full bg-rose-500/50"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Activity Timeline — full width */}
            {data.timelineData.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl card-base overflow-hidden"
              >
                <div className="px-5 py-4 border-b border-subtle flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <h3 className="text-base-ui font-semibold text-white/70">Activity Timeline</h3>
                </div>
                <div className="p-5">
                  <ResponsiveContainer width="100%" height={340}>
                    <LineChart data={data.timelineData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                        tickLine={false}
                      />
                      <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: "rgba(255,255,255,0.06)" }} />
                      <Line
                        type="monotone"
                        dataKey="objects"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={{ fill: "#2563eb", r: 3, strokeWidth: 0 }}
                        name="Objects"
                      />
                      <Line
                        type="monotone"
                        dataKey="violations"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: "#ef4444", r: 3, strokeWidth: 0 }}
                        name="Violations"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-3">
                    <span className="flex items-center gap-2 text-sm-ui text-white/40">
                      <span className="w-3 h-[2px] bg-[#2563eb] rounded" />
                      Objects
                    </span>
                    <span className="flex items-center gap-2 text-sm-ui text-white/40">
                      <span className="w-3 h-[2px] bg-rose-400 rounded" />
                      Violations
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
