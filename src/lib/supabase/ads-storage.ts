import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'ads-photos';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function uploadAdImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido para upload.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Erro no upload do Supabase:', error);
    throw new Error(`Falha ao fazer upload da imagem: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  if (!publicUrlData.publicUrl) {
    await supabaseAdmin.storage.from(BUCKET_NAME).remove([data.path]);
    throw new Error('Falha ao obter URL pública para a imagem enviada.');
  }

  return publicUrlData.publicUrl;
}

export async function deleteAdImage(imageUrl: string): Promise<void> {
  const pathSegments = imageUrl.split('/');
  const bucketNameIndex = pathSegments.findIndex(segment => segment === BUCKET_NAME);

  if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
    throw new Error('URL da imagem inválida');
  }

  const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

  const { error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    console.error('Erro ao deletar do Supabase:', error);
    throw new Error('Falha ao deletar imagem');
  }
}