import jwt from "jsonwebtoken";

// Define the payload structure
interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Generate a JWT token for authentication
 * @param payload - User data to include in the token
 * @returns JWT token string
 */
export function generateJWT(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  
  return jwt.sign(
    payload,
    secret,
    { expiresIn: "8h" } // Token expires in 8 hours
  );
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }
    
    return jwt.verify(token, secret) as JWTPayload;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}