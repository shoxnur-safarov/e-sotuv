"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, X, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  badge: string | null;
}

const brands = ["Apple", "Samsung", "Sony", "Xiaomi"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`text-sm ${star <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", company: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [sendingContact, setSendingContact] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=4`);
        const data = await res.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Mahsulotlar yuklanmadi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleJoin = () => {
    if (!email || !email.includes("@")) return;
    setJoinSuccess(true);
    setEmail("");
    setTimeout(() => setJoinSuccess(false), 3000);
  };

  const handleContact = async () => {
    if (!contactForm.name || !contactForm.email || sendingContact) return;
    setSendingContact(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      setContactSuccess(true);
      setTimeout(() => {
        setContactSuccess(false);
        setShowContactModal(false);
        setContactForm({ name: "", email: "", company: "", message: "" });
      }, 2000);
    } catch (err) {
      console.error("Xabar yuborishda xatolik:", err);
    } finally {
      setSendingContact(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[560px] flex items-end overflow-hidden bg-gray-900">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&h=600&fit=crop"
            alt="Hero"
            fill
            sizes="100vw"
            className="object-cover opacity-60"
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 pb-16 pt-32">
          <p className="text-xs font-semibold text-[var(--primary)] uppercase tracking-widest mb-3">
            New Collection 2024
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 max-w-xl">
            Elevate Your Daily{" "}
            <span className="text-[var(--primary)]">Performance.</span>
          </h1>
          <p className="text-gray-300 text-base max-w-md mb-8 leading-relaxed">
            Discover our curated selection of high-fidelity technology and lifestyle essentials designed for the modern professional.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/products" className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-colors">
              Shop Now
            </Link>
            <Link href="/products" className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white hover:text-gray-900 transition-colors">
              View Lookbook
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="border-b border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs text-center text-[var(--text-muted)] uppercase tracking-widest mb-6">
            Trusted by Industry Leaders
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            {brands.map((brand) => (
              <Link
                key={brand}
                href={`/products?brand=${brand}`}
                className="text-lg font-bold text-gray-400 hover:text-[var(--primary)] transition-colors"
              >
                {brand}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)]">Featured Products</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">Our most popular selections this month</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline font-medium">
            View all items <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[var(--surface)] rounded-xl overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
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
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-[var(--success)] text-white text-xs font-semibold rounded">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--text)] leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-1 mt-2">
                    <StarRating rating={product.rating} />
                  </div>
                  <p className="text-sm font-bold text-[var(--primary)] mt-2">{formatPrice(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA + Enterprise */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Newsletter */}
          <div className="md:col-span-2 bg-[var(--primary)] rounded-2xl p-8 flex flex-col gap-4">
            <h3 className="text-2xl font-bold text-white">Join the Inner Circle.</h3>
            <p className="text-sm text-red-200 leading-relaxed">
              Subscribe to get early access to new collections and exclusive corporate events. No spam, only precision.
            </p>
            {joinSuccess ? (
              <div className="flex items-center gap-2 text-white font-medium">
                <CheckCircle size={20} />
                Muvaffaqiyatli obuna bo&apos;ldingiz!
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-red-200 outline-none focus:border-white transition-colors text-sm"
                />
                <button
                  onClick={handleJoin}
                  className="px-5 py-2.5 bg-white text-[var(--primary)] rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  Join
                </button>
              </div>
            )}
          </div>

          {/* Enterprise */}
          <div className="bg-emerald-50 dark:bg-emerald-950 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center">
            <Shield size={32} className="text-emerald-600" />
            <h4 className="font-bold text-[var(--text)]">Enterprise Grade</h4>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              Bulk orders and corporate gifting options available for teams of all sizes.
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              className="text-sm font-semibold text-emerald-600 hover:underline mt-1"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Contact Sales Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-[var(--surface)] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">Sales bilan bog&apos;lanish</h2>
              <button
                onClick={() => { setShowContactModal(false); setContactSuccess(false); }}
                className="text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                <X size={20} />
              </button>
            </div>

            {contactSuccess ? (
              <div className="flex flex-col items-center gap-4 py-8">
                <CheckCircle size={48} className="text-[var(--success)]" />
                <p className="text-lg font-semibold text-[var(--text)]">Xabaringiz yuborildi!</p>
                <p className="text-sm text-[var(--text-muted)]">Tez orada siz bilan bog&apos;lanamiz.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--text)]">Ism</label>
                    <input
                      type="text"
                      placeholder="Jasur"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[var(--text)]">Email</label>
                    <input
                      type="email"
                      placeholder="email@company.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text)]">Kompaniya</label>
                  <input
                    type="text"
                    placeholder="Kompaniya nomi"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text)]">Xabar</label>
                  <textarea
                    placeholder="Qanday miqdorda buyurtma bermoqchisiz?"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Bekor qilish
                  </button>
                  <button
                    onClick={handleContact}
                    disabled={sendingContact}
                    className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60"
                  >
                    {sendingContact ? "Yuborilmoqda..." : "Yuborish"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}