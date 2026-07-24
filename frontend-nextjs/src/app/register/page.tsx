"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta harf"),
  lastName: z.string().min(2, "Familiya kamida 2 ta harf"),
  email: z.string().email("Yaroqli email kiriting"),
  password: z.string().min(6, "Parol kamida 6 ta belgi"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parollar mos kelmaydi",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;
type Errors = Partial<Record<keyof RegisterForm, string>>;

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const errs: Errors = {};
      result.error.issues.forEach((e: z.ZodIssue) => {
        if (e.path[0]) errs[e.path[0] as keyof RegisterForm] = e.message;
      });
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const  response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setErrors({ email: data.message });
        return;
      }
      window.location.href = "/login";
    } catch {
      setErrors({ email: "Server bilan ulanishda xatolik" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[var(--primary)]">
            E-Sotuv
          </Link>
          <h1 className="text-xl font-bold text-[var(--text)] mt-4">Hisob yaratish</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Bepul ro&apos;yxatdan o&apos;ting</p>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl p-8 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "firstName", label: "Ism", placeholder: "Jasur" },
                { key: "lastName", label: "Familiya", placeholder: "Karimov" },
              ].map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[var(--text)]">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={form[key as keyof RegisterForm]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={`px-4 py-3 rounded-xl border ${errors[key as keyof RegisterForm] ? "border-[var(--error)]" : "border-gray-200"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm`}
                  />
                  {errors[key as keyof RegisterForm] && (
                    <p className="text-xs text-[var(--error)]">{errors[key as keyof RegisterForm]}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text)]">Email</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`px-4 py-3 rounded-xl border ${errors.email ? "border-[var(--error)]" : "border-gray-200"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm`}
              />
              {errors.email && <p className="text-xs text-[var(--error)]">{errors.email}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text)]">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={`w-full px-4 py-3 pr-11 rounded-xl border ${errors.password ? "border-[var(--error)]" : "border-gray-200"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm`}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[var(--error)]">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text)]">Parolni tasdiqlang</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`px-4 py-3 rounded-xl border ${errors.confirmPassword ? "border-[var(--error)]" : "border-gray-200"} bg-[var(--background)] text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors text-sm`}
              />
              {errors.confirmPassword && <p className="text-xs text-[var(--error)]">{errors.confirmPassword}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-hover)] transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={18} />
                  Ro&apos;yxatdan o&apos;tish
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-[var(--text-muted)] mt-6">
          Hisobingiz bormi?{" "}
          <Link href="/login" className="text-[var(--primary)] font-semibold hover:underline">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}