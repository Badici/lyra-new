"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionSafe } from "@/components/motion/use-motion-safe";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Pixel travel range; positive = moves down as you scroll */
  offset?: number;
  speed?: number;
};

export function Parallax({
  children,
  className,
  offset = 48,
  speed = 1,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionSafe();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset * speed, offset * speed]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative will-change-transform", className)}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
