// ShapeShifterStation.jsx — Station 1: Shape Shifter
// Child drags one corner to transform a rectangle into a parallelogram,
// then uses the Shape Scanner to classify quadrilaterals.

import { useState, useCallback, useRef, useEffect } from 'react';

// ── SVG canvas dimensions ──────────────────────────────────────────────────
const W = 340;
const H = 220;
const BASE_X = 60;
const BASE_Y = 160;
const BASE_W = 220;
const BASE_H = 110;

// Scanner challenge shapes (geometry-based classification)
const SCANNER_SHAPES = [
  {
    id: 's1',
    label: 'Shape 1',
    points: [[20, 60], [150, 60], [130, 20], [0, 20]],   // parallelogram (slanted)
    isParallelogram: true,
    hint: 'Both pairs of opposite sides are parallel!',
  },
  {
    id: 's2',
    label: 'Shape 2',
    points: [[0, 60], [160, 60], [160, 10], [0, 10]],    // rectangle = parallelogram
    isParallelogram: true,
    hint: 'A rectangle has two pairs of parallel sides — it IS a parallelogram!',
  },
  {
    id: 's3',
    label: 'Shape 3',
    points: [[30, 60], [130, 60], [160, 10], [0, 10]],   // trapezium — only 1 pair parallel
    isParallelogram: false,
    hint: 'Only one pair of opposite sides is parallel — this is a trapezium.',
  },
  {
    id: 's4',
    label: 'Shape 4',
    points: [[80, 0], [160, 50], [80, 70], [0, 50]],     // rhombus = parallelogram
    isParallelogram: true,
    hint: 'A rhombus has two pairs of parallel sides — it IS a parallelogram!',
  },
  {
    id: 's5',
    label: 'Shape 5',
    points: [[80, 0], [150, 40], [100, 70], [30, 70]],   // irregular quad — NOT
    isParallelogram: false,
    hint: 'Opposite sides are not both parallel and equal here.',
  },
];

// ── Geometry helpers ───────────────────────────────────────────────────────
function cross2d(ax, ay, bx, by) { return ax * by - ay * bx; }

function vecLen(dx, dy) { return Math.sqrt(dx * dx + dy * dy); }

function areSidesParallel(p1, p2, p3, p4) {
  // Check if segment p1→p2 is parallel to p3→p4
  const d1x = p2[0] - p1[0], d1y = p2[1] - p1[1];
  const d2x = p4[0] - p3[0], d2y = p4[1] - p3[1];
  return Math.abs(cross2d(d1x, d1y, d2x, d2y)) < 1e-6 * (vecLen(d1x, d1y) * vecLen(d2x, d2y) + 1);
}

