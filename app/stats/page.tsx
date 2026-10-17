import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { TierChart, GenreChart } from '@/components/stats-charts';
import {
  SCORE_LABELS,
  SCORE_WEIGHTS,
  TIERS,
  calculateOverall,
  calculateRawOverall,
  getTier,
  type MediaScores,
} from '@/lib/tier';
import { BADGE_BASE, TYPE_STYLES } from '@/lib/badge-styles';
import { cn } from '@/lib/utils';
import type { MediaItem } from '@/lib/types';
import rawData from '@/data/tierlist.json';

export const metadata: Metadata = {
  title: 'Stats \u2014 Geraldhyon Tier List',
  description: 'Titles per tier, average scores, and the most common genres in the tier list.',
};

const TOP_GENRES = 10;

// Semua dihitung di server saat build; yang dikirim ke browser cuma hasilnya.
const items: MediaItem[] = (rawData as Omit<MediaItem, 'overall'>[]).map((item) => ({
  ...item,
  overall: calculateOverall(item.scores),
}));

const mean = (nums: number[]) =>
  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;

const total = items.length;
const avgOverall = mean(items.map((i) => calculateRawOverall(i.scores)));
const completed = items.filter((i) => i.status === 'Completed').length;
const ongoing = total - completed;

const tierData = TIERS.map((t) => ({
  tier: t.label,
  count: items.filter((i) => getTier(i.overall).label === t.label).length,
}));

const criteria = (Object.keys(SCORE_WEIGHTS) as (keyof MediaScores)[]).map((key) => ({
  key,
  label: SCORE_LABELS[key],
  avg: mean(items.map((i) => i.scores[key])),
}));

const typeStats = (['Manhwa', 'Manga', 'Anime'] as const)
  .map((type) => {
    const list = items.filter((i) => i.type === type);
    return { type, count: list.length, avg: mean(list.map((i) => calculateRawOverall(i.scores))) };
  })
  .filter((t) => t.count > 0);

const genreCounts = new Map<string, number>();
for (const item of items) {
  for (const g of item.genres) genreCounts.set(g, (genreCounts.get(g) ?? 0) + 1);
}
const genreData = Array.from(genreCounts, ([genre, count]) => ({ genre, count }))
  .sort((a, b) => b.count - a.count || a.genre.localeCompare(b.genre))
  .slice(0, TOP_GENRES);

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black tracking-tight">
        {value}
        {hint && <span className="ml-1.5 text-xs font-medium text-muted-foreground">{hint}</span>}
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border/60 bg-card/40 p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Stats</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick summary of all {total} titles in the tier list.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total titles" value={String(total)} />
          <StatCard label="Average score" value={avgOverall.toFixed(2)} hint="/ 10" />
          <StatCard label="Completed" value={String(completed)} />
          <StatCard label="Ongoing" value={String(ongoing)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="Titles per tier">
            <TierChart data={tierData} />
          </Section>

          <Section title="Average score">
            <div className="space-y-3">
              {criteria.map(({ key, label, avg }) => (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="font-mono font-bold text-foreground">{avg.toFixed(2)}/10</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(avg / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
              {typeStats.map(({ type, count, avg }) => (
                <div
                  key={type}
                  className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2"
                >
                  <span className={cn(BADGE_BASE, TYPE_STYLES[type])}>{type}</span>
                  <span className="text-xs text-muted-foreground">
                    {count} {count === 1 ? 'title' : 'titles'} &middot; avg{' '}
                    <span className="font-mono font-bold text-foreground">{avg.toFixed(2)}</span>
                  </span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        <Section title={`Most common genres (top ${genreData.length})`}>
          <GenreChart data={genreData} />
        </Section>
      </main>
    </div>
  );
}
