import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import { passwordService } from "@/utils/auth/passwordUtils";

interface RequestPayload {
    adminSecret: string;
    
    adminName: string;
    adminEmail: string;
    adminPassword: string;
}

const defaultAdmin = {
    name: "admin",
    email: "initial-admin@guiatnn.com",
    password: "Admin@0310",
}

export async function POST(req: NextRequest) {
    const { adminSecret } = await req.json() as RequestPayload;

    if (adminSecret!== process.env.ADMIN_SECRET_KEY) {
        return new Response("Unauthorized", { status: 401 });
    }

    const prisma = new PrismaClient();
    const alreadyExists = await prisma.admin.findFirst({
        where: {
            email: defaultAdmin.email,
        },
    });

    if (alreadyExists) {
        return new Response("Initial Admin already exists", { status: 400 });
    }
    
    const hashedPassword = await passwordService.hashPassword(defaultAdmin.password);
    
    const admin = await prisma.admin.create({
        data: {
            name: defaultAdmin.name,
            email: defaultAdmin.email,
            password: hashedPassword,
            createdBy: "System",
        }, 
    })

    // Don't return the password in the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...adminWithoutPassword } = admin;
    return new Response(JSON.stringify(adminWithoutPassword), { status: 200 });
}