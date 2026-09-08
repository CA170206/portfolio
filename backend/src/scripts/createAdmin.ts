import dotenv from 'dotenv';
dotenv.config();

import prisma from '../config/prisma';
import { hashPassword } from '../utils/password';

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error('Error: ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must all be defined in environment variables.');
    process.exit(1);
  }

  try {
    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      console.log(`Admin account with email "${email}" already exists (ID: ${existing.id}). No duplicate created.`);
      return;
    }

    const passwordHash = await hashPassword(password);

    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    console.log(`Admin account successfully created for "${newAdmin.name}" (${newAdmin.email}) with ID: ${newAdmin.id}`);
  } catch (error) {
    console.error('Failed to create admin account:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
