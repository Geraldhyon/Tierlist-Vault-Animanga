'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIERS, getTier } from '@/lib/tier';
import type { MediaItem } from '@/lib/types';

interface TierBoardProps {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
}

const TYPE_STYLES: Record<string, string> = {
  Anime: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Manga: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Manhwa: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};

export function TierBoard({ items, onSelect }: TierBoardProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border/60 py-20 text-center">
        <p className="text-lg font-semibold text-muted-foreground">No titles match your filters</p>
        <p className="mt-1 text-sm text-muted-foreground/60">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {TIERS.map((tier) => {
        const tierItems = items.filter((item) => {
          const itemTier = getTier(item.overall);
          return itemTier.label === tier.label;
        });

        if (tierItems.length === 0) return null;

        return (
          <div
            key={tier.label}
            className="overflow-hidden rounded-lg border border-border/60 bg-card/40"
          >
            <div className="flex flex-col sm:flex-row">
              <div
                className={cn(
                  'flex items-center justify-center bg-gradient-to-br px-6 py-4 sm:w-28 sm:py-0',
                  tier.gradient,
                  tier.text
                )}
              >
                <span className="text-2xl font-black tracking-tight drop-shadow-sm sm:text-3xl">
                  {tier.label}
                </span>
              </div>

              <div className="flex flex-1 flex-wrap gap-3 p-3">
                {tierItems.map((item) => (
                  <MediaCard key={item.id} item={item} onSelect={onSelect} />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MediaCard({ item, onSelect }: { item: MediaItem; onSelect: (item: MediaItem) => void }) {
  const tier = getTier(item.overall);

  return (
    <button
      onClick={() => onSelect(item)}
      className="group relative w-[140px] shrink-0 overflow-hidden rounded-lg border border-border/60 bg-card text-left transition-all hover:border-primary/40 sm:w-[160px]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.coverImage}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-secondary/40 p-3 text-center">
            <span className="text-sm font-semibold leading-tight text-muted-foreground">
              {item.title}
            </span>
          </div>
        )}
        <div className="absolute left-2 top-2">
          <span
            className={cn(
              'rounded-md border px-1.5 py-0.5 text-[10px] font-bold backdrop-blur-sm',
              TYPE_STYLES[item.type] ?? 'bg-secondary/80 text-foreground border-border'
            )}
          >
            {item.type}
          </span>
        </div>
        <div className="absolute right-2 top-2 flex items-center gap-0.5 rounded-md bg-black/70 px-1.5 py-0.5 backdrop-blur-sm">
          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-bold text-white">{item.overall.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-2.5">
        <h3 className="line-clamp-1 text-xs font-semibold text-foreground">{item.title}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {item.genres.slice(0, 2).map((g) => (
            <span
              key={g}
              className="rounded bg-secondary/60 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
            >
              {g}
            </span>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center rounded bg-gradient-to-r px-1.5 py-0.5 text-[9px] font-bold',
              tier.gradient,
              tier.text
            )}
          >
            {tier.label}
          </span>
          <span className="text-[9px] text-muted-foreground">{item.status}</span>
        </div>
      </div>
    </button>
  );
}
