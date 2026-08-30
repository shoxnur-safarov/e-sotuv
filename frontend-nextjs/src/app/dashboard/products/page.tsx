"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  category: string;
  stock: number;
  image: string;
  badge: string | null;
  rating: number;
}

const emptyForm = { name: "", price: "", brand: "Apple", category: "Watches", stock: "", image: "", badge: "", rating: "" };

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=100`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      console.error("Mahsulotlar yuklanmadi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchProducts();
    }, 0);
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      brand: product.brand,
      category: product.category,
      stock: String(product.stock),
      image: product.image,
      badge: product.badge || "",
      rating: String(product.rating || ""),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) return;
    setSaving(true);
    const token = localStorage.getItem("token");
    const body = {
      name: form.name,
      price: Number(form.price),
      brand: form.brand,
      stock: Number(form.stock),
      image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
      badge: form.badge || null,
      rating: Number(form.rating) || 0,
      category: form.category,
      description: `${form.name} — sifatli mahsulot.`,
    };

    try {
      if (editProduct) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${editProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      } else {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Saqlashda xatolik:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      console.error("O'chirishda xatolik:", err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Mahsulotlar</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{products.length} ta mahsulot</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
        >
          <Plus size={16} />
          Yangi mahsulot
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Mahsulot yoki brend qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[var(--surface)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Mahsulot</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Brend</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Narx</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Stok</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Badge</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
                        </div>
                        <span className="font-medium text-[var(--text)]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)]">{product.brand}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--text)]">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${product.stock <= 5 ? "text-[var(--error)]" : product.stock <= 10 ? "text-[var(--warning)]" : "text-[var(--success)]"}`}>
                        {product.stock} ta
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.badge ? (
                        <Badge variant={product.badge === "SALE" ? "error" : product.badge === "NEW" ? "default" : "success"}>
                          {product.badge}
                        </Badge>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-[var(--error)] transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-[var(--text-muted)]">
                Mahsulot topilmadi
              </div>
            )}
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-[var(--surface)] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">
                {editProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text)]">Nom</label>
                <input
                  type="text"
                  placeholder="Mahsulot nomi"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--text)]">Narx (so&apos;m)</label>
                  <input
                    type="number"
                    placeholder="299000"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--text)]">Stok</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--text)]">Reyting (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--text)]">Brend</label>
                  <select
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                  >
                    {["Apple", "Samsung", "Sony", "Xiaomi"].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text)]">Kategoriya</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                >
                  {["Watches", "Audio", "Laptops", "Tablets", "Keyboards", "Accessories"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text)]">Badge</label>
                <select
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                >
                  <option value="">Yo&apos;q</option>
                  <option value="NEW">NEW</option>
                  <option value="SALE">SALE</option>
                  <option value="BESTSELLER">BESTSELLER</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--text)]">Rasm URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-[var(--text)] hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60"
              >
                {saving ? "Saqlanmoqda..." : editProduct ? "Saqlash" : "Qo'shish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-[var(--surface)] rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-[var(--error)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--text)] mb-2">O&apos;chirishni tasdiqlang</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">Bu mahsulot butunlay o&apos;chiriladi. Bu amalni qaytarib bo&apos;lmaydi.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-[var(--error)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                O&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}