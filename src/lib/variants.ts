import { Product } from '../types';

// Groups variants like "Oppo A6X 5G (4GB/128GB) - ..." by base model name.
// Base = text before first " (" — old catalog names without " (" stay single.

export function baseNameOf(p: Product): string {
  const i = p.name.indexOf(' (');
  return (i > 0 ? p.name.slice(0, i) : p.name).trim();
}

export function groupKeyOf(p: Product): string {
  return `${p.brand.toLowerCase()}||${baseNameOf(p).toLowerCase()}`;
}

export function sizeLabelOf(p: Product): string {
  const ram = (p.specs?.RAM || '').replace(/\s+/g, '');
  const st = (p.specs?.Storage || '').replace(/\s+/g, '');
  if (ram && st) return `${ram}+${st}`;
  const m = p.name.match(/\(([^)]+)\)/);
  return m ? m[1].replace(/\s*\/\s*/g, '+').replace(/\s+/g, '') : '';
}

export function colorsOf(p: Product): string[] {
  const raw = (p.specs?.Colour || p.specs?.Color || '') as string;
  if (!raw) return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function groupVariants(all: Product[], p: Product): Product[] {
  const key = groupKeyOf(p);
  const list = all.filter((x) => groupKeyOf(x) === key);
  if (list.length <= 1) return list;
  // Sort by price so cheapest is default representative
  return [...list].sort((a, b) => a.price - b.price);
}

export interface GroupedInfo {
  rep: Product;
  count: number;
  minPrice: number;
  maxPrice: number;
  sizes: number;
}

// Dedupe a sorted list to 1 card per model (keeps first = per current sort)
export function dedupeToRepresentatives(sorted: Product[]): { rep: Product; count: number }[] {
  const seen = new Set<string>();
  const out: { rep: Product; count: number }[] = [];
  const counts = new Map<string, number>();
  for (const p of sorted) counts.set(groupKeyOf(p), (counts.get(groupKeyOf(p)) || 0) + 1);
  for (const p of sorted) {
    const k = groupKeyOf(p);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ rep: p, count: counts.get(k) || 1 });
  }
  return out;
}

export function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}
