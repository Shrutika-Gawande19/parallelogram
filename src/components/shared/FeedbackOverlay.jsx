// FeedbackOverlay.jsx — Correct/incorrect full-screen modal

export default function FeedbackOverlay({
  type,           // 'correct' | 'wrong'
  xpEarned,
  explanation,
  onContinue,
}) {
  const isCorrect = type === 'correct';

  return (
    <div className="feedback-overlay" role="dialog" aria-modal="true" aria-label={isCorrect ? 'Correct!' : 'Not quite'}>
      <div className={`feedback-card ${isCorrect ? 'correct-card' : 'wrong-card'}`}>
        {/* Icon */}
        <div style={{ fontSize: '3.5rem', marginBottom: '12px', animation: isCorrect ? 'bounceIn 0.5s ease' : 'shake 0.4s ease' }}>
          {isCorrect ? '🎉' : '💡'}
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: '1.8rem',
          fontWeight: 700,
          color: isCorrect ? '#81c784' : '#ef9a9a',
          marginBottom: '8px',
        }}>
          {isCorrect ? 'Excellent!' : 'Not quite!'}
        </h2>

        {/* XP */}
        {isCorrect && xpEarned > 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '9999px',
            background: 'rgba(255,193,7,0.15)',
            border: '1px solid rgba(255,193,7,0.3)',
            color: '#ffd54f',
            fontWeight: 700,
            fontSize: '1.1rem',
            marginBottom: '16px',
          }}>
            +{xpEarned} XP ⭐
          </div>
        )}

        {/* Explanation */}
        {explanation && (
          <p style={{
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.55,
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '12px 16px',
          }}>
            {explanation}
          </p>
        )}

        {/* Continue */}
        <button
          className={`btn ${isCorrect ? 'btn-green' : 'btn-outline'}`}
          onClick={onContinue}
          id="feedback-continue-btn"
          aria-label="Continue"
        >
          {isCorrect ? 'Next Question →' : 'Try Again →'}
        </button>
      </div>
    </div>
  );
}
