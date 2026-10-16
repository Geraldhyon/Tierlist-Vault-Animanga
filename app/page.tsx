'use client';

import { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/header';
import { FilterBar, type Category } from '@/components/filter-bar';
import { TierBoard } from '@/components/tier-board';
import { DetailModal } from '@/components/detail-modal';
import { ScoringInfoModal } from '@/components/scoring-info-modal';
import { calculateOverall, calculateRawOverall, getTier, TIERS } from '@/lib/tier';
import type { MediaItem } from '@/lib/types';
import rawData from '@/data/tierlist.json';

const CATEGORIES: Category[] = ['All', 'Anime', 'Manga', 'Manhwa'];
const TIER_LABELS = TIERS.map((t) => t.label);

// Urut dari skor tertinggi ke terendah. TierBoard cuma nge-filter per tier,
// jadi urutan ini otomatis kepakai di dalam tiap grup tier.
// Kalau overall (dibulatkan) sama, dibandingin pakai skor mentah, lalu judul A-Z.
const ALL_ITEMS: MediaItem[] = (rawData as Omit<MediaItem, 'overall'>[])
  .map((item) => ({
    ...item,
    overall: calculateOverall(item.scores),
  }))
  .sort(
    (a, b) =>
      calculateRawOverall(b.scores) - calculateRawOverall(a.scores) ||
      a.title.localeCompare(b.title)
  );

const ALL_GENRES = Array.from(new Set(ALL_ITEMS.flatMap((i) => i.genres))).sort();

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [activeTier, setActiveTier] = useState('All');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [scoringOpen, setScoringOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter((item) => {
      if (activeCategory !== 'All' && item.type !== activeCategory) return false;
      if (activeGenre !== 'All' && !item.genres.includes(activeGenre)) return false;
      if (activeTier !== 'All' && getTier(item.overall).label !== activeTier) return false;
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [activeCategory, activeGenre, activeTier, searchQuery]);

  const handleSelect = useCallback((item: MediaItem) => {
    setSelectedItem(item);
    setDetailOpen(true);
  }, []);

  const handleDetailClose = useCallback(() => {
    setDetailOpen(false);
    setSelectedItem(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header onShowScoring={() => setScoringOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <FilterBar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          genres={ALL_GENRES}
          activeGenre={activeGenre}
          onGenreChange={setActiveGenre}
          tiers={TIER_LABELS}
          activeTier={activeTier}
          onTierChange={setActiveTier}
          resultCount={filteredItems.length}
        />

        <div className="mt-6">
          <TierBoard items={filteredItems} onSelect={handleSelect} />
        </div>
      </main>

      <footer className="border-t border-border/40 px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          &copy; 2026 Geraldhyon &middot;{' '}
          <a
            href="https://github.com/Geraldhyon"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            GitHub
          </a>
        </p>
      </footer>

      <DetailModal item={selectedItem} open={detailOpen} onClose={handleDetailClose} />
      <ScoringInfoModal open={scoringOpen} onClose={() => setScoringOpen(false)} />
    </div>
  );
}
