import { NextRequest, NextResponse } from 'next/server';
import { uploadAdImage } from '@/lib/supabase/ads-storage';

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
    
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Tamanho do arquivo excede o limite de 5MB.' }, { status: 400 });
    }

    const imageUrl = await uploadAdImage(file);
    
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Erro no upload:', error);
    const message = error instanceof Error ? error.message : 'Erro interno durante o upload.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}