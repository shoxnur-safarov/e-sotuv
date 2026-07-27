"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ShoppingCart, Search, Bell, User, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect, useRef, Suspense } from "react";
import CartBadge from "@/components/CartBadge";

interface UserData {
  id: number;
  email: string;
  role: string;
}

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Active link holatini aniqlash
  const categoryParam = searchParams.get("category");
  const dealsParam = searchParams.get("deals");

  const isDealsActive = pathname === "/products" && dealsParam === "true";
  const isCategoriesActive = pathname === "/products" && categoryParam === "all";
  const isShopActive = pathname === "/products" && !dealsParam && !categoryParam;

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    }, 0);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    router.push("/");
  };

  const getInitial = (email: string) => email.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[var(--primary)] shrink-0">
          E-Sotuv
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/products"
            className={`py-1 text-sm font-medium transition-colors border-b-2 ${isShopActive
              ? "border-[var(--primary)] text-[var(--primary)] font-semibold"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--primary)]"
              }`}
          >
            Shop
          </Link>

          <Link
            href="/products?category=all"
            className={`py-1 text-sm font-medium transition-colors border-b-2 ${isCategoriesActive
              ? "border-[var(--primary)] text-[var(--primary)] font-semibold"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--primary)]"
              }`}
          >
            Categories
          </Link>

          <Link
            href="/products?deals=true"
            className={`py-1 text-sm font-medium transition-colors border-b-2 ${isDealsActive
              ? "border-[var(--primary)] text-[var(--primary)] font-semibold"
              : "border-transparent text-[var(--text-muted)] hover:text-[var(--primary)]"
              }`}
          >
            Deals
          </Link>

          {user && (user.role === "ADMIN" || user.role === "MANAGER") && (
            <Link
              href="/dashboard"
              className={`py-1 text-sm font-medium transition-colors border-b-2 ${pathname.startsWith("/dashboard")
                ? "border-[var(--primary)] text-[var(--primary)] font-semibold"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--primary)]"
                }`}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Search size={20} className="text-[var(--text)]" />
          </button>

          {/* Notification */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex">
            <Bell size={20} className="text-[var(--text)]" />
          </button>

          {/* Profile */}
          {mounted && user ? (
            <div className="relative hidden md:block" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold hover:opacity-90 transition-opacity"
              >
                {getInitial(user.email)}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-[var(--surface)] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-semibold text-[var(--text)] truncate">{user.email}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{user.role}</p>
                  </div>
                  {(user.role === "ADMIN" || user.role === "MANAGER") && (
                    <Link
                      href="/dashboard"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2.5 text-sm text-[var(--text)] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      Admin panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--error)] hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden md:flex">
              <User size={20} className="text-[var(--text)]" />
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors text-sm font-medium"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Cart</span>
            <CartBadge />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  router.push(`/products?search=${searchQuery.trim()}`);
                  setSearchOpen(false);
                  setSearchQuery("");
                }
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-[var(--surface)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
            />
            <p className="text-xs text-[var(--text-muted)] mt-2">Enter bosib qidiring</p>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 px-4 py-2 flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          <Link
            href="/products"
            onClick={() => setMenuOpen(false)}
            className={`py-3 text-sm font-medium transition-colors ${isShopActive ? "text-[var(--primary)] font-semibold" : "text-[var(--text-muted)]"
              }`}
          >
            Shop
          </Link>
          <Link
            href="/products?category=all"
            onClick={() => setMenuOpen(false)}
            className={`py-3 text-sm font-medium transition-colors ${isCategoriesActive ? "text-[var(--primary)] font-semibold" : "text-[var(--text-muted)]"
              }`}
          >
            Categories
          </Link>
          <Link
            href="/products?deals=true"
            onClick={() => setMenuOpen(false)}
            className={`py-3 text-sm font-medium transition-colors ${isDealsActive ? "text-[var(--primary)] font-semibold" : "text-[var(--text-muted)]"
              }`}
          >
            Deals
          </Link>

          {mounted && user ? (
            <>
              {(user.role === "ADMIN" || user.role === "MANAGER") && (
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                  Admin panel
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="flex items-center gap-2 py-3 text-sm font-medium text-[var(--error)] text-left"
              >
                <LogOut size={15} />
                Chiqish
              </button>
            </>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)} className="py-3 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
              Kirish
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}