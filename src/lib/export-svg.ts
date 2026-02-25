import { Point, SpirographState } from '@/types';
import { computeSegmentColors } from './gradient';
import { applyTransform3D } from './transform';
import { computeBoundingBox } from './spirograph';

function formatNum(n: number): string {
  return n.toFixed(2);
}

export function buildSvgString(
  points: Point[],
  state: SpirographState
): string {
  // Apply 3D transforms to points for export
  const transformedPoints = applyTransform3D(points, state.transform);

  const bbox = computeBoundingBox(transformedPoints);
  const padding = state.strokeWidth * 2 + 10;
  const vbX = bbox.minX - padding;
  const vbY = bbox.minY - padding;
  const vbW = bbox.width + padding * 2;
  const vbH = bbox.height + padding * 2;

  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${formatNum(vbX)} ${formatNum(vbY)} ${formatNum(vbW)} ${formatNum(vbH)}" width="${formatNum(vbW)}" height="${formatNum(vbH)}">`
  );
  lines.push('  <style>svg { background: transparent; }</style>');

  if (state.color.mode === 'solid') {
    // Single polyline
    const pointsStr = transformedPoints
      .map((p) => `${formatNum(p.x)},${formatNum(p.y)}`)
      .join(' ');
    lines.push(
      `  <polyline points="${pointsStr}" fill="none" stroke="${state.color.solidColor}" stroke-width="${state.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`
    );
  } else {
    // Gradient: individual line segments
    const segmentCount = transformedPoints.length - 1;
    const colors = computeSegmentColors(state.color.gradientStops, segmentCount);

    lines.push('  <g stroke-linecap="round">');
    for (let i = 0; i < segmentCount; i++) {
      const p1 = transformedPoints[i];
      const p2 = transformedPoints[i + 1];
      lines.push(
        `    <line x1="${formatNum(p1.x)}" y1="${formatNum(p1.y)}" x2="${formatNum(p2.x)}" y2="${formatNum(p2.y)}" stroke="${colors[i]}" stroke-width="${state.strokeWidth}" />`
      );
    }
    lines.push('  </g>');
  }

  lines.push('</svg>');
  return lines.join('\n');
}

export function exportSvg(points: Point[], state: SpirographState): void {
  const svgString = buildSvgString(points, state);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'spirograph.svg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
