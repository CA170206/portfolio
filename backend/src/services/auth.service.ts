import prisma from '../config/prisma';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export interface SafeAdmin {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResult {
  token: string;
  admin: SafeAdmin;
}

export class AuthService {
  /**
   * Authenticates an admin by email and password.
   * Throws an error if credentials are invalid.
   */
  async login(email: string, password: string): Promise<LoginResult> {
    const trimmedEmail = email.trim().toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { email: trimmedEmail },
    });

    if (!admin) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({
      adminId: admin.id,
      email: admin.email,
    });

    const safeAdmin: SafeAdmin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };

    return { token, admin: safeAdmin };
  }

  /**
   * Retrieves an admin's profile by ID without passwordHash.
   */
  async getAdminById(adminId: string): Promise<SafeAdmin | null> {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  }
}

export const authService = new AuthService();
export default authService;
