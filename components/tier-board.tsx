'use client';

import { memo, useMemo } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIERS, getTier } from '@/lib/tier';
import {
  BADGE_BASE,
  FALLBACK_BADGE,
  RATING_STYLE,
  STATUS_STYLES,
  TYPE_STYLES,
} from '@/lib/badge-styles';
import { ReadLinks, getReadLinks } from '@/components/read-links';
import { CoverImage } from '@/components/cover-image';
import { formatChapters } from '@/lib/length';
import type { MediaItem } from '@/lib/types';

interface TierBoardProps {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
}

export function TierBoard({ items, onSelect }: TierBoardProps) {
  // Kelompokkan sekali jalan (O(n)), bukan filter ulang per tier tiap render.
  // Urutan item di dalam tier tetap sama seperti urutan `items`.
  const grouped = useMemo(() => {
    const map = new Map<string, MediaItem[]>();
    for (const item of items) {
      const label = getTier(item.overall).label;
      const list = map.get(label);
      if (list) list.push(item);
      else map.set(label, [item]);
    }
    return map;
  }, [items]);

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
        const tierItems = grouped.get(tier.label) ?? [];

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

// memo: kartu nggak di-render ulang kalau item & onSelect-nya nggak berubah
// (mis. waktu ngetik di search / buka-tutup modal).
const MediaCard = memo(function MediaCard({
  item,
  onSelect,
}: {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
}) {
  const hasLinks = getReadLinks(item).length > 0;
  const chapters = formatChapters(item);

  return (
    // Wrapper-nya <div> (bukan <button>) karena di dalamnya ada 2 aksi terpisah:
    // buka detail (tombol utama) dan "Baca di sini" (popover). Button di dalam
    // button itu nggak valid di HTML.
    <div className="group relative flex w-[140px] shrink-0 flex-col overflow-hidden rounded-lg border border-border/60 bg-card transition-colors hover:border-primary/40 sm:w-[160px]">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
          <CoverImage
            src={item.coverImage}
            alt={item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            fallback={
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-secondary/40 p-3 text-center">
                <span className="text-sm font-semibold leading-tight text-muted-foreground">
                  {item.title}
                </span>
              </div>
            }
          />
          <div className="absolute left-2 top-2">
            <span className={cn(BADGE_BASE, TYPE_STYLES[item.type] ?? FALLBACK_BADGE)}>
              {item.type}
            </span>
          </div>
          <div className="absolute right-2 top-2">
            <span className={cn(BADGE_BASE, RATING_STYLE)}>
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              {item.overall.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="w-full p-2.5">
          <div className="flex flex-wrap items-center gap-1">
            <span className={cn(BADGE_BASE, STATUS_STYLES[item.status] ?? FALLBACK_BADGE)}>
              {item.status}
            </span>
            {chapters && (
              <span className={cn(BADGE_BASE, 'border-zinc-700 bg-zinc-900 text-zinc-300')}>
                {chapters}
              </span>
            )}
          </div>
          <h3 className="mt-1.5 line-clamp-1 text-xs font-semibold text-foreground">{item.title}</h3>
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
        </div>
      </button>

      {hasLinks && (
        <div className="px-2.5 pb-2.5">
          <ReadLinks item={item} compact />
        </div>
      )}
    </div>
  );
});
