import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-id')
);

// Fallback or active client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Upload a compressed image file directly to the Supabase storage bucket 'poster-gallery'
 */
export async function uploadPosterImage(file: Blob, fileName: string): Promise<string> {
  if (!supabase || !isSupabaseConfigured) {
    // If Supabase is not yet configured, create an object URL or base64 so local testing succeeds smoothly
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  const cleanName = `${Date.now()}-${fileName.replace(/\s+/g, '-').toLowerCase()}`;
  const filePath = `posters/${cleanName}`;

  const { data, error } = await supabase.storage
    .from('poster-gallery')
    .upload(filePath, file, {
      contentType: 'image/webp',
      upsert: true,
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from('poster-gallery')
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
