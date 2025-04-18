import bcrypt from "bcrypt";

/**
 * Service for handling password hashing and verification
 */
export const passwordService = {
  /**
   * Hash a plain text password
   * @param password - Plain text password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  /**
   * Verify if a plain text password matches a hashed password
   * @param plainPassword - Plain text password to verify
   * @param hashedPassword - Hashed password to compare against
   * @returns Boolean indicating if passwords match
   */
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
};