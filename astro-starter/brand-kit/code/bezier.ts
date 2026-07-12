/**
 * A standard, high-performance cubic Bezier curve solver for CSS-like easing.
 * Solves the parametric cubic Bezier equations to find the output y for a given input x.
 */

export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  // If control points are linear, return a simple identity mapper
  if (x1 === y1 && x2 === y2) {
    return (x: number) => x;
  }

  // Pre-calculate coefficients
  // x(t) = 3*(1-t)^2*t*x1 + 3*(1-t)*t^2*x2 + t^3
  //      = (3*x1)*t + (3*x2 - 6*x1)*t^2 + (1 - 3*x2 + 3*x1)*t^3
  const cx = 3.0 * x1;
  const bx = 3.0 * (x2 - x1) - cx;
  const ax = 1.0 - cx - bx;

  const cy = 3.0 * y1;
  const by = 3.0 * (y2 - y1) - cy;
  const ay = 1.0 - cy - by;

  function sampleCurveX(t: number): number {
    return ((ax * t + bx) * t + cx) * t;
  }

  function sampleCurveY(t: number): number {
    return ((ay * t + by) * t + cy) * t;
  }

  function sampleCurveDerivativeX(t: number): number {
    return (3.0 * ax * t + 2.0 * bx) * t + cx;
  }

  // Find t for a given x using Newton-Raphson iteration or Binary Search fallback
  return function solve(x: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;

    // First try Newton-Raphson iteration (highly precise & fast for well-behaved curves)
    let t = x;
    for (let i = 0; i < 8; i++) {
      const xSample = sampleCurveX(t) - x;
      if (Math.abs(xSample) < 1e-7) {
        return sampleCurveY(t);
      }
      const dX = sampleCurveDerivativeX(t);
      if (Math.abs(dX) < 1e-6) {
        break; // Derivative too small, fallback to binary search
      }
      t -= xSample / dX;
    }

    // Binary search fallback
    let t0 = 0.0;
    let t1 = 1.0;
    t = x;

    while (t0 < t1) {
      const xSample = sampleCurveX(t);
      if (Math.abs(xSample - x) < 1e-7) {
        return sampleCurveY(t);
      }
      if (x > xSample) {
        t0 = t;
      } else {
        t1 = t;
      }
      t = (t1 + t0) * 0.5;
    }

    return sampleCurveY(t);
  };
}
