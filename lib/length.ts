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

// Versi singkat buat kartu: "120+ Ch" (ongoing) / "120 Ch" (completed).
// Anime nggak punya chapter, jadi null.
export function formatChapters(item: MediaItem): string | null {
  if (!item.chapters) return null;
  return `${item.chapters}${item.status === 'Ongoing' ? '+' : ''} Ch`;
}

// Filter chapter: "diatas N" (cumulative). Judul tanpa data chapter
// (anime / belum diisi) nggak lolos filter ini.
export const CHAPTER_FILTERS = [
  { label: 'All', min: 0 },
  { label: '50+', min: 50 },
  { label: '100+', min: 100 },
  { label: '150+', min: 150 },
  { label: '200+', min: 200 },
] as const;

export type ChapterFilter = (typeof CHAPTER_FILTERS)[number]['label'];

export function matchesChapterFilter(item: MediaItem, filter: ChapterFilter): boolean {
  if (filter === 'All') return true;
  const min = CHAPTER_FILTERS.find((f) => f.label === filter)?.min ?? 0;
  return (item.chapters ?? 0) >= min;
}
