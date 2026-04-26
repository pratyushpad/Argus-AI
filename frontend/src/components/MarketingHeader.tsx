"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/platform", label: "System" },
  { href: "/analyze", label: "Workspace" },
];

export default function MarketingHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-white/10 bg-white/[0.03]">
            <Logo size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[0.68rem] uppercase tracking-[0.28em] text-white/30">
              Road Vision Suite
            </div>
            <div className="font-display text-lg leading-none text-white">Argus AI</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[6px] px-4 py-2 text-sm transition-colors ${
                  active
                    ? "bg-white text-black"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/auth/login"
            className="hidden rounded-[6px] border border-white/10 px-4 py-2 text-sm text-white/65 transition-colors hover:border-white/20 hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link href="/analyze" className="btn-indigo text-sm">
            Open workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
