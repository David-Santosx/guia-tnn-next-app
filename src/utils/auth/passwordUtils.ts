import * as bcrypt from 'bcrypt';

export class PasswordService {
  private readonly saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  /**
   * Hashes a plain text password
   * @param plainPassword The plain text password to hash
   * @returns A promise that resolves to the hashed password
   */
  async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  /**
   * Compares a plain text password with a hashed password
   * @param plainPassword The plain text password to compare
   * @param hashedPassword The hashed password to compare against
   * @returns A promise that resolves to true if passwords match, false otherwise
   */
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const passwordService = new PasswordService();