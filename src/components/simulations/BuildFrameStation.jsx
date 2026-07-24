// BuildFrameStation.jsx — Station A: Drag vertices to build a parallelogram

import { useState, useCallback } from 'react';
import { getPropertyBadges, isParallelogram } from '../../utils/geometryEngine';

const CELL = 36;
const PAD = 24;
const COLS = 9;
const ROWS = 7;
const W = PAD * 2 + CELL * (COLS - 1);
const H = PAD * 2 + CELL * (ROWS - 1);

const ROUNDS = [
  { label: 'Round 1', startPts: [{ x:2,y:1 },{ x:6,y:1 },{ x:5,y:5 },{ x:1,y:5 }] },
  { label: 'Round 2', startPts: [{ x:1,y:1 },{ x:7,y:1 },{ x:6,y:5 },{ x:0,y:5 }] },
  { label: 'Round 3', startPts: [{ x:3,y:0 },{ x:7,y:0 },{ x:6,y:6 },{ x:2,y:6 }] },
  { label: 'Round 4', startPts: [{ x:1,y:2 },{ x:7,y:2 },{ x:8,y:5 },{ x:2,y:5 }] },
];

const VERTEX_LABELS = ['A','B','C','D'];
const VERTEX_COLORS = ['#ffc107','#4caf50','#ff7043','#7c5cbf'];

export default function BuildFrameStation({ onComplete }) {
  const [round, setRound] = useState(0);
  const [vertices, setVertices] = useState(ROUNDS[0].startPts.map(p => ({ ...p })));
  const [dragging, setDragging] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const toPixel = (g) => ({ x: PAD + g.x * CELL, y: PAD + g.y * CELL });
  const toGrid = (px, py) => ({
    x: Math.max(0, Math.min(COLS - 1, Math.round((px - PAD) / CELL))),
    y: Math.max(0, Math.min(ROWS - 1, Math.round((py - PAD) / CELL))),
  });

  const handleSvgPointerMove = useCallback((e) => {
    if (dragging === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const scale = rect.width / W;
    const g = toGrid(px / scale, py / scale);
    setVertices(prev => {
      const next = [...prev];
      next[dragging] = g;
      return next;
    });
  }, [dragging]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  const badges = getPropertyBadges(vertices.map(toPixel));
  const valid = isParallelogram(vertices.map(toPixel));

  const handleSubmit = () => {
    setSubmitted(true);
    setIsCorrect(valid);
    if (valid) {
      const next = roundsCompleted + 1;
      setRoundsCompleted(next);
      if (next >= ROUNDS.length) {
        setTimeout(() => onComplete(true), 1200);
      } else {
        setTimeout(() => {
          setRound(next);
          setVertices(ROUNDS[next].startPts.map(p => ({ ...p })));
          setSubmitted(false);
          setIsCorrect(false);
        }, 1000);
      }
    } else {
      setTimeout(() => setSubmitted(false), 1200);
    }
  };

  const pixelVerts = vertices.map(toPixel);
  const polyPts = pixelVerts.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
        Drag the <strong style={{ color: '#ffc107' }}>corners</strong> until the shape becomes a valid parallelogram!
      </p>

      {/* Round indicator */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {ROUNDS.map((_, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: i < roundsCompleted ? 'var(--green)' : i === round ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
            border: `2px solid ${i === round ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700,
            color: i < roundsCompleted ? 'white' : i === round ? '#1a1a2e' : 'rgba(255,255,255,0.4)',
          }}>
            {i < roundsCompleted ? '✓' : i + 1}
          </div>
        ))}
      </div>

      {/* Geoboard */}
      <div className="geoboard-container" style={{ touchAction: 'none' }}>
        <svg
          width={W} height={H}
          viewBox={`0 0 ${W} ${H}`}
          onPointerMove={handleSvgPointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ display: 'block', cursor: dragging !== null ? 'grabbing' : 'default', maxWidth: '100%' }}
        >
          {/* Grid dots */}
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => (
              <circle
                key={`${r}-${c}`}
                cx={PAD + c * CELL} cy={PAD + r * CELL}
                r={2.5} fill="rgba(255,255,255,0.2)"
              />
            ))
          )}

          {/* Parallelogram fill */}
          <polygon
            points={polyPts}
            fill={submitted && isCorrect ? 'rgba(76,175,80,0.15)' : submitted ? 'rgba(239,83,80,0.1)' : 'rgba(100,120,255,0.08)'}
            stroke={submitted && isCorrect ? '#4caf50' : submitted ? '#ef5350' : 'rgba(124,92,191,0.7)'}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Vertex handles */}
          {pixelVerts.map((p, i) => (
            <g key={i}
              onPointerDown={(e) => { e.preventDefault(); setDragging(i); }}
              style={{ cursor: 'grab' }}
            >
              <circle
                cx={p.x} cy={p.y} r={12}
                fill={VERTEX_COLORS[i]}
                stroke="white" strokeWidth="2"
                style={{ animation: 'vertexPop 0.3s ease' }}
              />
              <text x={p.x} y={p.y + 5} textAnchor="middle"
                fill="white" fontSize="11" fontFamily="'Fredoka', sans-serif" fontWeight="700"
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {VERTEX_LABELS[i]}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Property badges */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'AB ∥ DC', key: 'ab_parallel_dc' },
          { label: 'AD ∥ BC', key: 'ad_parallel_bc' },
          { label: 'AB = DC', key: 'ab_equals_dc' },
          { label: 'AD = BC', key: 'ad_equals_bc' },
        ].map(b => (
          <span key={b.key} className={`property-badge ${badges[b.key] ? 'pass' : 'fail'}`}>
            {badges[b.key] ? '✓' : '○'} {b.label}
          </span>
        ))}
      </div>

      {/* Submit */}
      <button
        className="btn btn-green"
        onClick={handleSubmit}
        disabled={submitted}
        id="build-submit-btn"
      >
        {submitted && isCorrect ? '✓ Correct! Next Round →' : submitted ? '✗ Not quite — try again!' : 'Check My Parallelogram! 📐'}
      </button>
    </div>
  );
}
