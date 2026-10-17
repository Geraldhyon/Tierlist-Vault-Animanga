'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Info, Github, BarChart3, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  // Opsional: tombol "Scoring System" cuma muncul kalau handler-nya dikasih
  // (di halaman tierlist), dan disembunyiin di halaman lain (mis. /stats).
  onShowScoring?: () => void;
}

export function Header({ onShowScoring }: HeaderProps) {
  const pathname = usePathname();
  const onStats = pathname?.startsWith('/stats') ?? false;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-lg font-black text-primary-foreground">
            G
          </div>
          <div>
            <h1 className="text-lg font-extrabold leading-tight tracking-tight">
              Geraldhyon
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Anime &middot; Manga &middot; Manhwa tier list
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onShowScoring && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowScoring}
              className="gap-2 border-border/60 bg-transparent"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Scoring System</span>
              <span className="sm:hidden">Info</span>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-2 border-border/60 bg-transparent"
          >
            {onStats ? (
              <Link href="/" aria-label="Back to tier list">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Tier List</span>
              </Link>
            ) : (
              <Link href="/stats" aria-label="Stats">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Stats</span>
              </Link>
            )}
          </Button>
          <a
            href="https://github.com/Geraldhyon/Tierlist-Vault-Animanga"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="GitHub Repository"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
