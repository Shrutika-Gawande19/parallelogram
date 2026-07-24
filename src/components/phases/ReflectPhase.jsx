// ReflectPhase.jsx — Journal, summary, and completion screen

import { useState, useEffect } from 'react';
import BadgePanel from '../gamification/BadgePanel';
import StarRating from '../gamification/StarRating';
import Mascot from '../shared/Mascot';
import { calcTotalStars } from '../../utils/scoring';
import { narrate, stopNarration } from '../../utils/audio';
import { reflectNarration } from '../../utils/narration';

export default function ReflectPhase({ state, dispatch, onComplete, isComplete = false }) {
  const [journal, setJournal] = useState('');
  const totalStars = calcTotalStars(state.worldScores || {});
  const totalBadges = (state.badges || []).length;

  useEffect(() => {
    if (state.audioEnabled) {
      narrate(reflectNarration());
    }
    return () => stopNarration();
  }, [state.audioEnabled]);

  return (
    <div className="phase-content">
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <span className="q-type-badge">
          {isComplete ? '🏆 Complete!' : '📓 Phase 5 — Reflect'}
        </span>
      </div>

      {/* Summary card */}
      <div className="glass-card" style={{ width: '100%', padding: '32px', textAlign: 'center' }}>
        <div style={{ marginBottom: '8px' }}>
          <Mascot mood="celebrating" size={80} />
        </div>
        <h2 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, marginBottom: '8px' }}>
          {isComplete ? 'You completed the journey! 🎉' : 'What did you discover today? 🔍'}
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '24px' }}>
          Properties of Parallelogram — Grade 5
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <StatCard icon="⭐" label="Total XP" value={state.xp || 0} />
          <StatCard icon="★" label="Stars" value={totalStars} />
          <StatCard icon="🔥" label="Best Streak" value={state.maxStreak || 0} />
          <StatCard icon="🏅" label="Badges" value={`${totalBadges}/8`} />
        </div>

        <div className="section-divider" />
      </div>

      {/* Properties summary */}
      <div className="glass-card" style={{ width: '100%', padding: '24px' }}>
        <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
          📐 What You Learned
        </h3>
        {[
          { emoji: '↔️', text: 'Opposite sides are parallel and equal (AB ∥ DC, AD ∥ BC)' },
          { emoji: '🔁', text: 'Opposite angles are equal (∠A = ∠C, ∠B = ∠D)' },
          { emoji: '➕', text: 'Adjacent angles are supplementary (∠A + ∠B = 180°)' },
          { emoji: '✂️', text: 'Diagonals bisect each other at the midpoint' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px',
            padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{item.emoji}</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      {/* Journal */}
      {!isComplete && (
        <div style={{ width: '100%' }}>
          <label style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', fontWeight: 700, display: 'block', marginBottom: '10px' }}>
            ✏️ Write in your journal:
          </label>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '10px' }}>
            Can you draw a parallelogram and label one pair of equal angles and one pair of supplementary angles?
          </p>
          <textarea
            className="reflect-journal"
            value={journal}
            onChange={e => setJournal(e.target.value)}
            placeholder="Write or describe your drawing here..."
            aria-label="Journal entry"
            id="journal-input"
          />
        </div>
      )}

      {/* Badge panel */}
      <BadgePanel badges={state.badges || []} />

      {/* CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={onComplete}
          id="reflect-complete-btn"
          style={{ animation: 'bounceIn 0.5s ease' }}
        >
          {isComplete ? '🔄 Play Again!' : '🏆 Complete Lesson!'}
        </button>
        <button className="btn btn-outline btn-sm" onClick={() => window.print()} id="share-btn">
          📸 Share with your teacher
        </button>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      padding: '14px 20px',
      textAlign: 'center',
      minWidth: '80px',
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{icon}</div>
      <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem', fontWeight: 700, color: '#ffd54f' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    </div>
  );
}
