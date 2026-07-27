import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--surface)] border-t border-gray-200 dark:border-gray-800 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Ustunlar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-16 text-left">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="text-xl font-bold tracking-tight text-[var(--primary)] hover:opacity-80 transition-opacity"
            >
              E-Sotuv
            </Link>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-xs">
              The leading platform for high-performance essentials and corporate lifestyle gear. Engineered for excellence.
            </p>
          </div>

          {/* SHOP */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Shop
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <Link href="/products" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                All Products
              </Link>
              <Link href="/products?category=electronics" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                Top Categories
              </Link>
              <Link href="/products?sort=bestseller" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                Bestsellers
              </Link>
              <Link href="/products?sort=newest" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                New Arrivals
              </Link>
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Account
            </h4>
            <div className="flex flex-col gap-2.5 text-xs">
              <Link href="/cart" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                Cart
              </Link>
              <Link href="/dashboard" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors">
                Create Account
              </Link>
            </div>
          </div>

          {/* OFFICE & TELEGRAM */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-semibold text-[var(--text)] uppercase tracking-wider">
              Office
            </h4>
            <div className="flex flex-col gap-1.5 text-xs text-[var(--text-muted)]">
              <p>124 Innovation Way</p>
              <p>Silicon District</p>
              <p>Jizzax, Uzbekistan</p>
            </div>

            {/* Telegram - Ranglar to'g'rilandi (Aniq, tiniq va kontrastli) */}
            <div className="mt-2">
              <a
                href="https://t.me/shoxnursafarov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--primary)] text-white hover:opacity-90 text-xs font-medium transition-all shadow-sm"
              >
                <span>💬</span>
                <span>@shoxnursafarov</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© 2026 E-Sotuv Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-[var(--primary)] transition-colors cursor-pointer">
              Terms of Service
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}