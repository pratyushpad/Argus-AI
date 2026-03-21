"use client";

import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
}

export default function LampEffect({ children }: Props) {
  return (
    <div className="relative flex flex-col items-center">
      {/* Lamp container */}
      <div className="relative w-full flex items-center justify-center">
        {/* Wide glow */}
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          whileInView={{ width: "30rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 h-48 bg-gradient-to-b from-red-500/20 to-transparent blur-[80px] rounded-full"
        />
        {/* Narrow bright beam */}
        <motion.div
          initial={{ width: "4rem", opacity: 0 }}
          whileInView={{ width: "16rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 h-32 bg-gradient-to-b from-red-400/30 to-transparent blur-[40px] rounded-full"
        />
        {/* Top line */}
        <motion.div
          initial={{ width: "4rem" }}
          whileInView={{ width: "20rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent"
        />
      </div>
      <div className="relative z-10 pt-12">{children}</div>
    </div>
  );
}
