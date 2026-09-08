# Portfolio Backend API

Backend REST API for the Portfolio application built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **Prisma ORM**.

---

## 📁 Project Architecture

```
backend/
├── prisma/
│   └── schema.prisma         # Prisma schema (PostgreSQL datasource & Admin model)
├── src/
│   ├── config/
│   │   └── prisma.ts         # Singleton Prisma client instance
│   ├── controllers/          # Route controller logic (placeholders for upcoming milestones)
│   ├── middleware/
│   │   └── errorHandler.ts   # Centralized error handler & 404 handler
│   ├── routes/
│   │   └── health.routes.ts  # Health check route (/api/health)
│   ├── services/             # Business logic layer (placeholders for upcoming milestones)
│   ├── utils/                # Helper functions & utilities
│   └── server.ts             # Main Express server entry point
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules for backend
├── package.json              # Backend dependencies and scripts
├── tsconfig.json             # Strict TypeScript configuration
└── README.md                 # Backend documentation
```

---

## 🛠️ Prerequisites

- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local or hosted PostgreSQL database instance (e.g. Supabase, Neon, Railway, or local Postgres)

---

## 🚀 Getting Started

### 1. Install Dependencies

Navigate to the `backend` directory from the repository root:

```bash
cd backend
npm install
```

> **Windows PowerShell Tip:** If you encounter a script execution policy error (`npm.ps1 cannot be loaded`), use `npm.cmd install` or run PowerShell with `-ExecutionPolicy Bypass`.

---

### 2. Configure Environment Variables

Copy the `.env.example` file to create your local `.env`:

```bash
cp .env.example .env
```

On Windows Command Prompt / PowerShell:
```powershell
Copy-Item .env.example .env
```

Open `.env` and fill in your configuration:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"

# Secret key for JWT signing
JWT_SECRET="your-super-secret-jwt-key"

# Port for the Express server
PORT=5000

# Allowed frontend origin for CORS
FRONTEND_URL="http://localhost:5173"
```

---

### 3. Generate Prisma Client

Generate the Prisma Client code based on the models defined in `prisma/schema.prisma`:

```bash
npm run prisma:generate
```

---

### 4. Run Prisma Database Migrations

Apply database migrations to your PostgreSQL database (creates the `admins` table):

```bash
npm run prisma:migrate
```

*Note: You can name your migration when prompted (e.g. `init`).*

To visually inspect or manage your database tables in Prisma Studio:

```bash
npm run prisma:studio
```

---

### 5. Start Development Server

Run the development server with live-reloading powered by `tsx`:

```bash
npm run dev
```

The server will start and log:
```
Portfolio API server is running on http://localhost:5000
```

---

### 6. Production Build & Start

To build the TypeScript project into JavaScript:

```bash
npm run build
```

To run the built production server:

```bash
npm run start
```

---

## 🩺 Testing the Health Endpoint

Verify that the server is up and running by sending a `GET` request to `/api/health`:

### Using `curl`:
```bash
curl http://localhost:5000/api/health
```

### Using PowerShell:
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/health -Method GET
```

### Expected JSON Response:
```json
{
  "success": true,
  "message": "Portfolio API is running"
}
```

### Testing 404 Route Handling:
```bash
curl http://localhost:5000/api/unknown-route
```

Response:
```json
{
  "success": false,
  "message": "Route not found: GET /api/unknown-route"
}
```

---

## 🗺️ Upcoming Backend Milestones

- [ ] **Admin Authentication**: JWT tokens, bcrypt password hashing, login/refresh/logout endpoints, auth middleware.
- [ ] **Projects CRUD**: Full CRUD endpoints for managing portfolio projects and tags.
- [ ] **Project Images**: Image uploads, ordering, and cloud storage integration.
- [ ] **Certificates CRUD**: Certification entries management.
- [ ] **Experience & Education CRUD**: Timeline entries management.
- [ ] **Skills & Categories CRUD**: Technical skill ratings and taxonomy.
- [ ] **Profile / About CRUD**: Dynamic bio, social links, resume URL.
- [ ] **Admin CMS Dashboard**: Protected routes for content management.
