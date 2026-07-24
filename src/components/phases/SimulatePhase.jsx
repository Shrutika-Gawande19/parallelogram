// SimulatePhase.jsx — Station router for 3 simulation stations
// Station 1: Shape Shifter  | Station 2: Repair Shop | Station 3: City Builder

import ShapeShifterStation from '../simulations/ShapeShifterStation';
import RepairShopStation from '../simulations/RepairShopStation';
import CityBuilderStation from '../simulations/CityBuilderStation';
import { useEffect } from 'react';
import { narrate, stopNarration } from '../../utils/audio';
import { simulateInstruction, simulateStationCompleteNarration } from '../../utils/narration';

const STATIONS = [
  {
    label: 'Shape Shifter',
    icon: '🔺',
    title: 'Shape Shifter',
    subtitle: 'What makes a parallelogram?',
    color: '#7c5cbf',
    colorLight: 'rgba(124,92,191,0.2)',
    colorBorder: 'rgba(124,92,191,0.5)',
  },
  {
    label: 'Repair Shop',
    icon: '🛠️',
    title: 'Parallelogram Repair Shop',
    subtitle: 'Discover its secret properties',
    color: '#26c6da',
    colorLight: 'rgba(38,198,218,0.15)',
    colorBorder: 'rgba(38,198,218,0.4)',
  },
  {
    label: 'City Builder',
    icon: '🏙️',
    title: 'Parallelogram City Builder',
    subtitle: 'Master the area formula',
    color: '#ffc107',
    colorLight: 'rgba(255,193,7,0.15)',
    colorBorder: 'rgba(255,193,7,0.4)',
  },
];

export default function SimulatePhase({
  currentStation,
  simStationsComplete,
  onCompleteStation,
  onSetStation,
  onComplete,
  state,
}) {
  const allDone = simStationsComplete >= 3;
  const current = STATIONS[currentStation] || STATIONS[0];

  useEffect(() => {
    if (state.audioEnabled) {
      narrate(simulateInstruction(currentStation));
    }
    return () => stopNarration();
  }, [currentStation, state.audioEnabled]);

  return (
    <div className="phase-content" style={{ paddingTop: '68px', paddingBottom: '24px', gap: '12px' }}>

      {/* ── Phase badge ── */}
      <div style={{ textAlign: 'center' }}>
        <span className="q-type-badge">🧪 Phase 3 — Simulate</span>
      </div>

      {/* ── Station progress strip ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '999px',
        padding: '8px 16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {STATIONS.map((s, i) => {
          const done = i < simStationsComplete;
          const active = i === currentStation;
          const locked = i > simStationsComplete;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => !locked && onSetStation(i)}
                id={`station-tab-${i}`}
                aria-label={`${s.label} station`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  border: `1.5px solid ${done ? 'var(--green)' : active ? s.colorBorder : 'rgba(255,255,255,0.12)'}`,
                  background: done ? 'rgba(76,175,80,0.12)' : active ? s.colorLight : 'rgba(255,255,255,0.03)',
                  color: done ? '#81c784' : active ? s.color : 'rgba(255,255,255,0.3)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontFamily: "'Fredoka', sans-serif",
                  cursor: locked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: active ? `0 0 10px ${s.colorBorder}` : 'none',
                  whiteSpace: 'nowrap',
                  opacity: locked ? 0.4 : 1,
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{done ? '✓' : locked ? '🔒' : s.icon}</span>
                {s.label}
              </button>
              {i < STATIONS.length - 1 && (
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Current station header card ── */}
      <div style={{
        width: '100%',
        background: current.colorLight,
        border: `1px solid ${current.colorBorder}`,
        borderRadius: '16px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        animation: 'slideInUp 0.4s ease',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.4rem', flexShrink: 0,
        }}>
          {current.icon}
        </div>
        <div>
          <div style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: 'clamp(1rem, 3.5vw, 1.3rem)',
            fontWeight: 700,
            color: current.color,
            lineHeight: 1.2,
          }}>
            {current.title}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
            {current.subtitle}
          </div>
        </div>
      </div>

      {/* ── Station content ── */}
      <div style={{
        width: '100%',
        background: 'rgba(30,30,100,0.5)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '20px 16px',
        animation: 'slideInUp 0.4s ease',
      }}>
        {currentStation === 0 && (
          <ShapeShifterStation onComplete={(perfect) => {
            if (state.audioEnabled) narrate(simulateStationCompleteNarration());
            onCompleteStation(0, perfect);
          }} />
        )}
        {currentStation === 1 && (
          <RepairShopStation onComplete={(perfect) => {
            if (state.audioEnabled) narrate(simulateStationCompleteNarration());
            onCompleteStation(1, perfect);
          }} />
        )}
        {currentStation === 2 && (
          <CityBuilderStation onComplete={(perfect) => {
            if (state.audioEnabled) narrate(simulateStationCompleteNarration());
            onCompleteStation(2, perfect);
          }} />
        )}
      </div>

      {/* ── All done CTA ── */}
      {allDone && (
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={onComplete}
            id="simulate-complete-btn"
            style={{ animation: 'bounceIn 0.5s ease' }}
          >
            🎮 Let's Play!
          </button>
        </div>
      )}
    </div>
  );
}
