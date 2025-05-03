import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'gallery-photos';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
         return NextResponse.json({ error: 'Invalid file type.' }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
         return NextResponse.json({ error: 'File size exceeds 15MB limit.' }, { status: 400 });
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
      console.error('Server-side Supabase upload error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(uploadData.path);

    if (!publicUrlData || !publicUrlData.publicUrl) {
       await supabaseAdmin.storage.from(BUCKET_NAME).remove([uploadData.path]);
       throw new Error('Failed to get public URL for the uploaded image.');
    }

    return NextResponse.json({ imageUrl: publicUrlData.publicUrl });

  } catch (error) {
    console.error("Upload API error:", error);
    const message = error instanceof Error ? error.message : 'Internal server error during upload.';
    return NextResponse.json({ error: message.startsWith('Failed to') ? message : 'Image upload failed.' }, { status: 500 });
  }
}