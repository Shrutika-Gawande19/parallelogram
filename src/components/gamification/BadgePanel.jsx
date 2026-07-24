// BadgePanel.jsx — Badge grid + unlock toast

import { useEffect, useState } from 'react';
import { BADGES, BADGE_MAP } from '../../utils/badgeEngine';

export default function BadgePanel({ newBadgeId, onDismiss, toastOnly = false, badges = [] }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (toastOnly && newBadgeId) {
      const t = setTimeout(() => {
        setVisible(false);
        setTimeout(onDismiss, 300);
      }, 3500);
      return () => clearTimeout(t);
    }
  }, [newBadgeId, toastOnly]);

  if (toastOnly) {
    if (!newBadgeId || !visible) return null;
    const badge = BADGE_MAP[newBadgeId];
    if (!badge) return null;

    return (
      <div className="badge-toast" role="alert" aria-live="polite">
        <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ffd54f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Badge Unlocked!
          </div>
          <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1rem', fontWeight: 700, color: 'white' }}>
            {badge.label}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
            {badge.desc}
          </div>
        </div>
        <button
          onClick={() => { setVisible(false); onDismiss?.(); }}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.1rem', padding: '4px' }}
          aria-label="Dismiss badge"
        >
          ✕
        </button>
      </div>
    );
  }

  // Full badge grid (for Reflect phase)
  return (
    <div style={{ width: '100%' }}>
      <h3 style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px', textAlign: 'center' }}>
        🏅 Your Badges
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {BADGES.map(badge => {
          const earned = badges.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`badge-chip ${earned ? '' : 'locked'}`}
              title={badge.desc}
              style={{ flexDirection: 'column', gap: '4px', padding: '12px 8px', borderRadius: '12px', textAlign: 'center' }}
            >
              <span style={{ fontSize: '1.8rem', filter: earned ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                {badge.icon}
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, lineHeight: 1.3 }}>
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
