import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { passwordService } from "@/lib/services/password-service";
import { generateJWT } from "@/lib/services/jwt-service";
import { cookies } from "next/headers";
import { encrypt } from "@/lib/utils/encryption";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(1, { message: "Senha é obrigatória" }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = loginSchema.safeParse(body);
    
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: "Dados de login inválidos", 
          details: validationResult.error.format() 
        }), 
        { status: 400 }
      );
    }
    
    const { email, password } = validationResult.data;
    
    const prisma = new PrismaClient();
    const admin = await prisma.admin.findUnique({
      where: { email },
    });
    
    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas" }), 
        { status: 401 }
      );
    }
    
    const isPasswordValid = await passwordService.verifyPassword(
      password,
      admin.password
    );
    
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Credenciais inválidas" }), 
        { status: 401 }
      );
    }
    
    const token = generateJWT({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: "admin"
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...adminData } = admin;
    
    // Create encrypted cookies with user data
    const cookieStore = cookies();
    
    // Set auth token cookie (encrypted)
    const encryptedToken = encrypt(token);
    (await cookieStore).set({
      name: 'auth_token',
      value: encryptedToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2, // 2 hours in seconds
      sameSite: 'strict'
    });
    
    // Set user data cookie (encrypted)
    const userData = {
      id: admin.id,
      name: admin.name,
      email: admin.email
    };
    const encryptedUserData = encrypt(JSON.stringify(userData));
    (await cookieStore).set({
      name: 'user_data',
      value: encryptedUserData,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2, // 2 hours in seconds
      sameSite: 'strict'
    });
    
    return new Response(
      JSON.stringify({
        message: "Login realizado com sucesso",
        token,
        admin: adminData
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}