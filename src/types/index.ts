export interface Point {
  x: number;
  y: number;
}

export type CurveType = 'hypotrochoid' | 'epitrochoid';

export type ColorMode = 'solid' | 'gradient';

export interface GradientStop {
  id: string;
  offset: number; // 0..1
  color: string;  // hex e.g. "#ff0000"
}

export interface CurveParams {
  R: number;
  r: number;
  d: number;
  rotations: number;
  curveType: CurveType;
}

export interface ColorParams {
  mode: ColorMode;
  solidColor: string;
  gradientStops: GradientStop[];
}

export interface TransformParams {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  skewX: number;
  skewY: number;
  scaleX: number;
  scaleY: number;
}

export interface SpirographState {
  curve: CurveParams;
  strokeWidth: number;
  color: ColorParams;
  transform: TransformParams;
}

export type SpirographAction =
  | { type: 'SET_CURVE_PARAM'; key: keyof CurveParams; value: number | CurveType }
  | { type: 'SET_STROKE_WIDTH'; value: number }
  | { type: 'SET_COLOR_MODE'; mode: ColorMode }
  | { type: 'SET_SOLID_COLOR'; color: string }
  | { type: 'ADD_GRADIENT_STOP' }
  | { type: 'REMOVE_GRADIENT_STOP'; id: string }
  | { type: 'UPDATE_GRADIENT_STOP'; id: string; offset?: number; color?: string }
  | { type: 'SET_TRANSFORM_PARAM'; key: keyof TransformParams; value: number }
  | { type: 'RESET_ALL' }
  | { type: 'RESET_TRANSFORMS' };
