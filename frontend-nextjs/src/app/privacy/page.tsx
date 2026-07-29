export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h1 className="text-3xl font-bold text-[var(--text)] mb-6">Maxfiylik siyosati</h1>
            <div className="flex flex-col gap-4 text-sm text-[var(--text-muted)] leading-relaxed">
                <p>
                    E-Sotuv — bu portfolio maqsadida yaratilgan namoyish loyihasi. Ushbu sahifada saytdan
                    foydalanish davomida to&apos;planadigan ma&apos;lumotlar haqida umumiy tushuncha berilgan.
                </p>
                <p>
                    Ro&apos;yxatdan o&apos;tishda kiritilgan email va boshqa shaxsiy ma&apos;lumotlar faqat
                    ushbu platforma doirasida (autentifikatsiya va buyurtmalarni bog&apos;lash uchun)
                    ishlatiladi va uchinchi shaxslarga uzatilmaydi.
                </p>
                <p>
                    Checkout jarayonidagi to&apos;lov ma&apos;lumotlari (karta raqami) real bank tizimiga
                    yuborilmaydi — bu funksiya faqat interfeysni namoyish qilish uchun simulyatsiya
                    qilingan.
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