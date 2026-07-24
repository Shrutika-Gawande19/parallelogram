// geometryEngine.js — Parallelogram validation using vector math

// Distance between two points
function dist(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

// Vector from p1 to p2
function vec(p1, p2) {
  return { x: p2.x - p1.x, y: p2.y - p1.y };
}

// Are two vectors parallel? (cross product ≈ 0)
function areParallel(v1, v2, tol = 3) {
  return Math.abs(v1.x * v2.y - v1.y * v2.x) < tol * Math.max(
    Math.sqrt(v1.x**2 + v1.y**2),
    Math.sqrt(v2.x**2 + v2.y**2)
  );
}

// Are two lengths approximately equal?
function approxEqual(a, b, tol = 4) {
  return Math.abs(a - b) < tol;
}

/**
 * Check if 4 vertices [A, B, C, D] form a valid parallelogram
 * Vertices must be in order: A(top-left) → B(top-right) → C(bottom-right) → D(bottom-left)
 * Properties checked:
 *   AB ∥ DC  (top ∥ bottom)
 *   AD ∥ BC  (left ∥ right)
 *   AB = DC  (top = bottom)
 *   AD = BC  (left = right)
 */
export function isParallelogram(vertices) {
  if (!vertices || vertices.length !== 4) return false;
  const [A, B, C, D] = vertices;

  const AB = vec(A, B);
  const DC = vec(D, C);
  const AD = vec(A, D);
  const BC = vec(B, C);

  return (
    areParallel(AB, DC) &&
    areParallel(AD, BC) &&
    approxEqual(dist(A, B), dist(D, C)) &&
    approxEqual(dist(A, D), dist(B, C))
  );
}

/**
 * Returns property check results as individual booleans
 */
export function getPropertyBadges(vertices) {
  if (!vertices || vertices.length !== 4) {
    return { ab_parallel_dc: false, ad_parallel_bc: false, ab_equals_dc: false, ad_equals_bc: false };
  }
  const [A, B, C, D] = vertices;
  const AB = vec(A, B);
  const DC = vec(D, C);
  const AD = vec(A, D);
  const BC = vec(B, C);

  return {
    ab_parallel_dc: areParallel(AB, DC),
    ad_parallel_bc: areParallel(AD, BC),
    ab_equals_dc: approxEqual(dist(A, B), dist(D, C)),
    ad_equals_bc: approxEqual(dist(A, D), dist(B, C)),
  };
}

/**
 * Given angle A of a parallelogram, return all 4 angles
 * angleA → angleB = 180-A → angleC = A → angleD = 180-A
 */
export function getAngles(angleA) {
  const angleB = 180 - angleA;
  return { A: angleA, B: angleB, C: angleA, D: angleB };
}

/**
 * Convert grid coordinate to SVG pixel
 */
export function gridToPixel(gridX, gridY, cellSize = 40, padding = 20) {
  return { x: padding + gridX * cellSize, y: padding + gridY * cellSize };
}
