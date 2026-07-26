E-Sotuv — Full-Stack E-Commerce Platform

Next.js, Node.js/Express va PostgreSQL asosida qurilgan, to'liq production muhitida ishlaydigan e-commerce platforma.

🔗 Live demo: e-sotuv.vercel.app
🔗 Backend API: e-sotuv-backend.onrender.com

Admin panel faqat tizim egasiga tegishli. Ko'rish uchun ekran suratlarini so'rashingiz mumkin.

Tech Stack

**Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, React Hook Form, Axios, Recharts
**Backend:** Node.js, Express.js, PostgreSQL, JWT, bcryptjs, Zod

Infratuzilma: Vercel (frontend) · Render.com (backend) · Neon.tech (database)

Xususiyatlar
Mahsulotlar katalogi — filtrlash, qidiruv, saralash
Savat va 3 bosqichli checkout (Zod validatsiya bilan)
JWT autentifikatsiya, rol asosida ruxsat (Admin / User)
Admin dashboard — analitika, grafiklar, to'liq CRUD
Responsive dizayn
⚠️ Muhim eslatmalar
To'lov tizimi simulyatsiya qilingan (mock) — haqiqiy bank integratsiyasi yo'q
Email tasdiqlash hali qo'shilmagan
Lokal ishga tushirish
bash
git clone https://github.com/shoxnur-safarov/e-sotuv.git
cd e-sotuv

# Backend
cd backend-nodejs
npm install
cp .env.example .env   # PostgreSQL va JWT ma'lumotlarini kiriting
npm run dev

# Frontend (yangi terminalda)
cd frontend-nextjs
npm install
cp .env.local.example .env.local   # Backend API URL kiriting
npm run dev

Database uchun PostgreSQL kerak (local yoki Neon.tech kabi bulutli xizmat).

Environment Variables

Backend: PORT, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET, JWT_EXPRISE_IN, CLIENT_URL

Frontend: NEXT_PUBLIC_API_URL

Struktura
e-sotuv/
├── backend-nodejs/     # Express API (auth, products, orders)
├── frontend-nextjs/    # Next.js ilovasi (foydalanuvchi + admin panel)
└── README.md
Muallif

Shoxnur Safarov — GitHub: @shoxnur-safarov