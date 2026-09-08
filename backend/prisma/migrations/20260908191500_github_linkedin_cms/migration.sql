-- CreateTable
CREATE TABLE "github_data" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'CA170206',
    "profileUrl" TEXT NOT NULL DEFAULT 'https://github.com/CA170206',
    "totalContributions" INTEGER NOT NULL DEFAULT 0,
    "contributionsData" JSONB,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "github_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_data" (
    "id" TEXT NOT NULL,
    "profileUrl" TEXT NOT NULL DEFAULT 'https://linkedin.com/in/chaitanya-anmulwar',
    "followers" TEXT NOT NULL DEFAULT '1000+',
    "connections" TEXT NOT NULL DEFAULT '500+',
    "role" TEXT NOT NULL DEFAULT 'Web Development Intern',
    "company" TEXT NOT NULL DEFAULT 'Labmentix',
    "location" TEXT NOT NULL DEFAULT 'Greater Nashik Area',
    "education" TEXT NOT NULL DEFAULT 'B.Tech CSE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linkedin_data_pkey" PRIMARY KEY ("id")
);
