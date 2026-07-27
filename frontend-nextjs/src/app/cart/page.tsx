"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 500000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center gap-6">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-2xl font-bold text-[var(--text)]">Savatcha bo&apos;sh</h2>
        <p className="text-[var(--text-muted)]">Hali hech narsa qo&apos;shilmagan</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-colors"
        >
          Xarid qilishni boshlash
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--text)]">Savatcha</h1>
        <button
          onClick={clearCart}
          className="text-sm text-[var(--text-muted)] hover:text-[var(--error)] transition-colors flex items-center gap-1"
        >
          <Trash2 size={14} />
          Barchasini o&apos;chirish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="bg-[var(--surface)] rounded-xl p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
            >
              {/* Image + Info */}
              <div className="flex gap-4 items-center min-w-0">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--primary)] font-medium mb-0.5">{item.product.brand}</p>
                  <h3 className="text-sm font-semibold text-[var(--text)] truncate">{item.product.name}</h3>
                  <p className="text-sm font-bold text-[var(--text)] mt-1">{formatPrice(item.product.price)}</p>
                </div>
              </div>

              {/* Controls: Quantity + Total + Delete (Mobilda pastki qatorda) */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800">
                {/* Quantity */}
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    −
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-medium border-x border-gray-200 dark:border-gray-700">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    +
                  </button>
                </div>

                {/* Total + Delete */}
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-bold text-[var(--text)] whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-400 hover:text-[var(--error)] transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--surface)] rounded-xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[var(--text)] mb-6">Buyurtma xulosasi</h2>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Jami ({items.length} ta mahsulot)</span>
                <span className="text-[var(--text)] font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Yetkazib berish</span>
                <span className={shipping === 0 ? "text-[var(--success)] font-medium" : "text-[var(--text)] font-medium"}>
                  {shipping === 0 ? "Bepul" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[var(--text-muted)]">
                  {formatPrice(500000 - subtotal)} dan ko&apos;p sotib olsangiz yetkazib berish bepul
                </p>
              )}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                <span className="font-bold text-[var(--text)]">Umumiy</span>
                <span className="font-bold text-[var(--text)]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Promo kod"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
              />
              <button className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
                Qo&apos;llash
              </button>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-hover)] transition-colors"
            >
              Buyurtma berish
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/products"
              className="flex items-center justify-center w-full py-3 mt-3 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
            >
              Xaridni davom ettirish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}