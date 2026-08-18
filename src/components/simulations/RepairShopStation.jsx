// RepairShopStation.jsx — Station 2: Parallelogram Repair Shop
// Three missions: Opposite Sides, Opposite Angles, Diagonal Power.

import { useState } from 'react';

// ── Shared SVG geometry ────────────────────────────────────────────────────
const W = 320;
const H = 200;

// Parallelogram vertices (fixed for Repair Shop — properties are the focus)
const SHEAR = 55;
const BASE_X = 50;
const BASE_Y = 160;
const BASE_W = 210;
const BASE_H = 100;

const A = [BASE_X, BASE_Y];
const B = [BASE_X + BASE_W, BASE_Y];
const C = [BASE_X + BASE_W + SHEAR, BASE_Y - BASE_H];
const D = [BASE_X + SHEAR, BASE_Y - BASE_H];

const POLY = `${A.join(',')},${B.join(',')},${C.join(',')},${D.join(',')}`;

// Midpoints
function midpt(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }

const MAB = midpt(A, B);
const MDC = midpt(D, C);
const MAD = midpt(A, D);
const MBC = midpt(B, C);
const diagCenter = midpt(A, C); // diagonals of a parallelogram bisect each other

// Angle at vertex A (using dot product of AB and AD vectors)
function angleDeg(origin, p1, p2) {
  const v1 = [p1[0] - origin[0], p1[1] - origin[1]];
  const v2 = [p2[0] - origin[0], p2[1] - origin[1]];
  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  const len = Math.sqrt((v1[0]**2+v1[1]**2)) * Math.sqrt((v2[0]**2+v2[1]**2));
  return Math.round(Math.acos(Math.max(-1, Math.min(1, dot/len))) * 180 / Math.PI);
}

const angleA = angleDeg(A, B, D);
const angleB = angleDeg(B, A, C);
const angleC = angleDeg(C, B, D);
const angleD = angleDeg(D, A, C);

