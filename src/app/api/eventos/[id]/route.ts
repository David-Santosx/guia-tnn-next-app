import { NextResponse, NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { deleteEventImage, uploadEventImage } from '@/lib/supabase/events-storage';

const prisma = new PrismaClient();
type RouteParams = Promise<{ id: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function GET(request: NextRequest, props: {params: RouteParams, searchParams: SearchParams}) {
  try {
    const id = (await props.params).id;

    if (!id) {
      return NextResponse.json({ error: 'ID do evento não fornecido' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar evento', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  props: {params: RouteParams, searchParams: SearchParams}
) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID do evento não fornecido' }, { status: 400 });
    }
    
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const organization = formData.get('organization') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const image = formData.get('image') as File | null;
    
    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }
    
    let imageUrl = existingEvent.imageUrl;
    
    if (image && image.size > 0) {
      // Excluir imagem antiga e fazer upload da nova
      await deleteEventImage(existingEvent.imageUrl);
      imageUrl = await uploadEventImage(image);
    }
    
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title || undefined,
        description: description || undefined,
        organization: organization || undefined,
        date: date ? new Date(date) : undefined,
        time: time || undefined,
        location: location || undefined,
        imageUrl
      }
    });
    
    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json({ 
      error: 'Erro ao atualizar evento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, props: {params: RouteParams, searchParams: SearchParams}) {
  try {
    const id = (await props.params).id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID do evento não fornecido' }, { status: 400 });
    }
    
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }
    
    // Excluir a imagem do storage
    await deleteEventImage(event.imageUrl);
    
    // Excluir o evento do banco de dados
    await prisma.event.delete({ where: { id } });
    
    return NextResponse.json({ success: true, message: 'Evento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return NextResponse.json({ 
      error: 'Erro ao excluir evento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}