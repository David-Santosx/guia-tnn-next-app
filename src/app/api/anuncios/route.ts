import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Listar todos os anúncios ativos
export async function GET() {
  try {
    
    const anuncios = await prisma.advertisement.findMany({
      where: {
        isActive: true,
        startDate: { lte: new Date() },
      },
      orderBy: {
        position: 'asc'
      }
    });
    
    return NextResponse.json(anuncios);
  } catch (error) {
    console.error('Erro ao buscar anúncios:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar anúncios' },
      { status: 500 }
    );
  }
}

// POST - Criar um novo anúncio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { title, imageUrl, position, isActive, startDate, endDate, uploadedById } = body;
    
    if (!title || !imageUrl || position === undefined) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      );
    }
    
    const anuncio = await prisma.advertisement.create({
      data: {
        title,
        imageUrl,
        position,
        isActive: isActive ?? true,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias por padrão
        uploadedById
      }
    });
    
    return NextResponse.json(anuncio, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro ao criar anúncio' },
      { status: 500 }
    );
  }
}