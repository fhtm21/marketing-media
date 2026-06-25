import React from 'react';

/**
 * Komponen animasi keberhasilan kampanye (Confetti, Golden Trophy, Jumping Penguin).
 */
export function SuccessStatusAnimation() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 180,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes TS_confetti_1 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(-80px, -50px) scale(0.5) rotate(360deg); opacity: 0; }
        }
        @keyframes TS_confetti_2 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(80px, -60px) scale(0.5) rotate(-360deg); opacity: 0; }
        }
        @keyframes TS_confetti_3 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50px, 60px) scale(0.4) rotate(180deg); opacity: 0; }
        }
        @keyframes TS_confetti_4 {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(60px, 70px) scale(0.4) rotate(-180deg); opacity: 0; }
        }
        @keyframes TS_goldGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(251,191,36,0.5)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 25px rgba(251,191,36,0.9)); transform: scale(1.08); }
        }
        @keyframes TS_jump {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-24px) rotate(10deg); }
        }
        @keyframes TS_spin_star {
          0% { transform: rotate(0deg) scale(0.8); opacity: 0.6; }
          50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
          100% { transform: rotate(360deg) scale(0.8); opacity: 0.6; }
        }
      `}</style>

      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        width: 120, height: 120,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0) 70%)',
        zIndex: 1,
      }} />

      {/* Confetti Elements */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`c1-${i}`}
          style={{
            position: 'absolute',
            width: i % 2 === 0 ? 8 : 12,
            height: i % 2 === 0 ? 4 : 6,
            background: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#10b981' : '#38bdf8',
            borderRadius: 2,
            zIndex: 3,
            animation: `TS_confetti_${(i % 4) + 1} ${1.8 + i * 0.2}s ease-in-out infinite`,
            animationDelay: `${i * 0.15}s`,
            transformOrigin: 'center'
          }}
        />
      ))}

      {/* Floating Stars */}
      <span style={{ position: 'absolute', top: 20, left: 60, fontSize: 20, animation: 'TS_spin_star 3s linear infinite', zIndex: 2 }}>⭐️</span>
      <span style={{ position: 'absolute', top: 30, right: 70, fontSize: 16, animation: 'TS_spin_star 4s linear infinite', zIndex: 2 }}>🌟</span>
      <span style={{ position: 'absolute', bottom: 30, left: 80, fontSize: 14, animation: 'TS_spin_star 2.5s linear infinite', zIndex: 2 }}>⭐</span>

      {/* Main Elements (Mascot and Trophy) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, zIndex: 4 }}>
        {/* Jumping Penguin */}
        <div style={{
          fontSize: 64,
          animation: 'TS_jump 1.6s ease-in-out infinite',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
        }}>🐧</div>

        {/* Glowing Trophy */}
        <div style={{
          fontSize: 58,
          animation: 'TS_goldGlow 2.5s ease-in-out infinite',
        }}>🏆</div>
      </div>
    </div>
  );
}

/**
 * Komponen animasi kegagalan kampanye (Shivering Penguin, Shaking Ice, Warning Alert, Blizzard).
 */
export function FailureStatusAnimation() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 180,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes TS_shiver {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 1px); }
          20%, 40%, 60%, 80% { transform: translate(2px, -1px); }
        }
        @keyframes TS_snowfall {
          0% { transform: translateY(-40px) translateX(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(80px) translateX(-20px); opacity: 0; }
        }
        @keyframes TS_crack {
          0% { stroke-dashoffset: 80; opacity: 0.3; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { opacity: 0.8; }
        }
        @keyframes TS_siren {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.45; }
        }
      `}</style>

      {/* Ambient Red Alert Glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0) 80%)',
        animation: 'TS_siren 2s ease-in-out infinite',
        zIndex: 1,
      }} />

      {/* Falling Snowflakes */}
      {[...Array(8)].map((_, i) => (
        <span
          key={`s-${i}`}
          style={{
            position: 'absolute',
            top: 10,
            left: `${20 + i * 20}%`,
            fontSize: i % 2 === 0 ? 10 : 14,
            color: '#bae6fd',
            opacity: 0,
            animation: `TS_snowfall ${2 + i * 0.3}s linear infinite`,
            animationDelay: `${i * 0.25}s`,
            zIndex: 2,
            pointerEvents: 'none'
          }}
        >
          ❄️
        </span>
      ))}

      {/* Shivering Penguin on Cracked Ice */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 4 }}>
        {/* Warning Light */}
        <div style={{
          fontSize: 22,
          marginBottom: 4,
          animation: 'TS_shiver 0.4s infinite'
        }}>🚨</div>

        {/* Shivering Mascot */}
        <div style={{
          fontSize: 60,
          animation: 'TS_shiver 0.15s linear infinite',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))',
        }}>🐧</div>

        {/* Simulated cracked ice underneath */}
        <svg viewBox="0 0 100 20" style={{ width: 110, height: 22, marginTop: 4 }}>
          {/* Ice base */}
          <polygon points="5,2 95,2 85,18 15,18" fill="#1e293b" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" />
          {/* Animated crack line */}
          <path
            d="M 50 2 L 48 8 L 54 12 L 50 18"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="80"
            strokeDashoffset="80"
            style={{ animation: 'TS_crack 3s ease forwards infinite' }}
          />
        </svg>
      </div>
    </div>
  );
}
