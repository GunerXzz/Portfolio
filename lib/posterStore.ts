import { Poster } from './types';
import { INITIAL_POSTERS } from './initialData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEY = 'sok_chanmony_posters_v2';

export function getStoredPosters(): Poster[] {
  if (typeof window === 'undefined') return INITIAL_POSTERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_POSTERS));
      return INITIAL_POSTERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_POSTERS;
  } catch (err) {
    console.error('Error reading posters from localStorage:', err);
    return INITIAL_POSTERS;
  }
}

export function saveStoredPosters(posters: Poster[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posters));
    // Dispatch custom event for cross-component real-time sync
    window.dispatchEvent(new Event('posters-updated'));
  } catch (err) {
    console.error('Error writing posters to localStorage:', err);
  }
}

export async function syncPostersFromSupabase(): Promise<Poster[]> {
  if (!isSupabaseConfigured || !supabase) {
    return getStoredPosters();
  }

  try {
    const { data, error } = await supabase
      .from('posters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (data && data.length > 0) {
      const dbPosters: Poster[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        description: item.description,
        image_url: item.image_url,
        aspect_ratio: item.aspect_ratio || 'portrait',
        tags: item.tags || [],
        created_at: item.created_at,
        isVisible: item.is_visible !== undefined ? item.is_visible : true,
      }));
      saveStoredPosters(dbPosters);
      return dbPosters;
    }
  } catch (err) {
    console.warn('Supabase fetch fallback to local store:', err);
  }

  return getStoredPosters();
}
