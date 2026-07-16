# E-Sotuv — Full-Stack E-Commerce Platform

Modern e-commerce platform built with Next.js 15, Node.js, Express, and PostgreSQL.

## Tech Stack

**Frontend:** Next.js 15, TypeScript, Tailwind CSS, Zustand, Recharts

**Backend:** Node.js, Express.js, PostgreSQL, JWT, bcryptjs

## Features

- Product catalog with filtering, search, sorting
- Shopping cart with persistent storage
- 3-step checkout with form validation (Zod)
- JWT authentication with role-based access (Admin/User)
- Admin dashboard with analytics and charts
- Full CRUD for products and orders
- Responsive design

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/username/e-sotuv.git
cd e-sotuv
```

### 2. Backend setup
```bash
cd backend-nodejs
npm install
cp .env.example .env
# .env ga PostgreSQL ma'lumotlarini kiriting
npm run dev
```

### 3. Frontend setup
```bash
cd frontend-nextjs
npm install
cp .env.local.example .env.local
# .env.local ga API URL kiriting
npm run dev
```

### 4. Database setup
```bash
psql -U postgres -d e_sotuv -f database.sql
```

## Environment Variables

**Backend `.env`:**