import { Point, CurveParams } from '@/types';

export function generateSpirographPoints(params: CurveParams): Point[] {
  const { R, r, d, rotations, curveType } = params;

  if (r === 0) return [];

  const totalPoints = Math.max(rotations * 360, 360);
  const maxT = 2 * Math.PI * rotations;
  const points: Point[] = [];

  for (let i = 0; i <= totalPoints; i++) {
    const t = (i / totalPoints) * maxT;
    let x: number;
    let y: number;

    if (curveType === 'hypotrochoid') {
      x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
      y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    } else {
      // epitrochoid
      x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
      y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
    }

    points.push({ x, y });
  }

  return points;
}

export function computeBoundingBox(points: Point[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (points.length === 0) {
    return { minX: -100, minY: -100, maxX: 100, maxY: 100, width: 200, height: 200 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function lcm(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  if (a === 0 || b === 0) return 0;
  return (a / gcd(a, b)) * b;
}

export function computeClosingRotations(R: number, r: number): number {
  if (r === 0) return 1;
  const l = lcm(Math.round(R), Math.round(r));
  const result = l / Math.round(R);
  return Math.min(result, 100); // cap at 100
}
