// XPTracker.jsx — XP progress bar with floating animation

import { useEffect, useRef, useState } from 'react';

const XP_PER_LEVEL = 100;

export default function XPTracker({ xp }) {
  const [showFloat, setShowFloat] = useState(false);
  const prevXP = useRef(xp);

  useEffect(() => {
    if (xp > prevXP.current) {
      setShowFloat(true);
      const t = setTimeout(() => setShowFloat(false), 1200);
      prevXP.current = xp;
      return () => clearTimeout(t);
    }
  }, [xp]);

  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const levelXP = xp % XP_PER_LEVEL;
  const pct = (levelXP / XP_PER_LEVEL) * 100;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
        ⭐ Lv{level}
      </span>
      <div style={{ flex: 1, position: 'relative' }}>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        {showFloat && (
          <div
            className="xp-float"
            style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)' }}
          >
            +XP 🌟
          </div>
        )}
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ffd54f', whiteSpace: 'nowrap' }}>
        {levelXP}/{XP_PER_LEVEL}
      </span>
    </div>
  );
}
