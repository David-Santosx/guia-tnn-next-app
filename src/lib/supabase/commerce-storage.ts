import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'commerce-photos';

// Inicializa o cliente admin para operações no servidor
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function uploadCommerceImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('Nenhum arquivo fornecido para upload.');
  }

  const fileExtension = file.name.split('.').pop();
  const uniqueFileName = `${uuidv4()}.${fileExtension}`;
  const filePath = `${uniqueFileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Erro no upload do Supabase:', error);
    throw new Error(`Falha ao fazer upload da imagem: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    await supabaseAdmin.storage.from(BUCKET_NAME).remove([data.path]);
    throw new Error('Falha ao obter URL pública para a imagem enviada.');
  }

  return publicUrlData.publicUrl;
}

export async function deleteCommerceImage(imageUrl: string): Promise<boolean> {
  try {
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const bucketNameIndex = pathSegments.findIndex(segment => segment === BUCKET_NAME);
    
    if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
      console.error("Não foi possível extrair o caminho do arquivo da URL:", imageUrl);
      return false;
    }
    
    const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Erro ao deletar do Supabase:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    return false;
  }
}