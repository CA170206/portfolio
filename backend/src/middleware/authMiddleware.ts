import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

/**
 * Authentication middleware that verifies the JWT Bearer token in the Authorization header.
 * Rejects missing or invalid tokens with HTTP 401.
 * Attaches the authenticated admin payload to req.admin upon success.
 */
export const authenticateAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || typeof authHeader !== 'string') {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided',
    });
    return;
  }

  const trimmedHeader = authHeader.trim();

  // Validate that the header starts with "Bearer " (case-insensitive)
  if (!/^Bearer\s+/i.test(trimmedHeader)) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token format. Expected "Bearer <token>"',
    });
    return;
  }

  // Strip one or more occurrences of "Bearer " (case-insensitive)
  let token = trimmedHeader.replace(/^(?:Bearer\s+)+/i, '').trim();

  // Strip any accidental wrapping quotes or angle brackets (e.g. "token", 'token', <token>)
  token = token.replace(/^[<"']+|[>"']+$/g, '').trim();

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided',
    });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.admin = payload;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or expired token',
    });
  }
};
