'use client';

import React, { useMemo } from 'react';
import { Point, ColorParams, TransformParams } from '@/types';
import { computeBoundingBox } from '@/lib/spirograph';
import { computeSegmentColors } from '@/lib/gradient';
import { getCssTransform } from '@/lib/transform';

interface SpirographCanvasProps {
  points: Point[];
  strokeWidth: number;
  color: ColorParams;
  transform: TransformParams;
}

export default function SpirographCanvas({
  points,
  strokeWidth,
  color,
  transform,
}: SpirographCanvasProps) {
  const bbox = useMemo(() => computeBoundingBox(points), [points]);

  const padding = strokeWidth * 2 + 20;
  const viewBox = `${bbox.minX - padding} ${bbox.minY - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`;

  const cssTransform = useMemo(() => getCssTransform(transform), [transform]);

  const svgContent = useMemo(() => {
    if (points.length < 2) return null;

    if (color.mode === 'solid') {
      const pointsStr = points
        .map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(' ');
      return (
        <polyline
          points={pointsStr}
          fill="none"
          stroke={color.solidColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    }

    // Gradient mode: render segments with per-segment colors
    // For performance, downsample if too many points
    const maxSegments = 2000;
    let renderPoints = points;
    if (points.length > maxSegments + 1) {
      const step = Math.ceil(points.length / maxSegments);
      renderPoints = [];
      for (let i = 0; i < points.length; i += step) {
        renderPoints.push(points[i]);
      }
      // Ensure last point is included
      if (renderPoints[renderPoints.length - 1] !== points[points.length - 1]) {
        renderPoints.push(points[points.length - 1]);
      }
    }

    const segmentCount = renderPoints.length - 1;
    const colors = computeSegmentColors(color.gradientStops, segmentCount);

    return (
      <g strokeLinecap="round">
        {colors.map((segColor, i) => (
          <line
            key={i}
            x1={renderPoints[i].x}
            y1={renderPoints[i].y}
            x2={renderPoints[i + 1].x}
            y2={renderPoints[i + 1].y}
            stroke={segColor}
            strokeWidth={strokeWidth}
          />
        ))}
      </g>
    );
  }, [points, color, strokeWidth]);

  return (
    <div className="flex-1 h-screen flex items-center justify-center bg-zinc-950 overflow-hidden">
      <div
        style={{
          transform: cssTransform,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <svg
          viewBox={viewBox}
          className="w-[min(80vh,80vw)] h-[min(80vh,80vw)] max-w-full max-h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {svgContent}
        </svg>
      </div>
    </div>
  );
}
