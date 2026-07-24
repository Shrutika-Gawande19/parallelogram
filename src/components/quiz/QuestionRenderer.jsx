// QuestionRenderer.jsx — Polymorphic dispatcher for all question types

import { useState, useEffect } from 'react';
import ParallelogramDiagram from '../shared/ParallelogramDiagram';
import HintOverlay from './HintOverlay';
import { shuffleOptions } from '../../utils/scoring';

export default function QuestionRenderer({ question, onAnswer, hintsUsed, attemptCount }) {
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    // Shuffle options on each new question
    setSelected(null);
    setLocked(false);
    if (question?.options) {
      setOptions(shuffleOptions(question.options));
    }
  }, [question?.id]);

  if (!question) return null;

  const handleSelect = (opt) => {
    if (locked) return;
    setSelected(opt);
    setLocked(true);
    const correct = opt === question.answer;
    onAnswer(correct, opt);
  };

  const showHint = attemptCount > 0 && !locked;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', animation: 'slideInUp 0.35s ease' }}>
      {/* Type badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span className="q-type-badge">{typeLabel(question.type)}</span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
          {question.difficulty === 'hard' ? '⭐⭐⭐' : question.difficulty === 'medium' ? '⭐⭐' : '⭐'}
        </span>
      </div>

      {/* Parallelogram diagram (if applicable) */}
      {needsDiagram(question) && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ParallelogramDiagram
            angleA={question.angleA || 65}
            missingSlot={question.missingSlot || null}
            showDiagonals={!!question.showDiagonals}
            showArrows
            showTicks
            animated
            size={0.9}
            highlight={
              locked && selected === question.answer ? 'correct'
              : locked && selected !== question.answer ? 'wrong'
              : null
            }
          />
        </div>
      )}

      {/* Question text */}
      <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.65, color: 'rgba(255,255,255,0.9)' }}>
          {question.question}
        </p>
      </div>

      {/* Hint overlay */}
      {attemptCount >= 1 && (
        <HintOverlay
          hint={attemptCount >= 2 ? question.hint2 : question.hint1}
          level={attemptCount}
        />
      )}

      {/* MCQ options */}
      <div className="options-grid">
        {options.map((opt, i) => {
          let cls = 'option-btn';
          if (locked && opt === question.answer) cls += ' correct';
          else if (locked && opt === selected && selected !== question.answer) cls += ' wrong';
          else if (!locked && opt === selected) cls += ' selected';

          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleSelect(opt)}
              disabled={locked}
              id={`option-${i}`}
              aria-label={`Option ${i + 1}: ${opt}`}
            >
              <span style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function needsDiagram(q) {
  return ['opposite_angle','co_interior_angle','algebraic_angle','diagonal_bisect','word_problem_angle','multi_step_reasoning'].includes(q.type);
}

function typeLabel(type) {
  const map = {
    identify_shape: '🔍 Identify',
    opposite_angle: '📐 Opposite Angle',
    co_interior_angle: '↔️ Adjacent Angle',
    missing_side: '📏 Missing Side',
    true_false_property: '✅ True / False',
    word_problem_angle: '📝 Word Problem',
    word_problem_side: '📝 Word Problem',
    algebraic_angle: '🔣 Algebra',
    diagonal_bisect: '🔺 Diagonals',
    multi_step_reasoning: '🧩 Multi-Step',
  };
  return map[type] || '❓ Question';
}
