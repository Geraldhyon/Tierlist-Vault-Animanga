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
}

export const TIERS: TierInfo[] = [
  { label: 'S+', min: 9.5, max: 10, gradient: 'from-red-500 to-red-600', text: 'text-white' },
  { label: 'S', min: 9.0, max: 9.49, gradient: 'from-orange-500 to-orange-600', text: 'text-white' },
  { label: 'A+', min: 8.5, max: 8.99, gradient: 'from-amber-400 to-amber-500', text: 'text-amber-950' },
  { label: 'A', min: 8.0, max: 8.49, gradient: 'from-yellow-300 to-yellow-400', text: 'text-yellow-950' },
  { label: 'B+', min: 7.5, max: 7.99, gradient: 'from-lime-400 to-lime-500', text: 'text-lime-950' },
  { label: 'B', min: 7.0, max: 7.49, gradient: 'from-emerald-500 to-emerald-600', text: 'text-white' },
  { label: 'C', min: 6.0, max: 6.99, gradient: 'from-sky-500 to-sky-600', text: 'text-white' },
  { label: 'D/F', min: 0, max: 5.99, gradient: 'from-zinc-600 to-zinc-700', text: 'text-zinc-100' },
];

export function getTier(overall: number): TierInfo {
  return TIERS.find((t) => overall >= t.min && overall <= t.max) ?? TIERS[TIERS.length - 1];
}
