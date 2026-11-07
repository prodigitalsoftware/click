import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://prunuegthoruksqyqang.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JDHakneZBhPJnnRrt4GVXA_BWujh-IQ';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Upload an image file to Supabase Storage bucket 'product-images'
 */
export async function uploadFileToSupabase(file: File, bucket = 'product-images'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
}

