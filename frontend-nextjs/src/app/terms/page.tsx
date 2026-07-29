export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-6">Foydalanish shartlari</h1>
            <div className="flex flex-col gap-4 text-sm text-[var(--text-muted)] leading-relaxed">
                <p>
                    E-Sotuv platformasidan foydalanish orqali siz quyidagi shartlarga rozilik
                    bildirasiz. Bu — namoyish (demo) loyiha bo&apos;lib, haqiqiy tijorat maqsadida
                    ishlatilmaydi.
                </p>
                <p>
                    Saytdagi barcha mahsulotlar, narxlar va buyurtmalar test ma&apos;lumotlaridir.
                    Checkout orqali amalga oshirilgan xaridlar real to&apos;lovni talab qilmaydi va
                    haqiqiy yetkazib berish amalga oshirilmaydi.
                </p>
                <p>
                    Platforma &quot;qanday bo&apos;lsa shunday&quot; taqdim etiladi, va uning uzluksiz
                    yoki xatosiz ishlashi kafolatlanmaydi.
                </p>
                <p>
                    Savollaringiz bo&apos;lsa,{" "}
                    <a href="https://t.me/shoxnursafarov" target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                        @shoxnursafarov
                    </a>{" "}
                    orqali Telegram&apos;da bog&apos;lanishingiz mumkin.
                </p>
            </div>
        </div>
    );
}