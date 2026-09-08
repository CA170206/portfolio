# Portfolio Fullstack Monorepo (2026-2027)

This repository contains both the client-side portfolio application and the dedicated REST API backend.

---

## 📁 Repository Structure

```
portfolio/
├── frontend/                 # React + Vite + TypeScript + Tailwind CSS Frontend
│   ├── src/                  # Application components, sections, assets, data
│   ├── public/               # Static public assets
│   ├── index.html            # Vite HTML entry point
│   ├── package.json          # Frontend dependencies & scripts
│   ├── tailwind.config.js    # Tailwind styling config
│   ├── vite.config.ts        # Vite configuration
│   └── tsconfig.json         # TypeScript configuration
│
├── backend/                  # Node.js + Express + TypeScript + Prisma Backend
│   ├── prisma/               # Prisma schema & PostgreSQL definitions
│   ├── src/                  # Controllers, routes, middleware, services, server.ts
│   ├── .env.example          # Environment variables template
│   ├── package.json          # Backend dependencies & scripts
│   ├── tsconfig.json         # Strict TypeScript configuration
│   └── README.md             # Backend setup & API documentation
│
└── README.md                 # Project root documentation
```

---

## 🚀 Quick Start

### 1. Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173).

---

### 2. Backend Development

```bash
cd backend
npm install
cp .env.example .env          # Configure your PostgreSQL DATABASE_URL
npm run prisma:generate
npm run dev
```

The backend server will run on [http://localhost:5000](http://localhost:5000).

Health Check endpoint: [http://localhost:5000/api/health](http://localhost:5000/api/health).
