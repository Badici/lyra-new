"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export type PhotoViewerItem = {
  src: string;
  alt?: string;
  caption?: string;
};

type PhotoViewerProps = {
  items: PhotoViewerItem[];
  initialIndex: number;
  onClose: () => void;
};

export function PhotoViewer({ items, initialIndex, onClose }: PhotoViewerProps) {
  const length = items.length;
  const [index, setIndex] = useState(initialIndex);
  const item = items[index];

  const goPrev = useCallback(() => {
    setIndex((i) => (i <= 0 ? length - 1 : i - 1));
  }, [length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i >= length - 1 ? 0 : i + 1));
  }, [length]);

  useEffect(() => {
    setIndex(Math.min(initialIndex, length - 1));
  }, [initialIndex, length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        onClick={onClose}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Închide"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Anterior"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Următor"
            >
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        <div
          className="relative w-full h-full flex flex-col items-center justify-center p-4 pt-14 pb-20"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl flex flex-col items-center justify-center"
            >
              <div className="relative w-full h-[80vh] min-h-[300px] max-h-[85vh] flex items-center justify-center">
                <Image
                  src={item.src}
                  alt={item.alt ?? ""}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
              {item.caption && (
                <p className="mt-4 text-center text-white/90 text-sm md:text-base max-w-xl">
                  {item.caption}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {index + 1} / {length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
