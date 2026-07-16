import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-[var(--primary)]">404</h1>
      <p className="text-xl text-[var(--text-muted)]">Sahifa topilmadi</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}