import type { Metadata } from "next";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { LinkButton } from "@/components/ui/link-button";

export const metadata: Metadata = {
  title: "Povestea noastră",
  description:
    "Spațiu narativ LyraBaits — placeholder artistic, fără istoric inventat, pregătit pentru conținut real.",
};

const CHAPTERS = [
  {
    id: "1",
    title: "Originea — de completat",
    body: "Placeholder narativ. Echipa va adăuga aici povestea autentică a brandului, fără date sau statistici inventate.",
    seed: "story-1",
    quote: "Apa își scrie propriul ritm.",
  },
  {
    id: "2",
    title: "Apă, echipament, comunitate",
    body: "Secțiune editorială pentru valorile LyraBaits: natură, meșteșug, parteneriate reale — conținut de înlocuit.",
    seed: "story-2",
    quote: "Echipament cu sens, nu doar rafturi.",
  },
  {
    id: "3",
    title: "Ce urmează",
    body: "Invitație către produse, articole și emisiuni. Fără promisiuni nerealiste — doar direcția hub-ului digital.",
    seed: "story-3",
    quote: "Un hub pentru pescari, construit treptat.",
  },
] as const;

export default function PovesteaNoastraPage() {
  return (
    <div>
      <section className="surface-depth relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 grain-overlay opacity-35" aria-hidden />
        <div className="container-lyra relative max-w-3xl">
          <Reveal>
            <p className="font-hand mb-3 text-3xl text-sand">Narativ</p>
            <h1 className="mb-4 font-display text-5xl tracking-wide md:text-7xl">
              Povestea noastră
            </h1>
            <p className="text-cream/80 md:text-lg">
              Pagină artistică cu placeholder-e marcate explicit. Nu conține istoric fabricat —
              este un schelet editorial pentru echipă.
            </p>
          </Reveal>
        </div>
      </section>

      {CHAPTERS.map((chapter, index) => (
        <section
          key={chapter.id}
          className={`section-lyra relative overflow-hidden ${index % 2 === 1 ? "bg-fog/35" : ""}`}
        >
          <div className="container-lyra grid items-center gap-10 lg:grid-cols-2">
            <Reveal className={index % 2 === 1 ? "lg:order-2" : ""}>
              <p className="mb-2 text-xs uppercase tracking-widest text-accent">
                Placeholder · Capitol {chapter.id}
              </p>
              <h2 className="mb-4 font-display text-4xl tracking-wide md:text-5xl">
                {chapter.title}
              </h2>
              <p className="mb-6 leading-relaxed text-muted md:text-lg">{chapter.body}</p>
              <blockquote className="border-l-2 border-accent/60 pl-4 font-hand text-2xl text-foreground/80 md:text-3xl">
                {chapter.quote}
              </blockquote>
            </Reveal>
            <Parallax
              offset={52}
              speed={index % 2 === 0 ? 0.9 : 1.1}
              className={index % 2 === 1 ? "lg:order-1" : ""}
            >
              <PlaceholderMedia
                seed={chapter.seed}
                ratio="portrait"
                label="Placeholder poveste"
                className="shadow-soft"
              />
            </Parallax>
          </div>
        </section>
      ))}

      <section className="section-lyra relative border-t border-border">
        <Reveal>
          <div className="container-lyra text-center">
            <h2 className="mb-4 font-display text-4xl tracking-wide">Descoperă hub-ul</h2>
            <p className="mx-auto mb-8 max-w-lg text-muted">
              Produse, articole și emisiuni — toate conectate într-un singur loc.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <LinkButton href="/produse">Produse</LinkButton>
              <LinkButton href="/articole" variant="secondary">
                Articole
              </LinkButton>
              <LinkButton href="/contact" variant="secondary">
                Contact
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
