import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";

interface RequestPayload {
    adminSecret: string; 
}

export async function POST(req: NextRequest) {
    const { adminSecret } = await req.json() as RequestPayload;
    if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return new Response("Unauthorized", { status: 401 }); 
    }

    const prisma = new PrismaClient();
    const admins = await prisma.admin.findMany();

    return new Response(JSON.stringify(admins), { status: 200 });
}