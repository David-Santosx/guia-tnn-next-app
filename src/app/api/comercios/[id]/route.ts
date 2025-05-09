import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { deleteCommerceImage } from '@/lib/supabase/commerce-storage';

const prisma = new PrismaClient();
type RouteParams = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// GET - Buscar um comércio específico
export async function GET(request: NextRequest, props: {params: RouteParams, searchParams: SearchParams}) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do comércio não fornecido' },
        { status: 400 }
      );
    }
    
    const commerce = await prisma.commerce.findUnique({
      where: { id }
    });
    
    if (!commerce) {
      return NextResponse.json(
        { error: 'Comércio não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(commerce);
  } catch (error) {
    console.error('Erro ao buscar comércio:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comércio' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um comércio específico
export async function PUT(request: NextRequest, props: {params: RouteParams, searchParams: SearchParams}) {
  try {
    const id = (await props.params).id;
    const body = await request.json();
    
    const { name, description, phone, rate, owner, hours, imageUrl, location } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do comércio não fornecido' },
        { status: 400 }
      );
    }
    
    const commerceExistente = await prisma.commerce.findUnique({
      where: { id }
    });
    
    if (!commerceExistente) {
      return NextResponse.json(
        { error: 'Comércio não encontrado' },
        { status: 404 }
      );
    }
    
    // Validar o formato do objeto hours se estiver presente
    let hoursData = hours;
    if (hours && typeof hours === 'string') {
      try {
        hoursData = JSON.parse(hours);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        return NextResponse.json(
          { error: 'Formato de horas inválido' },
          { status: 400 }
        );
      }
    }
    
    const commerceAtualizado = await prisma.commerce.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        phone: phone !== undefined ? phone : undefined,
        rate: rate !== undefined ? rate : undefined,
        owner: owner || undefined,
        hours: hoursData !== undefined ? hoursData : undefined,
        imageUrl: imageUrl || undefined,
        location: location || undefined,
      }
    });
    
    return NextResponse.json(commerceAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar comércio:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar comércio' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um comércio específico
export async function DELETE(request: NextRequest, props: {params: RouteParams, searchParams: SearchParams}) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do comércio não fornecido' },
        { status: 400 }
      );
    }
    
    const commerce = await prisma.commerce.findUnique({
      where: { id }
    });
    
    if (!commerce) {
      return NextResponse.json(
        { error: 'Comércio não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir a imagem do storage
    await deleteCommerceImage(commerce.imageUrl);
    
    // Excluir o comércio do banco de dados
    await prisma.commerce.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir comércio:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir comércio' },
      { status: 500 }
    );
  }
}