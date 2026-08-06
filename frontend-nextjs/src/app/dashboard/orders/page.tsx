"use client";

import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: string;
  name: string;
  image: string;
}

interface Order {
  id: string;
  user_id: number;
  customer_email: string;
  total_amount: string;
  status: "PENDING" | "SHIPPED" | "DELIVERED";
  created_at: string;
  items?: OrderItem[];
}

const statusOptions = ["PENDING", "SHIPPED", "DELIVERED"] as const;

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("Bu bo'limni ko'rish uchun ruxsatingiz yo'q.");
        } else {
          setError("Buyurtmalarni yuklashda xatolik yuz berdi.");
        }
        setOrders([]);
        return;
      }

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setError("Server bilan bog'lanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  setTimeout(() => {
     fetchOrders();
  }, 0);
}, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_email?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openOrderDetail = async (order: Order) => {
    setSelectedOrder(order);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedOrder(data);
    } catch (err) {
      console.error("Buyurtma detail yuklanmadi:", err);
    }
  };

  const updateStatus = async (id: string, status: Order["status"]) => {
    setUpdating(true);
    const token = localStorage.getItem("token");
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      if (selectedOrder?.id === id) {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err) {
      console.error("Status yangilashda xatolik:", err);
    } finally {
      setUpdating(false);
    }
  };

  const getBadgeVariant = (status: string) => {
    if (status === "DELIVERED") return "success";
    if (status === "SHIPPED") return "default";
    return "warning";
  };

  const stats = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "PENDING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text)]">Buyurtmalar</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Barcha buyurtmalarni boshqaring</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Jami", value: stats.all, color: "text-[var(--text)]" },
          { label: "Kutilmoqda", value: stats.pending, color: "text-[var(--warning)]" },
          { label: "Yo'lda", value: stats.shipped, color: "text-blue-500" },
          { label: "Yetkazildi", value: stats.delivered, color: "text-[var(--success)]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[var(--surface)] rounded-xl p-4">
            <p className="text-xs text-[var(--text-muted)] mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Buyurtma ID yoki email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
        />
        <div className="flex items-center gap-2">
          {["ALL", ...statusOptions].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                filterStatus === s
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "border-gray-200 dark:border-gray-700 text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
              }`}
            >
              {s === "ALL" ? "Barchasi" : s === "PENDING" ? "Kutilmoqda" : s === "SHIPPED" ? "Yo'lda" : "Yetkazildi"}
            </button>
          ))}
        </div>
      </div>

       {error ? (
        <div className="flex flex-col items-center justify-center h-64 text-center gap-3 bg-[var(--surface)] rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-[var(--text)] font-semibold">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 px-5 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[var(--surface)] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Mijoz</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase hidden md:table-cell">Sana</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase">Summa</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[var(--text-muted)] uppercase">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-muted)]">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--text)]">{order.customer_email}</p>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)] hidden md:table-cell">
                      {new Date(order.created_at).toLocaleDateString("uz-UZ")}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getBadgeVariant(order.status)}>
                        {order.status === "PENDING" ? "Kutilmoqda" : order.status === "SHIPPED" ? "Yo'lda" : "Yetkazildi"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-[var(--text)]">{formatPrice(Number(order.total_amount))}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => openOrderDetail(order)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-[var(--text-muted)]">
                Buyurtma topilmadi
              </div>
            )}
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-[var(--surface)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--text)]">Buyurtma {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-[var(--text-muted)] hover:text-[var(--text)]">
                <X size={20} />
              </button>
            </div>

            <div className="bg-[var(--background)] rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-[var(--text)] mb-1">{selectedOrder.customer_email}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {new Date(selectedOrder.created_at).toLocaleDateString("uz-UZ")}
              </p>
            </div>

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Mahsulotlar</h3>
                <div className="flex flex-col gap-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-[var(--text)]">{item.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">Miqdor: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[var(--text)]">{formatPrice(Number(item.price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Umumiy summa</h3>
              <p className="text-2xl font-bold text-[var(--text)]">{formatPrice(Number(selectedOrder.total_amount))}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Statusni o&apos;zgartirish</h3>
              <div className="flex gap-2">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(selectedOrder.id, s)}
                    disabled={updating}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 ${
                      selectedOrder.status === s
                        ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                        : "border-gray-200 dark:border-gray-700 text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    {s === "PENDING" ? "Kutilmoqda" : s === "SHIPPED" ? "Yo'lda" : "Yetkazildi"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}