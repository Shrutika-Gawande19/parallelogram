// StreakCounter.jsx — Fire streak counter

import { useEffect, useRef, useState } from 'react';

export default function StreakCounter({ streak }) {
  const [animate, setAnimate] = useState(false);
  const prev = useRef(streak);

  useEffect(() => {
    if (streak > prev.current) {
      setAnimate(true);
      const t = setTimeout(() => setAnimate(false), 600);
      prev.current = streak;
      return () => clearTimeout(t);
    }
    if (streak === 0) prev.current = 0;
  }, [streak]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        animation: animate ? 'celebrate 0.5s ease' : 'none',
      }}
      aria-label={`Current streak: ${streak}`}
    >
      <span style={{ fontSize: '1.2rem' }}>🔥</span>
      <span style={{
        fontFamily: "'Fredoka', sans-serif",
        fontSize: '1.1rem',
        fontWeight: 700,
        color: streak >= 5 ? '#ffc107' : streak >= 3 ? '#ff7043' : 'rgba(255,255,255,0.6)',
      }}>
        {streak}
      </span>
    </div>
  );
}
