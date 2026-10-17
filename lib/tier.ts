export const SCORE_WEIGHTS = {
  story: 0.35,
  character: 0.25,
  art: 0.25,
  enjoyment: 0.15,
} as const;

export const SCORE_LABELS: Record<keyof typeof SCORE_WEIGHTS, string> = {
  story: 'Story & Pacing',
  character: 'Character Development',
  art: 'Art Style / Animation',
  enjoyment: 'Enjoyment / Impact',
};

// Penjelasan tiap kriteria penilaian (tampil di modal "Scoring System").
// Edit teks di sini kalau mau ganti penjelasannya.
export const SCORE_DESCRIPTIONS: Record<
  keyof typeof SCORE_WEIGHTS,
  { summary: string; points: string[] }
> = {
  story: {
    summary: 'The plot itself and how well it is told from start to finish.',
    points: [
      'Is the premise fresh, or at least executed really well?',
      'Does the pacing keep me hooked without dragging or rushing?',
      'Is the world and plot consistent, with a satisfying direction or ending?',
    ],
  },
  character: {
    summary: 'How well the cast is written and how much they grow over time.',
    points: [
      'Do the main and side characters have distinct personalities and motivations?',
      'Do they actually develop, instead of staying the same the whole way?',
      'Is the MC believable, not just overpowered for no reason?',
    ],
  },
  art: {
    summary: 'The visual side of the work.',
    points: [
      'Manga / Manhwa: art style, panel flow, character and cover design.',
      'Anime: animation quality, direction, and overall visual polish.',
      'Do the visuals make fights, emotions, and key moments hit harder?',
    ],
  },
  enjoyment: {
    summary: 'My personal gut feeling: how fun it was and how much it stuck with me.',
    points: [
      'How badly did I want to binge it?',
      'How strong was the emotional impact or hype?',
      'Would I reread / rewatch it, and does it stay in my head after finishing?',
    ],
  },
};

export interface MediaScores {
  story: number;
  character: number;
  art: number;
  enjoyment: number;
}

// Skor mentah (belum dibulatkan). Dipakai buat tiebreak urutan di tierlist,
// supaya judul dengan overall sama (mis. 9.6) tetap urut dengan adil.
export function calculateRawOverall(scores: MediaScores): number {
  return (
    scores.story * SCORE_WEIGHTS.story +
    scores.character * SCORE_WEIGHTS.character +
    scores.art * SCORE_WEIGHTS.art +
    scores.enjoyment * SCORE_WEIGHTS.enjoyment
  );
}

export function calculateOverall(scores: MediaScores): number {
  return Math.round(calculateRawOverall(scores) * 10) / 10;
}

export interface TierInfo {
  label: string;
  min: number;
  max: number;
  gradient: string;
  text: string;
  // Arti tier-nya (tampil di modal "Scoring System").
  description: string;
}

// Overall dibulatkan ke 1 desimal, jadi batasnya jelas:
// S+ di atas 9.5 (mulai 9.6), S 9.1 - 9.5 (9.0 masih A).
export const TIERS: TierInfo[] = [
  {
    label: 'S+',
    min: 9.6,
    max: 10,
    gradient: 'from-red-500 to-red-600',
    text: 'text-white',
    description: 'PEAK. Sebagus itu, wajib baca.',
  },
  {
    label: 'S',
    min: 9.1,
    max: 9.5,
    gradient: 'from-orange-500 to-orange-600',
    text: 'text-white',
    description: 'Nearly peak. tinggal ada hal kecil yang gw nggak suka.',
  },
  {
    label: 'A',
    min: 8.0,
    max: 9.0,
    gradient: 'from-yellow-300 to-yellow-400',
    text: 'text-yellow-950',
    description: 'Worth dibaca.',
  },
  {
    label: 'B',
    min: 7.0,
    max: 7.9,
    gradient: 'from-emerald-500 to-emerald-600',
    text: 'text-white',
    description: 'Worth dibaca kalau udah mentok semua bacaan (kalau A-S+ mentok semua).',
  },
  {
    label: 'C',
    min: 6.0,
    max: 6.9,
    gradient: 'from-sky-500 to-sky-600',
    text: 'text-white',
    description: 'Mmm, kalau nganggur oke.',
  },
  {
    label: 'D',
    min: 0,
    max: 5.9,
    gradient: 'from-zinc-600 to-zinc-700',
    text: 'text-zinc-100',
    description: 'Buang waktu idup.',
  },
];

// Cuma pakai batas bawah (min) supaya nggak ada celah antar tier.
export function getTier(overall: number): TierInfo {
  return TIERS.find((t) => overall >= t.min) ?? TIERS[TIERS.length - 1];
}
