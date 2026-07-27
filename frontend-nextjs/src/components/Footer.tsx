import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800 bg-black py-12 text-sm text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Yuqori qism: Mobilda 2 ustun, kompyuterda 5 ustun */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          
          {/* Logo va Ta'rif */}
          <div className="col-span-2 md:col-span-2">
            <h2 className="text-xl font-bold tracking-tight text-red-600">
              E-Sotuv
            </h2>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-zinc-400">
              The leading platform for high-performance essentials and corporate lifestyle gear. Engineered for excellence.
            </p>
          </div>

          {/* SHOP */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Shop
            </h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/products" className="transition-colors hover:text-white">All Products</Link></li>
              <li><Link href="/products?category=top" className="transition-colors hover:text-white">Top Categories</Link></li>
              <li><Link href="/products?sort=bestsellers" className="transition-colors hover:text-white">Bestsellers</Link></li>
              <li><Link href="/products?sort=newest" className="transition-colors hover:text-white">New Arrivals</Link></li>
            </ul>
          </div>

          {/* ACCOUNT - Barcha 4 ta havola va to'g'ri routelar */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Account
            </h3>
            <ul className="mt-3 space-y-2">
              <li><Link href="/cart" className="transition-colors hover:text-white">Cart</Link></li>
              <li><Link href="/dashboard" className="transition-colors hover:text-white">Dashboard</Link></li>
              <li><Link href="/login" className="transition-colors hover:text-white">Sign In</Link></li>
              <li><Link href="/register" className="transition-colors hover:text-white">Create Account</Link></li>
            </ul>
          </div>

          {/* OFFICE */}
          <div className="col-span-2 sm:col-span-1 md:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Office
            </h3>
            <address className="mt-3 not-italic space-y-1 text-xs text-zinc-400">
              <p>124 Innovation Way</p>
              <p>Silicon District</p>
              <p>Jizzax, Uzbekistan</p>
            </address>
            <div className="mt-4">
              <a
                href="https://t.me/shoxnursafarov"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-red-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-800"
              >
                <span>💬</span> @shoxnursafarov
              </a>
            </div>
          </div>

        </div>

        {/* Chiziq */}
        <div className="mt-10 border-t border-zinc-800 pt-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs md:flex-row md:text-left">
          <p>© 2026 E-Sotuv Platform. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}