// Angle arc path helper
function arcPath(cx, cy, r, startAngleDeg, endAngleDeg) {
  const toRad = d => d * Math.PI / 180;
  const x1 = cx + r * Math.cos(toRad(startAngleDeg));
  const y1 = cy + r * Math.sin(toRad(startAngleDeg));
  const x2 = cx + r * Math.cos(toRad(endAngleDeg));
  const y2 = cy + r * Math.sin(toRad(endAngleDeg));
  const large = Math.abs(endAngleDeg - startAngleDeg) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

// Angle arcs for each vertex
const arcs = {
  A: { cx: A[0], cy: A[1], start: -15, end: -angleDeg(A,B,D)-15+angleDeg(A,B,D), startV: 0, endV: angleDeg(A,B,D) },
  B: { cx: B[0], cy: B[1] },
  C: { cx: C[0], cy: C[1] },
  D: { cx: D[0], cy: D[1] },
};

// Mission definitions
const MISSIONS = [
  {
    id: 'sides',
    title: 'Mission 1: Opposite Sides',
    icon: '📏',
    desc: 'Click the side that is EQUAL and PARALLEL to the highlighted side AB.',
    hint: 'In a parallelogram, opposite sides are always equal!',
  },
  {
    id: 'angles',
    title: 'Mission 2: Opposite Angles',
    icon: '📐',
    desc: 'Click the angle that equals the highlighted angle A.',
    hint: 'Opposite angles in a parallelogram are always equal!',
  },
  {
    id: 'diagonals',
    title: 'Mission 3: Diagonal Power',
    icon: '✂️',
    desc: 'Press "Draw Diagonals" to discover the secret of parallelogram diagonals!',
    hint: 'The diagonals of a parallelogram bisect each other!',
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────

function MissionSides({ onDone }) {
  const [clicked, setClicked] = useState(null); // 'DC' | 'BC' | 'AD'
  const [revealed, setRevealed] = useState(false);

  const handleClick = (side) => {
    if (clicked === 'DC' || revealed) return;
    setClicked(side);
    if (side === 'DC') {
      setTimeout(() => { setRevealed(true); setTimeout(() => onDone(), 1400); }, 600);
    } else {
      setTimeout(() => setClicked(null), 1500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.3)',
        borderRadius: '10px', padding: '12px 20px', textAlign: 'center',
        fontSize: '1.2rem', fontWeight: 800, color: '#ffd54f', maxWidth: 450,
      }}>
        Click the side equal and parallel to <strong>AB</strong> (highlighted in gold)
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%' }}>
        {/* Shape fill */}
        <polygon points={POLY} fill="rgba(100,120,255,0.08)" stroke="rgba(124,92,191,0.4)" strokeWidth="1.5" />

        {/* Highlighted side AB */}
        <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]}
          stroke="#ffc107" strokeWidth="4" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.6))' }}
        />
        <text x={MAB[0]} y={MAB[1] + 16} textAnchor="middle" fill="#ffc107" fontSize="13"
          fontFamily="'Fredoka', sans-serif" fontWeight="700">AB</text>

        {/* Clickable sides */}
        {[
          { id: 'DC', x1: D[0], y1: D[1], x2: C[0], y2: C[1], mid: MDC, label: 'DC', correct: true },
          { id: 'AD', x1: A[0], y1: A[1], x2: D[0], y2: D[1], mid: MAD, label: 'AD', correct: false },
          { id: 'BC', x1: B[0], y1: B[1], x2: C[0], y2: C[1], mid: MBC, label: 'BC', correct: false },
        ].map(s => {
          const isClicked = clicked === s.id;
          const color = isClicked ? (s.correct ? '#4caf50' : '#ef5350') : 'rgba(255,255,255,0.5)';
          return (
            <g key={s.id} style={{ cursor: clicked ? 'default' : 'pointer' }} onClick={() => handleClick(s.id)}>
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                stroke={color} strokeWidth={isClicked ? 5 : 3} strokeLinecap="round"
                style={{ transition: 'stroke 0.3s, stroke-width 0.3s' }}
              />
              {/* Invisible fat hit area */}
              <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                stroke="transparent" strokeWidth="18"
              />
              <text x={s.mid[0] + (s.id === 'AD' ? -18 : s.id === 'BC' ? 18 : 0)}
                y={s.mid[1] + (s.id === 'DC' ? -8 : 4)}
                textAnchor="middle" fill={color} fontSize="12"
                fontFamily="'Fredoka', sans-serif" fontWeight="700"
                style={{ transition: 'fill 0.3s', pointerEvents: 'none' }}
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {/* Equal tick marks when revealed */}
        {revealed && (
          <>
            {/* AB ticks */}
            <line x1={MAB[0]-5} y1={MAB[1]-4} x2={MAB[0]-5} y2={MAB[1]+4} stroke="#4caf50" strokeWidth="2" />
            <line x1={MAB[0]+5} y1={MAB[1]-4} x2={MAB[0]+5} y2={MAB[1]+4} stroke="#4caf50" strokeWidth="2" />
            {/* DC ticks */}
            <line x1={MDC[0]-5} y1={MDC[1]-4} x2={MDC[0]-5} y2={MDC[1]+4} stroke="#4caf50" strokeWidth="2" />
            <line x1={MDC[0]+5} y1={MDC[1]-4} x2={MDC[0]+5} y2={MDC[1]+4} stroke="#4caf50" strokeWidth="2" />
          </>
        )}

        {/* Corner labels */}
        {[{p:A,l:'A',ox:-12,oy:14},{p:B,l:'B',ox:8,oy:14},{p:C,l:'C',ox:10,oy:-6},{p:D,l:'D',ox:-14,oy:-6}].map(v => (
          <text key={v.l} x={v.p[0]+v.ox} y={v.p[1]+v.oy} textAnchor="middle"
            fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="'Fredoka', sans-serif">
            {v.l}
          </text>
        ))}
      </svg>

      {clicked && (
        <div style={{
          fontSize: '0.9rem', fontWeight: 700,
          color: clicked === 'DC' ? '#81c784' : '#ef9a9a',
          animation: 'bounceIn 0.4s ease', textAlign: 'center',
          background: clicked === 'DC' ? 'rgba(76,175,80,0.12)' : 'rgba(239,83,80,0.12)',
          border: `1px solid ${clicked === 'DC' ? '#4caf50' : '#ef5350'}`,
          borderRadius: '10px', padding: '8px 14px',
        }}>
          {clicked === 'DC'
            ? '✓ Correct! DC = AB — opposite sides are equal and parallel!'
            : '✗ Not quite — look for the side directly opposite to AB!'}
        </div>
      )}
    </div>
  );
}

function MissionAngles({ onDone }) {
  const [clicked, setClicked] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleClick = (vertex) => {
    if (clicked === 'C' || revealed) return;
    setClicked(vertex);
    if (vertex === 'C') {
      setTimeout(() => { setRevealed(true); setTimeout(() => onDone(), 1400); }, 600);
    } else {
      setTimeout(() => setClicked(null), 1500);
    }
  };

  // Compute angle arc angles from vectors
  const getArcAngles = (origin, p1, p2) => {
    const a1 = Math.atan2(p1[1] - origin[1], p1[0] - origin[0]) * 180 / Math.PI;
    const a2 = Math.atan2(p2[1] - origin[1], p2[0] - origin[0]) * 180 / Math.PI;
    return [a1, a2];
  };

  const arcA = getArcAngles(A, B, D);
  const arcC = getArcAngles(C, B, D);
  const arcB = getArcAngles(B, A, C);
  const arcD = getArcAngles(D, A, C);

  const clickableAngles = [
    { id: 'B', cx: B[0], cy: B[1], arcs: arcB, correct: false },
    { id: 'C', cx: C[0], cy: C[1], arcs: arcC, correct: true },
    { id: 'D', cx: D[0], cy: D[1], arcs: arcD, correct: false },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.3)',
        borderRadius: '10px', padding: '12px 20px', textAlign: 'center',
        fontSize: '1.2rem', fontWeight: 800, color: '#ffd54f', maxWidth: 450,
      }}>
        Angle A = <strong>{angleA}°</strong>. Click the angle that equals it!
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%' }}>
        <polygon points={POLY} fill="rgba(100,120,255,0.08)" stroke="rgba(124,92,191,0.4)" strokeWidth="1.5" />

        {/* Highlighted angle A */}
        <path
          d={arcPath(A[0], A[1], 28, arcA[0], arcA[1])}
          fill="none" stroke="#ffc107" strokeWidth="3" strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 5px rgba(255,193,7,0.6))' }}
        />
        <text x={A[0]+22} y={A[1]-12} fill="#ffc107" fontSize="12"
          fontFamily="'Fredoka', sans-serif" fontWeight="700">
          {angleA}°
        </text>

        {/* Clickable angles */}
        {clickableAngles.map(a => {
          const isClicked = clicked === a.id;
          const color = isClicked ? (a.correct ? '#4caf50' : '#ef5350') : 'rgba(255,255,255,0.5)';
          return (
            <g key={a.id} style={{ cursor: clicked ? 'default' : 'pointer' }} onClick={() => handleClick(a.id)}>
              {/* Hit area */}
              <circle cx={a.cx} cy={a.cy} r={28} fill="transparent" />
              <path
                d={arcPath(a.cx, a.cy, 24, a.arcs[0], a.arcs[1])}
                fill="none" stroke={color} strokeWidth={isClicked ? 3.5 : 2.5} strokeLinecap="round"
                style={{ transition: 'stroke 0.3s', strokeDasharray: isClicked ? 'none' : '4,3' }}
              />
              {revealed && a.id === 'C' && (
                <text x={a.cx - 28} y={a.cy - 10} fill="#4caf50" fontSize="12"
                  fontFamily="'Fredoka', sans-serif" fontWeight="700">
                  {angleA}°
                </text>
              )}
            </g>
          );
        })}

        {/* Vertex labels */}
        {[{p:A,l:'A',ox:-12,oy:14},{p:B,l:'B',ox:10,oy:14},{p:C,l:'C',ox:12,oy:-6},{p:D,l:'D',ox:-14,oy:-6}].map(v => (
          <text key={v.l} x={v.p[0]+v.ox} y={v.p[1]+v.oy} textAnchor="middle"
            fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="'Fredoka', sans-serif">
            {v.l}
          </text>
        ))}
      </svg>

      {clicked && (
        <div style={{
          fontSize: '0.9rem', fontWeight: 700,
          color: clicked === 'C' ? '#81c784' : '#ef9a9a',
          animation: 'bounceIn 0.4s ease', textAlign: 'center',
          background: clicked === 'C' ? 'rgba(76,175,80,0.12)' : 'rgba(239,83,80,0.12)',
          border: `1px solid ${clicked === 'C' ? '#4caf50' : '#ef5350'}`,
          borderRadius: '10px', padding: '8px 14px',
        }}>
          {clicked === 'C'
            ? `✓ Yes! ∠C = ∠A = ${angleA}° — opposite angles are equal!`
            : '✗ That\'s adjacent! Look for the angle OPPOSITE to A (diagonally across)!'}
        </div>
      )}
    </div>
  );
}

