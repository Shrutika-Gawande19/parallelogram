// StarRating.jsx — 1-3 star display

export default function StarRating({ stars, large = false }) {
  const size = large ? '2rem' : '1rem';
  return (
    <div style={{ display: 'flex', gap: '2px' }} aria-label={`${stars} out of 3 stars`}>
      {[0,1,2].map(i => (
        <span
          key={i}
          style={{
            fontSize: size,
            color: i < stars ? '#ffc107' : 'rgba(255,255,255,0.15)',
            transition: '0.3s ease',
            animation: i < stars ? `starPop 0.4s ease ${i * 0.15}s both` : 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
