import { Request, Response } from 'express';
import authService from '../services/auth.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Controller for admin login (POST /api/auth/login).
 */
export const loginController = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validation
  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({
      success: false,
      message: 'Email is required',
    });
    return;
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    res.status(400).json({
      success: false,
      message: 'Invalid email address format',
    });
    return;
  }

  if (!password || typeof password !== 'string') {
    res.status(400).json({
      success: false,
      message: 'Password is required',
    });
    return;
  }

  try {
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: result.token,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Authentication failed';
    if (message === 'Invalid email or password') {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

/**
 * Controller for retrieving current authenticated admin profile (GET /api/auth/me).
 */
export const getMeController = async (req: Request, res: Response): Promise<void> => {
  if (!req.admin || !req.admin.adminId) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const admin = await authService.getAdminById(req.admin.adminId);

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin account not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: 'Internal server error fetching admin profile',
    });
  }
};
