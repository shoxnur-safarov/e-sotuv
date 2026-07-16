"use client";

export default function CheckoutError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-[var(--error)]">Xatolik yuz berdi</h2>
      <p className="text-[var(--text-muted)]">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
      >
        Qayta urinish
      </button>
    </div>
  );
}