"use client";

import { useCartStore } from "@/store/cartStore";

export default function CartBadge() {
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  if (count === 0) return null;

  return (
    <span className="bg-white text-[var(--primary)] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {count}
    </span>
  );
}