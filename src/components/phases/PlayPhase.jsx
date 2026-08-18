// PlayPhase.jsx — Full quiz engine with world map, XP, streaks

import { useState, useRef } from 'react';
import WorldMap from '../gamification/WorldMap';
import XPTracker from '../gamification/XPTracker';
import StreakCounter from '../gamification/StreakCounter';
import StarRating from '../gamification/StarRating';
import QuestionRenderer from '../quiz/QuestionRenderer';
import FeedbackOverlay from '../shared/FeedbackOverlay';
import Mascot from '../shared/Mascot';
import { calcXP, calcStars, canUnlockWorld } from '../../utils/scoring';
import { useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import { playWorldMapNarration, playFeedbackNarration } from '../../utils/narration';

const WORLD_THEMES = [
  { name: 'Playground', icon: '🏫' },
  { name: 'Workshop', icon: '🔨' },
  { name: 'Kite Park', icon: '🪁' },
];

export default function PlayPhase({ state, dispatch, onComplete }) {
  const [showWorldMap, setShowWorldMap] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const answerBtnRef = useRef(null);

  const { currentWorld, worldQuestions, currentQuestion, xp, streak, hintsUsed, attemptCount, worldScores } = state;
  const worldQs = worldQuestions?.[currentWorld] || [];
  const question = worldQs[currentQuestion];
  const worldScore = worldScores[currentWorld] || 0;
  const totalQ = worldQs.length;

  useEffect(() => {
    if (showWorldMap && state.audioEnabled) {
      narrate(playWorldMapNarration());
    }
    return () => stopNarration();
  }, [showWorldMap, state.audioEnabled]);

  const handleAnswer = (correct, selected) => {
    if (state.audioEnabled) {
      narrate(playFeedbackNarration(correct));
    }
    if (correct) {
      const xpEarned = calcXP(attemptCount + 1, hintsUsed, streak);
      setLastXP(xpEarned);
      setLastCorrect(true);
      dispatch({ type: 'ANSWER_CORRECT', payload: { xpEarned, questionType: question?.type } });
    } else {
      setLastXP(0);
      setLastCorrect(false);
      dispatch({ type: 'ANSWER_INCORRECT' });
    }
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    const newQ = currentQuestion + 1;
    if (newQ >= totalQ) {
      // World complete
      setShowWorldMap(true);
      if (currentWorld >= WORLD_THEMES.length - 1) {
        onComplete();
      } else {
        dispatch({ type: 'NEXT_QUESTION' });
      }
    } else {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const handleWorldSelect = (worldIdx) => {
    if (worldIdx === 0 || state.worldCompleted[worldIdx - 1]) {
      dispatch({ type: 'SET_WORLD', payload: worldIdx });
      setShowWorldMap(false);
    }
  };

  const hasCompletedAnyWorld = Object.values(state.worldCompleted).some(c => c);

  const mascotMood = streak >= 5 ? 'celebrating' : lastCorrect ? 'happy' : attemptCount >= 1 ? 'encouraging' : 'idle';

  return (
    <div className="phase-content">
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <span className="q-type-badge">🎮 Phase 4 — Practice</span>
      </div>

      {showWorldMap ? (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <h2 style={{ fontFamily: "'Fredoka', sans-serif", color: '#fff', margin: '10px 0 0' }}>Practice — Choose Your World!</h2>
          <WorldMap
            worlds={WORLD_THEMES}
            currentWorld={currentWorld}
            worldScores={worldScores}
            worldCompleted={state.worldCompleted}
            onSelect={handleWorldSelect}
          />
          {hasCompletedAnyWorld && (
            <button 
              className="btn btn-primary btn-lg" 
              style={{
                marginTop: '10px',
                padding: '12px 28px',
                fontSize: '1.1rem',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #7c4dff, #536dfe)',
                boxShadow: '0 4px 16px rgba(124, 77, 255, 0.4)',
                animation: 'bounceIn 0.5s ease',
              }}
              onClick={onComplete}
              id="skip-to-reflect-btn"
            >
              Skip to Reflect Phase ⏭️
            </button>
          )}
        </div>
      ) : (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {/* World progress header */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <div>
              <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.1rem', fontWeight: 700 }}>
                {WORLD_THEMES[currentWorld]?.icon} {WORLD_THEMES[currentWorld]?.name}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                Question {currentQuestion + 1} of {totalQ}
              </p>
            </div>
            <StarRating stars={calcStars(worldScore)} />
          </div>

          {/* Progress bar */}
          <div className="progress-bar-container" style={{ width: '100%' }}>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${((currentQuestion) / totalQ) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          {question ? (
            <QuestionRenderer
              question={question}
              onAnswer={handleAnswer}
              hintsUsed={hintsUsed}
              attemptCount={attemptCount}
            />
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: '30px', maxWidth: '400px', width: '100%' }}>
              <p style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#81c784', marginBottom: '8px' }}>
                🎉 World {currentWorld + 1} Complete!
              </p>
              <StarRating stars={calcStars(worldScore)} large />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
                {currentWorld < WORLD_THEMES.length - 1 ? (
                  <>
                    <button className="btn btn-primary" onClick={() => setShowWorldMap(true)}>
                      Back to Map 🗺️
                    </button>
                    <button
                      className="btn btn-green"
                      onClick={onComplete}
                      id="world-complete-reflect-btn"
                      style={{
                        background: 'linear-gradient(135deg, #7c4dff, #536dfe)',
                      }}
                    >
                      Skip to Reflect Phase ⏭️
                    </button>
                  </>
                ) : (
                  <button className="btn btn-green" onClick={onComplete}>
                    Finish & Reflect! 🏆
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}



      {/* Feedback overlay */}
      {showFeedback && (
        <FeedbackOverlay
          type={lastCorrect ? 'correct' : 'wrong'}
          xpEarned={lastXP}
          explanation={!lastCorrect ? question?.explanation : null}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
