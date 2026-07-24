"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";

const shippingSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta harf"),
  lastName: z.string().min(2, "Familiya kamida 2 ta harf"),
  address: z.string().min(5, "Manzil kamida 5 ta harf"),
  city: z.string().min(2, "Shahar nomini kiriting"),
  postalCode: z.string().min(4, "Pochta indeksini kiriting"),
  email: z.string().email("Yaroqli email manzil kiriting"),
  phone: z.string().min(9, "Telefon raqamini kiriting"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Karta raqamini to'liq kiriting"),
  cardName: z.string().min(2, "Karta egasining ismini kiriting"),
  expiry: z.string().min(5, "Amal qilish muddatini kiriting"),
  cvv: z.string().min(3, "CVV kodni kiriting"),
});

type ShippingData = z.infer<typeof shippingSchema>;
type PaymentData = z.infer<typeof paymentSchema>;
type Errors = Partial<Record<string, string>>;

const steps = ["Yetkazib berish", "To'lov", "Tasdiqlash"];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const [shipping, setShipping] = useState<ShippingData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
  });

  const [payment, setPayment] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const [shippingErrors, setShippingErrors] = useState<Errors>({});
  const [paymentErrors, setPaymentErrors] = useState<Errors>({});

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = subtotal > 500000 ? 0 : 30000;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shippingCost - discount;

  const validateShipping = () => {
    const result = shippingSchema.safeParse(shipping);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach((e) => {
        if (e.path[0]) errs[e.path[0] as string] = e.message;
      });
      setShippingErrors(errs);
      return false;
    }
    setShippingErrors({});
    return true;
  };

  const validatePayment = () => {
    const result = paymentSchema.safeParse(payment);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach((e) => {
        if (e.path[0]) errs[e.path[0] as string] = e.message;
      });
      setPaymentErrors(errs);
      return false;
    }
    setPaymentErrors({});
    return true;
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setOrderError("Buyurtma berish uchun avval tizimga kiring");
      router.push("/login");
      return;
    }

    setPlacing(true);
    setOrderError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          totalAmount: total,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setOrderError(data.message || "Buyurtma berishda xatolik");
        return;
      }

      setOrderPlaced(true);
      clearCart();
    } catch {
      setOrderError("Server bilan ulanishda xatolik");
    } finally {
      setPlacing(false);
    }
  };

  const handleNext = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment()) return;
    if (step === 2) {
      placeOrder();
      return;
    }
    setStep((s) => s + 1);
  };

  const formatCardNumber = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    return val.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/");
  };

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-6 text-center">
        <CheckCircle size={72} className="text-[var(--success)]" />
        <h1 className="text-3xl font-bold text-[var(--text)]">Buyurtma qabul qilindi!</h1>
        <p className="text-[var(--text-muted)]">
          Buyurtmangiz muvaffaqiyatli joylashtirildi. Tez orada email orqali xabar beramiz.
        </p>
        <Link
          href="/products"
          className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-hover)] transition-colors"
        >
          Xaridni davom ettirish
        </Link>
      </div>
    );
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
        <p className="text-[var(--text-muted)]">Savatcha bo&apos;sh</p>
        <Link href="/products" className="px-6 py-3 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-hover)] transition-colors">
          Xarid qilish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i <= step
                    ? "bg-[var(--primary)] text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-[var(--text-muted)]"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  i <= step ? "text-[var(--text)]" : "text-[var(--text-muted)]"
                }`}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-2 transition-colors ${i < step ? "bg-[var(--primary)]" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-[var(--surface)] rounded-2xl p-6">
            {step === 0 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--text)] mb-6">Yetkazib berish manzili</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "firstName", label: "Ism", placeholder: "Jasur" },
                    { key: "lastName", label: "Familiya", placeholder: "Karimov" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[var(--text)]">{label}</label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={shipping[key as keyof ShippingData]}
                        onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                        className={`px-4 py-2.5 rounded-lg border ${shippingErrors[key] ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                      />
                      {shippingErrors[key] && <p className="text-xs text-[var(--error)]">{shippingErrors[key]}</p>}
                    </div>
                  ))}

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-[var(--text)]">Manzil</label>
                    <input
                      type="text"
                      placeholder="Ko'cha, uy raqami"
                      value={shipping.address}
                      onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                      className={`px-4 py-2.5 rounded-lg border ${shippingErrors.address ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                    />
                    {shippingErrors.address && <p className="text-xs text-[var(--error)]">{shippingErrors.address}</p>}
                  </div>

                  {[
                    { key: "city", label: "Shahar", placeholder: "Toshkent" },
                    { key: "postalCode", label: "Pochta indeksi", placeholder: "100000" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[var(--text)]">{label}</label>
                      <input
                        type="text"
                        placeholder={placeholder}
                        value={shipping[key as keyof ShippingData]}
                        onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })}
                        className={`px-4 py-2.5 rounded-lg border ${shippingErrors[key] ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                      />
                      {shippingErrors[key] && <p className="text-xs text-[var(--error)]">{shippingErrors[key]}</p>}
                    </div>
                  ))}

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-[var(--text)]">Email</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className={`px-4 py-2.5 rounded-lg border ${shippingErrors.email ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                    />
                    {shippingErrors.email && <p className="text-xs text-[var(--error)]">{shippingErrors.email}</p>}
                  </div>

                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-sm font-medium text-[var(--text)]">Telefon</label>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className={`px-4 py-2.5 rounded-lg border ${shippingErrors.phone ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                    />
                    {shippingErrors.phone && <p className="text-xs text-[var(--error)]">{shippingErrors.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--text)] mb-6">To&apos;lov ma&apos;lumotlari</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[var(--text)]">Karta raqami</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={payment.cardNumber}
                      onChange={(e) => setPayment({ ...payment, cardNumber: formatCardNumber(e.target.value) })}
                      className={`px-4 py-2.5 rounded-lg border ${paymentErrors.cardNumber ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                    />
                    {paymentErrors.cardNumber && <p className="text-xs text-[var(--error)]">{paymentErrors.cardNumber}</p>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-[var(--text)]">Karta egasi</label>
                    <input
                      type="text"
                      placeholder="JASUR KARIMOV"
                      value={payment.cardName}
                      onChange={(e) => setPayment({ ...payment, cardName: e.target.value.toUpperCase() })}
                      className={`px-4 py-2.5 rounded-lg border ${paymentErrors.cardName ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                    />
                    {paymentErrors.cardName && <p className="text-xs text-[var(--error)]">{paymentErrors.cardName}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[var(--text)]">Amal qilish muddati</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: formatExpiry(e.target.value) })}
                        className={`px-4 py-2.5 rounded-lg border ${paymentErrors.expiry ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                      />
                      {paymentErrors.expiry && <p className="text-xs text-[var(--error)]">{paymentErrors.expiry}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-[var(--text)]">CVV</label>
                      <input
                        type="password"
                        placeholder="•••"
                        maxLength={3}
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                        className={`px-4 py-2.5 rounded-lg border ${paymentErrors.cvv ? "border-[var(--error)]" : "border-gray-200 dark:border-gray-700"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors`}
                      />
                      {paymentErrors.cvv && <p className="text-xs text-[var(--error)]">{paymentErrors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-[var(--text)] mb-6">Buyurtmani tasdiqlash</h2>
                {orderError && (
                  <div className="bg-red-50 border border-red-200 text-[var(--error)] text-sm rounded-lg px-4 py-3 mb-4">
                    {orderError}
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <div className="bg-[var(--background)] rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-[var(--text)] mb-2">Yetkazib berish manzili</h3>
                    <p className="text-sm text-[var(--text-muted)]">{shipping.firstName} {shipping.lastName}</p>
                    <p className="text-sm text-[var(--text-muted)]">{shipping.address}, {shipping.city}</p>
                    <p className="text-sm text-[var(--text-muted)]">{shipping.email}</p>
                    <p className="text-sm text-[var(--text-muted)]">{shipping.phone}</p>
                  </div>
                  <div className="bg-[var(--background)] rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-[var(--text)] mb-2">To&apos;lov</h3>
                    <p className="text-sm text-[var(--text-muted)]">**** **** **** {payment.cardNumber.slice(-4)}</p>
                    <p className="text-sm text-[var(--text-muted)]">{payment.cardName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                <ArrowLeft size={16} />
                Orqaga
              </button>
            ) : (
              <Link
                href="/cart"
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                <ArrowLeft size={16} />
                Savatchaga qaytish
              </Link>
            )}
            <button
              onClick={handleNext}
              disabled={placing}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-60"
            >
              {placing ? "Yuborilmoqda..." : step === 2 ? "Buyurtma berish" : "Davom etish"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[var(--surface)] rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[var(--text)] mb-4">Buyurtma xulosasi</h2>

            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <Image src={item.product.image} alt={item.product.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[var(--text)] truncate">{item.product.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">Miqdor: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-[var(--text)] shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Jami</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-muted)]">Yetkazib berish</span>
                <span className={shippingCost === 0 ? "text-[var(--success)] font-medium" : "font-medium"}>
                  {shippingCost === 0 ? "Bepul" : formatPrice(shippingCost)}
                </span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--success)]">Chegirma (10%)</span>
                  <span className="text-[var(--success)] font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-2 flex justify-between font-bold">
                <span>Umumiy</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {!promoApplied && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo kod"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
                />
                <button
                  onClick={() => { if (promoCode === "SALE10") setPromoApplied(true); }}
                  className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                >
                  Qo&apos;llash
                </button>
              </div>
            )}
            {promoApplied && (
              <p className="text-sm text-[var(--success)] font-medium">✓ Promo kod qo&apos;llandi</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}