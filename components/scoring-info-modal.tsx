'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SCORE_WEIGHTS, SCORE_LABELS, SCORE_DESCRIPTIONS, TIERS } from '@/lib/tier';
import { cn } from '@/lib/utils';

interface ScoringInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export function ScoringInfoModal({ open, onClose }: ScoringInfoModalProps) {
  const weightKeys = Object.keys(SCORE_WEIGHTS) as (keyof typeof SCORE_WEIGHTS)[];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto scrollbar-thin border-border/60 bg-card sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Scoring System</DialogTitle>
          <DialogDescription>
            How titles are evaluated, scored, and assigned a tier grade.
            DISCLAIMER: Ini sangat amat Subjektif.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Criteria */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Evaluation Criteria</h3>
            <div className="space-y-2">
              {weightKeys.map((key) => (
                <div
                  key={key}
                  className="rounded-lg border border-border/60 bg-secondary/30 px-4 py-3"
                >
                  <span className="text-sm font-medium text-foreground">{SCORE_LABELS[key]}</span>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {SCORE_DESCRIPTIONS[key].summary}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {SCORE_DESCRIPTIONS[key].points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2 text-xs leading-relaxed text-foreground/70"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/70" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              The overall score combines the four criteria above, each scored from 0 to 10.
            </p>
          </div>

          {/* Tier mapping */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Tier Conversion</h3>
            <div className="space-y-2">
              {TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 p-2.5"
                >
                  <div
                    className={cn(
                      'flex h-14 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-br',
                      tier.gradient
                    )}
                  >
                    <span className={cn('text-lg font-black leading-none', tier.text)}>
                      {tier.label}
                    </span>
                    <span className={cn('mt-1 text-[10px] font-medium leading-none', tier.text)}>
                      {tier.min.toFixed(1)}&ndash;{tier.max.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/80">{tier.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
