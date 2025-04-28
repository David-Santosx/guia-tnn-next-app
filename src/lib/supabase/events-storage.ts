import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'events-photos';

// Initialize admin client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function uploadEventImage(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload.');
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
    console.error('Supabase upload error:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    await supabaseAdmin.storage.from(BUCKET_NAME).remove([data.path]);
    throw new Error('Failed to get public URL for the uploaded image.');
  }

  return publicUrlData.publicUrl;
}

export async function deleteEventImage(imageUrl: string): Promise<boolean> {
  try {
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const bucketNameIndex = pathSegments.findIndex(segment => segment === BUCKET_NAME);
    
    if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
      console.error("Could not extract file path from URL:", imageUrl);
      return false;
    }
    
    const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
}