'use server';

import { PrismaClient } from '@prisma/client';
import { uploadEventImage } from '@/lib/supabase/events-storage';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/utils/encryption';
import { verifyJWT } from '@/lib/services/jwt-service';

const prisma = new PrismaClient();


export async function createEvent(formData: FormData) {
  try {
    const imageFile = formData.get('imageFile') as File;
    let imageUrl = '';
    
    if (imageFile) {
      imageUrl = await uploadEventImage(imageFile);
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;
    const organization = 'TNN';

    // Obter o token de autenticação
    const cookieStore = cookies();
    const authToken = (await cookieStore).get('auth_token');

    if (!authToken) {
      throw new Error('Não autenticado');
    }

    // Descriptografar e verificar o token
    const decryptedToken = decrypt(authToken.value);
    const payload = verifyJWT(decryptedToken);

    if (!payload) {
      throw new Error('Token inválido');
    }

    const dateTime = new Date(`${date}T${time}:00`);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: dateTime,
        time,
        location,
        imageUrl,
        organization,
        createdById: payload.id, // ID do admin autenticado
      },
    });

    return { success: true, event };
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return { error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.' };
  }
}

export async function updateEvent(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    if (!id) throw new Error('ID do evento não fornecido');

    const imageFile = formData.get('imageFile') as File;
    let imageUrl = '';
    
    if (imageFile) {
      imageUrl = await uploadEventImage(imageFile);
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const location = formData.get('location') as string;

    const dateTime = new Date(`${date}T${time}:00`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      title,
      description,
      date: dateTime,
      time,
      location,
    };

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return { success: true, event };
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return { error: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.' };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getEventById(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/eventos/${id}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const event = await res.json();
    console.log(event.createdBy);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return event as any;
  } catch {
    return null;
  }
}