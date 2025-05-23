import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'events-images';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

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

    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `public/${uniqueFileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Erro de upload no Supabase:', uploadError);
      throw new Error(`Falha ao fazer upload da imagem: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadData.path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
      await supabaseAdmin.storage.from(BUCKET_NAME).remove([uploadData.path]);
      throw new Error('Falha ao obter URL pública para a imagem enviada.');
    }

    return NextResponse.json({ imageUrl: publicUrlData.publicUrl });

  } catch (error) {
    console.error("Erro na API de upload:", error);
    const message = error instanceof Error ? error.message : 'Erro interno durante o upload.';
    return NextResponse.json({ error: message.startsWith('Falha') ? message : 'Falha no upload da imagem.' }, { status: 500 });
  }
}