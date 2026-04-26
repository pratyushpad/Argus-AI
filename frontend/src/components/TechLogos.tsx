"use client";

import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiDocker,
  SiFastapi,
  SiGooglecloud,
  SiPython,
  SiFramer,
} from "react-icons/si";

const TECHS = [
  { name: "YOLOv8", Icon: null as null },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Tailwind", Icon: SiTailwindcss },
  { name: "Framer Motion", Icon: SiFramer },
  { name: "Docker", Icon: SiDocker },
  { name: "Google Cloud", Icon: SiGooglecloud },
  { name: "Python", Icon: SiPython },
];

export default function TechLogos() {
  return (
    <div className="flex items-center gap-8 md:gap-10 overflow-x-auto py-1">
      {TECHS.map((tech, i) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-2 text-white/20 hover:text-white/50 transition-colors duration-300 shrink-0 cursor-default"
        >
          {tech.Icon ? (
            <tech.Icon className="w-4.5 h-4.5" />
          ) : (
            <span className="text-[11px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-white/30">Y8</span>
          )}
          <span className="text-[13px] font-medium whitespace-nowrap">{tech.name}</span>
        </motion.div>
      ))}
    </div>
  );
}
