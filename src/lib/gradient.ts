import { GradientStop } from '@/types';

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    Math.round(Math.max(0, Math.min(255, n)))
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function interpolateGradientColor(
  stops: GradientStop[],
  t: number
): string {
  if (stops.length === 0) return '#000000';
  if (stops.length === 1) return stops[0].color;

  // Sort stops by offset
  const sorted = [...stops].sort((a, b) => a.offset - b.offset);

  // Clamp t
  t = Math.max(0, Math.min(1, t));

  // Find the two surrounding stops
  if (t <= sorted[0].offset) return sorted[0].color;
  if (t >= sorted[sorted.length - 1].offset) return sorted[sorted.length - 1].color;

  let lower = sorted[0];
  let upper = sorted[sorted.length - 1];

  for (let i = 0; i < sorted.length - 1; i++) {
    if (t >= sorted[i].offset && t <= sorted[i + 1].offset) {
      lower = sorted[i];
      upper = sorted[i + 1];
      break;
    }
  }

  const range = upper.offset - lower.offset;
  const localT = range === 0 ? 0 : (t - lower.offset) / range;

  const [r1, g1, b1] = hexToRgb(lower.color);
  const [r2, g2, b2] = hexToRgb(upper.color);

  return rgbToHex(lerp(r1, r2, localT), lerp(g1, g2, localT), lerp(b1, b2, localT));
}

export function computeSegmentColors(
  stops: GradientStop[],
  segmentCount: number
): string[] {
  const colors: string[] = [];
  for (let i = 0; i < segmentCount; i++) {
    const t = segmentCount <= 1 ? 0 : i / (segmentCount - 1);
    colors.push(interpolateGradientColor(stops, t));
  }
  return colors;
}
