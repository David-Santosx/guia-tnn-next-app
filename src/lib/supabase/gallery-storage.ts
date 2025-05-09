import { supabaseAdmin } from '@/app/api/galeria/upload/route';

/**
 * Exclui uma imagem da galeria no Supabase Storage
 * @param imageUrl URL completa da imagem a ser excluída
 * @returns Promise<boolean> indicando se a exclusão foi bem-sucedida
 */
export async function deleteGalleryImage(imageUrl: string): Promise<boolean> {
  try {
    const url = new URL(imageUrl);
    const pathSegments = url.pathname.split('/');
    const bucketNameIndex = pathSegments.findIndex(segment => segment === "gallery-photos");

    if (bucketNameIndex === -1 || bucketNameIndex + 1 >= pathSegments.length) {
      console.error("Could not extract file path from URL:", imageUrl);
      return false;
    }

    const filePath = pathSegments.slice(bucketNameIndex + 1).join('/');

    // Use admin client for deletion to bypass RLS
    const { error } = await supabaseAdmin.storage
      .from("gallery-photos")
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