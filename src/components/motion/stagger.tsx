"use client";

import { Children, isValidElement } from "react";
import { motion } from "framer-motion";
import { useMotionSafe } from "@/components/motion/use-motion-safe";
import { cn } from "@/lib/utils";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
};

export function Stagger({ children, className, stagger = 0.08 }: StaggerProps) {
  const { reduced, duration, ease } = useMotionSafe();
  const items = Children.toArray(children);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-6% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {items.map((child, i) => (
        <motion.div
          key={isValidElement(child) && child.key != null ? String(child.key) : i}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0, transition: { duration, ease } },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
