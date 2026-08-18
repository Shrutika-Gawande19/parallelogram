// ProgressMap.jsx — Fixed top-center journey bar (only shown in active phases)

const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Practice' },
  { icon: '📓', label: 'Reflect' },
];

const PHASE_ORDER = ['wonder', 'story', 'simulate', 'play', 'reflect'];

export default function ProgressMap({ phase }) {
  const activeIdx = PHASE_ORDER.indexOf(phase);

  return (
    <div className="journey-bar" role="navigation" aria-label="Lesson journey">
      {JOURNEY_ITEMS.map((item, i) => {
        const state = i < activeIdx ? 'completed' : i === activeIdx ? 'active' : '';
        return (
          <div key={item.label} className="journey-step" style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`journey-step ${state}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div className={`journey-step-dot ${state}`} aria-label={item.label}>
                {i < activeIdx ? '✓' : item.icon}
              </div>
              <span className={`journey-step-label ${state}`}>{item.label}</span>
            </div>
            {i < JOURNEY_ITEMS.length - 1 && (
              <div className={`journey-connector ${i < activeIdx ? 'filled' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
