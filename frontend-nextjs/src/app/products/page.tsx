"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
}

const brands = ["Apple", "Samsung", "Sony", "Xiaomi"];
const brandColors: Record<string, string> = {
  Apple: "bg-gray-900",
  Samsung: "bg-green-700",
  Sony: "bg-red-800",
  Xiaomi: "bg-orange-500",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-sm ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
      ))}
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(10000000);
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    const urlBrand = searchParams.get("brand") || "";

    // Faqat shu ichki qismlarni xavfsiz o'raymiz:
    if (urlSearch) {
      setTimeout(() => {
        setSearch(urlSearch);
      }, 0);
    }

    if (urlBrand) {
      setTimeout(() => {
        setSelectedBrands([urlBrand]);
      }, 0);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (selectedBrands.length === 1) params.append("brand", selectedBrands[0]);
        if (maxPrice < 10000000) params.append("max_price", String(maxPrice));
        if (minRating > 0) params.append("rating", String(minRating));
        if (sort !== "default") {
          const sortMap: Record<string, string> = {
            "price-asc": "price_asc",
            "price-desc": "price_desc",
            rating: "rating",
          };
          params.append("sort", sortMap[sort] || "id");
        }
        params.append("limit", "50");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params}`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Mahsulotlarni yuklashda xatolik:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, selectedBrands, maxPrice, minRating, sort]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filtered = selectedBrands.length > 1
    ? products.filter((p) => selectedBrands.includes(p.brand))
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium"
          >
            Filtr
          </button>
          <p className="text-sm text-[var(--text-muted)]">{filtered.length} ta mahsulot</p>
        </div>

        <div className="flex items-center gap-3">
         <input
            type="text"
            placeholder="Qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors w-48"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
          >
            <option value="default">Saralash</option>
            <option value="price-asc">Narx: past → yuqori</option>
            <option value="price-desc">Narx: yuqori → past</option>
            <option value="rating">Reyting bo&apos;yicha</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
          <div className="mb-8">
            <h3 className="font-semibold text-[var(--text)] mb-4">Narx Oralig&apos;i</h3>
            <input
              type="range"
              min={0}
              max={10000000}
              step={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#8B0000]"
            />
            <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
              <span>0 so&apos;m</span>
              <span>{(maxPrice / 1000000).toFixed(1)}M so&apos;m</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-[var(--text)] mb-4">Brendlar</h3>
            <div className="flex flex-col gap-3">
              {brands.map((brand) => (
                <label key={brand} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 accent-[#8B0000] rounded"
                    />
                    <span className="text-sm text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{brand}</span>
                  </div>
                  <span className={`w-3 h-3 rounded-full ${brandColors[brand]}`} />
                </label>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-[var(--text)] mb-4">Reyting</h3>
            <div className="flex flex-col gap-2">
              {[4, 3, 2, 0].map((r) => (
                <label key={r} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={minRating === r}
                    onChange={() => setMinRating(r)}
                    className="accent-[#8B0000]"
                  />
                  <div className="flex items-center gap-1">
                    {r === 0 ? (
                      <span className="text-sm text-[var(--text-muted)]">Barchasi</span>
                    ) : (
                      <>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-sm ${s <= r ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                        ))}
                        <span className="text-xs text-[var(--text-muted)] ml-1">va yuqori</span>
                      </>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {(selectedBrands.length > 0 || minRating > 0 || maxPrice < 10000000) && (
            <button
              onClick={() => { setSelectedBrands([]); setMinRating(0); setMaxPrice(10000000); }}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Filtrni tozalash
            </button>
          )}
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[var(--surface)] rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
                  <div className="p-3 flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-4xl">🔍</p>
              <p className="text-[var(--text-muted)]">Mahsulot topilmadi</p>
              <button
                onClick={() => { setSelectedBrands([]); setMinRating(0); setMaxPrice(10000000); setSearch(""); }}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Filtrni tozalash
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-[var(--surface)] rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className={`absolute top-3 left-3 px-2 py-0.5 text-white text-xs font-semibold rounded ${product.badge === "SALE" ? "bg-[var(--error)]" : product.badge === "NEW" ? "bg-blue-500" : "bg-[var(--success)]"}`}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-[var(--text)] leading-tight mb-1">{product.name}</h3>
                    <StarRating rating={product.rating} />
                    <p className="text-sm font-bold text-[var(--primary)] mt-2">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}