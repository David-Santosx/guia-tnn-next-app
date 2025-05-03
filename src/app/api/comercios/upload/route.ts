import { NextRequest, NextResponse } from 'next/server';
import { uploadCommerceImage } from '@/lib/supabase/commerce-storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo fornecido.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Tipo de arquivo inválido.' }, { status: 400 });
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'O tamanho do arquivo excede o limite de 10MB.' }, { status: 400 });
    }

    const imageUrl = await uploadCommerceImage(file);
    return NextResponse.json({ imageUrl });

  } catch (error) {
    console.error("Erro na API de upload:", error);
    const message = error instanceof Error ? error.message : 'Erro interno durante o upload.';
    return NextResponse.json({ error: message.startsWith('Falha') ? message : 'Falha no upload da imagem.' }, { status: 500 });
  }
}