function MissionDiagonals({ onDone }) {
  const [phase, setPhase] = useState('idle'); // idle | drawing | shown | halves
  const [drawn, setDrawn] = useState(false);

  const diagAC = midpt(A, C);  // should equal midpt(B,D)
  const diagBD = midpt(B, D);

  function localLen(dx, dy) { return Math.sqrt(dx*dx+dy*dy).toFixed(0); }

  const halfAC1 = localLen(diagAC[0]-A[0], diagAC[1]-A[1]);
  const halfAC2 = localLen(C[0]-diagAC[0], C[1]-diagAC[1]);
  const halfBD1 = localLen(diagBD[0]-B[0], diagBD[1]-B[1]);
  const halfBD2 = localLen(D[0]-diagBD[0], D[1]-diagBD[1]);

  const handleDraw = () => {
    setPhase('drawing');
    setTimeout(() => setPhase('shown'), 1000);
    setTimeout(() => setDrawn(true), 1000);
    setTimeout(() => setPhase('halves'), 2200);
    setTimeout(() => onDone(), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{
        background: 'rgba(255,193,7,0.12)', border: '1px solid rgba(255,193,7,0.3)',
        borderRadius: '10px', padding: '12px 20px', textAlign: 'center',
        fontSize: '1.2rem', fontWeight: 800, color: '#ffd54f', maxWidth: 450,
      }}>
        Press the button to draw the diagonals and discover their secret!
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ maxWidth: '100%' }}>
        <polygon points={POLY} fill="rgba(100,120,255,0.08)" stroke="rgba(124,92,191,0.5)" strokeWidth="1.5" />

        {/* Diagonal AC */}
        {phase !== 'idle' && (
          <line x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]}
            stroke="#4caf50" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={phase === 'drawing' ? '8,5' : 'none'}
            style={{ animation: phase === 'drawing' ? 'none' : 'fadeIn 0.5s ease' }}
          />
        )}

        {/* Diagonal BD */}
        {phase !== 'idle' && (
          <line x1={B[0]} y1={B[1]} x2={D[0]} y2={D[1]}
            stroke="#ff7043" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={phase === 'drawing' ? '8,5' : 'none'}
            style={{ animation: phase === 'drawing' ? 'none' : 'fadeIn 0.5s ease' }}
          />
        )}

        {/* Intersection point */}
        {drawn && (
          <circle cx={diagAC[0]} cy={diagAC[1]} r={7}
            fill="#ffc107" stroke="white" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255,193,7,0.8))', animation: 'bounceIn 0.4s ease' }}
          />
        )}

        {/* Equal half labels */}
        {phase === 'halves' && (
          <>
            <text x={(A[0]+diagAC[0])/2 - 10} y={(A[1]+diagAC[1])/2 - 6} fill="#81c784" fontSize="11"
              fontFamily="'Fredoka', sans-serif" fontWeight="700">{halfAC1}</text>
            <text x={(C[0]+diagAC[0])/2 + 4} y={(C[1]+diagAC[1])/2 - 6} fill="#81c784" fontSize="11"
              fontFamily="'Fredoka', sans-serif" fontWeight="700">{halfAC2}</text>
            <text x={(B[0]+diagBD[0])/2 + 8} y={(B[1]+diagBD[1])/2} fill="#ffab91" fontSize="11"
              fontFamily="'Fredoka', sans-serif" fontWeight="700">{halfBD1}</text>
            <text x={(D[0]+diagBD[0])/2 - 18} y={(D[1]+diagBD[1])/2} fill="#ffab91" fontSize="11"
              fontFamily="'Fredoka', sans-serif" fontWeight="700">{halfBD2}</text>
          </>
        )}

        {/* Vertex labels */}
        {[{p:A,l:'A',ox:-12,oy:14},{p:B,l:'B',ox:10,oy:14},{p:C,l:'C',ox:12,oy:-6},{p:D,l:'D',ox:-14,oy:-6}].map(v => (
          <text key={v.l} x={v.p[0]+v.ox} y={v.p[1]+v.oy} textAnchor="middle"
            fill="rgba(255,255,255,0.5)" fontSize="11" fontFamily="'Fredoka', sans-serif">
            {v.l}
          </text>
        ))}
      </svg>

      {phase === 'idle' && (
        <button className="btn btn-primary" onClick={handleDraw} id="draw-diagonals-btn">
          ✏️ Draw Diagonals
        </button>
      )}

      {phase === 'halves' && (
        <div style={{
          background: 'rgba(76,175,80,0.12)', border: '1px solid #4caf50',
          borderRadius: '12px', padding: '12px 16px', textAlign: 'center',
          animation: 'slideInUp 0.4s ease', maxWidth: 340,
        }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#81c784', margin: 0 }}>
            🎉 Discovered! The diagonals <strong style={{ color: '#ffd54f' }}>bisect each other</strong> — each diagonal is cut into two equal halves!
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main RepairShop Component ──────────────────────────────────────────────
export default function RepairShopStation({ onComplete }) {
  const [mission, setMission] = useState(0);
  const [missionsDone, setMissionsDone] = useState(0);
  const [allComplete, setAllComplete] = useState(false);

  const completeMission = () => {
    const next = missionsDone + 1;
    setMissionsDone(next);
    if (next >= MISSIONS.length) {
      setAllComplete(true);
      setTimeout(() => onComplete(true), 700);
    } else {
      setTimeout(() => setMission(next), 400);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', width: '100%' }}>
      {/* Mission tabs */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {MISSIONS.map((m, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: i < missionsDone ? 'var(--green)' : i === mission ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${i < missionsDone ? 'var(--green)' : i === mission ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', transition: 'all 0.3s',
              boxShadow: i === mission ? '0 0 12px rgba(255,193,7,0.3)' : 'none',
            }}>
              {i < missionsDone ? '✓' : m.icon}
            </div>
            <span style={{
              fontSize: '0.62rem', fontWeight: 700, textAlign: 'center',
              color: i === mission ? 'var(--gold)' : i < missionsDone ? 'var(--green-light)' : 'rgba(255,255,255,0.35)',
              maxWidth: 60,
            }}>
              {m.title.split(':')[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Mission header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'Fredoka', sans-serif", fontSize: '1.05rem', fontWeight: 700,
          color: 'var(--gold)', marginBottom: '4px',
        }}>
          {MISSIONS[mission].title}
        </div>
        <div style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.65)', maxWidth: 340 }}>
          {MISSIONS[mission].desc}
        </div>
      </div>

      {/* Mission content */}
      {mission === 0 && <MissionSides onDone={completeMission} />}
      {mission === 1 && <MissionAngles onDone={completeMission} />}
      {mission === 2 && <MissionDiagonals onDone={completeMission} />}

      {/* All done */}
      {allComplete && (
        <div style={{
          background: 'rgba(76,175,80,0.15)', border: '1px solid var(--green)',
          borderRadius: '12px', padding: '12px 20px', textAlign: 'center',
          animation: 'bounceIn 0.5s ease',
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#81c784' }}>
            🛠️ Repair Shop Complete! All properties discovered!
          </div>
        </div>
      )}
    </div>
  );
}
