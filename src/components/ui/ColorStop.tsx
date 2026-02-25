'use client';

import React from 'react';
import { GradientStop } from '@/types';

interface ColorStopProps {
  stop: GradientStop;
  onChange: (id: string, updates: { offset?: number; color?: string }) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export default function ColorStop({
  stop,
  onChange,
  onRemove,
  canRemove,
}: ColorStopProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={stop.color}
        onChange={(e) => onChange(stop.id, { color: e.target.value })}
        className="w-8 h-8 rounded border border-zinc-600 cursor-pointer bg-transparent shrink-0
          [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded"
      />
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(stop.offset * 100)}
        onChange={(e) =>
          onChange(stop.id, { offset: parseInt(e.target.value) / 100 })
        }
        className="flex-1 h-1.5 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-500
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer
          [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:border-0"
      />
      <span className="text-xs text-zinc-400 font-mono w-8 text-right tabular-nums">
        {Math.round(stop.offset * 100)}%
      </span>
      {canRemove && (
        <button
          onClick={() => onRemove(stop.id)}
          className="text-zinc-500 hover:text-red-400 hover:scale-125 active:scale-90 transition-all duration-200 ease-out text-sm w-5 h-5 flex items-center justify-center"
          title="Remove stop"
        >
          &times;
        </button>
      )}
    </div>
  );
}
