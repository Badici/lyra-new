import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { LinkButton } from "@/components/ui/link-button";

const DESCRIPTION =
  "Povestea LyraBaits: de la pasiunea pentru pescuitul sportiv la crap, la monturi și forfacuri legate cu grijă, și mai departe către un hub pentru pescari.";

export const metadata: Metadata = {
  title: "Povestea noastră",
  description: DESCRIPTION,
  openGraph: {
    title: "Povestea noastră",
    description: DESCRIPTION,
    url: "/povestea-noastra",
  },
};

const CHAPTERS = [
  {
    id: "01",
    title: "Pasiunea de la mal",
    body: "Pescuitul ne-a prins de mici. Diminețile pe baltă, lansetele sprijinite în iarbă și răbdarea de a aștepta o trăsătură au rămas cu noi. În timp, pasiunea s-a așezat pe pescuitul sportiv la crap — acolo am învățat și am perfecționat partea care ne definește: legatul monturilor și al forfacurilor. Noduri, prezentări, detalii mici, repetate până ies cum trebuie.",
    image: "/despre_noi_1.jpeg",
    alt: "Copil lângă lansete de pescuit, la începutul pasiunii pentru apă",
    quote: "De mici pe mal, cu undița în mână.",
    aspect: "aspect-[3/4]",
    focus: "object-[center_72%]",
  },
  {
    id: "02",
    title: "LyraBaits prinde contur",
    body: "Din orele petrecute la legat s-a născut LyraBaits. Am lansat firma ca un atelier de monturi și forfacuri, făcute cu aceeași grijă cu care le pregătim și pentru propriile partide. Fiecare piesă pleacă din experiența de pe apă: simplă, sigură și gândită pentru pescuitul la crap.",
    image: "/despre_noi_2.jpeg",
    alt: "Pescar LyraBaits ținând un crap, la apus, pe malul apei",
    quote: "Monturi și forfacuri legate cum le vrem și noi pe fir.",
    aspect: "aspect-[4/3]",
    focus: "object-center",
  },
  {
    id: "03",
    title: "Un hub pentru pescari",
    body: "Acum ducem LyraBaits mai departe de atelier. Vrem un hub pentru pescari: produse alese, știri din lumea apei și emisiuni video. Magazinul rămâne inima, iar în jurul lui crește un loc în care găsești echipament, povești și oameni care stau ei înșiși pe mal.",
    image: "/despre_noi_3.jpeg",
    alt: "Echipa LyraBaits pe barcă, cu câțiva crapi prinși împreună",
    quote: "Produse alese, știri și emisiuni, într-un singur loc.",
    aspect: "aspect-[4/3]",
    focus: "object-center",
  },
] as const;

export default function PovesteaNoastraPage() {
  return (
    <div>
      <section className="surface-depth relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 grain-overlay opacity-35" aria-hidden />
        <div className="container-lyra relative max-w-3xl">
          <Reveal>
            <p className="font-hand mb-3 text-3xl text-sand">Trei pași</p>
            <h1 className="mb-4 font-display text-5xl tracking-wide md:text-7xl">
              Povestea noastră
            </h1>
            <p className="text-cream/80 md:text-lg">
              De la malul apei, la un atelier de monturi, și mai departe către un loc
              făcut pentru pescari. Aceeași pasiune, spusă în trei pași.
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
                Pasul {chapter.id}
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
              <div className={`relative overflow-hidden rounded-2xl bg-depth shadow-soft ${chapter.aspect}`}>
                <Image
                  src={chapter.image}
                  alt={chapter.alt}
                  fill
                  sizes="(min-width: 1024px) 40rem, 100vw"
                  className={`object-cover ${chapter.focus}`}
                  priority={index === 0}
                />
              </div>
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
