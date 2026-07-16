import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-gray-200 dark:border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[var(--primary)]">E-Sotuv</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              The leading platform for high-performance essentials and corporate lifestyle gear. Engineered for excellence.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors text-sm">
                🌐
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors text-sm">
                📤
              </button>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wide">Shop</h4>
            <div className="flex flex-col gap-2">
              <Link href="/products" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">All Products</Link>
              <Link href="/products?sort=popular" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Top Categories</Link>
              <Link href="/products?badge=bestseller" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Bestsellers</Link>
              <Link href="/products?sort=newest" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">New Arrivals</Link>
            </div>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wide">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Order Status</Link>
              <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Returns & Exchanges</Link>
              <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Shipping Policy</Link>
              <Link href="#" className="text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Help Center</Link>
            </div>
          </div>

          {/* Office */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-[var(--text)] uppercase tracking-wide">Office</h4>
            <div className="flex flex-col gap-2">
              <p className="text-sm text-[var(--text-muted)]">124 Innovation Way</p>
              <p className="text-sm text-[var(--text-muted)]">Silicon District</p>
              <p className="text-sm text-[var(--text-muted)]">Tashkent, Uzbekistan</p>
              <a href="mailto:support@e-sotuv.com" className="text-sm text-[var(--primary)] hover:underline mt-1">
                support@e-sotuv.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)]">© 2024 E-Sotuv Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}