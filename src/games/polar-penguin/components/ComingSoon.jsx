import React from 'react';

/**
 * ComingSoon — Placeholder untuk modul yang belum dibangun (Phase 3+).
 *
 * @param {{ moduleTitle: string, concept: string, onBackToHub: () => void }} props
 */
export default function ComingSoon({ moduleTitle, concept, onBackToHub }) {
  return (
    <div style={{
      width: '100%', height: '100%', minHeight: 320,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      textAlign: 'center', padding: '32px 24px',
      gap: 16,
    }}>
      <style>{`
        @keyframes CS_spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes CS_pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .CS_back { transition:opacity .2s; border:none; cursor:pointer; background:transparent; }
        .CS_back:hover { opacity:.7; }
      `}</style>

      <div style={{ fontSize: 52, animation: 'CS_spin 8s linear infinite' }}>❄️</div>

      <div>
        <h2 style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 16, fontWeight: 800, color: '#e0f2fe',
          margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1,
        }}>
          {moduleTitle}
        </h2>
        <p style={{
          fontSize: 11, color: '#38bdf8', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: 1.5, margin: 0,
          fontFamily: "'Nunito', sans-serif",
        }}>
          {concept}
        </p>
      </div>

      <div style={{
        padding: '14px 20px', maxWidth: 280,
        background: 'rgba(14,165,233,0.08)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 14,
      }}>
        <p style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.65,
        }}>
          <span style={{ color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
            🚧 Segera Hadir — Phase 2
          </span>
          Modul ini sedang dalam pengembangan. Selesaikan modul Market Tycoon & Network Architect terlebih dahulu!
        </p>
      </div>

      <button
        className="CS_back"
        onClick={onBackToHub}
        style={{
          fontFamily: "'Nunito', sans-serif",
          fontSize: 12, fontWeight: 700, color: '#38bdf8',
          padding: '10px 24px', borderRadius: 10,
          border: '1px solid rgba(56,189,248,0.3)',
          cursor: 'pointer', animation: 'CS_pulse 2s ease-in-out infinite',
        }}
      >
        ← Kembali ke Journey Map
      </button>
    </div>
  );
}