function sideLengthsApproxEqual(p1, p2, p3, p4) {
  const l1 = vecLen(p2[0] - p1[0], p2[1] - p1[1]);
  const l2 = vecLen(p4[0] - p3[0], p4[1] - p3[1]);
  return Math.abs(l1 - l2) < 2;
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ShapeShifterStation({ onComplete }) {
  // Shear offset: how far corner B and corner C are shifted horizontally
  const [shearX, setShearX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartShear, setDragStartShear] = useState(0);
  const svgRef = useRef(null);

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false);
  const [scanIdx, setScanIdx] = useState(0);
  const [scanResult, setScanResult] = useState(null); // null | 'correct' | 'wrong'
  const [scanCompleted, setScanCompleted] = useState(0);
  const [hasCompletedShifter, setHasCompletedShifter] = useState(false);
  const [celebrateShifter, setCelebrateShifter] = useState(false);
  const [allDone, setAllDone] = useState(false);

  // Parallelogram vertices
  // A = bottom-left, B = bottom-right, C = top-right (shifted), D = top-left (shifted)
  const A = [BASE_X, BASE_Y];
  const B = [BASE_X + BASE_W, BASE_Y];
  const C = [BASE_X + BASE_W + shearX, BASE_Y - BASE_H];
  const D = [BASE_X + shearX, BASE_Y - BASE_H];

  // Property checks on live shape
  const abParallel = areSidesParallel(A, B, D, C);          // AB ∥ DC
  const adParallel = areSidesParallel(A, D, B, C);          // AD ∥ BC
  const abEqualDC = sideLengthsApproxEqual(A, B, D, C);
  const adEqualBC = sideLengthsApproxEqual(A, D, B, C);
  const isParallel = abParallel && adParallel;
  const isEqual = abEqualDC && adEqualBC;

  // Clamp shear to reasonable range
  const clamp = (v) => Math.max(-70, Math.min(70, v));

  // ── Pointer drag for top-right corner ────────────────────────────────────
  const onPointerDownCorner = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartShear(shearX);
  };

  const onPointerMove = useCallback((e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    const svgW = svgRef.current?.getBoundingClientRect().width || W;
    const scale = svgW / W;
    setShearX(clamp(dragStartShear + dx / scale));
  }, [isDragging, dragStartX, dragStartShear]);

  const onPointerUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  // When user has pulled shape to a clear slant (|shearX| > 30), mark shifter done
  useEffect(() => {
    if (Math.abs(shearX) > 30 && !hasCompletedShifter) {
      setHasCompletedShifter(true);
      setCelebrateShifter(true);
      setTimeout(() => setCelebrateShifter(false), 1800);
    }
  }, [shearX, hasCompletedShifter]);

  const [isAutoScanning, setIsAutoScanning] = useState(false);

  // ── Scanner logic ─────────────────────────────────────────────────────────
  const currentScan = SCANNER_SHAPES[scanIdx];

  // Auto-scanning loop
  useEffect(() => {
    if (!isAutoScanning || scanIdx >= SCANNER_SHAPES.length || allDone) return;

    let timerId;
    if (scanResult === null) {
      // Shape is moving into position. Classify it automatically.
      timerId = setTimeout(() => {
        const correct = SCANNER_SHAPES[scanIdx].isParallelogram;
        setScanResult(correct ? 'correct' : 'wrong');
      }, 1000);
    } else {
      // Result is shown. Wait a moment, then move to next shape.
      timerId = setTimeout(() => {
        setScanResult(null);
        const next = scanCompleted + 1;
        setScanCompleted(next);
        if (scanIdx + 1 < SCANNER_SHAPES.length) {
          setScanIdx(scanIdx + 1);
        } else {
          setIsAutoScanning(false);
          setAllDone(true);
          setTimeout(() => onComplete(true), 800);
        }
      }, 1800);
    }

    return () => clearTimeout(timerId);
  }, [isAutoScanning, scanIdx, scanResult, scanCompleted, allDone, onComplete]);

  const toggleScanning = () => {
    setIsAutoScanning(!isAutoScanning);
  };

  const polyStr = (pts) => pts.map(p => p.join(',')).join(' ');
  const mainPoly = `${A.join(',')},${B.join(',')},${C.join(',')},${D.join(',')}`;

  // Parallel guide lines (extended dashed lines through AB and DC)
  const guideAB = { x1: A[0] - 20, y1: A[1], x2: B[0] + 20, y2: B[1] };
  const guideDC = { x1: D[0] - 20, y1: D[1], x2: C[0] + 20, y2: C[1] };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontFamily: "'Fredoka', sans-serif", fontSize: '1.05rem', fontWeight: 700,
          color: 'rgba(255,255,255,0.75)',
        }}>
          {!scannerActive
            ? '🖱️ Drag the top-right corner to tilt the shape!'
            : '🔬 Shape Scanner — Is it a parallelogram?'}
        </span>
      </div>

      {/* ── Shape Shifter area ── */}
      {!scannerActive && (
        <>
          <div style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '6px',
            touchAction: 'none',
            overflow: 'visible',
          }}>
            <svg
              ref={svgRef}
              width={W} height={H}
              viewBox={`0 0 ${W} ${H}`}
              style={{ display: 'block', maxWidth: '100%', cursor: 'default', userSelect: 'none' }}
            >
              {/* Parallel guide lines */}
              {isParallel && (
                <>
                  <line {...guideAB} stroke="rgba(255,193,7,0.35)" strokeWidth="1.5" strokeDasharray="6,4" />
                  <line {...guideDC} stroke="rgba(255,193,7,0.35)" strokeWidth="1.5" strokeDasharray="6,4" />
                  {/* AD and BC guides */}
                  <line
                    x1={A[0] - 10} y1={A[1] + 10} x2={D[0] - 10} y2={D[1] - 10}
                    stroke="rgba(100,200,255,0.3)" strokeWidth="1.5" strokeDasharray="6,4"
                  />
                  <line
                    x1={B[0] + 10} y1={B[1] + 10} x2={C[0] + 10} y2={C[1] - 10}
                    stroke="rgba(100,200,255,0.3)" strokeWidth="1.5" strokeDasharray="6,4"
                  />
                </>
              )}

              {/* Main parallelogram */}
              <polygon
                points={mainPoly}
                fill={isParallel ? 'rgba(124,92,191,0.18)' : 'rgba(63,81,181,0.12)'}
                stroke={isParallel ? '#7c5cbf' : 'rgba(124,92,191,0.5)'}
                strokeWidth="2.5"
                strokeLinejoin="round"
                style={{ transition: 'fill 0.3s, stroke 0.3s' }}
              />

              {/* Side length tick marks — AB and DC */}
              {[
                { mid: [(A[0]+B[0])/2, (A[1]+B[1])/2], angle: 0, label: 'a' },
                { mid: [(D[0]+C[0])/2, (D[1]+C[1])/2], angle: 0, label: 'a' },
                { mid: [(A[0]+D[0])/2, (A[1]+D[1])/2], angle: -Math.atan2(D[1]-A[1], D[0]-A[0]), label: 'b' },
                { mid: [(B[0]+C[0])/2, (B[1]+C[1])/2], angle: -Math.atan2(C[1]-B[1], C[0]-B[0]), label: 'b' },
              ].map((t, i) => (
                <text key={i}
                  x={t.mid[0]} y={t.mid[1] - 8}
                  textAnchor="middle" fill="rgba(255,255,255,0.45)"
                  fontSize="11" fontFamily="'Fredoka', sans-serif" fontWeight="700"
                >
                  {t.label}
                </text>
              ))}

              {/* Corner labels */}
              {[
                { p: A, label: 'A', ox: -14, oy: 14 },
                { p: B, label: 'B', ox: 10, oy: 14 },
                { p: C, label: 'C', ox: 10, oy: -8 },
                { p: D, label: 'D', ox: -14, oy: -8 },
              ].map(({ p, label, ox, oy }) => (
                <text key={label}
                  x={p[0] + ox} y={p[1] + oy}
                  textAnchor="middle" fill="rgba(255,255,255,0.6)"
                  fontSize="12" fontFamily="'Fredoka', sans-serif" fontWeight="700"
                >
                  {label}
                </text>
              ))}

              {/* Draggable corner C (top-right) */}
              <g
                onPointerDown={onPointerDownCorner}
                style={{ cursor: 'grab', touchAction: 'none' }}
              >
                <circle cx={C[0]} cy={C[1]} r={16}
                  fill={isDragging ? '#ffc107' : 'rgba(255,193,7,0.8)'}
                  stroke="white" strokeWidth="2.5"
                  style={{ filter: isDragging ? 'drop-shadow(0 0 8px rgba(255,193,7,0.8))' : 'none', transition: 'filter 0.2s' }}
                />
                <text x={C[0]} y={C[1] + 5} textAnchor="middle"
                  fill="#1a1a2e" fontSize="11" fontFamily="'Fredoka', sans-serif" fontWeight="700"
                  style={{ pointerEvents: 'none' }}
                >
                  ↔
                </text>
              </g>

              {/* Corresponding corner D follows automatically — highlight */}
              <circle cx={D[0]} cy={D[1]} r={8}
                fill="rgba(255,193,7,0.4)" stroke="rgba(255,193,7,0.7)" strokeWidth="2"
              />
            </svg>
          </div>

          {/* ── Property badges ── */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { label: 'AB ∥ DC', ok: abParallel },
              { label: 'AD ∥ BC', ok: adParallel },
              { label: 'AB = DC', ok: abEqualDC },
              { label: 'AD = BC', ok: adEqualBC },
            ].map(b => (
              <span key={b.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '5px 12px', borderRadius: '999px',
                background: b.ok ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${b.ok ? 'var(--green)' : 'rgba(255,255,255,0.12)'}`,
                fontSize: '0.78rem', fontWeight: 700,
                color: b.ok ? '#81c784' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s',
              }}>
                {b.ok ? '✓' : '○'} {b.label}
              </span>
            ))}
          </div>

          {/* ── Key insight card ── */}
          {isParallel && (
            <div style={{
              background: 'rgba(124,92,191,0.15)', border: '1px solid rgba(124,92,191,0.4)',
              borderRadius: '12px', padding: '12px 16px', textAlign: 'center',
              animation: 'slideInUp 0.4s ease', maxWidth: 360, width: '100%',
            }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#b39ddb', margin: 0 }}>
                💡 A parallelogram is a quadrilateral with <strong style={{ color: '#ffd54f' }}>two pairs of opposite sides parallel</strong>!
              </p>
            </div>
          )}

          {/* ── Celebration ── */}
          {celebrateShifter && (
            <div style={{
              fontSize: '1.1rem', fontWeight: 700, color: '#ffd54f',
              animation: 'bounceIn 0.5s ease', textAlign: 'center',
            }}>
              🎉 You slanted it! The shape stayed a parallelogram!
            </div>
          )}

          {/* ── Proceed to scanner ── */}
          {hasCompletedShifter && (
            <button
              className="btn btn-primary"
              onClick={() => setScannerActive(true)}
              style={{ animation: 'bounceIn 0.5s ease' }}
              id="go-scanner-btn"
            >
              🔬 Try the Shape Scanner!
            </button>
          )}
        </>
      )}

      {/* ── Shape Scanner ── */}
      {scannerActive && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {SCANNER_SHAPES.map((_, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i < scanCompleted ? 'var(--green)' : i === scanIdx ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                border: `2px solid ${i === scanIdx ? 'var(--gold)' : i < scanCompleted ? 'var(--green)' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                color: i < scanCompleted ? 'white' : i === scanIdx ? '#1a1a2e' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s',
              }}>
                {i < scanCompleted ? '✓' : i + 1}
              </div>
            ))}
          </div>

          {/* Conveyor Belt Scanner display */}
          {scanIdx < SCANNER_SHAPES.length && (
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: scanResult === 'correct' ? '2px solid var(--green)' : scanResult === 'wrong' ? '2px solid var(--red)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '16px', width: '100%', maxWidth: 420,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
              transition: 'border-color 0.3s',
              animation: scanResult ? (scanResult === 'correct' ? 'bounceIn 0.4s ease' : 'shake 0.4s ease') : 'slideInUp 0.3s ease',
            }}>
              <svg viewBox="0 0 400 130" width="100%" height="130" style={{ overflow: 'hidden', borderRadius: '8px' }}>
                {/* Conveyor belt */}
                <rect x="0" y="105" width="400" height="8" fill="rgba(255,255,255,0.1)" rx="4" />
                <line x1="0" y1="109" x2="400" y2="109" stroke="rgba(0,0,0,0.5)" strokeWidth="2" strokeDasharray="10,10" style={{ animation: (isAutoScanning && scanResult === null) ? 'dashMove 1.5s linear infinite' : 'none' }} />
                
                {/* Shapes group - moves to the left based on scanIdx */}
                <g style={{ transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', transform: `translateX(${200 - scanIdx * 150}px)` }}>
                  {SCANNER_SHAPES.map((shape, i) => {
                     const isCurrent = i === scanIdx;
                     const isPast = i < scanIdx;
                     const dx = i * 150;
                     return (
                        <g key={i} transform={`translate(${dx - 90}, 20)`}>
                          <polygon
                            points={polyStr(shape.points)}
                            fill={
                              isCurrent && scanResult === 'correct' ? 'rgba(76,175,80,0.3)' :
                              isCurrent && scanResult === 'wrong' ? 'rgba(239,83,80,0.3)' :
                              isPast ? 'rgba(255,255,255,0.02)' :
                              'rgba(100,120,255,0.2)'
                            }
                            stroke={
                              isCurrent && scanResult === 'correct' ? '#4caf50' :
                              isCurrent && scanResult === 'wrong' ? '#ef5350' :
                              isPast ? 'rgba(255,255,255,0.1)' :
                              'rgba(124,92,191,0.8)'
                            }
                            strokeWidth="3"
                            strokeLinejoin="round"
                            style={{ transition: 'all 0.3s' }}
                          />
                        </g>
                     )
                  })}
                </g>

                {/* Magnifying Glass (fixed in center) */}
                <circle cx="200" cy="65" r="55" fill="rgba(255,255,255,0.05)" stroke="var(--gold)" strokeWidth="4" pointerEvents="none" style={{ filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.5))' }} />
                <line x1="239" y1="104" x2="269" y2="134" stroke="var(--gold)" strokeWidth="8" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px rgba(255,193,7,0.4))' }} />
                <circle cx="200" cy="65" r="45" fill="url(#lensGradient)" opacity="0.3" pointerEvents="none" />
                
                <defs>
                  <radialGradient id="lensGradient">
                    <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
              
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                {currentScan.label}
              </span>
              {scanResult && (
                <div style={{
                  fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', padding: '8px 14px',
                  borderRadius: '8px',
                  background: scanResult === 'correct' ? 'rgba(76,175,80,0.15)' : 'rgba(239,83,80,0.15)',
                  color: scanResult === 'correct' ? '#81c784' : '#ef9a9a',
                }}>
                  {scanResult === 'correct' ? '✓ Parallelogram Detected ' : '✗ Non-Parallelogram Rejected '}
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          {scanIdx < SCANNER_SHAPES.length && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                className={`btn ${isAutoScanning ? 'btn-outline' : 'btn-green'}`}
                style={{ minWidth: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={toggleScanning}
                id="toggle-scan-btn"
              >
                {isAutoScanning ? (
                  <>⏸️ Pause Scanner</>
                ) : (
                  <>▶️ {scanIdx === 0 ? 'Start Scanning' : 'Resume Scanning'}</>
                )}
              </button>
            </div>
          )}

          {allDone && (
            <div style={{
              fontSize: '1.2rem', fontWeight: 700, color: '#ffd54f',
              animation: 'bounceIn 0.5s ease', textAlign: 'center',
            }}>
              🏆 Scanner Complete! You know your parallelograms!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
