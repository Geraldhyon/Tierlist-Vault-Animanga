'use client';

import { BookOpen, ExternalLink, Play } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { MediaItem, ReadLink } from '@/lib/types';


function isSafeUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

function getHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}


export function getReadLinks(item: MediaItem): ReadLink[] {
  return (item.readLinks ?? []).filter((l) => l && l.name && l.url && isSafeUrl(l.url));
}


export function ReadLinks({ item, compact = false }: { item: MediaItem; compact?: boolean }) {
  const links = getReadLinks(item);

  
  if (links.length === 0) return null;

  const isAnime = item.type === 'Anime';
  const Icon = isAnime ? Play : BookOpen;
  const label = isAnime ? 'Tonton di sini' : 'Baca di sini';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={
            compact
              ? 'inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-2 py-1.5 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              : 'inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          }
        >
          <Icon className={compact ? 'h-3 w-3' : 'h-4 w-4'} />
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <p className="px-2 pb-1.5 pt-1 text-xs font-semibold text-muted-foreground">
          {isAnime ? 'Tonton lewat' : 'Baca lewat'}
        </p>
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors hover:bg-secondary/60"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {link.name}
                  </span>
                  <span className="block truncate text-[11px] text-muted-foreground">
                    {getHost(link.url)}
                  </span>
                </span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
              </a>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
