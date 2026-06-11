import React, { useState, useEffect, useRef } from "react";

// Stage 7 — Sunrise Path
// Q: "Mimpi kamu 10 tahun lagi?"
// Scoring: tech | design | change | strat

const ELEMENTS = [
  {
    key: "tech",
    emoji: "🏛️",
    title: "Warisan Digital",
    desc: "Bisnis keluarga naik kelas jadi brand digital",
    color: "#5b8cff",
  },
  {
    key: "design",
    emoji: "💎",
    title: "Karya yang Dicintai",
    desc: "Brand / produk yang dicintai karena desainnya",
    color: "#b06bff",
  },
  {
    key: "change",
    emoji: "🌱",
    title: "Dampak Nyata",
    desc: "Menciptakan bisnis yang membawa dampak sosial bagi masyarakat luas",
    color: "#2ecc8f",
  },
  {
    key: "strat",
    emoji: "📈",
    title: "Kerajaan Bisnis",
    desc: "Membangun & mengembangkan banyak bisnis sekaligus",
    color: "#ffb020",
  },
];

export default function DreamStage7_SunrisePath({ onComplete }) {
  const [visible, setVisible] = useState([]);
  const [selected, setSelected] = useState(null);
  const [dawnArrived, setDawnArrived] = useState(false);

  const timersRef = useRef([]);

  useEffect(() => {
    // Trigger CSS sunrise animation on mount
    setDawnArrived(true);

    // Reveal elements one by one with speeded-up stagger delay
    ELEMENTS.forEach((el, index) => {
      const t = setTimeout(() => {
        setVisible((v) => [...v, el.key]);
      }, index * 350 + 200);
      timersRef.current.push(t);
    });

    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const pick = (el) => {
    if (selected || !visible.includes(el.key)) return;
    // Clear remaining timers so no more cards pop in during transition
    timersRef.current.forEach(clearTimeout);
    setSelected(el);
    setTimeout(() => onComplete(el.key), 1200);
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <style>{`
        @keyframes sunRise { from{transform:translateY(65px);opacity:0} to{transform:translateY(12px);opacity:1} }
        @keyframes elementAppear { from{opacity:0;transform:translateY(14px) scale(.9)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes sunGlow {
          0%,100% { box-shadow: 0 0 20px rgba(255,176,32,.4), 0 0 40px rgba(255,120,30,.2); }
          50%      { box-shadow: 0 0 40px rgba(255,176,32,.7), 0 0 80px rgba(255,120,30,.35); }
        }
        .sunrise-btn { border:none; cursor:pointer; padding:0; background:transparent; }
        .sunrise-btn:hover:not(:disabled) { filter:brightness(1.15); }
        .sunrise-btn:disabled { cursor:default; }
      `}</style>

      <p style={{
        fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
        color: "#ffb4a2", fontWeight: 700, margin: "0 0 10px", opacity: .85,
      }}>
        ✦ Langkah 7 dari 7 — Fajar Impian ✦
      </p>
      <h2 style={{
        fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700,
        color: "#fff", margin: "0 0 6px", textShadow: "0 2px 18px rgba(255,180,162,.4)",
      }}>
        Apa yang Menarik Perhatianmu Saat Fajar Tiba?
      </h2>
      <p style={{ fontSize: 13.5, color: "#ffb4a2", fontWeight: 600, margin: "0 0 18px", opacity: .9 }}>
        Bagaimana impianmu 10 tahun ke depan?
      </p>

      {/* Sunrise panorama container */}
      <div style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        background: "linear-gradient(180deg, #0a0826 0%, #1e0f3c 40%, #50280a 100%)",
        border: "1px solid rgba(255,176,32,.15)",
        marginBottom: 18, padding: "20px 16px 16px",
        minHeight: 160,
      }}>
        {/* Sunrise Sky Overlay (Hardware-accelerated CSS transition) */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, #3c264e 0%, #a83c74 40%, #ff8c0a 100%)",
          opacity: dawnArrived ? 1 : 0,
          transition: "opacity 3.5s cubic-bezier(0.25, 1, 0.5, 1)",
          zIndex: 0,
          pointerEvents: "none",
        }} />

        {/* Sun (rises dynamically from below the horizon) */}
        <div style={{
          position: "relative",
          zIndex: 1,
          width: 52, height: 52, borderRadius: "50%",
          background: "radial-gradient(circle, #fffde7, #ffb020)",
          margin: "0 auto 16px",
          transform: dawnArrived ? "translateY(12px)" : "translateY(65px)",
          opacity: dawnArrived ? 1 : 0,
          animation: "sunGlow 3s ease-in-out infinite",
          transition: "transform 3.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 3.5s ease",
        }} />

        {/* Horizon line */}
        <div style={{
          position: "relative",
          zIndex: 1,
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(255,176,32,${dawnArrived ? .6 : .1}), transparent)`,
          transition: "background 3.5s ease",
          marginBottom: 14,
        }} />

        {/* Tip text */}
        {visible.length < ELEMENTS.length && (
          <p style={{ position: "relative", zIndex: 1, fontSize: 12, color: "rgba(255,210,162,.7)", fontWeight: 600, margin: 0 }}>
            Elemen bermunculan saat fajar terbit...
          </p>
        )}
      </div>

      {/* Elements Grid using CSS Grid for alignment & equal heights */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(2, 1fr)", 
        gap: 10, 
        width: "100%",
        boxSizing: "border-box" 
      }}>
        {ELEMENTS.map((el) => {
          const isVisible = visible.includes(el.key);
          const isSelected = selected?.key === el.key;
          const isDimmed = selected && !isSelected;
          const isLocked = !isVisible;
          return (
            <button
              key={el.key}
              className="sunrise-btn"
              onClick={() => pick(el)}
              disabled={!!selected || isLocked}
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: "100%",
                borderRadius: 18,
                border: isSelected
                  ? `2px solid ${el.color}`
                  : isVisible
                    ? "1.5px solid rgba(255,255,255,0.12)"
                    : "1.5px solid rgba(255,255,255,0.04)",
                background: isSelected
                  ? `linear-gradient(135deg, ${el.color}44, rgba(14,8,40,.95))`
                  : isVisible
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(255,255,255,0.02)",
                backdropFilter: "blur(12px)",
                boxShadow: isSelected
                  ? `0 0 28px ${el.color}55, 0 12px 28px rgba(0,0,0,.5)`
                  : "0 6px 18px rgba(0,0,0,.35)",
                padding: "14px 12px",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 8,
                opacity: isDimmed ? 0.18 : isLocked ? 0.2 : 1,
                transition: "all .4s",
                cursor: selected || isLocked ? "default" : "pointer",
                animation: isVisible && !selected ? "elementAppear .6s ease both" : "none",
              }}
            >
              <div style={{
                fontSize: 28, lineHeight: 1,
                filter: isLocked ? "grayscale(1) brightness(.3)" : "none",
                transition: "filter .5s",
              }}>
                {isLocked ? "✦" : el.emoji}
              </div>
              <div style={{
                fontFamily: "'Fredoka', sans-serif", fontSize: 14, fontWeight: 700,
                color: isSelected ? el.color : isVisible ? "#ffb4a2" : "rgba(255,255,255,.2)",
              }}>
                {isLocked ? "Menunggu fajar..." : el.title}
              </div>
              <div style={{
                fontSize: 11.5, fontWeight: 600,
                color: isSelected ? "rgba(255,255,255,.85)" : isVisible ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.1)",
                lineHeight: 1.4, textAlign: "center",
              }}>
                {isLocked ? "···" : el.desc}
              </div>
            </button>
          );
        })}
      </div>

      {!selected && visible.length === ELEMENTS.length && (
        <p style={{ marginTop: 14, fontSize: 13, color: "#ffb4a2", fontWeight: 600, opacity: .7 }}>
          🌅 Klik yang paling menarik perhatianmu...
        </p>
      )}
      {selected && (
        <p style={{
          marginTop: 14, fontSize: 13.5, color: "#ffe24d", fontWeight: 700,
          opacity: .95, animation: "elementAppear .5s ease both",
        }}>
          ✦ Fajar telah menyingkap takdirmu ✦
        </p>
      )}
    </div>
  );
}
