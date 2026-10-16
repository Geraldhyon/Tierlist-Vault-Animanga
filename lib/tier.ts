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

export interface MediaScores {
  story: number;
  character: number;
  art: number;
  enjoyment: number;
}

export function calculateOverall(scores: MediaScores): number {
  const overall =
    scores.story * SCORE_WEIGHTS.story +
    scores.character * SCORE_WEIGHTS.character +
    scores.art * SCORE_WEIGHTS.art +
    scores.enjoyment * SCORE_WEIGHTS.enjoyment;
  return Math.round(overall * 10) / 10;
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
