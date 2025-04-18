import crypto from 'crypto';

// For AES-256, key must be exactly 32 bytes (256 bits)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default32bytesecretkey12345678901234';
// Ensure key is exactly 32 bytes
const NORMALIZED_KEY = Buffer.from(ENCRYPTION_KEY).slice(0, 32).toString('utf8').padEnd(32, '0');
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * Encrypts a string using AES-256-CBC
 * @param text - The string to encrypt
 * @returns Encrypted string (base64 encoded)
 */
export function encrypt(text: string): string {
  // Create an initialization vector
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Create cipher with normalized key
  const cipher = crypto.createCipheriv(
    'aes-256-cbc', 
    Buffer.from(NORMALIZED_KEY), 
    iv
  );
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Combine IV and encrypted data and return as base64
  return Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
}

/**
 * Decrypts an AES-256-CBC encrypted string
 * @param encryptedText - The encrypted string (base64 encoded)
 * @returns Decrypted string
 */
export function decrypt(encryptedText: string): string {
  // Convert from base64 to buffer
  const buffer = Buffer.from(encryptedText, 'base64');
  
  // Extract the IV from the buffer
  const iv = buffer.slice(0, IV_LENGTH);
  
  // Extract the encrypted text from the buffer
  const encrypted = buffer.slice(IV_LENGTH).toString('base64');
  
  // Create decipher with normalized key
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc', 
    Buffer.from(NORMALIZED_KEY), 
    iv
  );
  
  // Decrypt the text
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}