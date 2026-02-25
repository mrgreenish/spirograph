'use client';

import React, { useReducer, useMemo } from 'react';
import {
  SpirographState,
  SpirographAction,
  GradientStop,
} from '@/types';
import { generateSpirographPoints } from '@/lib/spirograph';
import ControlPanel from '@/components/ControlPanel';
import SpirographCanvas from '@/components/SpirographCanvas';

let stopIdCounter = 0;
function nextStopId(): string {
  return `stop-${++stopIdCounter}`;
}

const initialState: SpirographState = {
  curve: {
    R: 200,
    r: 80,
    d: 60,
    rotations: 10,
    curveType: 'hypotrochoid',
  },
  strokeWidth: 1.5,
  color: {
    mode: 'solid',
    solidColor: '#3b82f6',
    gradientStops: [
      { id: 'stop-init-1', offset: 0, color: '#3b82f6' },
      { id: 'stop-init-2', offset: 1, color: '#ec4899' },
    ],
  },
  transform: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewX: 0,
    skewY: 0,
    scaleX: 1,
    scaleY: 1,
  },
};

function spirographReducer(
  state: SpirographState,
  action: SpirographAction
): SpirographState {
  switch (action.type) {
    case 'SET_CURVE_PARAM':
      return {
        ...state,
        curve: {
          ...state.curve,
          [action.key]: action.value,
        },
      };

    case 'SET_STROKE_WIDTH':
      return { ...state, strokeWidth: action.value };

    case 'SET_COLOR_MODE':
      return {
        ...state,
        color: { ...state.color, mode: action.mode },
      };

    case 'SET_SOLID_COLOR':
      return {
        ...state,
        color: { ...state.color, solidColor: action.color },
      };

    case 'ADD_GRADIENT_STOP': {
      const stops = state.color.gradientStops;
      // Place new stop at the midpoint of existing range
      const newStop: GradientStop = {
        id: nextStopId(),
        offset: 0.5,
        color: '#8b5cf6',
      };
      return {
        ...state,
        color: {
          ...state.color,
          gradientStops: [...stops, newStop],
        },
      };
    }

    case 'REMOVE_GRADIENT_STOP':
      return {
        ...state,
        color: {
          ...state.color,
          gradientStops: state.color.gradientStops.filter(
            (s) => s.id !== action.id
          ),
        },
      };

    case 'UPDATE_GRADIENT_STOP':
      return {
        ...state,
        color: {
          ...state.color,
          gradientStops: state.color.gradientStops.map((s) =>
            s.id === action.id
              ? {
                  ...s,
                  ...(action.offset !== undefined && { offset: action.offset }),
                  ...(action.color !== undefined && { color: action.color }),
                }
              : s
          ),
        },
      };

    case 'SET_TRANSFORM_PARAM':
      return {
        ...state,
        transform: {
          ...state.transform,
          [action.key]: action.value,
        },
      };

    case 'RESET_TRANSFORMS':
      return {
        ...state,
        transform: initialState.transform,
      };

    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}

export default function SpirographApp() {
  const [state, dispatch] = useReducer(spirographReducer, initialState);

  const points = useMemo(
    () => generateSpirographPoints(state.curve),
    [state.curve]
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <ControlPanel state={state} dispatch={dispatch} points={points} />
      <SpirographCanvas
        points={points}
        strokeWidth={state.strokeWidth}
        color={state.color}
        transform={state.transform}
      />
    </div>
  );
}
