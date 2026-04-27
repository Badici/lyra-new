"use client";

import Image from "next/image";
import Script from "next/script";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { NadaSection } from "@/components/NadaSection";
import { SectionBoillies } from "@/components/SectionBoillies";
import { SectionMonturi } from "@/components/SectionMonturi";
import { SectionPVA } from "@/components/SectionPVA";
import { CapturileNoastre } from "@/components/CapturileNoastre";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lyrabaits.ro";
  const seoSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Lyra Baits",
        url: `${siteUrl}/`,
        telephone: "+40728241412",
        email: "raresbadici@gmail.com",
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Lyra Baits",
        inLanguage: "ro-RO",
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
      {
        "@type": "Store",
        "@id": `${siteUrl}/#store`,
        name: "Lyra Baits",
        url: `${siteUrl}/`,
        image: `${siteUrl}/logo-lyra.png`,
        telephone: "+40728241412",
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Sos. Chitilei 242 E, Corp C5, Ap. 328, Parter, Faza 2",
          addressCountry: "RO",
        },
        areaServed: "EU",
      },
    ],
  };

  return (
    <>
      <Script
        id="seo-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(seoSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section
          id="acasa"
          className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 overflow-hidden"
        >
          <Image
            src="/hero.jpeg"
            alt="Pescuit la crap cu momeala Lyra Baits"
            fill
            priority
            className="absolute inset-0 object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/45 via-transparent to-[var(--background)]" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative z-10 text-center max-w-3xl"
          >
            <h1 className="sr-only">
              Lyra Baits - momeala, pungi PVA si monturi pentru pescuit la crap
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 flex justify-center"
            >
              <Image
                src="/logo-lyra.png"
                alt="Lyra Baits"
                width={320}
                height={120}
                className="w-64 sm:w-72 md:w-80 h-auto object-contain"
                priority
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xl md:text-2xl text-[var(--cream)]/95 drop-shadow-sm font-sans mb-4"
            >
              Momeala premium pentru pescuit la crap.
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="max-w-2xl mx-auto text-[var(--cream)]/90 text-base md:text-lg mb-8"
            >
              La Lyra Baits gasesti nada, pungi PVA, monturi si amestec de nadire
              pentru partide eficiente pe lacurile din Romania.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              <a
                href="#nada"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-[var(--cream)] font-medium hover:bg-[var(--accent-light)] transition-colors"
              >
                Vezi produsele
              </a>
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--muted)] text-sm"
          >
            Comandă prin WhatsApp: +40 728 241 412
          </motion.div>
        </section>

        {/* Order CTA strip */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-6 px-4 bg-[var(--lake)] border-y border-white/5"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
            <p className="text-[var(--cream)] font-medium">
              Toate comenzile se plasează prin WhatsApp
            </p>
            <WhatsAppButton />
          </div>
        </motion.section>

        {/* Nada – clickable variants, gallery per type */}
        <NadaSection />

        {/* Pungi PVA */}
        <SectionPVA />

        {/* Monturi – two columns */}
        <SectionMonturi />

        {/* Amestec nădire */}
        <SectionBoillies />

        {/* Contact / CTA */}
        <section
          id="contact"
          className="py-20 md:py-28 px-4 scroll-mt-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--cream)] mb-4">
              Comandă acum
            </h2>
            <p className="text-[var(--muted)] text-lg mb-6">
              Toate comenzile se plasează prin WhatsApp. Scrie-ne la numărul de
              mai jos pentru prețuri și disponibilitate.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WhatsAppButton className="!px-8 !py-4 !text-lg" />
              <a
                href="tel:+40728241412"
                className="text-[var(--muted)] hover:text-[var(--cream)] transition-colors"
              >
                +40 728 241 412
              </a>
            </div>
            <p className="mt-8 text-sm text-[var(--muted)]">
              Lyra Baits – Pescuit la crap. Nadă, amestec nădire, monturi,
              accesorii.
            </p>
          </motion.div>
        </section>

        {/* Capturile noastre – last */}
        <CapturileNoastre />

        <footer className="py-8 px-4 border-t border-white/5 text-center text-[var(--muted)] text-sm">
          <a href="#acasa" className="inline-block mb-4" aria-label="Lyra Baits">
            <Image
              src="/logo-lyra.png"
              alt="Logo Lyra Baits"
              width={100}
              height={34}
              className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity mx-auto"
            />
          </a>
          <div className="mb-3 flex items-center justify-center gap-5 text-sm">
            <a href="/date-legale" className="hover:text-[var(--cream)] transition-colors">
              Date legale
            </a>
            <a href="/date-legale#confidentialitate" className="hover:text-[var(--cream)] transition-colors">
              Confidențialitate
            </a>
            <a href="/termeni-si-conditii" className="hover:text-[var(--cream)] transition-colors">
              Termeni și condiții
            </a>
          </div>
          <p>© {new Date().getFullYear()} Lyra Baits. Toate comenzile prin WhatsApp +40 728 241 412.</p>
        </footer>
      </main>
    </>
  );
}
