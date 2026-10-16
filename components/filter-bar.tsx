'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type Category = 'All' | 'Anime' | 'Manga' | 'Manhwa';

interface FilterBarProps {
  categories: Category[];
  activeCategory: Category;
  onCategoryChange: (c: Category) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  genres: string[];
  activeGenre: string;
  onGenreChange: (g: string) => void;
  tiers: string[];
  activeTier: string;
  onTierChange: (t: string) => void;
  resultCount: number;
}

export function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  genres,
  activeGenre,
  onGenreChange,
  tiers,
  activeTier,
  onTierChange,
  resultCount,
}: FilterBarProps) {
  const hasFilters =
    activeCategory !== 'All' ||
    activeGenre !== 'All' ||
    activeTier !== 'All' ||
    searchQuery !== '';

  const clearAll = () => {
    onCategoryChange('All');
    onGenreChange('All');
    onTierChange('All');
    onSearchChange('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all',
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:max-w-xs sm:ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search titles..."
            className="h-9 pl-9 pr-8"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Genre:</span>
          <select
            value={activeGenre}
            onChange={(e) => onGenreChange(e.target.value)}
              className="h-8 rounded-lg border border-border/60 bg-secondary/60 px-2.5 text-xs text-foreground outline-none transition-colors hover:bg-secondary focus:border-primary"
          >
            <option value="All">All</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted-foreground">Tier:</span>
          <select
            value={activeTier}
            onChange={(e) => onTierChange(e.target.value)}
            className="h-8 rounded-lg border border-border/60 bg-secondary/60 px-2.5 text-xs text-foreground outline-none transition-colors hover:bg-secondary focus:border-primary"
          >
            <option value="All">All</option>
            {tiers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? 'title' : 'titles'}
        </span>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
