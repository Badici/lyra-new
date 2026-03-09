"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { href: "#acasa", label: "Acasă" },
  { href: "#nada", label: "Nadă" },
  { href: "#monturi", label: "Monturi" },
  { href: "#pva", label: "PVA" },
  { href: "#boillies", label: "Boillies" },
  { href: "#momeala", label: "Momeală silicon" },
  { href: "#contact", label: "Contact" },
  { href: "#capturi", label: "Capturile noastre" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[var(--background)]/95 backdrop-blur-md border-b border-white/5" : ""
        }`}
      >
        <nav className="max-w-[90rem] mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">
          <a href="#acasa" className="flex items-center shrink-0 mr-6 md:mr-8" aria-label="Lyra Baits – Acasă">
            <Image
              src="/logo-navbar-shadow.png"
              alt="Lyra Baits"
              width={240}
              height={80}
              className="h-12 w-auto sm:h-14 md:h-16 object-contain object-left"
              priority
            />
          </a>

          {/* Desktop */}
          <ul className="hidden md:flex items-center gap-8 text-base text-[var(--muted)]">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="hover:text-[var(--cream)] transition-colors font-medium"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/40728241412"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-base font-medium text-white hover:bg-[#20bd5a] transition-colors"
          >
            WhatsApp
          </a>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-[var(--cream)]"
            onClick={() => setOpen((o) => !o)}
            aria-label="Meniu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[var(--background)]/98 backdrop-blur md:hidden pt-24 px-4"
            onClick={() => setOpen(false)}
          >
            <ul className="flex flex-col gap-4 text-xl">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block py-2 text-[var(--cream)] hover:text-[var(--accent-light)]"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/40728241412"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-white font-medium"
                >
                  WhatsApp +40 728 241 412
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
