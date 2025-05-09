import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { deleteAdImage } from '@/lib/supabase/ads-storage';

const prisma = new PrismaClient();
type RouteParams = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// GET - Buscar um anúncio específico
export async function GET(props: {params: RouteParams, searchParams: SearchParams}) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do anúncio não fornecido' },
        { status: 400 }
      );
    }
    
    const anuncio = await prisma.advertisement.findUnique({
      where: { id }
    });
    
    if (!anuncio) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(anuncio);
  } catch (error) {
    console.error('Erro ao buscar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar anúncio' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um anúncio
export async function PUT(props: {params: RouteParams, searchParams: SearchParams}, request: NextRequest) {
  try {
    const id = (await props.params).id;
    const body = await request.json();
    
    const { title, imageUrl, position, isActive, startDate, endDate } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do anúncio não fornecido' },
        { status: 400 }
      );
    }
    
    const anuncioExistente = await prisma.advertisement.findUnique({
      where: { id }
    });
    
    if (!anuncioExistente) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      );
    }
    
    const anuncioAtualizado = await prisma.advertisement.update({
      where: { id },
      data: {
        title: title || undefined,
        imageUrl: imageUrl || undefined,
        position: position !== undefined ? position : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      }
    });
    
    return NextResponse.json(anuncioAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar anúncio' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um anúncio
export async function DELETE(props: {params: RouteParams, searchParams: SearchParams}) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do anúncio não fornecido' },
        { status: 400 }
      );
    }
    
    const anuncio = await prisma.advertisement.findUnique({
      where: { id }
    });
    
    if (!anuncio) {
      return NextResponse.json(
        { error: 'Anúncio não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir a imagem do storage
    await deleteAdImage(anuncio.imageUrl);
    
    // Excluir o anúncio do banco de dados
    await prisma.advertisement.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir anúncio:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir anúncio' },
      { status: 500 }
    );
  }
}