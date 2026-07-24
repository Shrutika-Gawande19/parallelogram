// HintOverlay.jsx — Animated hint below question

export default function HintOverlay({ hint, level }) {
  if (!hint) return null;

  return (
    <div className="hint-box" role="alert" aria-label={`Hint level ${level}`}>
      <span style={{ fontSize: '1.2rem' }}>{level >= 2 ? '🔍' : '💡'}</span>
      <div>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,160,120,0.7)', marginBottom: '2px' }}>
          {level >= 2 ? 'Hint 2:' : 'Hint 1:'}
        </div>
        {hint}
      </div>
    </div>
  );
}
