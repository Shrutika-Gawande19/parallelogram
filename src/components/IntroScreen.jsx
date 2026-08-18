// IntroScreen.jsx — Welcome screen matching the exact layout requested

const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder', desc: 'A sliding gate mystery!' },
  { icon: '📖', label: 'Story', desc: 'See parallelograms in action' },
  { icon: '🧪', label: 'Simulate', desc: 'Build and explore' },
  { icon: '🎮', label: 'Practice', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">✨ Grade 5 Maths</div>

      {/* Title & Subtitle */}
      <h1 className="intro-title">
        <span style={{ color: '#ffc107' }}>Properties of Parallelogram</span>
      </h1>
      <p style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>
        Lesson 4.1 · Introduction to parallelograms
      </p>

      {/* Mascot & Bubble */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '4px 0 12px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ffc107', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', flexShrink: 0 }}>
          <MascotHead />
        </div>
        <div style={{ background: 'white', color: '#1a1a3e', padding: '10px 18px', borderRadius: '16px', fontWeight: 700, fontSize: '0.95rem', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          Let's explore parallelograms! 📐
          <div style={{ position: 'absolute', left: '-8px', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid white' }} />
        </div>
      </div>

      {/* Description */}
      <p className="intro-desc">
        Learn to see <strong>parallelograms</strong> everywhere, explore their properties, measure their angles, and discover the secrets of geometry!
      </p>

      {/* Journey Box */}
      <div className="intro-journey-map">
        <h3 className="intro-journey-title">YOUR LEARNING JOURNEY</h3>
        <div className="intro-journey-steps">
          {JOURNEY_ITEMS.map((item, i) => (
            <div key={item.label} className="intro-journey-step">
              <div className="intro-journey-icon">{item.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{item.label}</div>
                <div className="intro-journey-desc">{item.desc}</div>
              </div>
              {i < JOURNEY_ITEMS.length - 1 && (
                <div className="intro-journey-arrow">→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="btn btn-primary btn-lg intro-start-btn"
        id="start-btn"
        onClick={onStart}
        aria-label="Start lesson"
      >
        🚀 Begin Your Journey!
      </button>

      {/* Bottom Cards */}
      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon">🎯</div>
          <div className="feature-card-label">Interactive Tasks</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">📐</div>
          <div className="feature-card-label">Properties</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon">✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}

// Inline SVG mascot head for intro
function MascotHead() {
  return (
    <svg width="40" height="40" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <rect x="18" y="10" width="54" height="44" rx="14" fill="#5c6bc0" />
      {/* Eyes */}
      <circle cx="33" cy="30" r="7" fill="white" />
      <circle cx="57" cy="30" r="7" fill="white" />
      <circle cx="35" cy="31" r="4" fill="#1a237e" />
      <circle cx="59" cy="31" r="4" fill="#1a237e" />
      {/* Gleam */}
      <circle cx="37" cy="29" r="1.5" fill="white" />
      <circle cx="61" cy="29" r="1.5" fill="white" />
      {/* Smile */}
      <path d="M34 42 Q45 50 56 42" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Antenna */}
      <line x1="45" y1="10" x2="45" y2="2" stroke="#ffc107" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="45" cy="1" r="3" fill="#ffc107" />
    </svg>
  );
}



