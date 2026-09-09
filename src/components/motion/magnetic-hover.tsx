"use client";

import { motion } from "framer-motion";
import { useMotionSafe } from "@/components/motion/use-motion-safe";
import { cn } from "@/lib/utils";

type MagneticHoverProps = {
  children: React.ReactNode;
  className?: string;
  scale?: number;
};

export function MagneticHover({
  children,
  className,
  scale = 1.03,
}: MagneticHoverProps) {
  const { reduced } = useMotionSafe();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      whileHover={{ scale, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      {children}
    </motion.div>
  );
}
