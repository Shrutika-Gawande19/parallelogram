// CityBuilderStation.jsx — Station 3: Parallelogram City Builder
// Sliders control base, height, and slant. Magic Transformation animation.
// Area challenges reveal Area = base × height through discovery.

import { useState } from 'react';


// ── SVG layout helpers ─────────────────────────────────────────────────────
const SVG_W = 340;
const SVG_H = 200;
const BASE_Y = 168;    // bottom of shape
const LEFT_X = 40;     // left edge of base

// Compute the four vertices given base, height, slant
function getVerts(base, height, slant) {
  const A = [LEFT_X, BASE_Y];
  const B = [LEFT_X + base, BASE_Y];
  const C = [LEFT_X + base + slant, BASE_Y - height];
  const D = [LEFT_X + slant, BASE_Y - height];
  return { A, B, C, D };
}

// SVG polygon string
function polyStr({ A, B, C, D }) {
  return [A, B, C, D].map(p => p.join(',')).join(' ');
}

// ── Challenges ────────────────────────────────────────────────────────────
const CHALLENGES = [
  {
    id: 'c1',
    icon: '🏗️',
    title: 'Challenge 1',
    desc: 'Build a parallelogram with an area of exactly 24 square units.',
    targetArea: 24,
    check: (base, height, _slant) => base * height === 24,
    feedback: (area) => area === 24
      ? '🎉 Perfect! 24 square units achieved!'
      : area < 24 ? `Area is ${area} — need ${24 - area} more!` : `Area is ${area} — too big by ${area - 24}!`,
  },
  {
    id: 'c2',
    icon: '↔️',
    title: 'Challenge 2',
    desc: 'Make the parallelogram more slanted WITHOUT changing its area! (Keep base & height the same)',
    targetArea: null,
    check: (_b, _h, slant, locked) => Math.abs(slant) > 30 && locked,
    feedback: (area, slant, locked) =>
      Math.abs(slant) > 30 && locked
        ? '💡 Wow! Slanting it didn\'t change the area!'
        : Math.abs(slant) <= 30 ? 'Drag the Slant slider further!' : 'Keep base and height the same!',
  },
  {
    id: 'c3',
    icon: '🏢',
    title: 'Challenge 3',
    desc: 'Build a giant skyscraper parallelogram with an area of exactly 72 square units!',
    targetArea: 72,
    check: (base, height, _slant) => base * height === 72,
    feedback: (area) => area === 72
      ? '🎉 Magnificent! 72 square units skyscraper built!'
      : area < 72 ? `Area is ${area} — need ${72 - area} more!` : `Area is ${area} — too big by ${area - 72}!`,
  },
];

// ── Animation phases for "Make it Flat" ────────────────────────────────────
// phase: idle → cutting → sliding → complete → revealed
const ANIM_DURATION = { cutting: 700, sliding: 900, complete: 500, revealed: 0 };

