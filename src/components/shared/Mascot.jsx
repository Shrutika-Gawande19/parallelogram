// Mascot.jsx — LearnBot robot mascot (5 moods as inline SVG)

const MOODS = {
  idle:         { eyeOffsetY: 0, mouthPath: 'M34 42 Q45 48 56 42', antennaColor: '#ffc107', bodyColor: '#3f51b5' },
  happy:        { eyeOffsetY: 1, mouthPath: 'M32 41 Q45 52 58 41', antennaColor: '#4caf50', bodyColor: '#3f51b5' },
  thinking:     { eyeOffsetY: -1, mouthPath: 'M36 45 Q45 44 54 45', antennaColor: '#ffc107', bodyColor: '#4a2c8a' },
  celebrating:  { eyeOffsetY: 2, mouthPath: 'M30 40 Q45 55 60 40', antennaColor: '#ff7043', bodyColor: '#2e7d32' },
  encouraging:  { eyeOffsetY: 0, mouthPath: 'M34 43 Q45 50 56 43', antennaColor: '#ffc107', bodyColor: '#1565c0' },
};

export default function Mascot({ mood = 'idle', size = 80, bubble = null, style = {} }) {
  const m = MOODS[mood] || MOODS.idle;
  const animClass = mood === 'celebrating' ? 'mascot-celebrate'
    : mood === 'happy' ? 'mascot-bounce' : '';

  return (
    <div className="mascot-wrapper" style={{ ...style }}>
      {bubble && (
        <div className="mascot-bubble">{bubble}</div>
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 90 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={animClass}
        style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))' }}
      >
        {/* Body */}
        <rect x="22" y="44" width="46" height="32" rx="10" fill={m.bodyColor} />

        {/* Head */}
        <rect x="18" y="10" width="54" height="44" rx="14" fill="#5c6bc0" />

        {/* Eyes */}
        <circle cx="33" cy={30 + m.eyeOffsetY} r="7" fill="white" />
        <circle cx="57" cy={30 + m.eyeOffsetY} r="7" fill="white" />
        <circle cx="35" cy={31 + m.eyeOffsetY} r="4" fill="#1a237e" />
        <circle cx="59" cy={31 + m.eyeOffsetY} r="4" fill="#1a237e" />
        {/* Gleam */}
        <circle cx="37" cy={29 + m.eyeOffsetY} r="1.5" fill="white" />
        <circle cx="61" cy={29 + m.eyeOffsetY} r="1.5" fill="white" />

        {/* Mouth */}
        <path d={m.mouthPath} stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Cheeks */}
        <circle cx="25" cy="36" r="5" fill="rgba(255,100,100,0.3)" />
        <circle cx="65" cy="36" r="5" fill="rgba(255,100,100,0.3)" />

        {/* Antenna */}
        <line x1="45" y1="10" x2="45" y2="3" stroke={m.antennaColor} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="45" cy="2" r="3.5" fill={m.antennaColor} />

        {/* Arms */}
        <rect x="8" y="50" width="14" height="8" rx="4" fill={m.bodyColor} />
        <rect x="68" y="50" width="14" height="8" rx="4" fill={m.bodyColor} />

        {/* Legs */}
        <rect x="28" y="72" width="12" height="16" rx="6" fill="#283593" />
        <rect x="50" y="72" width="12" height="16" rx="6" fill="#283593" />
      </svg>
    </div>
  );
}
