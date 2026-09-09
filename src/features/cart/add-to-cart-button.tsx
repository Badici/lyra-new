"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";

type Props = {
  productId: string;
  slug: string;
  name: string;
  priceBani: number;
  stockQuantity: number;
  className?: string;
};

export function AddToCartButton({
  productId,
  slug,
  name,
  priceBani,
  stockQuantity,
  className,
}: Props) {
  const { addItem } = useCart();
  const [pending, setPending] = useState(false);

  return (
    <Button
      variant="accent"
      size="lg"
      className={className}
      disabled={pending}
      onClick={() => {
        setPending(true);
        addItem({ productId, slug, name, priceBani, stockQuantity });
        toast.success(`${name} a fost adăugat în coș`);
        setPending(false);
      }}
    >
      Adaugă în coș
    </Button>
  );
}
