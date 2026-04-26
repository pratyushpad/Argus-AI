"use client";

import { motion } from "framer-motion";
import GlowingCard from "./GlowingCard";

interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  gradient?: string;
  visual?: React.ReactNode;
}

interface Props {
  items: BentoItem[];
}

export default function BentoGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 auto-rows-[160px]">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className={item.className}
        >
          <GlowingCard className="h-full group cursor-default">
            <div className={`p-5 h-full flex flex-col justify-between ${item.gradient || ""}`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-[14px] text-white tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[11px] text-white/45 leading-relaxed">{item.description}</p>
              </div>
              {item.visual && (
                <div className="mt-2 opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                  {item.visual}
                </div>
              )}
            </div>
          </GlowingCard>
        </motion.div>
      ))}
    </div>
  );
}
