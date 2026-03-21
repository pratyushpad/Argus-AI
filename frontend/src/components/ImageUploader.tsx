"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface Props {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export default function ImageUploader({ onFileSelect, isLoading }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      setFileName(file.name);
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
  };

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5">
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-[400px] object-contain bg-black/20"
          />
          {!isLoading && (
            <button
              onClick={clearPreview}
              className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          <div className="px-4 py-3 bg-white/5 text-sm text-gray-400 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            {fileName}
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/[0.07]"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
          <p className="text-lg font-medium text-gray-300">
            {isDragActive ? "Drop your image here" : "Drag & drop a dashcam image"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            or click to browse — JPEG, PNG, WebP up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}
