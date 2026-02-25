'use client';

import React from 'react';
import { SpirographAction } from '@/types';
import Slider from '@/components/ui/Slider';

interface StrokeControlsProps {
  strokeWidth: number;
  dispatch: React.Dispatch<SpirographAction>;
}

export default function StrokeControls({
  strokeWidth,
  dispatch,
}: StrokeControlsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
        Stroke
      </h3>
      <Slider
        label="Width"
        value={strokeWidth}
        min={0.5}
        max={10}
        step={0.5}
        onChange={(v) => dispatch({ type: 'SET_STROKE_WIDTH', value: v })}
        unit="px"
      />
    </div>
  );
}
