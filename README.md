E-Sotuv — Full-Stack E-Commerce Platform

Zamonaviy e-commerce platforma — Next.js, Node.js/Express va PostgreSQL asosida qurilgan, to'liq production muhitida ishlaydi.

🔗 Live demo: e-sotuv.vercel.app 🔗 Backend API: e-sotuv-backend.onrender.com

Admin panelga kirish faqat tizim egasiga tegishli. Namoyish uchun ekran suratlarini so'rashingiz mumkin.

Tech Stack

Frontend: Next.js 15 (App Router), TypeScript, Tailwind CSS, Zustand, Recharts

Backend: Node.js, Express.js, PostgreSQL (raw SQL, pg), JWT, bcryptjs, Zod

Infratuzilma:

Qism	Xizmat
Frontend hosting	Vercel
Backend hosting	Render.com
Database	Neon.tech (serverless PostgreSQL)
Xususiyatlar
Mahsulotlar katalogi — filtrlash (narx, brend, reyting), qidiruv, saralash
Savat (cart) — doimiy saqlash (persistent state)
3 bosqichli checkout — Zod orqali validatsiya
JWT autentifikatsiya — rol asosida ruxsat (Admin / User)
Admin dashboard — analitika, grafiklar (Recharts), to'liq CRUD (mahsulotlar, buyurtmalar)
Responsive dizayn — mobil, planshet, desktop uchun moslashtirilgan
⚠️ Muhim eslatmalar
To'lov tizimi simulyatsiya qilingan (mock). Checkout jarayonida kiritilgan karta ma'lumotlari haqiqiy bank/to'lov tizimiga (Payme, Click va h.k.) ulanmagan — bu faqat UI/UX oqimini namoyish qilish uchun. Haqiqiy to'lov integratsiyasi keyingi bosqichda rejalashtirilgan.
Email tasdiqlash (email verification) hali qo'shilmagan — ro'yxatdan o'tishda email haqiqiyligi tekshirilmaydi.
Lokal muhitda ishga tushirish
1. Repo'ni klonlash
bash
git clone https://github.com/shoxnur-safarov/e-sotuv.git
cd e-sotuv
2. Backend
bash
cd backend-nodejs
npm install
cp .env.example .env
# .env faylida PostgreSQL va JWT ma'lumotlarini kiriting
npm run dev
3. Frontend
bash
cd frontend-nextjs
npm install
cp .env.local.example .env.local
# .env.local faylida backend API URL'ni kiriting (masalan http://localhost:5000/api/v1)
npm run dev
4. Database

Loyiha PostgreSQL talab qiladi (local yoki Neon.tech kabi bulutli xizmat). Kerakli jadval strukturasi uchun database.sql fayliga qarang.

Environment Variables
Backend (.env)
O'zgaruvchi	Tavsif
PORT	Server porti (masalan 5000)
DB_HOST	PostgreSQL host manzili
DB_PORT	PostgreSQL porti (odatda 5432)
DB_NAME	Database nomi
DB_USER	Database foydalanuvchisi
DB_PASSWORD	Database paroli
JWT_SECRET	JWT token imzolash uchun maxfiy kalit
JWT_EXPIRES_IN	Token amal qilish muddati (masalan 7d)
CLIENT_URL	Frontend manzili (CORS uchun)
Frontend (.env.local)
O'zgaruvchi	Tavsif
NEXT_PUBLIC_API_URL	Backend API manzili (masalan http://localhost:5000/api/v1)
Loyiha strukturasi
e-sotuv/
├── backend-nodejs/        # Express API (auth, products, orders)
├── frontend-nextjs/       # Next.js ilovasi (foydalanuvchi va admin panel)
└── README.md
Muallif

Shoxnur Safarov GitHub: @shoxnur-safarov