import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { deleteEventImage } from '@/lib/supabase/events-storage';

const prisma = new PrismaClient();
type RouteParams = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// GET - Buscar um evento específico
export async function GET(request: NextRequest, props: {params: Promise<RouteParams>, searchParams: Promise<SearchParams>}) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento não fornecido' },
        { status: 400 }
      );
    }
    
    const evento = await prisma.event.findUnique({
      where: { id }
    });
    
    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(evento);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar evento' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar um evento
export async function PUT(request: NextRequest, props: {params: Promise<RouteParams>, searchParams: Promise<SearchParams>}) {
  try {
    const id = (await props.params).id;
    const body = await request.json();
    
    const { title, description, organization, date, time, location, imageUrl } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento não fornecido' },
        { status: 400 }
      );
    }
    
    const eventoExistente = await prisma.event.findUnique({
      where: { id }
    });
    
    if (!eventoExistente) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }
    
    const eventoAtualizado = await prisma.event.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        organization: organization || undefined,
        date: date ? new Date(date) : undefined,
        time: time || undefined,
        location: location || undefined,
        imageUrl: imageUrl || undefined
      }
    });
    
    return NextResponse.json(eventoAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar evento' },
      { status: 500 }
    );
  }
}

// DELETE - Excluir um evento
export async function DELETE(request: NextRequest, props: {params: Promise<RouteParams>, searchParams: Promise<SearchParams>}) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID do evento não fornecido' },
        { status: 400 }
      );
    }
    
    const evento = await prisma.event.findUnique({
      where: { id }
    });
    
    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }
    
    // Excluir a imagem do storage
    await deleteEventImage(evento.imageUrl);
    
    // Excluir o evento do banco de dados
    await prisma.event.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir evento' },
      { status: 500 }
    );
  }
}