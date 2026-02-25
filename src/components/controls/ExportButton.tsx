'use client';

import React from 'react';
import { Point, SpirographState } from '@/types';
import { exportSvg } from '@/lib/export-svg';

interface ExportButtonProps {
  points: Point[];
  state: SpirographState;
}

export default function ExportButton({ points, state }: ExportButtonProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
        Export
      </h3>
      <button
        onClick={() => exportSvg(points, state)}
        disabled={points.length === 0}
        className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-700
          disabled:text-zinc-500 text-white text-sm font-medium
          transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          hover:shadow-lg hover:shadow-blue-600/30 hover:scale-[1.02]
          active:scale-[0.97] active:shadow-sm
          flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export SVG
      </button>
    </div>
  );
}
