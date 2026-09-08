import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt.
 * @param password The plaintext password to hash.
 * @returns The hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password with a bcrypt password hash.
 * @param password The plaintext password.
 * @param hash The bcrypt password hash.
 * @returns True if the password matches, false otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
