// NumberPad.jsx — Large touch-friendly digit input pad

import { useState } from 'react';

export default function NumberPad({ onSubmit, max = 360, onActiveChange }) {
  const [value, setValue] = useState('');

  const press = (d) => {
    if (d === 'back') {
      const next = value.slice(0, -1);
      setValue(next);
      onActiveChange?.(next);
      return;
    }
    if (value.length >= 3) return;
    const next = value + d;
    const num = parseInt(next, 10);
    if (num > max) return;
    setValue(next);
    onActiveChange?.(next);
  };

  const handleSubmit = () => {
    if (!value) return;
    onSubmit(parseInt(value, 10));
    setValue('');
    onActiveChange?.('');
  };

  const digits = ['7','8','9','4','5','6','1','2','3','0','back'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      {/* Display */}
      <div className="num-display" aria-label={`Current value: ${value || 'empty'}`}>
        {value || <span style={{ opacity: 0.3 }}>°</span>}
      </div>

      {/* Pad */}
      <div className="number-pad">
        {digits.map((d) => (
          <button
            key={d}
            className="num-btn"
            onClick={() => press(d)}
            aria-label={d === 'back' ? 'Backspace' : `Digit ${d}`}
            id={`numpad-${d}`}
          >
            {d === 'back' ? '⌫' : d}
          </button>
        ))}
        <button
          className="num-btn submit"
          onClick={handleSubmit}
          disabled={!value}
          aria-label="Submit answer"
          id="numpad-submit"
        >
          Check ✓
        </button>
      </div>
    </div>
  );
}
