"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, ShoppingCart, Package, Settings, Plus } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Analytics", icon: BarChart2 },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      router.push("/");
      return;
    }
    setTimeout(() => {
  setAuthorized(true);
  setChecking(false);
}, 0);
     
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <aside className="w-56 shrink-0 bg-[var(--surface)] border-r border-gray-200 dark:border-gray-800 flex flex-col justify-between py-6 px-3 sticky top-0 h-screen">
        <div>
          <div className="px-3 mb-6">
            <h2 className="text-lg font-bold text-[var(--primary)]">E-Sotuv Admin</h2>
          </div>

          <div className="flex items-center gap-3 px-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-sm font-bold text-white">
              A
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text)]">Admin User</p>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Platform Manager</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                      : "text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[var(--text)]"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings size={18} />
            Settings
          </Link>
          <Link
            href="/dashboard/products"
            className="flex items-center justify-center gap-2 mx-2 py-2.5 bg-[var(--primary)] text-white rounded-xl text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors"
          >
            <Plus size={16} />
            New Product
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}