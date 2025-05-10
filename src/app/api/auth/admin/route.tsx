import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { passwordService } from "@/lib/services/password-service";

const prisma = new PrismaClient();

// Schema para validação de criação de administrador
const createAdminSchema = z.object({
  adminSecret: z.string().min(1, { message: "Admin key é obrigatória" }),
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .regex(/[A-Z]/, {
      message: "Senha deve conter pelo menos uma letra maiúscula",
    })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
});

// Schema para validação de atualização de administrador
const updateAdminSchema = z.object({
  adminSecret: z.string().min(1, { message: "Admin key é obrigatória" }),
  id: z.string().min(1, { message: "ID do administrador é obrigatório" }),
  name: z
    .string()
    .min(3, { message: "Nome deve ter pelo menos 3 caracteres" })
    .optional(),
  email: z.string().email({ message: "Email inválido" }).optional(),
  password: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .regex(/[A-Z]/, {
      message: "Senha deve conter pelo menos uma letra maiúscula",
    })
    .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" })
    .optional(),
});

// Schema para validação de exclusão de administrador
const deleteAdminSchema = z.object({
  adminSecret: z.string().min(1, { message: "Admin key é obrigatória" }),
  id: z.string().min(1, { message: "ID do administrador é obrigatório" }),
});

// GET - Listar todos os administradores
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const adminSecret = url.searchParams.get("adminSecret");

    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
      });
    }

    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        createdBy: true,
      },
    });

    return new Response(JSON.stringify(admins), { status: 200 });
  } catch (error) {
    console.error("Erro ao listar administradores:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
    });
  }
}

// POST - Criar um novo administrador
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = createAdminSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Dados inválidos",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const { adminSecret, name, email, password } = validationResult.data;

    if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
      });
    }

    // Verificar se já existe um administrador com este email
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return new Response(
        JSON.stringify({ error: "Já existe um administrador com este email" }),
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await passwordService.hashPassword(password);

    // Criar o administrador
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
        createdBy: "Admin",
      },
    });

    // Remover a senha do objeto de resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...adminWithoutPassword } = admin;

    return new Response(JSON.stringify(adminWithoutPassword), { status: 201 });
  } catch (error) {
    console.error("Erro ao criar administrador:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
    });
  }
}

// PATCH - Atualizar um administrador existente
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = updateAdminSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Dados inválidos",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    const { adminSecret, id, name, email, password } = validationResult.data;

    if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
      });
    }

    // Verificar se o administrador existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return new Response(
        JSON.stringify({ error: "Administrador não encontrado" }),
        { status: 404 }
      );
    }

    // Verificar se o email já está em uso por outro administrador
    if (email && email !== existingAdmin.email) {
      const emailInUse = await prisma.admin.findUnique({
        where: { email },
      });

      if (emailInUse) {
        return new Response(
          JSON.stringify({
            error: "Email já está em uso por outro administrador",
          }),
          { status: 400 }
        );
      }
    }

    // Preparar dados para atualização
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await passwordService.hashPassword(password);
    }

    // Atualizar o administrador
    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData,
    });

    // Remover a senha do objeto de resposta
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...adminWithoutPassword } = updatedAdmin;

    return new Response(JSON.stringify(adminWithoutPassword), { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar administrador:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
    });
  }
}

// DELETE - Excluir um administrador
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const adminSecret = url.searchParams.get("adminSecret");
    const id = url.searchParams.get("id");

    const validationResult = deleteAdminSchema.safeParse({ adminSecret, id });

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Dados inválidos",
          details: validationResult.error.format(),
        }),
        { status: 400 }
      );
    }

    if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
      });
    }

    // Verificar se o administrador existe
    const existingAdmin = await prisma.admin.findUnique({
      where: { id: id || undefined },
    });

    if (!existingAdmin) {
      return new Response(
        JSON.stringify({ error: "Administrador não encontrado" }),
        { status: 404 }
      );
    }

    // Verificar se é o último administrador
    const adminCount = await prisma.admin.count();
    if (adminCount <= 1) {
      return new Response(
        JSON.stringify({
          error: "Não é possível excluir o último administrador",
        }),
        { status: 400 }
      );
    }

    // Excluir o administrador
    await prisma.admin.delete({
      where: { id: id || undefined },
    });

    return new Response(
      JSON.stringify({ message: "Administrador excluído com sucesso" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir administrador:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
    });
  }
}
