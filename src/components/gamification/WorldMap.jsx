// WorldMap.jsx — Horizontal scrollable world map

import { calcStars } from '../../utils/scoring';

export default function WorldMap({ worlds, currentWorld, worldScores, worldCompleted, onSelect }) {
  return (
    <div className="world-map" style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: '16px', padding: '16px 8px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      {worlds.map((world, i) => {
        const score = worldScores[i] || 0;
        const isActive = i === currentWorld;
        const isCompleted = worldCompleted[i] === true;
        const isLocked = i > 0 && !worldCompleted[i-1];
        const stars = calcStars(score);

        return (
          <div
            key={i}
            className={`world-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            onClick={() => !isLocked && onSelect(i)}
            role="button"
            tabIndex={isLocked ? -1 : 0}
            aria-label={`World ${i + 1}: ${world.name}${isLocked ? ' (locked)' : ''}`}
            id={`world-${i}`}
            onKeyDown={(e) => e.key === 'Enter' && !isLocked && onSelect(i)}
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              minWidth: '100px',
              opacity: isLocked ? 0.5 : 1,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              transform: isActive ? 'scale(1.1)' : 'scale(1)',
              transition: 'transform 0.2s',
            }}
          >
            <div className={`world-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`} style={{
              width: '60px', height: '60px', borderRadius: '50%',
              background: isCompleted ? 'rgba(76,175,80,0.2)' : isActive ? 'rgba(124,92,191,0.2)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${isCompleted ? '#81c784' : isActive ? '#7c5cbf' : 'rgba(255,255,255,0.1)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: isActive ? '0 0 15px rgba(124,92,191,0.5)' : 'none'
            }}>
              {isLocked ? '🔒' : world.icon}
            </div>
            <span className={`world-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`} style={{
              fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap',
              color: isCompleted ? '#81c784' : isActive ? '#fff' : 'rgba(255,255,255,0.5)'
            }}>
              {world.name}
            </span>
            {!isLocked && (
              <div className="world-stars" style={{ display: 'flex', gap: '2px', fontSize: '0.75rem' }}>
                {[0,1,2].map(s => (
                  <span key={s} style={{ color: s < stars ? '#ffc107' : 'rgba(255,255,255,0.2)' }}>★</span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

