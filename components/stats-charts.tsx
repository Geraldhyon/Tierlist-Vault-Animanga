'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Warna tiap tier (setara warna gradient di tier board).
const TIER_COLORS: Record<string, string> = {
  'S+': '#ef4444',
  S: '#f97316',
  'A+': '#fbbf24',
  A: '#fde047',
  'B+': '#a3e635',
  B: '#10b981',
  C: '#0ea5e9',
  'D/F': '#52525b',
};

const AXIS_TICK = { fill: 'hsl(var(--muted-foreground))', fontSize: 12 };
const TOOLTIP_STYLE = {
  background: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: 8,
  fontSize: 12,
};
const CURSOR = { fill: 'hsl(var(--secondary) / 0.5)' };

// Sembunyiin label "0" di atas bar kosong.
const hideZero = (v: unknown) => (typeof v === 'number' && v > 0 ? v : '');

export function TierChart({ data }: { data: { tier: string; count: number }[] }) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="tier" tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={AXIS_TICK} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={CURSOR}
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="count" name="Titles" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.tier} fill={TIER_COLORS[d.tier] ?? '#71717a'} />
            ))}
            <LabelList
              dataKey="count"
              position="top"
              formatter={hideZero}
              fill="hsl(var(--foreground))"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GenreChart({ data }: { data: { genre: string; count: number }[] }) {
  return (
    <div className="w-full" style={{ height: data.length * 32 + 16 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 32, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="genre"
            width={100}
            tick={AXIS_TICK}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={CURSOR}
            contentStyle={TOOLTIP_STYLE}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="count" name="Titles" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="count"
              position="right"
              fill="hsl(var(--foreground))"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
