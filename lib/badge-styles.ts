// Style badge yang dipakai bareng di kartu & modal.
// Semua background SOLID (opacity 100%), jadi tetap kebaca di atas cover apa pun
// dan nggak butuh backdrop-blur (yang bikin scroll berat).

// Ukuran & bentuk badge di kartu (type, rating, status) dibikin sama persis.
export const BADGE_BASE =
  'inline-flex h-5 items-center gap-1 rounded-md border px-1.5 text-[10px] font-bold leading-none';

export const TYPE_STYLES: Record<string, string> = {
  Anime: 'border-sky-700 bg-sky-950 text-sky-300',
  Manga: 'border-rose-700 bg-rose-950 text-rose-300',
  Manhwa: 'border-violet-700 bg-violet-950 text-violet-300',
};

export const RATING_STYLE = 'border-zinc-700 bg-zinc-950 text-white';

export const STATUS_STYLES: Record<string, string> = {
  Ongoing: 'border-emerald-700 bg-emerald-950 text-emerald-300',
  Completed: 'border-zinc-600 bg-zinc-800 text-zinc-100',
};

export const FALLBACK_BADGE = 'border-zinc-700 bg-zinc-900 text-foreground';
