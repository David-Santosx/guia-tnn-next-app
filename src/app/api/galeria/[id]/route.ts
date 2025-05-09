import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { supabaseAdmin } from '../upload/route';

export async function deleteGalleryImage(imageUrl: string): Promise<boolean> {
  try {
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const bucketNameIndex = pathSegments.findIndex(segment => segment === "gallery-photos");

    if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
      console.error("Could not extract file path from URL:", imageUrl);
      return false;
    }

    const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

    // Use admin client for deletion to bypass RLS
    const { error } = await supabaseAdmin.storage
      .from("gallery-photos")
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}

const prisma = new PrismaClient();
type RouteParams = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// GET handler para buscar uma foto específica
export async function GET(request: NextRequest, props: { params: RouteParams, searchParams: SearchParams }) {
  try {
    const id = (await props.params).id;

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
  props: {params: RouteParams, searchParams: SearchParams}
) {
  try {
    const id = (await props.params).id;

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