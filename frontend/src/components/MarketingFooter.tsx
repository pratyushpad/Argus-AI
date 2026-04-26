import Link from "next/link";
import { Github } from "lucide-react";
import Logo from "@/components/Logo";

export default function MarketingFooter() {
  return (
    <footer className="border-t border-white/8 bg-black">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03]">
              <Logo size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display text-lg text-white">Argus AI</div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/28">
                Computer vision for road evidence
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/42">
            A black-and-white traffic intelligence workspace for upload, detection,
            review, analytics, and export.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/28">Product</p>
          <div className="mt-4 space-y-3 text-sm text-white/58">
            <Link href="/" className="block hover:text-white">
              Landing
            </Link>
            <Link href="/platform" className="block hover:text-white">
              System
            </Link>
            <Link href="/analyze" className="block hover:text-white">
              Workspace
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/28">Workspace</p>
          <div className="mt-4 space-y-3 text-sm text-white/58">
            <Link href="/analyze" className="block hover:text-white">
              Detection
            </Link>
            <Link href="/history" className="block hover:text-white">
              History
            </Link>
            <Link href="/analytics" className="block hover:text-white">
              Analytics
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/28">Source</p>
          <a
            href="https://github.com/Pratyushpad27/ML-Predictor"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-[6px] border border-white/10 px-4 py-2 text-sm text-white/58 transition-colors hover:border-white/18 hover:text-white"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
