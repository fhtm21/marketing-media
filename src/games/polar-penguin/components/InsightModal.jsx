import React from 'react';

/**
 * InsightModal — Modal yang muncul setelah menyelesaikan sebuah modul.
 * Menampilkan konsep Business IT yang dipelajari dan koneksi ke kurikulum BINUS.
 *
 * @param {{
 *   isOpen: boolean,
 *   moduleTitle: string,
 *   concept: string,
 *   insightText: string,
 *   scoreXP: number,
 *   onContinue: () => void
 * }} props
 */
export default function InsightModal({
  isOpen, moduleTitle, concept, insightText, scoreXP, onContinue,
}) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Insight: ${concept}`}
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(2,12,27,0.92)', backdropFilter: 'blur(8px)',
        zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center',
        padding: 20,
      }}
    >
      <style>{`
        @keyframes IM_popIn {
          from { opacity:0; transform:scale(.88) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .IM_btn {
          transition: transform .2s, filter .2s;
          border: none; cursor: pointer;
        }
        .IM_btn:hover { transform: translateY(-2px); filter: brightness(1.12); }
        .IM_btn:active { transform: scale(.97); }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 360,
        background: 'linear-gradient(160deg, #0c1a2e 0%, #071525 100%)',
        border: '1px solid rgba(56,189,248,0.25)',
        borderRadius: 20, padding: '28px 24px',
        boxShadow: '0 0 60px rgba(14,165,233,0.15), 0 20px 60px rgba(0,0,0,0.6)',
        animation: 'IM_popIn 0.35s cubic-bezier(.34,1.56,.64,1) both',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🎓</div>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase',
            color: '#38bdf8', fontWeight: 800, margin: '0 0 4px', opacity: .9,
          }}>
            Modul Selesai!
          </p>
          <h3 style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 15, fontWeight: 800, color: '#e0f2fe',
            margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {moduleTitle}
          </h3>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#38bdf8',
            background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)',
            borderRadius: 20, padding: '3px 10px',
            fontFamily: "'Nunito', sans-serif",
          }}>
            {concept}
          </span>
        </div>

        {/* Score */}
        <div style={{
          background: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: 12, padding: '10px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 14,
        }}>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 11, color: '#94a3b8', fontWeight: 700,
          }}>
            XP Diperoleh
          </span>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 18, fontWeight: 800, color: '#fbbf24',
          }}>
            +{scoreXP} XP
          </span>
        </div>

        {/* Insight Box */}
        <div style={{
          background: 'rgba(14,165,233,0.06)',
          border: '1px solid rgba(56,189,248,0.15)',
          borderRadius: 12, padding: '12px 14px',
          marginBottom: 20,
        }}>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 9, letterSpacing: 2, textTransform: 'uppercase',
            color: '#38bdf8', fontWeight: 800, margin: '0 0 6px',
          }}>
            📚 Business IT Insight
          </p>
          <p style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 12, color: '#cbd5e1', lineHeight: 1.65, margin: 0, fontWeight: 600,
          }}>
            {insightText}
          </p>
        </div>

        {/* BINUS link */}
        <a
          href="https://binus.ac.id/bekasi/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: 10, color: '#38bdf8', fontWeight: 700,
            letterSpacing: 1, textDecoration: 'none', opacity: .8,
            display: 'block', textAlign: 'center', marginBottom: 16,
          }}
        >
          🌐 Pelajari lebih lanjut di BINUS @Bekasi →
        </a>

        {/* CTA */}
        <button
          className="IM_btn"
          onClick={onContinue}
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 800, fontSize: 13,
            color: '#020c1b',
            background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
            padding: '13px 20px', borderRadius: 12,
            width: '100%', textTransform: 'uppercase', letterSpacing: 1,
          }}
        >
          Kembali ke Journey Map 🗺️
        </button>
      </div>
    </div>
  );
}
