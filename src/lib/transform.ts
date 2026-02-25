import { Point, TransformParams } from '@/types';

// 4x4 matrix stored as flat array (column-major)
type Mat4 = number[];

function identity(): Mat4 {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

function multiply(a: Mat4, b: Mat4): Mat4 {
  const r: Mat4 = new Array(16).fill(0);
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      for (let k = 0; k < 4; k++) {
        r[row * 4 + col] += a[row * 4 + k] * b[k * 4 + col];
      }
    }
  }
  return r;
}

function rotateXMatrix(deg: number): Mat4 {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [
    1, 0, 0, 0,
    0, c, -s, 0,
    0, s, c, 0,
    0, 0, 0, 1,
  ];
}

function rotateYMatrix(deg: number): Mat4 {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [
    c, 0, s, 0,
    0, 1, 0, 0,
    -s, 0, c, 0,
    0, 0, 0, 1,
  ];
}

function rotateZMatrix(deg: number): Mat4 {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return [
    c, -s, 0, 0,
    s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

function skewXMatrix(deg: number): Mat4 {
  const t = Math.tan((deg * Math.PI) / 180);
  return [
    1, t, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

function skewYMatrix(deg: number): Mat4 {
  const t = Math.tan((deg * Math.PI) / 180);
  return [
    1, 0, 0, 0,
    t, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

function scaleMatrix(sx: number, sy: number): Mat4 {
  return [
    sx, 0, 0, 0,
    0, sy, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ];
}

function perspectiveMatrix(d: number): Mat4 {
  return [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, -1 / d, 1,
  ];
}

export function buildTransformMatrix(
  transform: TransformParams,
  perspective = 800
): Mat4 {
  let mat = identity();

  // Apply perspective
  mat = multiply(perspectiveMatrix(perspective), mat);

  // Apply rotations
  mat = multiply(mat, rotateXMatrix(transform.rotateX));
  mat = multiply(mat, rotateYMatrix(transform.rotateY));
  mat = multiply(mat, rotateZMatrix(transform.rotateZ));

  // Apply skew
  mat = multiply(mat, skewXMatrix(transform.skewX));
  mat = multiply(mat, skewYMatrix(transform.skewY));

  // Apply scale
  mat = multiply(mat, scaleMatrix(transform.scaleX, transform.scaleY));

  return mat;
}

export function applyTransform3D(
  points: Point[],
  transform: TransformParams,
  perspective = 800
): Point[] {
  const hasTransform =
    transform.rotateX !== 0 ||
    transform.rotateY !== 0 ||
    transform.rotateZ !== 0 ||
    transform.skewX !== 0 ||
    transform.skewY !== 0 ||
    transform.scaleX !== 1 ||
    transform.scaleY !== 1;

  if (!hasTransform) return points;

  const mat = buildTransformMatrix(transform, perspective);

  return points.map((p) => {
    // Apply 4x4 matrix to point (x, y, 0, 1)
    const x = mat[0] * p.x + mat[1] * p.y + mat[2] * 0 + mat[3];
    const y = mat[4] * p.x + mat[5] * p.y + mat[6] * 0 + mat[7];
    const w = mat[12] * p.x + mat[13] * p.y + mat[14] * 0 + mat[15];

    // Perspective divide
    const invW = w !== 0 ? 1 / w : 1;
    return { x: x * invW, y: y * invW };
  });
}

export function getCssTransform(transform: TransformParams): string {
  const parts: string[] = ['perspective(800px)'];

  if (transform.rotateX !== 0) parts.push(`rotateX(${transform.rotateX}deg)`);
  if (transform.rotateY !== 0) parts.push(`rotateY(${transform.rotateY}deg)`);
  if (transform.rotateZ !== 0) parts.push(`rotateZ(${transform.rotateZ}deg)`);
  if (transform.skewX !== 0) parts.push(`skewX(${transform.skewX}deg)`);
  if (transform.skewY !== 0) parts.push(`skewY(${transform.skewY}deg)`);
  if (transform.scaleX !== 1 || transform.scaleY !== 1) {
    parts.push(`scale(${transform.scaleX}, ${transform.scaleY})`);
  }

  return parts.length > 1 ? parts.join(' ') : 'none';
}
