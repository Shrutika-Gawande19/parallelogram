// WorldMap.jsx — Vertical world map
import { calcStars } from '../../utils/scoring';

export default function WorldMap({ worlds, currentWorld, worldScores, worldCompleted, onSelect }) {
  return (
    <div
      className="world-map"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0px',
        padding: '16px 12px',
        width: '100%',
        maxWidth: '420px',
      }}
    >
      {worlds.map((world, i) => {
        const score = worldScores[i] || 0;
        const isActive = i === currentWorld;
        const isCompleted = worldCompleted[i] === true;
        const isLocked = i > 0 && !worldCompleted[i - 1];
        const stars = calcStars(score);

        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div
              className={`world-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => !isLocked && onSelect(i)}
              role="button"
              tabIndex={isLocked ? -1 : 0}
              aria-label={`World ${i + 1}: ${world.name}${isLocked ? ' (locked)' : ''}`}
              id={`world-${i}`}
              onKeyDown={(e) => e.key === 'Enter' && !isLocked && onSelect(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '14px 20px',
                borderRadius: '16px',
                background: isCompleted
                  ? 'rgba(76, 175, 80, 0.15)'
                  : isActive
                  ? 'rgba(124, 92, 191, 0.25)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${
                  isCompleted ? '#81c784' : isActive ? '#ffc107' : 'rgba(255, 255, 255, 0.12)'
                }`,
                opacity: isLocked ? 0.5 : 1,
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                transition: 'all 0.25s ease',
                boxShadow: isActive ? '0 0 20px rgba(255, 193, 7, 0.3)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  className={`world-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${
                    isLocked ? 'locked' : ''
                  }`}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: isCompleted
                      ? 'rgba(76, 175, 80, 0.2)'
                      : isActive
                      ? 'rgba(255, 193, 7, 0.2)'
                      : 'rgba(255, 255, 255, 0.08)',
                    border: `2px solid ${
                      isCompleted ? '#81c784' : isActive ? '#ffc107' : 'rgba(255, 255, 255, 0.15)'
                    }`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                  }}
                >
                  {isLocked ? '🔒' : world.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
                    World {i + 1}
                  </div>
                  <span
                    className={`world-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      fontFamily: "'Fredoka', sans-serif",
                      color: isCompleted ? '#81c784' : isActive ? '#ffd54f' : '#fff',
                    }}
                  >
                    {world.name}
                  </span>
                </div>
              </div>

              {!isLocked ? (
                <div className="world-stars" style={{ display: 'flex', gap: '4px', fontSize: '1.1rem' }}>
                  {[0, 1, 2].map((s) => (
                    <span key={s} style={{ color: s < stars ? '#ffc107' : 'rgba(255, 255, 255, 0.2)' }}>
                      ★
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.4)', fontWeight: 600 }}>
                  Locked
                </span>
              )}
            </div>

            {/* Vertical connector between worlds */}
            {i < worlds.length - 1 && (
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  background: isCompleted ? '#81c784' : 'rgba(255, 255, 255, 0.15)',
                  margin: '3px 0',
                  borderRadius: '2px',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

