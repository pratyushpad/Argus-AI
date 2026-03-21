"use client";

import { motion } from "framer-motion";

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className = "", delay = 0 }: Props) {
  const words = text.split(" ");

  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.06,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
