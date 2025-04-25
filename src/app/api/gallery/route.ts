import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const createPhotoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  imageUrl: z.string().url("Valid image URL is required"),
  description: z.string().nullish(),
  category: z.enum(['NATUREZA', 'LOCAIS', 'EVENTOS', 'GERAL']).nullish(),
  photographer: z.string().nullish(),
  location: z.string().nullish(),
  date: z.string().datetime({ offset: true }).nullish().or(z.literal('')),
});


// GET Handler (existing)
export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Convert enum values to strings
    const convertedPhotos = photos.map(photo => ({
      ...photo,
      category: photo.category ? String(photo.category) : null,
    }));

    return NextResponse.json(convertedPhotos);
  } catch (error) {
    console.error("Failed to fetch photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createPhotoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { title, imageUrl, description, category, photographer, location, date } = validation.data;

    const dateForDb = date ? new Date(date) : null;

    const newPhoto = await prisma.photo.create({
      data: {
        title,
        imageUrl,
        description: description || null,
        category: category || null,
        photographer: photographer || null,
        location: location || null,
        date: dateForDb,
      },
    });

    return NextResponse.json(newPhoto, { status: 201 });

  } catch (error) {
    console.error("Failed to create photo:", error);
    if (error instanceof Error && error.message.includes("Unauthorized")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Failed to create photo entry in database: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}