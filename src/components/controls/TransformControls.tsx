'use client';

import React from 'react';
import { TransformParams, SpirographAction } from '@/types';
import Slider from '@/components/ui/Slider';

interface TransformControlsProps {
  transform: TransformParams;
  dispatch: React.Dispatch<SpirographAction>;
}

export default function TransformControls({
  transform,
  dispatch,
}: TransformControlsProps) {
  const set = (key: keyof TransformParams, value: number) =>
    dispatch({ type: 'SET_TRANSFORM_PARAM', key, value });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
          3D Transform
        </h3>
        <button
          onClick={() => dispatch({ type: 'RESET_TRANSFORMS' })}
          className="text-[10px] text-zinc-500 hover:text-zinc-300 hover:scale-105 active:scale-95 transition-all duration-200 ease-out"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Rotation</p>
        <Slider
          label="Rotate X"
          value={transform.rotateX}
          min={-180}
          max={180}
          step={1}
          onChange={(v) => set('rotateX', v)}
          unit="°"
        />
        <Slider
          label="Rotate Y"
          value={transform.rotateY}
          min={-180}
          max={180}
          step={1}
          onChange={(v) => set('rotateY', v)}
          unit="°"
        />
        <Slider
          label="Rotate Z"
          value={transform.rotateZ}
          min={-180}
          max={180}
          step={1}
          onChange={(v) => set('rotateZ', v)}
          unit="°"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Skew</p>
        <Slider
          label="Skew X"
          value={transform.skewX}
          min={-60}
          max={60}
          step={1}
          onChange={(v) => set('skewX', v)}
          unit="°"
        />
        <Slider
          label="Skew Y"
          value={transform.skewY}
          min={-60}
          max={60}
          step={1}
          onChange={(v) => set('skewY', v)}
          unit="°"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Scale</p>
        <Slider
          label="Scale X"
          value={transform.scaleX}
          min={0.1}
          max={3}
          step={0.1}
          onChange={(v) => set('scaleX', v)}
          unit="×"
        />
        <Slider
          label="Scale Y"
          value={transform.scaleY}
          min={0.1}
          max={3}
          step={0.1}
          onChange={(v) => set('scaleY', v)}
          unit="×"
        />
      </div>
    </div>
  );
}
