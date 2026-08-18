// StoryPhase.jsx — 6-panel narrated story

import { useEffect } from 'react';
import { storyPanels } from '../../data/storyContent';
import Mascot from '../shared/Mascot';
import { narrate, stopNarration } from '../../utils/audio';
import { getStoryNarration } from '../../utils/narration';

export default function StoryPhase({ panelIndex, onNext, onPrev, onComplete, state }) {
  const panel = storyPanels[panelIndex];
  const isLast = panelIndex === storyPanels.length - 1;

  useEffect(() => {
    if (state.audioEnabled) {
      narrate(getStoryNarration(panelIndex));
    }
    return () => stopNarration();
  }, [panelIndex, state.audioEnabled]);

  const handleReplay = () => {
    if (!state.audioEnabled) return;
    stopNarration();
    narrate(getStoryNarration(panelIndex));
  };

  // Highlight vocab words
  function renderBody(text, highlights = []) {
    if (!highlights.length) return text;
    let result = text;
    highlights.forEach(word => {
      result = result.replace(
        new RegExp(`(${word})`, 'gi'),
        `|||$1|||`
      );
    });
    return result.split('|||').map((part, i) => {
      const isHighlight = highlights.some(h => h.toLowerCase() === part.toLowerCase());
      return isHighlight
        ? <span key={i} style={{ color: '#ffc107', fontWeight: 800 }}>{part}</span>
        : part;
    });
  }

  return (
    <div className="story-phase">
      {/* Top Progress Bar Area */}
      <div className="story-progress">
        <div className="story-progress-bar">
          <div
            className="story-progress-fill"
            style={{ width: `${((panelIndex + 1) / storyPanels.length) * 100}%` }}
          />
        </div>
        <div className="story-progress-label">
          {panelIndex + 1} / {storyPanels.length}
        </div>
      </div>

      {/* Main Story Card */}
      <div className="story-card">
        {/* Visual Image */}
        <div className="story-image-section">
          {panelIndex === 4 ? (
            <SupplementaryAnglesDiagram />
          ) : (
            <img src={panel.visual} alt="Story illustration" className="story-image" />
          )}
          <div className="story-image-overlay" />
        </div>

        {/* Content Area */}
        <div className="story-text-section">
          <h2 className="story-title">
            {panel.title}
          </h2>

          <p className="story-text">
            {renderBody(panel.body, panel.highlight)}
          </p>

          {/* Callout Box */}
          {panel.callout && (
            <div className="story-highlight">
              <span className="story-highlight-text">✨ "{panel.callout}" ✨</span>
            </div>
          )}

          {/* Mascot Speech */}
          <div className="story-mascot">
            <div className="story-mascot-head" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffc107', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MascotHead />
            </div>
            <div className="story-mascot-bubble" style={{
              background: 'white',
              color: '#1a1a3e',
              padding: '10px 16px',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '0.9rem',
              position: 'relative'
            }}>
              {panel.bubble}
              <div style={{
                position: 'absolute',
                left: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '0',
                height: '0',
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderRight: '6px solid white',
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* External Bottom Navigation */}
      <div className="story-nav">
        {/* Back Button */}
        {panelIndex > 0 ? (
          <button className="btn btn-outline btn-sm" onClick={onPrev} id="story-prev-btn">
            ← Back
          </button>
        ) : <div style={{ minWidth: '50px' }} />}

        {/* Dots */}
        <div className="story-dots">
          {storyPanels.map((_, i) => (
            <div
              key={i}
              className={`story-dot ${i === panelIndex ? 'active' : i < panelIndex ? 'completed' : ''}`}
            />
          ))}
        </div>

        {/* Replay Audio Button */}
        <button
          onClick={handleReplay}
          className="btn btn-outline btn-sm"
          disabled={!state.audioEnabled}
          title={state.audioEnabled ? "Replay audio" : "Audio is muted"}
          style={{
            opacity: state.audioEnabled ? 1 : 0.4,
            cursor: state.audioEnabled ? 'pointer' : 'not-allowed',
            padding: '6px 14px',
            fontSize: '0.85rem',
            borderRadius: '99px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
          }}
        >
          🔊 Replay
        </button>

        {/* Next Button */}
        {isLast ? (
          <button className="btn btn-primary btn-sm" onClick={onComplete} id="story-complete-btn" style={{ backgroundColor: '#4caf50' }}>
            Let's Explore! 🚀
          </button>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onNext} id="story-next-btn">
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

// Supplementary angles vector diagram for panel 4
function SupplementaryAnglesDiagram() {
  return (
    <svg viewBox="0 0 450 250" width="100%" height="100%" style={{ background: '#12132a' }}>
      <defs>
        <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
          <stop offset="100%" stopColor="rgba(255, 193, 7, 0.25)" />
        </linearGradient>
      </defs>
      
      {/* Grid line background */}
      <line x1="40" y1="180" x2="410" y2="180" stroke="rgba(255,255,255,0.15)" strokeDasharray="4,4" />
      <line x1="150" y1="70" x2="390" y2="70" stroke="rgba(255,255,255,0.15)" strokeDasharray="4,4" />

      {/* Parallelogram */}
      <polygon points="80,180 260,180 340,70 160,70" fill="url(#polyGrad)" stroke="#8b5cf6" strokeWidth="3.5" strokeLinejoin="round" />
      
      {/* Angle Arcs */}
      {/* Corner A (80,180) - 60 deg */}
      <path d="M 120,180 A 40,40 0 0,0 102,152" fill="none" stroke="#ffc107" strokeWidth="3" />
      <text x="110" y="165" fill="#ffc107" fontSize="15" fontFamily="'Fredoka', sans-serif" fontWeight="700">60° (∠A)</text>
      
      {/* Corner B (260,180) - 120 deg */}
      <path d="M 220,180 A 40,40 0 0,1 275,158" fill="none" stroke="#4caf50" strokeWidth="3" />
      <text x="215" y="162" fill="#81c784" fontSize="15" fontFamily="'Fredoka', sans-serif" fontWeight="700">120° (∠B)</text>

      {/* Badge showing addition formula */}
      <rect x="130" y="14" width="190" height="38" rx="19" fill="rgba(255,193,7,0.15)" stroke="#ffc107" strokeWidth="2" />
      <text x="225" y="39" textAnchor="middle" fill="#ffc107" fontSize="16" fontFamily="'Fredoka', sans-serif" fontWeight="700">
        60° + 120° = 180°
      </text>

      {/* Vertices Labels */}
      <text x="60" y="198" fill="white" fontSize="16" fontWeight="700">A</text>
      <text x="272" y="198" fill="white" fontSize="16" fontWeight="700">B</text>
      <text x="352" y="68" fill="white" fontSize="16" fontWeight="700">C</text>
      <text x="142" y="68" fill="white" fontSize="16" fontWeight="700">D</text>
    </svg>
  );
}

// Inline SVG mascot head
function MascotHead() {
  return (
    <svg width="32" height="32" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
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
