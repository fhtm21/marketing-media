import React from 'react';

const POLAR_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Nunito:wght@400;600;700;800&family=Fredoka:wght@500;600;700&display=swap');`;

/**
 * PolarIntro — Halaman splash sebelum masuk Journey Map.
 * Menampilkan branding, deskripsi singkat, dan CTA untuk memulai.
 *
 * @param {{ onStart: () => void, onBack: () => void }} props
 */
export default function PolarIntro({ onStart, onBack }) {
  return (
    <div style={{
      width: '100%', maxWidth: 480, margin: '0 auto',
      textAlign: 'center', padding: '32px 24px 48px',
      animation: 'PP_rise 0.7s ease both',
    }}>
      <style>{POLAR_FONTS}</style>
      <style>{`
        @keyframes PP_rise    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes PP_float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes PP_shimmer { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes PP_pulse   { 0%,100%{box-shadow:0 0 18px rgba(56,189,248,.25)} 50%{box-shadow:0 0 40px rgba(56,189,248,.5)} }
        @keyframes PP_twinkle { 0%,100%{opacity:.3;transform:scale(1)} 50%{opacity:.9;transform:scale(1.4)} }
        .PP_cta { transition: transform .22s, filter .22s; border:none; cursor:pointer; }
        .PP_cta:hover { transform: translateY(-3px); filter: brightness(1.1); }
        .PP_cta:active { transform: scale(.96); }
        .PP_back { transition: opacity .2s; border:none; cursor:pointer; background:transparent; }
        .PP_back:hover { opacity:.7; }
      `}</style>

      {/* Snowflake decorations */}
      {['❄️','🌨️','❄️','❄️','🌨️'].map((s, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: `${10 + i * 18}%`, top: `${8 + (i % 3) * 8}%`,
          fontSize: 16, opacity: 0.25,
          animation: `PP_twinkle ${2.5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
          pointerEvents: 'none',
          fontFamily: 'sans-serif',
        }}>{s}</span>
      ))}

      {/* Main penguin mascot */}
      <div style={{
        fontSize: 96, lineHeight: 1, marginBottom: 24,
        animation: 'PP_float 4s ease-in-out infinite',
        filter: 'drop-shadow(0 0 24px rgba(56,189,248,0.5))',
        display: 'inline-block',
      }}>🐧</div>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontSize: 'clamp(24px, 7vw, 38px)',
        fontWeight: 900, margin: '0 0 6px',
        background: 'linear-gradient(90deg, #7dd3fc, #38bdf8, #e0f2fe, #7dd3fc)',
        backgroundSize: '300% 300%',
        animation: 'PP_shimmer 5s ease infinite',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: 2,
      }}>
        POLAR IT PORTAL
      </h1>

      <p style={{
        fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase',
        opacity: .7, fontWeight: 700, color: '#7dd3fc', margin: '0 0 8px',
        fontFamily: "'Nunito', sans-serif",
      }}>
        Business Information Technology · BINUS @Bekasi
      </p>

      {/* Divider */}
      <div style={{
        height: 1, width: 80, margin: '18px auto',
        background: 'linear-gradient(90deg, transparent, rgba(56,189,248,.5), transparent)',
      }} />

      {/* Description */}
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 15, lineHeight: 1.7, fontWeight: 600,
        color: 'rgba(255,255,255,.88)', maxWidth: 360, margin: '0 auto 10px',
      }}>
        Kelola pasar arktik, rancang topologi jaringan, dan kuasai konsep{' '}
        <b>Business IT</b> melalui <b>5 simulasi interaktif</b> yang menantang!
      </p>
      <p style={{
        fontFamily: "'Nunito', sans-serif",
        fontSize: 12, opacity: .65, margin: '0 0 30px',
        fontWeight: 600, color: '#7dd3fc',
      }}>
        Selesaikan semua modul & temukan jalur karirmu di BINUS 🧊
      </p>

      {/* Decorative ice icons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, fontSize: 20, opacity: .55, marginBottom: 30 }}>
        {['🧊', '🐟', '🌐', '📊', '🗄️'].map((s, i) => (
          <span key={i} style={{
            animation: `PP_float ${3 + i * 0.35}s ease-in-out ${i * 0.25}s infinite`,
            display: 'inline-block',
          }}>{s}</span>
        ))}
      </div>

      {/* CTA */}
      <button
        className="PP_cta"
        onClick={onStart}
        style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18,
          color: '#020c1b',
          background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
          padding: '15px 44px', borderRadius: 40,
          boxShadow: '0 12px 32px rgba(14,165,233,.35)',
          display: 'block', width: '100%', maxWidth: 300,
          margin: '0 auto 14px',
          animation: 'PP_pulse 2.5s ease-in-out infinite',
        }}
      >
        Mulai Ekspedisi Arktik 🐧
      </button>

      <button
        className="PP_back"
        onClick={onBack}
        style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 13,
          color: 'rgba(125,211,252,.65)', padding: '8px 20px',
        }}
      >
        ← Kembali ke Game Hub
      </button>
    </div>
  );
}
