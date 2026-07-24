// FloatingShapes.jsx — Animated background parallelogram silhouettes

const SHAPES = [
  // SVG path data for different parallelogram proportions
  'M0,20 L60,0 L80,30 L20,50 Z',
  'M0,15 L50,0 L65,25 L15,40 Z',
  'M0,25 L70,0 L90,35 L20,60 Z',
  'M0,12 L45,0 L55,20 L10,32 Z',
  'M0,30 L80,0 L100,40 L20,70 Z',
  'M0,18 L55,0 L72,28 L17,46 Z',
];

const POSITIONS = [8, 20, 35, 50, 65, 78, 90];
const DELAYS = [0, 4, 8, 12, 16, 20, 3];
const DURATIONS = [22, 26, 18, 30, 24, 20, 28];
const SIZES = [0.7, 1.0, 1.3, 0.9, 1.1, 0.8, 1.2];

export default function FloatingShapes() {
  return (
    <div className="floating-shapes" aria-hidden="true">
      {SHAPES.map((path, i) => (
        <svg
          key={i}
          className="floating-shape"
          viewBox="0 0 100 70"
          style={{
            left: `${POSITIONS[i % POSITIONS.length]}%`,
            width: `${80 * SIZES[i % SIZES.length]}px`,
            height: `${56 * SIZES[i % SIZES.length]}px`,
            animationDelay: `${DELAYS[i % DELAYS.length]}s`,
            animationDuration: `${DURATIONS[i % DURATIONS.length]}s`,
            fill: 'rgba(255,255,255,0.9)',
            stroke: 'rgba(255,255,255,0.4)',
            strokeWidth: '1.5',
          }}
        >
          <path d={path} />
        </svg>
      ))}
    </div>
  );
}
