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
          initial={{ width: "6rem", opacity: 0 }}
          whileInView={{ width: "36rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
          className="absolute top-0 h-56 bg-gradient-to-b from-white/[0.15] to-transparent blur-[100px] rounded-full"
        />
        {/* Narrow bright beam */}
        <motion.div
          initial={{ width: "3rem", opacity: 0 }}
          whileInView={{ width: "18rem", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
          className="absolute top-0 h-36 bg-gradient-to-b from-white/[0.25] to-transparent blur-[50px] rounded-full"
        />
        {/* Top line */}
        <motion.div
          initial={{ width: "3rem" }}
          whileInView={{ width: "24rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 1, ease: "easeInOut" }}
          className="absolute top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />
      </div>
      <div className="relative z-10 pt-16">{children}</div>
    </div>
  );
}
