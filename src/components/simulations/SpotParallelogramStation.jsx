// SpotParallelogramStation.jsx — Station B: Identify true parallelograms

import { useState } from 'react';

const ROUNDS = [
  {
    shapes: [
      { id: 'a', type: 'parallelogram', label: 'Shape A' },
      { id: 'b', type: 'rectangle', label: 'Shape B' },
      { id: 'c', type: 'trapezium', label: 'Shape C' },
      { id: 'd', type: 'parallelogram', label: 'Shape D' },
    ],
    correct: ['a', 'b', 'd'], // rect is also a parallelogram
    instruction: 'Tap all the parallelograms!',
  },
  {
    shapes: [
      { id: 'a', type: 'rhombus', label: 'Shape A' },
      { id: 'b', type: 'kite', label: 'Shape B' },
      { id: 'c', type: 'parallelogram', label: 'Shape C' },
      { id: 'd', type: 'triangle', label: 'Shape D' },
    ],
    correct: ['a', 'c'], // rhombus is a parallelogram
    instruction: 'Select all parallelograms (remember: rhombuses count too!)',
  },
  {
    shapes: [
      { id: 'a', type: 'square', label: 'Shape A' },
      { id: 'b', type: 'trapezium', label: 'Shape B' },
      { id: 'c', type: 'pentagon', label: 'Shape C' },
      { id: 'd', type: 'parallelogram', label: 'Shape D' },
    ],
    correct: ['a', 'd'], // square is a parallelogram
    instruction: 'Which shapes are parallelograms? (Squares count too!)',
  },
];

export default function SpotParallelogramStation({ onComplete }) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState([]);
  const [checked, setChecked] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [perfect, setPerfect] = useState(true);

  const current = ROUNDS[round];

  const toggleSelect = (id) => {
    if (checked) return;
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCheck = () => {
    setChecked(true);
    const correct = new Set(current.correct);
    const sel = new Set(selected);
    const isCorrect =
      current.correct.every(id => sel.has(id)) &&
      selected.every(id => correct.has(id));

    if (!isCorrect) setPerfect(false);

    setTimeout(() => {
      const next = roundsCompleted + 1;
      setRoundsCompleted(next);
      if (next >= ROUNDS.length) {
        onComplete(isCorrect && perfect);
      } else {
        setRound(next);
        setSelected([]);
        setChecked(false);
      }
    }, 1400);
  };

  const getCardState = (shape) => {
    if (!checked) return selected.includes(shape.id) ? 'selected' : '';
    const isCorrectPick = current.correct.includes(shape.id);
    const isPicked = selected.includes(shape.id);
    if (isCorrectPick && isPicked) return 'correct';
    if (!isCorrectPick && isPicked) return 'wrong';
    if (isCorrectPick && !isPicked) return 'correct'; // missed — still highlight green
    return '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
        {current.instruction}
      </p>

      <div className="shapes-grid" style={{ width: '100%', maxWidth: 520 }}>
        {current.shapes.map((shape) => (
          <div
            key={shape.id}
            className={`shape-card ${getCardState(shape)}`}
            onClick={() => toggleSelect(shape.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selected.includes(shape.id)}
            aria-label={shape.label}
            id={`shape-card-${shape.id}`}
            onKeyDown={(e) => e.key === 'Enter' && toggleSelect(shape.id)}
          >
            <ShapeSVG type={shape.type} label={shape.label} />
          </div>
        ))}
      </div>

      <button
        className="btn btn-blue"
        onClick={handleCheck}
        disabled={selected.length === 0 || checked}
        id="spot-check-btn"
      >
        Check! ✓
      </button>
    </div>
  );
}

// Shape SVG renderer
function ShapeSVG({ type, label }) {
  const W = 120, H = 80;
  const color = 'rgba(100,120,255,0.7)';
  const fill = 'rgba(100,120,255,0.08)';

  const shapes = {
    parallelogram: <polygon points="20,60 90,60 100,20 30,20" fill={fill} stroke={color} strokeWidth="2.5" />,
    rectangle: <rect x="15" y="20" width="90" height="40" fill={fill} stroke="rgba(76,175,80,0.7)" strokeWidth="2.5" />,
    rhombus: <polygon points="60,10 110,40 60,70 10,40" fill={fill} stroke={color} strokeWidth="2.5" />,
    square: <rect x="20" y="15" width="50" height="50" fill={fill} stroke="rgba(76,175,80,0.7)" strokeWidth="2.5" />,
    trapezium: <polygon points="25,60 95,60 80,20 40,20" fill={fill} stroke="rgba(239,83,80,0.5)" strokeWidth="2.5" />,
    kite: <polygon points="60,8 95,45 60,72 25,45" fill={fill} stroke="rgba(239,83,80,0.5)" strokeWidth="2.5" />,
    triangle: <polygon points="60,10 110,70 10,70" fill={fill} stroke="rgba(239,83,80,0.5)" strokeWidth="2.5" />,
    pentagon: <polygon points="60,8 105,38 88,75 32,75 15,38" fill={fill} stroke="rgba(239,83,80,0.5)" strokeWidth="2.5" />,
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ maxHeight: 80 }}>
      {shapes[type] || shapes.parallelogram}
      <text x={W/2} y={H - 2} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="'Nunito', sans-serif">{label}</text>
    </svg>
  );
}
