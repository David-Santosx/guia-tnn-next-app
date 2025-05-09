import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { deleteGalleryImage } from '@/lib/supabase/gallery-storage';

const prisma = new PrismaClient();

// GET handler para buscar uma foto específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da foto não fornecido' },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json(
        { error: 'Foto não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(photo);
  } catch (error) {
    console.error('Error fetching photo:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar foto' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE handler para excluir uma foto
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: 'ID da foto não fornecido' },
        { status: 400 }
      );
    }

    const photo = await prisma.photo.findUnique({
      where: { id },
    });

    if (!photo) {
      return NextResponse.json(
        { error: 'Foto não encontrada' },
        { status: 404 }
      );
    }

    const imageUrl = photo.imageUrl;

    const deleteResult = await deleteGalleryImage(imageUrl);
    
    if (!deleteResult) {
      return NextResponse.json(
        { error: 'Falha ao excluir imagem do storage' },
        { status: 500 }
      );
    }

    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir foto' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}