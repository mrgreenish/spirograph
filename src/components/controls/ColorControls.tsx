'use client';

import React from 'react';
import { ColorParams, SpirographAction } from '@/types';
import ColorStop from '@/components/ui/ColorStop';

interface ColorControlsProps {
  color: ColorParams;
  dispatch: React.Dispatch<SpirographAction>;
}

export default function ColorControls({ color, dispatch }: ColorControlsProps) {
  const sortedStops = [...color.gradientStops].sort(
    (a, b) => a.offset - b.offset
  );

  const gradientPreview = sortedStops
    .map((s) => `${s.color} ${Math.round(s.offset * 100)}%`)
    .join(', ');

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
        Color
      </h3>

      <div className="flex gap-1.5">
        <button
          onClick={() => dispatch({ type: 'SET_COLOR_MODE', mode: 'solid' })}
          className={`flex-1 text-xs py-1.5 px-3 rounded transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            color.mode === 'solid'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:scale-[1.02]'
          }`}
        >
          Solid
        </button>
        <button
          onClick={() =>
            dispatch({ type: 'SET_COLOR_MODE', mode: 'gradient' })
          }
          className={`flex-1 text-xs py-1.5 px-3 rounded transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            color.mode === 'gradient'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:scale-[1.02]'
          }`}
        >
          Gradient
        </button>
      </div>

      {color.mode === 'solid' ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color.solidColor}
            onChange={(e) =>
              dispatch({ type: 'SET_SOLID_COLOR', color: e.target.value })
            }
            className="w-10 h-10 rounded border border-zinc-600 cursor-pointer bg-transparent
              [&::-webkit-color-swatch-wrapper]:p-0.5 [&::-webkit-color-swatch]:rounded"
          />
          <span className="text-xs text-zinc-400 font-mono">
            {color.solidColor}
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Gradient preview bar */}
          <div
            className="h-4 rounded-full border border-zinc-600 transition-all duration-300 ease-out"
            style={{
              background: `linear-gradient(to right, ${gradientPreview})`,
            }}
          />

          {/* Gradient stops */}
          <div className="space-y-2">
            {sortedStops.map((stop) => (
              <ColorStop
                key={stop.id}
                stop={stop}
                onChange={(id, updates) =>
                  dispatch({
                    type: 'UPDATE_GRADIENT_STOP',
                    id,
                    offset: updates.offset,
                    color: updates.color,
                  })
                }
                onRemove={(id) =>
                  dispatch({ type: 'REMOVE_GRADIENT_STOP', id })
                }
                canRemove={color.gradientStops.length > 2}
              />
            ))}
          </div>

          {color.gradientStops.length < 8 && (
            <button
              onClick={() => dispatch({ type: 'ADD_GRADIENT_STOP' })}
              className="w-full text-xs py-1.5 rounded bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:scale-[1.01] transition-all duration-200 ease-out active:scale-[0.98]"
            >
              + Add Color Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}
