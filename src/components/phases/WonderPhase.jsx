// WonderPhase.jsx — Animated playground gate hook

import { useState, useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import { wonderNarration } from '../../utils/narration';

const HOOK_STEPS = [
  "Look at this playground gate sliding open...",
  "The two long bars are always the same length and always stay parallel!",
  "What shape do the bars make when the gate tilts? Let's find out! 🔍",
];

export default function WonderPhase({ onComplete, state }) {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [animPhase, setAnimPhase] = useState(0); // 0=rectangle, 1=parallelogram

  useEffect(() => {
    if (state.audioEnabled) {
      narrate(wonderNarration(step, revealed));
    }
    return () => stopNarration();
  }, [step, revealed, state.audioEnabled]);

  // Cycle gate animation
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimPhase(p => (p === 0 ? 1 : 0));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    if (step < HOOK_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      setRevealed(true);
    }
  };

  const handleReplay = () => {
    if (!state.audioEnabled) return;
    stopNarration();
    narrate(wonderNarration(step, revealed));
  };

  return (
    <div className="phase-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 20px', minHeight: '100vh', justifyContent: 'center' }}>
      {/* Big Question Mark */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#7c4dff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3.5rem',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '12px',
        boxShadow: '0 8px 24px rgba(124, 77, 255, 0.4)',
        opacity: revealed ? 0 : 1,
        transform: revealed ? 'scale(0.8) translateY(-20px)' : undefined,
        animation: revealed ? 'none' : 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        pointerEvents: revealed ? 'none' : 'auto'
      }}>
        ?
      </div>

      {/* Mascot & Bubble */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#ffc107',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          marginBottom: '8px'
        }}>
          <MascotHead />
        </div>
        <div style={{
          background: 'white',
          color: '#1a1a3e',
          padding: '10px 16px',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.95rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          Hmm... I wonder... 🤔
          <div style={{
            position: 'absolute',
            top: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid white',
          }}></div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="glass-card" style={{ width: '100%', maxWidth: '600px', padding: '20px', textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ marginBottom: '16px', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <GateSVG animPhase={animPhase} revealed={revealed} />
        </div>
        
        <p style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.5, color: 'rgba(255,255,255,0.95)', marginBottom: '16px' }}>
          {HOOK_STEPS[step]}
        </p>

        {revealed && (
          <div style={{
            animation: 'fadeInUp 0.6s ease',
          }}>
            <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem', color: '#ffc107', fontWeight: 700, marginBottom: '8px' }}>
              Let's discover what shape this is! 🔍
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              We'll explore its properties and find out!
            </p>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
        {!revealed ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            id="wonder-next-btn"
            style={{ padding: '10px 28px', fontSize: '1.05rem', borderRadius: '99px' }}
          >
            {step < HOOK_STEPS.length - 1 ? 'Next 💡' : 'Let\'s Discover! ✨'}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={onComplete}
            id="wonder-continue-btn"
            style={{ padding: '10px 28px', fontSize: '1.05rem', borderRadius: '99px', animation: 'bounceIn 0.5s ease' }}
          >
            Begin Discovery 🚀
          </button>
        )}

        <button
          onClick={handleReplay}
          className="btn btn-outline"
          style={{
            padding: '10px 18px',
            fontSize: '0.95rem',
            borderRadius: '99px',
            opacity: state.audioEnabled ? 1 : 0.4,
            cursor: state.audioEnabled ? 'pointer' : 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
          disabled={!state.audioEnabled}
          title={state.audioEnabled ? "Replay audio" : "Audio is muted"}
        >
          🔊 Replay
        </button>
      </div>
    </div>
  );
}

// Inline SVG mascot head
function MascotHead() {
  return (
    <svg width="36" height="36" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="10" width="54" height="44" rx="14" fill="#5c6bc0" />
      <circle cx="33" cy="30" r="7" fill="white" />
      <circle cx="57" cy="30" r="7" fill="white" />
      <circle cx="35" cy="31" r="4" fill="#1a237e" />
      <circle cx="59" cy="31" r="4" fill="#1a237e" />
      <circle cx="37" cy="29" r="1.5" fill="white" />
      <circle cx="61" cy="29" r="1.5" fill="white" />
      <path d="M34 42 Q45 50 56 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="45" y1="10" x2="45" y2="2" stroke="#ffc107" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="45" cy="1" r="3" fill="#ffc107" />
    </svg>
  );
}

// Animated gate SVG
function GateSVG({ animPhase, revealed }) {
  // Rectangle state: skew=0. Parallelogram state: skew offset applied
  const skew = animPhase === 0 ? 0 : 40;
  const transition = 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)';

  // 4 posts (vertical bars)
  const posts = [0, 1, 2, 3];
  const postX = [60, 120, 180, 240];
  const topY = 40;
  const bottomY = 160;

  return (
    <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: 400 }}>
      {/* Ground */}
      <rect x="20" y="168" width="280" height="8" rx="4" fill="rgba(255,255,255,0.1)" />

      {/* Parallelogram fill */}
      <polygon
        points={`${60 + skew},${topY} ${240 + skew},${topY} ${240},${bottomY} ${60},${bottomY}`}
        fill="rgba(100,120,255,0.1)"
        stroke="rgba(100,120,255,0.3)"
        strokeWidth="1"
        style={{ transition }}
      />

      {/* Vertical bars */}
      {postX.map((x, i) => (
        <line
          key={i}
          x1={x + skew}
          y1={topY}
          x2={x}
          y2={bottomY}
          stroke={revealed ? '#4caf50' : '#7c5cbf'}
          strokeWidth="5"
          strokeLinecap="round"
          style={{ transition }}
        />
      ))}

      {/* Top bar */}
      <line
        x1={60 + skew} y1={topY} x2={240 + skew} y2={topY}
        stroke="#ffc107" strokeWidth="5" strokeLinecap="round"
        style={{ transition }}
      />
      {/* Bottom bar */}
      <line
        x1={60} y1={bottomY} x2={240} y2={bottomY}
        stroke="#ffc107" strokeWidth="5" strokeLinecap="round"
      />

      {/* Vertex labels */}
      {[
        { label: 'A', x: 55 + skew, y: topY - 12 },
        { label: 'B', x: 248 + skew, y: topY - 12 },
        { label: 'C', x: 248, y: bottomY + 18 },
        { label: 'D', x: 52, y: bottomY + 18 },
      ].map(v => (
        <text
          key={v.label}
          x={v.x} y={v.y}
          textAnchor="middle"
          fill="rgba(255,255,255,0.8)"
          fontSize="14"
          fontFamily="'Fredoka', sans-serif"
          fontWeight="700"
          style={{ transition }}
        >
          {v.label}
        </text>
      ))}

      {/* Tick marks on equal sides */}
      <line x1={148 + skew} y1={topY - 4} x2={152 + skew} y2={topY + 4} stroke="rgba(255,255,255,0.5)" strokeWidth="2" style={{ transition }} />
      <line x1={148} y1={bottomY - 4} x2={152} y2={bottomY + 4} stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

      {/* Arrow label */}
      {animPhase === 1 && (
        <text x="160" y="20" textAnchor="middle" fill="rgba(255,193,7,0.9)" fontSize="12" fontFamily="'Nunito', sans-serif" fontWeight="700">
          Sliding...
        </text>
      )}
    </svg>
  );
}
