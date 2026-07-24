// AngleSentenceStation.jsx — Station C: Fill in missing angles

import { useState } from 'react';
import ParallelogramDiagram from '../shared/ParallelogramDiagram';
import NumberPad from '../shared/NumberPad';

const ROUNDS = [
  {
    angleA: 70,
    question: 'In parallelogram ABCD, ∠A = 70°. What is ∠C?',
    target: 'C',
    answer: 70,
    property: 'Opposite angles are equal: ∠C = ∠A = 70°',
  },
  {
    angleA: 55,
    question: 'In parallelogram ABCD, ∠A = 55°. What is ∠B?',
    target: 'B',
    answer: 125,
    property: 'Adjacent angles are supplementary: ∠B = 180° − 55° = 125°',
  },
  {
    angleA: 120,
    question: 'In parallelogram ABCD, ∠A = 120°. Find ∠B and ∠C.',
    target: 'B',
    answer: 60,
    property: '∠B = 180° − 120° = 60°. ∠C = ∠A = 120°.',
  },
];

export default function AngleSentenceStation({ onComplete }) {
  const [round, setRound] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'wrong'
  const [showProperty, setShowProperty] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const current = ROUNDS[round];

  const handleSubmit = (val) => {
    if (val === current.answer) {
      setFeedback('correct');
      setTimeout(() => {
        const next = roundsCompleted + 1;
        setRoundsCompleted(next);
        if (next >= ROUNDS.length) {
          onComplete(true);
        } else {
          setRound(next);
          setInputVal('');
          setFeedback(null);
          setShowProperty(false);
        }
      }, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      {/* Question */}
      <div className="glass-card" style={{ width: '100%', padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
          {current.question}
        </p>

        {/* Diagram */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ParallelogramDiagram
            angleA={current.angleA}
            missingSlot={current.target}
            showArrows
            showTicks
            animated
            size={0.85}
            highlight={feedback}
          />
        </div>
      </div>

      {/* Current value display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 20px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
          ∠{current.target} =
        </span>
        <span style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: '2rem',
          fontWeight: 700,
          color: feedback === 'correct' ? '#81c784' : feedback === 'wrong' ? '#ef9a9a' : '#ffd54f',
          minWidth: '60px',
          animation: feedback === 'correct' ? 'bounceIn 0.3s ease' : feedback === 'wrong' ? 'shake 0.3s ease' : 'none',
        }}>
          {inputVal ? `${inputVal}°` : '?°'}
        </span>
      </div>

      {/* Show property toggle */}
      <button
        className="btn btn-outline btn-sm"
        onClick={() => setShowProperty(!showProperty)}
        id="show-property-btn"
      >
        {showProperty ? 'Hide Property 🔼' : 'Show Property 📐'}
      </button>

      {showProperty && (
        <div className="hint-box">
          💡 {current.property}
        </div>
      )}

      {/* Feedback */}
      {feedback === 'correct' && (
        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#81c784', animation: 'bounceIn 0.4s ease' }}>
          ✓ Correct! +10 XP 🎉
        </div>
      )}
      {feedback === 'wrong' && (
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ef9a9a', animation: 'shake 0.4s ease' }}>
          Not quite — try again!
        </div>
      )}

      {/* Number pad */}
      <NumberPad onSubmit={handleSubmit} max={359} onActiveChange={setInputVal} />
    </div>
  );
}
