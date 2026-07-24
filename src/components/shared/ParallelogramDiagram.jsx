// ParallelogramDiagram.jsx — Reusable labelled SVG parallelogram

/**
 * Props:
 *   angleA       {number}  — angle at vertex A (degrees)
 *   missingSlot  {string}  — which vertex shows "?" e.g. 'C', 'B', 'D'
 *   showDiagonals {bool}   — draw diagonals
 *   animated      {bool}   — staggered label fade-in
 *   size          {number} — SVG viewport scale factor
 *   highlight     {string} — 'correct' | 'wrong' | null
 *   showArrows    {bool}   — show parallel arrows on sides
 *   showTicks     {bool}   — show equal-side ticks
 */
export default function ParallelogramDiagram({
  angleA = 65,
  missingSlot = null,
  showDiagonals = false,
  animated = true,
  size = 1,
  highlight = null,
  showArrows = true,
  showTicks = true,
}) {
  const W = 280;
  const H = 160;
  const skew = 60; // horizontal offset for skew

  // Vertices: A(top-left) B(top-right) C(bottom-right) D(bottom-left)
  const A = { x: skew + 10, y: 20 };
  const B = { x: W - 10, y: 20 };
  const C = { x: W - skew - 10, y: H - 20 };
  const D = { x: 10, y: H - 20 };

  const pts = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`;

  const angleB = 180 - angleA;
  const angles = { A: angleA, B: angleB, C: angleA, D: angleB };

  const labelOffset = 18;
  const labels = {
    A: { x: A.x - labelOffset, y: A.y - 8 },
    B: { x: B.x + 6, y: B.y - 8 },
    C: { x: C.x + 6, y: C.y + 16 },
    D: { x: D.x - labelOffset, y: D.y + 16 },
  };

  const midAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const midDC = { x: (D.x + C.x) / 2, y: (D.y + C.y) / 2 };
  const midAD = { x: (A.x + D.x) / 2, y: (A.y + D.y) / 2 };
  const midBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };

  const strokeColor = highlight === 'correct' ? '#4caf50'
    : highlight === 'wrong' ? '#ef5350'
    : '#7c5cbf';

  const fillColor = highlight === 'correct' ? 'rgba(76,175,80,0.08)'
    : highlight === 'wrong' ? 'rgba(239,83,80,0.08)'
    : 'rgba(100,120,255,0.07)';

  return (
    <svg
      viewBox={`-10 -10 ${W + 20} ${H + 20}`}
      width={W * size}
      height={H * size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible', maxWidth: '100%' }}
      className={highlight === 'wrong' ? 'anim-shake' : highlight === 'correct' ? 'anim-bounce' : ''}
    >
      {/* Fill */}
      <polygon points={pts} fill={fillColor} />

      {/* Outline */}
      <polygon
        points={pts}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Diagonals */}
      {showDiagonals && (
        <>
          <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="rgba(255,193,7,0.5)" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1={B.x} y1={B.y} x2={D.x} y2={D.y} stroke="rgba(255,193,7,0.5)" strokeWidth="1.5" strokeDasharray="5 4" />
          {/* Midpoint */}
          <circle
            cx={(A.x + C.x) / 2}
            cy={(A.y + C.y) / 2}
            r="4"
            fill="#ffc107"
            stroke="white"
            strokeWidth="1.5"
          />
        </>
      )}

      {/* Parallel arrows on sides (AB and DC) */}
      {showArrows && (
        <>
          <Arrow mid={midAB} angle={0} color="rgba(255,255,255,0.5)" />
          <Arrow mid={midDC} angle={0} color="rgba(255,255,255,0.5)" />
          <Arrow mid={midAD} angle={-40} color="rgba(100,200,255,0.5)" />
          <Arrow mid={midBC} angle={-40} color="rgba(100,200,255,0.5)" />
        </>
      )}

      {/* Tick marks on equal sides */}
      {showTicks && (
        <>
          <Tick mid={midAB} angle={90} color="rgba(255,255,255,0.6)" />
          <Tick mid={midDC} angle={90} color="rgba(255,255,255,0.6)" />
          <Tick mid={midAD} angle={50} color="rgba(100,200,255,0.6)" />
          <Tick mid={midBC} angle={50} color="rgba(100,200,255,0.6)" />
        </>
      )}

      {/* Angle arcs + labels */}
      {['A', 'B', 'C', 'D'].map((v, i) => {
        const vertex = { A, B, C, D }[v];
        const isMissing = missingSlot === v;
        const angleVal = angles[v];
        const lp = labels[v];

        return (
          <g key={v} style={animated ? { animation: `fadeIn 0.4s ease ${i * 0.12}s both` } : {}}>
            {/* Vertex label */}
            <text
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="13"
              fontFamily="'Fredoka', sans-serif"
              fontWeight="600"
            >
              {v}
            </text>

            {/* Angle arc */}
            <AngleArc vertex={vertex} vertexKey={v} size={22} />

            {/* Angle value or ? */}
            <text
              x={lp.x}
              y={lp.y + 13}
              textAnchor="middle"
              fill={isMissing ? '#ffc107' : 'rgba(255,255,255,0.7)'}
              fontSize="11"
              fontFamily="'Nunito', sans-serif"
              fontWeight="700"
            >
              {isMissing ? '?' : `${angleVal}°`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// Arrow marker on parallel sides
function Arrow({ mid, angle, color }) {
  const rad = (angle * Math.PI) / 180;
  const len = 7;
  const x1 = mid.x - Math.cos(rad) * len;
  const y1 = mid.y - Math.sin(rad) * len;
  const x2 = mid.x + Math.cos(rad) * len;
  const y2 = mid.y + Math.sin(rad) * len;
  // Arrowhead
  const headLen = 5;
  const hrad = rad + Math.PI;
  const hx = x2 + Math.cos(hrad - 0.4) * headLen;
  const hy = y2 + Math.sin(hrad - 0.4) * headLen;
  const hx2 = x2 + Math.cos(hrad + 0.4) * headLen;
  const hy2 = y2 + Math.sin(hrad + 0.4) * headLen;

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" />
      <polyline points={`${hx},${hy} ${x2},${y2} ${hx2},${hy2}`} stroke={color} strokeWidth="1.5" fill="none" />
    </g>
  );
}

// Tick mark on equal sides
function Tick({ mid, angle, color }) {
  const rad = (angle * Math.PI) / 180;
  const halfLen = 5;
  const nx = -Math.sin(rad);
  const ny = Math.cos(rad);
  return (
    <line
      x1={mid.x + nx * halfLen}
      y1={mid.y + ny * halfLen}
      x2={mid.x - nx * halfLen}
      y2={mid.y - ny * halfLen}
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  );
}

// Small angle arc at a vertex
function AngleArc({ vertex, vertexKey, size }) {
  // Approximate arc positions per vertex key
  const offsets = {
    A: { dx: 10, dy: 8 },
    B: { dx: -10, dy: 8 },
    C: { dx: -10, dy: -8 },
    D: { dx: 10, dy: -8 },
  };
  const off = offsets[vertexKey] || { dx: 10, dy: 8 };
  return (
    <circle
      cx={vertex.x + off.dx * 0.7}
      cy={vertex.y + off.dy * 0.7}
      r={size * 0.45}
      fill="none"
      stroke="rgba(255,193,7,0.35)"
      strokeWidth="1.5"
      strokeDasharray="4 3"
    />
  );
}
