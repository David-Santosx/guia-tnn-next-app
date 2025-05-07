import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { uploadCommerceImage } from '@/lib/supabase/commerce-storage';

const prisma = new PrismaClient();


const commerceSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  description: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  rate: z.number().min(0).max(5).optional().nullable(),
  owner: z.string().min(1, { message: 'Proprietário é obrigatório' }),
  hours: z.any().optional().nullable(), // Alterado para aceitar objeto JSON
  imageUrl: z.string().url({ message: 'URL de imagem inválida' }),
  location: z.string().min(1, { message: 'Localização é obrigatória' }),
  uploadedById: z.string().optional().nullable(),
});


export async function GET() {
  try {
    const commerces = await prisma.commerce.findMany({
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json(commerces);
  } catch (error) {
    console.error('Erro ao buscar comércios:', error);
    return NextResponse.json({ error: 'Erro ao buscar comércios' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {

    const contentType = request.headers.get('content-type');
    
    let data;
    if (contentType?.includes('application/json')) {

      data = await request.json();
      
      const { name, description, phone, rate, owner, hours, imageUrl, location, uploadedById } = data;
      
      // Validação dos dados
      const validationResult = commerceSchema.safeParse({
        name,
        description,
        phone,
        rate,
        owner,
        hours,
        imageUrl,
        location,
        uploadedById
      });

      if (!validationResult.success) {
        return NextResponse.json({ 
          error: 'Dados inválidos', 
          details: validationResult.error.format() 
        }, { status: 400 });
      }

      // Criar o comércio
      const commerce = await prisma.commerce.create({
        data: {
          name,
          description,
          phone,
          rate,
          owner,
          hours: typeof hours === 'string' ? JSON.parse(hours) : hours,
          imageUrl,
          location,
          uploadedById
        }
      });

      return NextResponse.json(commerce, { status: 201 });
    } else if (contentType?.includes('multipart/form-data') || contentType?.includes('application/x-www-form-urlencoded')) {
      // Processar FormData (código existente)
      const formData = await request.formData();
      
      const name = formData.get('name') as string;
      const description = formData.get('description') as string | null;
      const phone = formData.get('phone') as string | null;
      const rateStr = formData.get('rate') as string | null;
      const rate = rateStr ? parseInt(rateStr, 10) : null;
      const owner = formData.get('owner') as string;
      const hours = formData.get('hours') as string | null;
      const image = formData.get('image') as File;
      const location = formData.get('location') as string;
      const uploadedById = formData.get('uploadedById') as string | null;

      if (!name || !owner || !location || !image) {
        return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
      }

      // Upload da imagem
      const imageUrl = await uploadCommerceImage(image);

      // Validação dos dados
      const validationResult = commerceSchema.safeParse({
        name,
        description,
        phone,
        rate,
        owner,
        hours,
        imageUrl,
        location,
        uploadedById
      });

      if (!validationResult.success) {
        return NextResponse.json({ 
          error: 'Dados inválidos', 
          details: validationResult.error.format() 
        }, { status: 400 });
      }

      // Criar o comércio
      const commerce = await prisma.commerce.create({
        data: {
          name,
          description,
          phone,
          rate,
          owner,
          hours: typeof hours === 'string' ? JSON.parse(hours) : hours,
          imageUrl,
          location,
          uploadedById
        }
      });

      return NextResponse.json(commerce, { status: 201 });
    } else {
      return NextResponse.json({ 
        error: 'Content-Type não suportado. Use multipart/form-data, application/x-www-form-urlencoded ou application/json' 
      }, { status: 415 });
    }
  } catch (error) {
    console.error('Erro ao criar comércio:', error);
    return NextResponse.json({
      error: 'Erro ao criar comércio',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json({ error: 'ID do comércio não fornecido' }, { status: 400 });
    }

    const existingCommerce = await prisma.commerce.findUnique({ where: { id } });
    if (!existingCommerce) {
      return NextResponse.json({ error: 'Comércio não encontrado' }, { status: 404 });
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string | null;
    const phone = formData.get('phone') as string | null;
    const rateStr = formData.get('rate') as string | null;
    const rate = rateStr ? parseInt(rateStr, 10) : null;
    const owner = formData.get('owner') as string;
    const hours = formData.get('hours') as string | null;
    const image = formData.get('image') as File | null;
    const location = formData.get('location') as string;

    let imageUrl = existingCommerce.imageUrl;


    if (image && image.size > 0) {
      imageUrl = await uploadCommerceImage(image);
    }


    const updatedCommerce = await prisma.commerce.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        phone: phone !== undefined ? phone : undefined,
        rate: rate !== undefined ? rate : undefined,
        owner: owner || undefined,
        hours: hours !== undefined ? JSON.parse(hours || 'null') : undefined,
        imageUrl,
        location: location || undefined,
      }
    });

    return NextResponse.json(updatedCommerce);
  } catch (error) {
    console.error('Erro ao atualizar comércio:', error);
    return NextResponse.json({ error: 'Erro ao atualizar comércio' }, { status: 500 });
  }
}

// DELETE - Excluir um comércio
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID do comércio não fornecido' }, { status: 400 });
    }

    const commerce = await prisma.commerce.findUnique({ where: { id } });
    if (!commerce) {
      return NextResponse.json({ error: 'Comércio não encontrado' }, { status: 404 });
    }

    // Excluir a imagem do storage
    await deleteCommerceImage(commerce.imageUrl);
    
    // Excluir o comércio do banco de dados
    await prisma.commerce.delete({ where: { id } });

    return NextResponse.json({ message: 'Comércio excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir comércio:', error);
    return NextResponse.json({ error: 'Erro ao excluir comércio' }, { status: 500 });
  }
}

// Função para excluir imagem do comércio
async function deleteCommerceImage(imageUrl: string): Promise<void> {
  try {
    const { deleteCommerceImage } = await import('@/lib/supabase/commerce-storage');
    await deleteCommerceImage(imageUrl);
  } catch (error) {
    console.error('Erro ao excluir imagem do comércio:', error);
    throw new Error('Falha ao excluir imagem do comércio');
  }
}