'use client';

import React from 'react';
import { Point, SpirographState, SpirographAction } from '@/types';
import CurveControls from '@/components/controls/CurveControls';
import StrokeControls from '@/components/controls/StrokeControls';
import ColorControls from '@/components/controls/ColorControls';
import TransformControls from '@/components/controls/TransformControls';
import ExportButton from '@/components/controls/ExportButton';

interface ControlPanelProps {
  state: SpirographState;
  dispatch: React.Dispatch<SpirographAction>;
  points: Point[];
}

export default function ControlPanel({
  state,
  dispatch,
  points,
}: ControlPanelProps) {
  return (
    <aside className="w-80 h-screen overflow-y-auto bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-6 shrink-0 scrollbar-thin">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white tracking-tight">
          Spirograph
        </h1>
        <button
          onClick={() => dispatch({ type: 'RESET_ALL' })}
          className="text-[10px] text-zinc-500 hover:text-zinc-300 hover:scale-105 active:scale-95 transition-all duration-200 ease-out uppercase tracking-wider"
        >
          Reset All
        </button>
      </div>

      <div className="h-px bg-zinc-800" />
      <CurveControls curve={state.curve} dispatch={dispatch} />

      <div className="h-px bg-zinc-800" />
      <StrokeControls strokeWidth={state.strokeWidth} dispatch={dispatch} />

      <div className="h-px bg-zinc-800" />
      <ColorControls color={state.color} dispatch={dispatch} />

      <div className="h-px bg-zinc-800" />
      <TransformControls transform={state.transform} dispatch={dispatch} />

      <div className="h-px bg-zinc-800" />
      <ExportButton points={points} state={state} />

      <div className="pb-4" />
    </aside>
  );
}
