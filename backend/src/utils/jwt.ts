import jwt from 'jsonwebtoken';

export interface AdminPayload {
  adminId: string;
  email: string;
}

const JWT_EXPIRES_IN = '7d';

/**
 * Retrieves the JWT secret from environment variables.
 * Throws an error if JWT_SECRET is not configured.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not configured');
  }
  return secret;
}

/**
 * Generates a signed JWT token containing admin identity.
 * @param payload Object containing adminId and email.
 * @returns Signed JWT string.
 */
export function generateToken(payload: AdminPayload): string {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies and decodes a JWT token.
 * @param token The JWT token string to verify.
 * @returns The decoded AdminPayload.
 */
export function verifyToken(token: string): AdminPayload {
  const secret = getJwtSecret();
  // Strip any accidental wrapping quotes, angle brackets, or whitespace
  const sanitizedToken = token.trim().replace(/^[<"']+|[>"']+$/g, '').trim();
  const decoded = jwt.verify(sanitizedToken, secret);
  if (typeof decoded !== 'object' || decoded === null || !('adminId' in decoded) || !('email' in decoded)) {
    throw new Error('Invalid token payload structure');
  }
  return {
    adminId: (decoded as AdminPayload).adminId,
    email: (decoded as AdminPayload).email,
  };
}
