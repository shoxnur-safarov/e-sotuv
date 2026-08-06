"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { RefreshCw } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface MonthlyRevenue {
  month: string;
  revenue: string;
}

interface Analytics {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  inStock: number;
  monthlyRevenue: MonthlyRevenue[];
}

export default function DashboardPage() {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("Bu bo'limni ko'rish uchun ruxsatingiz yo'q.");
        } else {
          setError("Ma'lumotlarni yuklashda xatolik yuz berdi.");
        }
        setAnalytics(null);
        return;
      }

      const data = await res.json();
      setAnalytics(data);
    } catch  {
      setError("Server bilan bog'lanishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      fetchAnalytics();
    }, 0);
  }, []);

  const chartData = analytics?.monthlyRevenue.map((m) => ({
    month: m.month,
    revenue: Number(m.revenue),
  })) || [];

  const stats = analytics
    ? [
      { label: "Total Users", value: analytics.totalUsers.toLocaleString() },
      { label: "Total Orders", value: analytics.totalOrders.toLocaleString() },
      { label: "Revenue", value: formatPrice(analytics.revenue) },
      { label: "In Stock", value: analytics.inStock.toLocaleString() },
    ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-[var(--text)] font-semibold">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="mt-2 px-5 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-hover)] transition-colors"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Dashboard Overview</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Real-time performance analytics for E-Sotuv marketplace.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-[var(--surface)] rounded-xl p-5">
            <p className="text-xs text-[var(--text-muted)] mb-2">{stat.label}</p>
            <p className="text-2xl font-bold text-[var(--text)]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--surface)] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">Revenue Analytics</h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Oylik daromad</p>
          </div>
          <button
            onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
            className="px-3 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            {chartType === "line" ? "Bar" : "Line"}
          </button>
        </div>
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-[var(--text-muted)]">
            Hali ma&apos;lumot yo&apos;q
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            {chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [formatPrice(Number(value)), "Revenue"]} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#16A34A" strokeWidth={2} dot={false} name="Revenue" />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => [formatPrice(Number(value)), "Revenue"]} />
                <Legend />
                <Bar dataKey="revenue" fill="#16A34A" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}