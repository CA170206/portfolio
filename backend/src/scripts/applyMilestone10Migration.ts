import prisma from '../config/prisma';

async function applyMigration() {
  console.log('=== Applying Milestone 10 Database Tables (Safe & Additive) ===');

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "github_data" (
      "id" TEXT NOT NULL,
      "username" TEXT NOT NULL DEFAULT 'CA170206',
      "profileUrl" TEXT NOT NULL DEFAULT 'https://github.com/CA170206',
      "totalContributions" INTEGER NOT NULL DEFAULT 0,
      "contributionsData" JSONB,
      "lastSyncedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "github_data_pkey" PRIMARY KEY ("id")
    );
  `);
  console.log('[SUCCESS] github_data table verified/created.');

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "linkedin_data" (
      "id" TEXT NOT NULL,
      "profileUrl" TEXT NOT NULL DEFAULT 'https://linkedin.com/in/chaitanya-anmulwar',
      "followers" TEXT NOT NULL DEFAULT '1000+',
      "connections" TEXT NOT NULL DEFAULT '500+',
      "role" TEXT NOT NULL DEFAULT 'Web Development Intern',
      "company" TEXT NOT NULL DEFAULT 'Labmentix',
      "location" TEXT NOT NULL DEFAULT 'Greater Nashik Area',
      "education" TEXT NOT NULL DEFAULT 'B.Tech CSE',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "linkedin_data_pkey" PRIMARY KEY ("id")
    );
  `);
  console.log('[SUCCESS] linkedin_data table verified/created.');

  // Initialize singleton records if not present
  const existingGithub = await prisma.githubData.findFirst();
  if (!existingGithub) {
    await prisma.githubData.create({
      data: {
        username: 'CA170206',
        profileUrl: 'https://github.com/CA170206',
        totalContributions: 0,
      },
    });
    console.log('[INITIALIZED] github_data default record created.');
  } else {
    console.log('[EXISTS] github_data record already exists.');
  }

  const existingLinkedin = await prisma.linkedinData.findFirst();
  if (!existingLinkedin) {
    await prisma.linkedinData.create({
      data: {
        profileUrl: 'https://linkedin.com/in/chaitanya-anmulwar',
        followers: '1000+',
        connections: '500+',
        role: 'Web Development Intern',
        company: 'Labmentix',
        location: 'Greater Nashik Area',
        education: 'B.Tech CSE',
      },
    });
    console.log('[INITIALIZED] linkedin_data default record created.');
  } else {
    console.log('[EXISTS] linkedin_data record already exists.');
  }

  console.log('\n=== Database Setup Complete ===');
}

applyMigration()
  .catch((e) => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
