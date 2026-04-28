import Image from "next/image";
import Link from "next/link";
import type { ProductCategory } from "@/data/catalog";

export function CategoryCard({
  category,
  productCount,
}: {
  category: ProductCategory;
  productCount: number;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--lake)]">
      <Link href={`/categorii/${category.slug}`} className="group block">
        <div className="relative aspect-[4/3]">
          <Image
            src={category.heroImage}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        </div>
        <div className="space-y-2 p-5">
          <h2 className="text-xl font-semibold text-[var(--cream)]">{category.name}</h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{category.description}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent-light)]">
            {productCount} produse
          </p>
        </div>
      </Link>
    </article>
  );
}
