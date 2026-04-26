"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Chrome, UserRound, Shield, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { useAuth } from "@/lib/auth";

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Couldn't redirect to Google. Check your connection and try again.",
  OAuthCallback: "Google returned an unexpected response. Try signing in again.",
  OAuthAccountNotLinked: "That Google account is linked to a different identity.",
  AccessDenied: "You declined access. Sign in again to continue.",
  Configuration: "OAuth isn't configured yet. Add Google credentials to .env.local.",
  default: "Something went wrong while signing in. Try again.",
};

const FEATURE_LIST = [
  { icon: Shield, text: "Detections saved to your account history" },
  { icon: Lock, text: "Google account — no new password required" },
  { icon: ArrowRight, text: "Full access to detection, history, and analytics" },
];

export default function LoginPage() {
  const { user, isLoading, signInWithGoogle, signInAsGuest } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const errorKey = params.get("error");
  const errorMessage = errorKey
    ? OAUTH_ERROR_MESSAGES[errorKey] ?? OAUTH_ERROR_MESSAGES.default
    : null;

  useEffect(() => {
    if (!isLoading && user) router.replace("/analyze");
  }, [user, isLoading, router]);

  if (isLoading) return <div className="min-h-screen bg-black" />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6 py-16">
      <div className="pointer-events-none absolute inset-0 gradient-mesh-soft" />
      <div className="pointer-events-none absolute inset-0 bg-dot-grid bg-dot-grid-fade opacity-40" />
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03]">
              <Logo size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/28">
                Road Vision Suite
              </p>
              <h1 className="font-display text-2xl text-white">Argus AI</h1>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.94] tracking-[-0.04em] text-white">
              Enter the
              <br />
              workspace.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/50">
              Sign in with Google to keep your detection history and preferences
              synced. Or continue as a guest — everything stays local.
            </p>
          </div>

          {/* OAuth error */}
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-[8px] border border-rose-500/25 bg-rose-500/[0.06] px-4 py-3 text-sm text-rose-200"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {/* Auth card */}
          <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-6 space-y-4 shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
            <button
              onClick={signInWithGoogle}
              className="btn-indigo w-full justify-center gap-3"
            >
              <Chrome className="h-4 w-4" />
              Continue with Google
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 border-t border-white/8" />
              <span className="text-[0.68rem] uppercase tracking-[0.24em] text-white/28">or</span>
              <div className="flex-1 border-t border-white/8" />
            </div>

            <button
              onClick={() => {
                signInAsGuest();
                router.push("/analyze");
              }}
              className="btn-ghost-framer w-full justify-center gap-3"
            >
              <UserRound className="h-4 w-4" />
              Continue as guest
            </button>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {FEATURE_LIST.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/44">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-white/8 bg-white/[0.03]">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                {text}
              </div>
            ))}
          </div>

          <p className="text-xs text-white/28 leading-6">
            Guest mode stores data locally in your browser only. Sign in with
            Google to persist history across devices.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
