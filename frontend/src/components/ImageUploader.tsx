"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, FileImage } from "lucide-react";
import GlowingCard from "@/components/ui/GlowingCard";

interface Props {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onFileSelect, isLoading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setFileName(file.name);
      setFileSize(formatSize(file.size));
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isLoading,
  });

  const clearPreview = () => {
    setPreview(null);
    setFileName("");
    setFileSize("");
  };

  return (
    <AnimatePresence mode="wait">
      {preview ? (
        <motion.div
          key="preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
        >
          <GlowingCard>
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-[420px] object-contain bg-black/40 rounded-t-2xl"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080c18] to-transparent" />
              {!isLoading && (
                <motion.button
                  onClick={clearPreview}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-red-500/80 border border-white/10 transition-colors cursor-pointer"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>
              )}
            </div>
            <div className="px-5 py-3.5 flex items-center gap-3 text-xs border-t border-white/[0.04]">
              <FileImage className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400 truncate">{fileName}</span>
              <span className="text-slate-600 font-mono text-[11px]">{fileSize}</span>
            </div>
          </GlowingCard>
        </motion.div>
      ) : (
        <motion.div
          key="dropzone"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <GlowingCard
            glowColor={isDragActive ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)"}
          >
            <div
              {...getRootProps()}
              className={`relative p-16 md:p-20 text-center cursor-pointer transition-all duration-300 rounded-2xl ${
                isDragActive ? "bg-red-500/[0.03]" : ""
              }`}
            >
              <input {...getInputProps()} />

              {/* Animated upload icon */}
              <motion.div
                className="relative inline-flex mb-6"
                animate={isDragActive ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-red-500/20 blur-2xl"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <Upload className={`w-8 h-8 transition-colors duration-300 ${
                    isDragActive ? "text-red-400" : "text-slate-500"
                  }`} />
                </div>
              </motion.div>

              <p className={`text-lg font-medium mb-2 transition-colors duration-200 ${
                isDragActive ? "text-red-400" : "text-slate-200"
              }`}>
                {isDragActive ? "Drop it here" : "Drop a dashcam image"}
              </p>
              <p className="text-sm text-slate-500 mb-5">
                or <span className="text-slate-400 underline underline-offset-4 decoration-slate-600 hover:decoration-red-500/50 transition-colors">browse files</span>
              </p>
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-600 font-mono">
                <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">JPEG</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">PNG</span>
                <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">WebP</span>
                <span className="text-slate-700">|</span>
                <span>Max 10MB</span>
              </div>

              {/* Scan line animation */}
              {isDragActive && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                  <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-scan" />
                </div>
              )}
            </div>
          </GlowingCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
