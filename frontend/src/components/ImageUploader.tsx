"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, CheckCircle2, FileImage } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageUploader({ onFileSelect, isLoading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    onFileSelect(f);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isLoading,
  });

  const clear = () => { setFile(null); setPreview(null); };

  return (
    <AnimatePresence mode="wait">
      {preview && file ? (
        <motion.div key="preview" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }} className="relative rounded-2xl overflow-hidden border border-white/[0.08]">
          <div className="relative aspect-[16/9] bg-zinc-900">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {!isLoading && (
              <button onClick={clear} className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 border border-white/[0.1] text-white/60 hover:text-white hover:bg-black/80 transition-all cursor-pointer backdrop-blur-sm">
                <X className="w-4 h-4" />
              </button>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/[0.1] backdrop-blur-sm border border-white/[0.1]">
                  <FileImage className="w-4 h-4 text-white/80" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white truncate max-w-[180px]">{file.name}</p>
                  <p className="text-[11px] text-white/50">{formatBytes(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-semibold">Ready</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div key="dropzone" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div {...getRootProps()} className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group ${
            isDragActive ? "border-[#2563eb]/50 bg-[#2563eb]/[0.05]" : "border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.02]"
          }`}>
            <input {...getInputProps()} />
            <AnimatePresence>
              {isDragActive && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(94,106,210,0.07) 0%, transparent 70%)" }} />
              )}
            </AnimatePresence>
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center relative z-10">
              <motion.div animate={isDragActive ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`mb-6 p-5 rounded-2xl border transition-all duration-300 ${
                  isDragActive ? "bg-[#2563eb]/12 border-[#2563eb]/30 text-[#60a5fa]" : "bg-white/[0.03] border-white/[0.06] text-white/25 group-hover:text-white/40 group-hover:bg-white/[0.05]"
                }`}>
                <Upload className="w-8 h-8" />
              </motion.div>
              <h3 className={`text-[16px] font-semibold mb-2 transition-colors ${isDragActive ? "text-[#60a5fa]" : "text-white/55"}`}>
                {isDragActive ? "Drop it right here!" : "Drop your dashcam image"}
              </h3>
              <p className="text-[13px] text-white/28 mb-5">
                or <span className="text-white/50 underline underline-offset-2 decoration-white/20">click to browse files</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {["JPEG", "PNG", "WebP"].map((f) => (
                  <span key={f} className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30">{f}</span>
                ))}
                <span className="text-[11px] text-white/18">· max 10MB</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
