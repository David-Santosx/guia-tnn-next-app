import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface GalleryPhoto {
  id: string;
  title: string;
  description?: string | null;
  imageUrl: string;
  category?: string | null;
  photographer?: string | null;
  location?: string | null;
  date?: string | null;
  createdAt: string;
}

export async function fetchGalleryPhotos(): Promise<GalleryPhoto[]> {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        category: true,
        photographer: true,
        location: true,
        date: true,
        createdAt: true,
      },
    });

    return photos.map(photo => ({
      ...photo,
      createdAt: photo.createdAt.toISOString(),
      date: photo.date ? photo.date.toISOString() : null,
    }));
  } catch (error) {
    console.error("Error fetching gallery photos:", error);
    throw new Error("Failed to fetch gallery photos");
  } finally {
    await prisma.$disconnect();
  }
}