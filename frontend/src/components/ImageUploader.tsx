"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, FileImage } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onFileSelect, isLoading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<string>("");

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

  if (preview) {
    return (
      <div className="rounded-2xl overflow-hidden glass animate-fade-in-scale">
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-[420px] object-contain bg-black/30"
          />
          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0F172A] to-transparent" />

          {!isLoading && (
            <button
              onClick={clearPreview}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/10 transition-all duration-200 cursor-pointer"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
        <div className="px-4 py-3 flex items-center gap-3 text-xs border-t border-white/[0.06]">
          <FileImage className="w-4 h-4 text-slate-500" />
          <span className="text-slate-400 truncate">{fileName}</span>
          <span className="text-slate-600 font-mono">{fileSize}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`group relative rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? "border-red-500/40 bg-red-500/[0.04]"
          : "border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.03]"
      }`}
    >
      <input {...getInputProps()} />

      <div className="relative inline-flex mb-5">
        <div className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 ${
          isDragActive ? "bg-red-500/20 opacity-100" : "bg-white/5 opacity-0 group-hover:opacity-100"
        }`} />
        <div className="relative p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
          <Upload className={`w-7 h-7 transition-colors duration-200 ${
            isDragActive ? "text-red-400" : "text-slate-500 group-hover:text-slate-400"
          }`} />
        </div>
      </div>

      <p className={`text-base font-medium mb-1.5 transition-colors duration-200 ${
        isDragActive ? "text-red-400" : "text-slate-300"
      }`}>
        {isDragActive ? "Drop your image here" : "Drop a dashcam image here"}
      </p>
      <p className="text-sm text-slate-500 mb-4">
        or <span className="text-slate-400 underline underline-offset-2 decoration-slate-600">browse files</span>
      </p>
      <p className="text-[11px] text-slate-600 font-mono">
        JPEG, PNG, WebP / Max 10MB
      </p>
    </div>
  );
}
