'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SCORE_WEIGHTS,
  SCORE_LABELS,
  calculateOverall,
  getTier,
  type MediaScores,
} from '@/lib/tier';
import type { MediaItem } from '@/lib/types';
import { formatLength } from '@/lib/length';
import { ReadLinks } from '@/components/read-links';

interface DetailModalProps {
  item: MediaItem | null;
  open: boolean;
  onClose: () => void;
}

const TYPE_STYLES: Record<string, string> = {
  Anime: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Manga: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Manhwa: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};

export function DetailModal({ item, open, onClose }: DetailModalProps) {
  if (!item) return null;

  const overall = calculateOverall(item.scores);
  const tier = getTier(overall);
  const lengthText = formatLength(item);
  const scoreKeys = Object.keys(SCORE_WEIGHTS) as (keyof MediaScores)[];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-thin border-border/60 bg-card p-0 sm:max-w-2xl">
        {/* Cover header */}
        <div className="relative h-40 w-full overflow-hidden bg-secondary sm:h-52">
          {item.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.coverImage}
              alt={item.title}
              className="h-full w-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end gap-4 p-6">
            <div className="relative w-20 shrink-0 overflow-hidden rounded-lg border-2 border-border/60 bg-secondary shadow-xl sm:w-24">
              {item.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.coverImage} alt={item.title} className="aspect-[3/4] w-full object-cover" />
              ) : (
                <div className="flex aspect-[3/4] w-full items-center justify-center bg-secondary p-2 text-center">
                  <span className="text-xs font-bold text-muted-foreground">{item.title}</span>
                </div>
              )}
            </div>
            <div className="flex-1 pt-2">
              <div className="mb-2 flex flex-wrap gap-2">
                <span
                  className={cn(
                    'rounded-md border px-2 py-0.5 text-xs font-bold',
                    TYPE_STYLES[item.type] ?? 'bg-secondary text-foreground border-border'
                  )}
                >
                  {item.type}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {item.status === 'Completed' ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-amber-400" />
                  )}
                  {item.status}
                </span>
                {lengthText && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-secondary/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {lengthText}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                {item.title}
              </h2>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 pt-2">
          {/* Overall score + Tier badge */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary">
                <span className="text-xl font-black text-primary-foreground">{overall.toFixed(1)}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Overall Score</p>
                <p className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  out of 10
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br',
                  tier.gradient
                )}
              >
                <span className={cn('text-xl font-black', tier.text)}>{tier.label}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grade Tier</p>
                <p className="text-sm font-semibold">
                  {tier.min.toFixed(1)} &ndash; {tier.max.toFixed(1)} range
                </p>
              </div>
            </div>
          </div>

          {/* Baca / tonton di mana (dari readLinks di tierlist.json) */}
          <ReadLinks item={item} />

          {/* Genres */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {item.genres.map((g) => (
                <Badge key={g} variant="secondary" className="bg-secondary/60 text-muted-foreground">
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Synopsis</h3>
            <p className="text-sm leading-relaxed text-foreground/90">{item.synopsis}</p>
          </div>

          {/* Personal Review */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">Personal Review</h3>
            <div className="rounded-lg border border-border/60 bg-secondary/20 p-4">
              <p className="text-sm italic leading-relaxed text-foreground/80">{item.review}</p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Score Breakdown</h3>
            <div className="space-y-3">
              {scoreKeys.map((key) => {
                const score = item.scores[key];
                const weight = SCORE_WEIGHTS[key];
                const pct = (score / 10) * 100;
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{SCORE_LABELS[key]}</span>
                        <span className="text-muted-foreground">({Math.round(weight * 100)}%)</span>
                      </div>
                      <span className="font-mono font-bold text-foreground">{score.toFixed(1)}/10</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-lg border border-border/60 bg-secondary/30 px-4 py-3">
              <span className="text-sm font-semibold text-muted-foreground">Calculated Overall</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-2xl font-black text-foreground">{overall.toFixed(1)}</span>
                <span
                  className={cn(
                    'rounded-md bg-gradient-to-r px-2 py-0.5 text-sm font-bold',
                    tier.gradient,
                    tier.text
                  )}
                >
                  {tier.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
