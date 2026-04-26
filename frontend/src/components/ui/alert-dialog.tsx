"use client";

import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[120] bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-[121] w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-[12px] border border-white/10 bg-[#0c0c12] p-6 shadow-2xl"
          >
            <h3 className="font-display text-xl text-white">{title}</h3>
            {description && (
              <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onClose} className="btn-ghost-framer text-sm">
                {cancelLabel}
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={
                  destructive
                    ? "rounded-[6px] bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_0_1px_rgba(244,63,94,0.4),0_4px_16px_rgba(244,63,94,0.25)] hover:bg-rose-400"
                    : "btn-indigo text-sm"
                }
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