// ── Main Component ─────────────────────────────────────────────────────────
export default function CityBuilderStation({ onComplete }) {
  const [base, setBase] = useState(10);       // in "units" (1 unit = 14px)
  const [height, setHeight] = useState(8);    // in "units"
  const [slant, setSlant] = useState(0);      // horizontal shift in px

  const [animPhase, setAnimPhase] = useState('idle');
  const [formulaRevealed, setFormulaRevealed] = useState(false);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [challengesDone, setChallengesDone] = useState(0);
  const [challengeFeedback, setChallengeFeedback] = useState('');
  const [areaLocked, setAreaLocked] = useState(false); // for challenge 2
  const [savedArea, setSavedArea] = useState(null);    // for challenge 3 compare

  const UNIT = 12; // pixels per unit
  const baseP = base * UNIT;
  const heightP = height * UNIT;
  const area = base * height;

  const { A, B, C, D } = getVerts(baseP, heightP, slant);

  // ── "Make it Flat" animation ───────────────────────────────────────────
  const runAnimation = () => {
    if (animPhase !== 'idle') return;
    setAnimPhase('cutting');
    setTimeout(() => setAnimPhase('sliding'), ANIM_DURATION.cutting);
    setTimeout(() => setAnimPhase('complete'), ANIM_DURATION.cutting + ANIM_DURATION.sliding);
    setTimeout(() => {
      setAnimPhase('revealed');
      setFormulaRevealed(true);
    }, ANIM_DURATION.cutting + ANIM_DURATION.sliding + ANIM_DURATION.complete);
  };

  // ── Triangle cut region ─────────────────────────────────────────────────
  // The triangle cut from the right side when slant > 0, or left when slant < 0
  const effectiveSlant = slant !== 0 ? slant : 30; // show with positive slant for demo
  // Triangle vertices (right slant case): D, topLeft of rect, D
  // We cut the "ear" triangle on the right:
  // Triangle: B (bottom-right), C (top-right), [B[0], C[1]] (top of B)
  const triA = [B[0], BASE_Y];          // bottom-right of base
  const triB = [B[0], BASE_Y - heightP]; // straight up from bottom-right
  const triC = C;                        // actual top-right corner (slanted)
  const triStr = [triA, triB, triC].map(p => p.join(',')).join(' ');

  // Slid triangle position (moves to left side)
  const triSlideOffset = animPhase === 'sliding' || animPhase === 'complete' || animPhase === 'revealed'
    ? -(baseP + slant)
    : 0;

  // ── Challenge logic ───────────────────────────────────────────────────
  const handleChallengeCheck = () => {
    const ch = CHALLENGES[challengeIdx];
    let passed = false;

    if (ch.id === 'c1') {
      passed = ch.check(base, height, slant);
      setChallengeFeedback(ch.feedback(area));
    } else if (ch.id === 'c2') {
      passed = ch.check(base, height, slant, areaLocked);
      setChallengeFeedback(ch.feedback(area, slant, areaLocked));
    } else if (ch.id === 'c3') {
      passed = ch.check(base, height, slant);
      setChallengeFeedback(ch.feedback(area));
    }

    if (passed) {
      const next = challengesDone + 1;
      setChallengesDone(next);
      if (next >= CHALLENGES.length) {
        setTimeout(() => onComplete(true), 1200);
      } else {
        setTimeout(() => {
          setChallengeIdx(challengeIdx + 1);
          setChallengeFeedback('');
          setSavedArea(null);
          setAreaLocked(false);
        }, 1800);
      }
    }
  };

  // Lock area for challenge 2 (lock base and height)
  const handleLockForChallenge2 = () => {
    setAreaLocked(true);
    setChallengeFeedback(`🔒 Base=${base} and Height=${height} locked! Area = ${area}. Now change the slant!`);
  };

  const currentChallenge = CHALLENGES[challengeIdx];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '13px', width: '100%' }}>

      {/* ── Shape + area label ── */}
      <div style={{
        position: 'relative',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '8px',
        width: '100%', maxWidth: 380,
        overflow: 'hidden',
      }}>
        <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block', maxWidth: '100%' }}>

          {/* Ground line */}
          <line x1={LEFT_X - 10} y1={BASE_Y + 2} x2={LEFT_X + baseP + Math.abs(slant) + 30} y2={BASE_Y + 2}
            stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />

          {/* Main parallelogram — hide during animation complete */}
          {animPhase !== 'complete' && animPhase !== 'revealed' && (
            <polygon
              points={polyStr({ A, B, C, D })}
              fill={animPhase !== 'idle' ? 'rgba(124,92,191,0.25)' : 'rgba(100,120,255,0.12)'}
              stroke={animPhase !== 'idle' ? '#7c5cbf' : 'rgba(124,92,191,0.7)'}
              strokeWidth="2.5" strokeLinejoin="round"
              style={{ transition: 'fill 0.4s, stroke 0.4s' }}
            />
          )}

          {/* Rectangle (result of transformation) */}
          {(animPhase === 'complete' || animPhase === 'revealed') && (
            <rect
              x={A[0]} y={BASE_Y - heightP}
              width={baseP} height={heightP}
              fill="rgba(76,175,80,0.18)"
              stroke="#4caf50" strokeWidth="2.5"
              style={{ animation: 'fadeIn 0.5s ease' }}
            />
          )}

          {/* Triangle cut (right ear) — only when slant > 0 and in animation */}
          {animPhase === 'cutting' && slant !== 0 && (
            <polygon
              points={triStr}
              fill="rgba(255,112,67,0.35)"
              stroke="#ff7043" strokeWidth="2"
              strokeDasharray="6,3"
              style={{ animation: 'fadeIn 0.3s ease' }}
            />
          )}

          {/* Triangle sliding to left side */}
          {(animPhase === 'sliding') && (
            <polygon
              points={triStr}
              fill="rgba(255,112,67,0.5)"
              stroke="#ff7043" strokeWidth="2"
              transform={`translate(${triSlideOffset}, 0)`}
              style={{ transition: `transform ${ANIM_DURATION.sliding}ms ease` }}
            />
          )}

          {/* Perpendicular height line (always shown) */}
          <line
            x1={D[0]} y1={D[1]}
            x2={D[0]} y2={BASE_Y}
            stroke="rgba(100,220,255,0.7)" strokeWidth="2" strokeDasharray="5,4"
          />
          {/* Height label */}
          <text x={D[0] - 12} y={(D[1] + BASE_Y) / 2 + 4}
            textAnchor="middle" fill="rgba(100,220,255,0.9)"
            fontSize="11" fontFamily="'Fredoka', sans-serif" fontWeight="700">
            h
          </text>
          {/* Height end marks */}
          <line x1={D[0]-5} y1={D[1]} x2={D[0]+5} y2={D[1]} stroke="rgba(100,220,255,0.7)" strokeWidth="2" />
          <line x1={D[0]-5} y1={BASE_Y} x2={D[0]+5} y2={BASE_Y} stroke="rgba(100,220,255,0.7)" strokeWidth="2" />

          {/* Right angle indicator at base of height */}
          <rect x={D[0]} y={BASE_Y - 10} width={10} height={10}
            fill="none" stroke="rgba(100,220,255,0.6)" strokeWidth="1.5"
          />

          {/* Base label */}
          <text x={A[0] + baseP/2} y={BASE_Y + 16}
            textAnchor="middle" fill="rgba(255,255,255,0.6)"
            fontSize="11" fontFamily="'Fredoka', sans-serif" fontWeight="700">
            base = {base}
          </text>

          {/* Area label */}
          <text
            x={A[0] + baseP/2 + slant/2}
            y={BASE_Y - heightP/2 + 4}
            textAnchor="middle"
            fill={animPhase === 'complete' || animPhase === 'revealed' ? '#81c784' : 'rgba(255,255,255,0.5)'}
            fontSize="12" fontFamily="'Fredoka', sans-serif" fontWeight="700"
            style={{ transition: 'fill 0.3s' }}
          >
            {area} sq
          </text>

          {/* Height annotation when revealed */}
          {animPhase === 'revealed' && (
            <text x={A[0] + baseP/2} y={BASE_Y - heightP - 12}
              textAnchor="middle" fill="#81c784"
              fontSize="11" fontFamily="'Fredoka', sans-serif" fontWeight="700"
              style={{ animation: 'slideInUp 0.4s ease' }}>
              h = {height}
            </text>
          )}

          {/* Vertex labels */}
          {[{p:A,l:'A',ox:-10,oy:14},{p:B,l:'B',ox:10,oy:14},{p:C,l:'C',ox:10,oy:-6},{p:D,l:'D',ox:-12,oy:-6}].map(v => (
            <text key={v.l} x={v.p[0]+v.ox} y={v.p[1]+v.oy} textAnchor="middle"
              fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="'Fredoka', sans-serif">
              {v.l}
            </text>
          ))}
        </svg>
      </div>

      {/* ── Sliders ── */}
      {(animPhase === 'idle') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: 380 }}>
          {[
            { label: 'Base', value: base, set: setBase, min: 4, max: 18, unit: 'units', color: '#ffc107' },
            { label: 'Height (⊥)', value: height, set: setHeight, min: 3, max: 12, unit: 'units', color: '#26c6da', disabled: challengeIdx === 1 && areaLocked },
            { label: 'Slant', value: slant, set: setSlant, min: -60, max: 60, unit: 'px', color: '#ff7043' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                minWidth: 78, fontSize: '0.8rem', fontWeight: 700,
                color: s.disabled ? 'rgba(255,255,255,0.25)' : s.color,
              }}>
                {s.label}{s.label === 'Height (⊥)' ? '' : ''}: {s.label === 'Slant' ? '' : s.value}
                {s.label === 'Slant' ? '' : ' ' + s.unit}
              </span>
              <input
                type="range" min={s.min} max={s.max} value={s.value}
                onChange={e => {
                  if (s.disabled) return;
                  if (s.label === 'Base' && challengeIdx === 1 && areaLocked) return;
                  s.set(Number(e.target.value));
                }}
                disabled={s.disabled}
                style={{
                  flex: 1, accentColor: s.color, cursor: s.disabled ? 'not-allowed' : 'pointer',
                  opacity: s.disabled ? 0.3 : 1,
                }}
                id={`slider-${s.label.replace(/\s/g,'').toLowerCase()}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Area display ── */}
      {!formulaRevealed && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)',
        }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.65)' }}>Area</span>
          <span style={{
            fontFamily: "'Fredoka', sans-serif", fontSize: '1.8rem', fontWeight: 700,
            color: '#ffd54f', minWidth: '50px', textAlign: 'center',
          }}>
            {area}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>sq units</span>
        </div>
      )}

      {/* ── Formula reveal ── */}
      {formulaRevealed && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(76,175,80,0.2), rgba(38,198,218,0.15))',
          border: '1px solid rgba(76,175,80,0.5)',
          borderRadius: '16px', padding: '14px 20px', textAlign: 'center',
          animation: 'bounceIn 0.5s ease', maxWidth: 380, width: '100%',
        }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            🔍 Discovered!
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#ffd54f' }}>
            Area = Base × Height
          </div>
          <div style={{ fontSize: '0.85rem', color: '#81c784', marginTop: '4px', fontWeight: 600 }}>
            = {base} × {height} = {area} square units
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
            Height must be measured <strong style={{ color: '#80deea' }}>perpendicular</strong> to the base!
          </div>
        </div>
      )}

      {/* ── Make it Flat button ── */}
      {animPhase === 'idle' && !formulaRevealed && (
        <button
          className="btn btn-primary"
          onClick={runAnimation}
          id="make-flat-btn"
          style={{ animation: 'pulseGlow 2s infinite' }}
        >
          🪄 Make It Flat!
        </button>
      )}

      {/* ── Animation status messages ── */}
      {animPhase === 'cutting' && (
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffab91', animation: 'slideInUp 0.3s ease', textAlign: 'center' }}>
          ✂️ Cutting a triangle from the side...
        </div>
      )}
      {animPhase === 'sliding' && (
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffd54f', animation: 'slideInUp 0.3s ease', textAlign: 'center' }}>
          ↩️ Sliding the triangle to the other side...
        </div>
      )}
      {animPhase === 'complete' && (
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#81c784', animation: 'bounceIn 0.4s ease', textAlign: 'center' }}>
          🟩 It's a rectangle! Same area!
        </div>
      )}

      {/* ── Area Challenges (shown after formula reveal) ── */}
      {formulaRevealed && challengeIdx < CHALLENGES.length && (
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Challenge progress */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '10px' }}>
            {CHALLENGES.map((_, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: '50%',
                background: i < challengesDone ? 'var(--green)' : i === challengeIdx ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${i < challengesDone ? 'var(--green)' : i === challengeIdx ? 'var(--gold)' : 'rgba(255,255,255,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700,
                color: i < challengesDone ? 'white' : i === challengeIdx ? '#1a1a2e' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.3s',
              }}>
                {i < challengesDone ? '✓' : i + 1}
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px', padding: '14px 16px',
          }}>
            <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '10px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              {currentChallenge.icon} {currentChallenge.title}
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', marginBottom: '16px', lineHeight: 1.4, background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--gold)' }}>
              {currentChallenge.desc}
            </div>

            {/* Challenge 2 special: Lock button */}
            {currentChallenge.id === 'c2' && !areaLocked && (
              <button className="btn btn-outline btn-sm" onClick={handleLockForChallenge2}
                style={{ marginBottom: '8px' }} id="lock-area-btn">
                🔒 Lock Base & Height
              </button>
            )}

            {/* Challenge sliders (re-render after formula) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {[
                { label: 'Base', value: base, set: setBase, min: 4, max: 18, color: '#ffc107', disabled: currentChallenge.id === 'c2' && areaLocked },
                { label: 'Height (⊥)', value: height, set: setHeight, min: 3, max: 12, color: '#26c6da', disabled: currentChallenge.id === 'c2' && areaLocked },
                { label: 'Slant', value: slant, set: setSlant, min: -60, max: 60, color: '#ff7043' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    minWidth: 74, fontSize: '0.75rem', fontWeight: 700,
                    color: s.disabled ? 'rgba(255,255,255,0.25)' : s.color,
                  }}>
                    {s.label}: {s.label !== 'Slant' ? s.value : ''}
                  </span>
                  <input
                    type="range" min={s.min} max={s.max} value={s.value}
                    onChange={e => !s.disabled && s.set(Number(e.target.value))}
                    disabled={s.disabled}
                    style={{ flex: 1, accentColor: s.color, opacity: s.disabled ? 0.3 : 1 }}
                    id={`ch-slider-${s.label.replace(/\s/g,'').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{
                fontFamily: "'Fredoka', sans-serif", fontSize: '1.4rem', fontWeight: 700,
                color: currentChallenge.id === 'c1' && area === 24 ? '#81c784' : '#ffd54f',
              }}>
                {area} sq
              </div>
              <button className="btn btn-green btn-sm" onClick={handleChallengeCheck}
                id={`challenge-check-${challengeIdx}`}>
                ✓ Check!
              </button>
            </div>

            {challengeFeedback && (
              <div style={{
                marginTop: '8px', fontSize: '0.82rem', fontWeight: 700,
                color: challengeFeedback.startsWith('🎉') || challengeFeedback.startsWith('💡') || challengeFeedback.startsWith('💾') ? '#81c784' : '#ffab91',
                animation: 'slideInUp 0.3s ease', lineHeight: 1.5,
              }}>
                {challengeFeedback}
              </div>
            )}
          </div>
        </div>
      )}

      {/* All challenges complete */}
      {formulaRevealed && challengesDone >= CHALLENGES.length && (
        <div style={{
          background: 'rgba(76,175,80,0.15)', border: '1px solid var(--green)',
          borderRadius: '14px', padding: '14px 20px', textAlign: 'center',
          animation: 'bounceIn 0.5s ease',
        }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#81c784' }}>
            🏙️ City Built! You mastered parallelogram area!
          </div>
          <div style={{ fontSize: '0.85rem', color: '#b2dfdb', marginTop: '4px' }}>
            Area = Base × Perpendicular Height
          </div>
        </div>
      )}
    </div>
  );
}
