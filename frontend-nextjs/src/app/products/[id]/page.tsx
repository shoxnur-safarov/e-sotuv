"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ShoppingCart, Star, ArrowLeft, Shield, Truck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  brand: string;
  badge: string | null;
  description: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id;
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
        reviews: 0,
        brand: product.brand,
        stock: product.stock,
        badge: product.badge,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-6xl font-bold text-[var(--primary)]">404</h1>
        <p className="text-xl text-[var(--text-muted)]">Mahsulot topilmadi</p>
        <Link href="/products" className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors">
          Mahsulotlarga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Mahsulotlarga qaytish
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.badge && (
            <span className={`absolute top-4 left-4 px-3 py-1 text-white text-xs font-semibold rounded-full ${product.badge === "SALE" ? "bg-[var(--error)]" : product.badge === "NEW" ? "bg-blue-500" : "bg-[var(--success)]"}`}>
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium text-[var(--primary)] mb-1">{product.brand}</p>
            <h1 className="text-3xl font-bold text-[var(--text)] mb-3">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= Math.round(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-[var(--text)]">{product.rating}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[var(--text)]">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-[var(--text-muted)] leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? "bg-[var(--success)]" : product.stock > 0 ? "bg-[var(--warning)]" : "bg-[var(--error)]"}`} />
            <span className="text-sm text-[var(--text-muted)]">
              {product.stock > 5 ? "Mavjud" : product.stock > 0 ? `Faqat ${product.stock} ta qoldi` : "Tugagan"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-[var(--text)]">Miqdor:</span>
            <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                −
              </button>
              <span className="w-10 h-10 flex items-center justify-center text-sm font-medium border-x border-gray-200 dark:border-gray-700">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-base transition-all ${
              added
                ? "bg-[var(--success)] text-white"
                : "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <ShoppingCart size={20} />
            {added ? "Savatchaga qo'shildi ✓" : "Savatchaga qo'shish"}
          </button>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col items-center gap-2 text-center">
              <Truck size={20} className="text-[var(--primary)]" />
              <span className="text-xs text-[var(--text-muted)]">Bepul yetkazib berish</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <Shield size={20} className="text-[var(--primary)]" />
              <span className="text-xs text-[var(--text-muted)]">2 yil kafolat</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <RefreshCw size={20} className="text-[var(--primary)]" />
              <span className="text-xs text-[var(--text-muted)]">30 kun qaytarish</span>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}