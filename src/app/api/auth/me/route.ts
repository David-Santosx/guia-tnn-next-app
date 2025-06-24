import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/utils/encryption";
import { verifyJWT } from "@/lib/services/jwt-service";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = (await cookieStore).get("auth_token");

    if (!authToken) {
      return new Response(
        JSON.stringify({ error: "Não autenticado" }),
        { status: 401 }
      );
    }

    // Decrypt the token
    const decryptedToken = decrypt(authToken.value);
    
    // Verify the JWT
    const payload = verifyJWT(decryptedToken);
    
    if (!payload) {
      return new Response(
        JSON.stringify({ error: "Token inválido" }),
        { status: 401 }
      );
    }

    // Get admin data from database
    const prisma = new PrismaClient();
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        // Don't include password
      },
    });

    if (!admin) {
      return new Response(
        JSON.stringify({ error: "Administrador não encontrado" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ admin }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor" }),
      { status: 500 }
    );
  }
}