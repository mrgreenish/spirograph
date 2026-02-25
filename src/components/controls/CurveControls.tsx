'use client';

import React from 'react';
import { CurveParams, CurveType, SpirographAction } from '@/types';
import { computeClosingRotations } from '@/lib/spirograph';
import Slider from '@/components/ui/Slider';

interface CurveControlsProps {
  curve: CurveParams;
  dispatch: React.Dispatch<SpirographAction>;
}

export default function CurveControls({ curve, dispatch }: CurveControlsProps) {
  const closingRotations = computeClosingRotations(curve.R, curve.r);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider">
        Curve Parameters
      </h3>

      <div className="flex gap-1.5">
        <button
          onClick={() =>
            dispatch({ type: 'SET_CURVE_PARAM', key: 'curveType', value: 'hypotrochoid' as CurveType })
          }
          className={`flex-1 text-xs py-1.5 px-3 rounded transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            curve.curveType === 'hypotrochoid'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:scale-[1.02]'
          }`}
        >
          Hypotrochoid
        </button>
        <button
          onClick={() =>
            dispatch({ type: 'SET_CURVE_PARAM', key: 'curveType', value: 'epitrochoid' as CurveType })
          }
          className={`flex-1 text-xs py-1.5 px-3 rounded transition-all duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
            curve.curveType === 'epitrochoid'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600 hover:scale-[1.02]'
          }`}
        >
          Epitrochoid
        </button>
      </div>

      <Slider
        label="Outer Radius (R)"
        value={curve.R}
        min={10}
        max={300}
        step={1}
        onChange={(v) => dispatch({ type: 'SET_CURVE_PARAM', key: 'R', value: v })}
      />

      <Slider
        label="Inner Radius (r)"
        value={curve.r}
        min={1}
        max={200}
        step={1}
        onChange={(v) => dispatch({ type: 'SET_CURVE_PARAM', key: 'r', value: v })}
      />

      <Slider
        label="Pen Offset (d)"
        value={curve.d}
        min={1}
        max={200}
        step={1}
        onChange={(v) => dispatch({ type: 'SET_CURVE_PARAM', key: 'd', value: v })}
      />

      <Slider
        label="Rotations"
        value={curve.rotations}
        min={1}
        max={100}
        step={1}
        onChange={(v) =>
          dispatch({ type: 'SET_CURVE_PARAM', key: 'rotations', value: v })
        }
      />

      <p className="text-[10px] text-zinc-500">
        Closes at {closingRotations} rotation{closingRotations !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
