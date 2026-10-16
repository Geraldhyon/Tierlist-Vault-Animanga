import type { MediaItem } from '@/lib/types';

export function formatLength(item: MediaItem): string | null {
  // kalau masih ongoing, kasih tanda "+" karena angkanya masih bisa nambah
  const plus = item.status === 'Ongoing' ? '+' : '';
  const parts: string[] = [];

  if (item.seasons) parts.push(`${item.seasons} Season${item.seasons > 1 ? 's' : ''}`);
  if (item.episodes) parts.push(`${item.episodes}${plus} Eps`);
  if (item.chapters) parts.push(`${item.chapters}${plus} Chapters`);

  return parts.length ? parts.join(' \u00b7 ') : null;
}
