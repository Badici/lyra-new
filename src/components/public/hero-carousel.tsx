"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Parallax } from "@/components/motion/parallax";
import { useMotionSafe } from "@/components/motion/use-motion-safe";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  seed: string;
  href: string;
  cta: string;
};

type Props = {
  slides: HeroSlide[];
};

const AUTOPLAY_MS = 7000;

export function HeroCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const touchStartX = useRef<number | null>(null);
  const regionRef = useRef<HTMLElement>(null);
  const { reduced, duration, ease } = useMotionSafe();

  const count = slides.length;

  const goTo = useCallback(
    (next: number, dir?: number) => {
      if (count === 0) return;
      const normalized = ((next % count) + count) % count;
      setDirection(dir ?? (normalized > index ? 1 : -1));
      setIndex(normalized);
    },
    [count, index],
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (paused || reduced || count <= 1) return;
    const id = window.setInterval(next, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, reduced, count, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!regionRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (count === 0) return null;

  const slide = slides[index]!;

  return (
    <section
      ref={regionRef}
      aria-roledescription="carusel"
      aria-label="Evidențe LyraBaits"
      className="relative isolate min-h-[min(88vh,52rem)] overflow-hidden bg-depth text-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start == null) return;
        const delta = (e.changedTouches[0]?.clientX ?? start) - start;
        if (Math.abs(delta) < 40) return;
        if (delta < 0) next();
        else prev();
      }}
    >
      {/* Atmospheric layers */}
      <div className="pointer-events-none absolute inset-0 ambience-depth" aria-hidden />
      <div className="pointer-events-none absolute inset-0 grain-overlay opacity-40" aria-hidden />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-0 h-[70%] w-[70%] rounded-full bg-accent/10 blur-3xl"
        animate={reduced ? undefined : { x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-1/5 bottom-0 h-[55%] w-[55%] rounded-full bg-moss/40 blur-3xl"
        animate={reduced ? undefined : { x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container-lyra relative z-10 grid min-h-[min(88vh,52rem)] items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div className="relative z-10 max-w-2xl">
          <motion.p
            className="font-hand mb-3 text-2xl text-sand md:text-3xl"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration, ease }}
          >
            Hub pentru pescari
          </motion.p>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              initial={
                reduced
                  ? false
                  : { opacity: 0, y: direction > 0 ? 28 : -28, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={
                reduced
                  ? undefined
                  : { opacity: 0, y: direction > 0 ? -24 : 24, filter: "blur(4px)" }
              }
              transition={{ duration: duration * 0.9, ease }}
            >
              <h1 className="mb-5 text-5xl leading-[0.92] md:text-7xl lg:text-8xl">
                {slide.title}
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-cream/80 md:text-lg">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap gap-3">
            <LinkButton href={slide.href} variant="accent">
              {slide.cta}
            </LinkButton>
            <LinkButton href="/articole" variant="secondary">
              Citește articole
            </LinkButton>
          </div>
        </div>

        <Parallax offset={36} speed={0.7} className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.seed}
              initial={reduced ? false : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration, ease }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-accent/20 via-transparent to-sand/10 blur-2xl" />
              <PlaceholderMedia
                seed={slide.seed}
                ratio="wide"
                label="Placeholder editorial"
                className="relative shadow-soft ring-1 ring-cream/15"
              />
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-depth/50 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </Parallax>
      </div>

      {count > 1 ? (
        <div className="container-lyra absolute bottom-6 left-0 right-0 z-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Slide-uri hero">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                className={cn(
                  "h-2.5 rounded-full transition-all duration-500 ease-out",
                  i === index ? "w-10 bg-accent" : "w-2.5 bg-cream/35 hover:bg-cream/60",
                )}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream/10 backdrop-blur-sm transition hover:bg-cream/20 hover:scale-105"
              aria-label={paused ? "Pornește redarea automată" : "Pauză redare automată"}
              onClick={() => setPaused((p) => !p)}
            >
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream/10 backdrop-blur-sm transition hover:bg-cream/20 hover:scale-105"
              aria-label="Slide anterior"
              onClick={prev}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cream/10 backdrop-blur-sm transition hover:bg-cream/20 hover:scale-105"
              aria-label="Slide următor"
              onClick={next}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}

      <Link href={slide.href} className="sr-only">
        {slide.cta}: {slide.title}
      </Link>

      {/* Progress bar for autoplay */}
      {!reduced && count > 1 && !paused ? (
        <motion.div
          key={`progress-${index}`}
          className="absolute bottom-0 left-0 h-0.5 origin-left bg-accent/80"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
          style={{ width: "100%" }}
        />
      ) : null}
    </section>
  );
}
