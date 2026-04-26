"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";

export default function WelcomePage() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/auth/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6 py-16">
      <div className="pointer-events-none absolute inset-0 gradient-mesh-soft" />
      <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-grid-fade opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03]">
            <Logo size={18} className="text-white" />
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/30">Road Vision Suite</p>
            <h1 className="font-display text-xl text-white leading-tight">Argus AI</h1>
          </div>
        </div>

        <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-7 shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.22em] text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Signed in
          </div>

          <div className="mt-6 flex items-center gap-4">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt=""
                className="h-14 w-14 rounded-full border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/45 text-lg font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-2xl text-white">{user.name}</p>
              <p className="mt-1 truncate text-sm text-white/45">{user.email}</p>
            </div>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[0.65rem] uppercase tracking-[0.22em] text-white/55">
            <Shield className="h-3 w-3" />
            {user.mode === "google" ? "Google account" : "Guest mode"}
          </div>

          <div className="mt-7 space-y-2 border-t border-white/8 pt-6">
            <p className="text-[0.7rem] uppercase tracking-[0.22em] text-white/30 mb-3">
              You'll have access to
            </p>
            {[
              "Detection workspace + YOLOv8 inference",
              "Saved history + analytics across runs",
              "Preferences synced with your account",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-white/55">
                <Sparkles className="h-3.5 w-3.5 mt-0.5 text-blue-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-2">
            <Link href="/analyze" className="btn-indigo w-full justify-center text-sm">
              Continue to workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => {
                signOut();
                router.replace("/auth/login");
              }}
              className="text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              Not you? Sign out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
