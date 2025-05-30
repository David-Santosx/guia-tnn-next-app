import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { uploadEventImage, deleteEventImage } from '@/lib/supabase/events-storage';

const eventSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório' }),
  description: z.string().optional().nullable(),
  organization: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  location: z.string().min(1, { message: 'Localização é obrigatória' }),
  imageUrl: z.string().url({ message: 'URL de imagem inválida' }),
  createdById: z.string().optional().nullable(),
})

const prisma = new PrismaClient();

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' }
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type');
    let data;

    if (contentType === 'application/json') {
      data = await request.json();
      const { title, description, organization, date, time, location, imageUrl, createdById } = data;

      const validationResult = eventSchema.safeParse({
        title,
        description,
        organization,
        date,
        time,
        location,
        imageUrl,
        createdById
      });

      if (!validationResult.success) {
        return NextResponse.json({ 
          error: 'Dados inválidos', 
          details: validationResult.error.format() 
        }, { status: 400 });
      }
      
      const event = await prisma.event.create({
        data: {
          title,
          description,
          organization,
          date: new Date(date),
          time: time || null,
          location,
          imageUrl,
          createdById
        }
      });
      return NextResponse.json(event, { status: 201 });
    } else if (contentType?.startsWith('multipart/form-data')) {
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const organization = formData.get('organization') as string;
      const date = formData.get('date') as string;
      const time = formData.get('time') as string;
      const location = formData.get('location') as string;
      const image = formData.get('image') as File;
      const createdById = formData.get('createdById') as string;

      if (!title || !description || !organization || !date || !location || !image || !createdById) {
        return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
      }

      const imageUrl = await uploadEventImage(image);

      const validationResult = eventSchema.safeParse({
        title,
        description,
        organization,
        date,
        time,
        location,
        imageUrl,
        createdById
      });

      if (!validationResult.success) {
        return NextResponse.json({
          error: 'Dados inválidos',
          details: validationResult.error.format()
        }, { status: 400 });
      }

      const event = await prisma.event.create({
        data: {
          title,
          description,
          organization,
          date: new Date(date),
          time: time || null,
          location,
          imageUrl,
          createdById
        }
      })

      return NextResponse.json(event, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Tipo de conteúdo não suportado' }, { status: 415 });

    }
    
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({
      error: 'Erro ao criar evento',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const organization = formData.get('organization') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const image = formData.get('image') as File;

    if (!id) {
      return NextResponse.json({ error: 'ID do evento não fornecido' }, { status: 400 });
    }

    const existingEvent = await prisma.event.findUnique({ where: { id } });
    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    let imageUrl = existingEvent.imageUrl;

    if (image) {
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
    return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do evento não fornecido' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado' }, { status: 404 });
    }

    await deleteEventImage(event.imageUrl);
    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ message: 'Evento deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return NextResponse.json({ error: 'Erro ao deletar evento' }, { status: 500 });
  }
}