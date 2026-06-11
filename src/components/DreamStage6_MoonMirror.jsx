import React, { useState } from "react";

// Stage 6 — Moon Mirror Reflection
// Q: "Pujian yang paling kamu suka denger?"
// Scoring: trail | create | tech | change

const REFLECTIONS = [
  {
    key: "trail",
    emoji: "🦁",
    title: "Sang Pemberani",
    quote: "\"Beraninya kamu mulai duluan!\"",
    color: "#ff7a59",
  },
  {
    key: "create",
    emoji: "🦋",
    title: "Sang Pencipta",
    quote: "\"Idemu kreatif banget!\"",
    color: "#ff5fa8",
  },
  {
    key: "tech",
    emoji: "🌳",
    title: "Sang Pengembang",
    quote: "\"Di tanganmu, usahanya jadi makin maju!\"",
    color: "#5b8cff",
  },
  {
    key: "change",
    emoji: "🌿",
    title: "Sang Pembawa Cahaya",
    quote: "\"Kamu bikin perubahan nyata.\"",
    color: "#2ecc8f",
  },
];

export default function DreamStage6_MoonMirror({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  const pick = (r) => {
    if (selected) return;
    setSelected(r);
    setTimeout(() => onComplete(r.key), 1300);
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <style>{`
        @keyframes poolRipple {
          0% { transform: scale(1); opacity: .6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes moonGlow {
          0%,100% { box-shadow: 0 0 20px rgba(196,168,255,.3), 0 0 40px rgba(135,206,235,.1); }
          50%      { box-shadow: 0 0 36px rgba(196,168,255,.55), 0 0 60px rgba(135,206,235,.2); }
        }
        @keyframes mirrorReveal { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        @keyframes fogDrift {
          0%,100% { transform: translateX(0); opacity: .12; }
          50%      { transform: translateX(10px); opacity: .2; }
        }
        .mirror-btn { border:none; padding:0; cursor:pointer; background:transparent; }
        .mirror-btn:hover:not(:disabled) { filter:brightness(1.18); }
      `}</style>

      <p style={{
        fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
        color: "#c4a8ff", fontWeight: 700, margin: "0 0 10px", opacity: .85,
      }}>
        ✦ Langkah 6 dari 7 — Kolam Bulan ✦
      </p>
      <h2 style={{
        fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700,
        color: "#fff", margin: "0 0 6px", textShadow: "0 2px 18px rgba(196,168,255,.5)",
      }}>
        Apa yang Kamu Lihat dalam Kolam Bulan?
      </h2>
      <p style={{ fontSize: 13.5, color: "#c4a8ff", fontWeight: 600, margin: "0 0 20px", opacity: .9 }}>
        Pujian yang paling kamu suka denger?
      </p>

      {/* Moon pool */}
      <div style={{
        position: "relative", width: 110, height: 110,
        borderRadius: "50%", margin: "0 auto 22px",
        background: "radial-gradient(circle, rgba(196,168,255,.2) 0%, rgba(135,206,235,.1) 50%, transparent 100%)",
        animation: "moonGlow 4s ease-in-out infinite",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ fontSize: 44 }}>🌙</div>
        {/* Ripple rings */}
        {[1,2,3].map(i => (
          <div key={i} style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1px solid rgba(196,168,255,.25)",
            animation: `poolRipple 3s ease-out ${i * .9}s infinite`,
            pointerEvents: "none",
          }} />
        ))}
      </div>

      {/* Fog wisps */}
      {[
        { left: "5%", top: "45%", w: 80 },
        { right: "3%", top: "55%", w: 60 },
      ].map((f, i) => (
        <div key={i} style={{
          position: "fixed", ...f, height: 20,
          background: "rgba(196,168,255,.15)",
          borderRadius: 20, filter: "blur(8px)",
          animation: `fogDrift ${5 + i * 2}s ease-in-out infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Reflection cards */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
        {REFLECTIONS.map((r) => {
          const isSelected = selected?.key === r.key;
          const isDimmed = selected && !isSelected;
          return (
            <button
              key={r.key}
              className="mirror-btn"
              onClick={() => pick(r)}
              disabled={!!selected}
              onMouseEnter={() => setHovered(r.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                width: 148,
                borderRadius: 22,
                border: isSelected
                  ? `2px solid ${r.color}`
                  : hovered === r.key
                    ? "1.5px solid rgba(196,168,255,.3)"
                    : "1.5px solid rgba(255,255,255,0.09)",
                background: isSelected
                  ? `radial-gradient(circle at center, ${r.color}22, rgba(14,8,40,.95))`
                  : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(16px)",
                boxShadow: isSelected
                  ? `0 0 36px ${r.color}44, 0 16px 40px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1)`
                  : "0 8px 24px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)",
                padding: "20px 14px",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 10,
                opacity: isDimmed ? 0.18 : 1,
                transition: "all .35s",
                cursor: selected ? "default" : "pointer",
                animation: isSelected ? "mirrorReveal .4s ease both" : "none",
              }}
            >
              {/* Mirror circle */}
              <div style={{
                position: "relative",
                width: 64, height: 64, borderRadius: "50%",
                background: isSelected
                  ? `radial-gradient(circle, ${r.color}33, rgba(20,10,50,.9))`
                  : "radial-gradient(circle, rgba(196,168,255,.08), rgba(14,8,40,.7))",
                border: `2px solid ${isSelected ? r.color : "rgba(196,168,255,.15)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30,
                boxShadow: isSelected ? `0 0 20px ${r.color}44` : "none",
                transition: "all .35s",
              }}>
                {r.emoji}
              </div>

              <div style={{
                fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 700,
                color: isSelected ? r.color : "#c4a8ff",
                transition: "color .3s",
              }}>
                {r.title}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 600,
                color: isSelected ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.38)",
                fontStyle: "italic", lineHeight: 1.4, textAlign: "center",
              }}>
                {r.quote}
              </div>
            </button>
          );
        })}
      </div>

      {!selected && (
        <p style={{ marginTop: 18, fontSize: 13, color: "#c4a8ff", fontWeight: 600, opacity: .65 }}>
          🌕 Pilih bayangan yang paling mencerminkan dirimu...
        </p>
      )}
      {selected && (
        <p style={{
          marginTop: 16, fontSize: 13.5, color: "#ffe24d", fontWeight: 700,
          opacity: .95, animation: "mirrorReveal .5s ease both",
        }}>
          ✦ {selected.title} menatapmu dari dalam kolam ✦
        </p>
      )}
    </div>
  );
}
