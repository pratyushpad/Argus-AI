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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className={item.className}
        >
          <GlowingCard className="h-full">
            <div className={`p-6 h-full flex flex-col justify-between ${item.gradient || ""}`}>
              <div>
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-semibold text-[15px] text-slate-100 mb-1.5">{item.title}</h3>
                <p className="text-[12px] text-slate-400 leading-relaxed">{item.description}</p>
              </div>
              {item.visual && <div className="mt-3">{item.visual}</div>}
            </div>
          </GlowingCard>
        </motion.div>
      ))}
    </div>
  );
}
