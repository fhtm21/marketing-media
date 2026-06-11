import React, { useState, useEffect } from "react";

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
    appearAt: 0,
  },
  {
    key: "design",
    emoji: "💎",
    title: "Karya yang Dicintai",
    desc: "Brand / produk yang dicintai karena desainnya",
    color: "#b06bff",
    appearAt: 800,
  },
  {
    key: "change",
    emoji: "🌱",
    title: "Dampak Nyata",
    desc: "Bisnis yang punya dampak sosial buat banyak orang",
    color: "#2ecc8f",
    appearAt: 1600,
  },
  {
    key: "strat",
    emoji: "📈",
    title: "Kerajaan Bisnis",
    desc: "Bangun & gedein banyak usaha sekaligus",
    color: "#ffb020",
    appearAt: 2400,
  },
];

export default function DreamStage7_SunrisePath({ onComplete }) {
  const [visible, setVisible] = useState([]);
  const [selected, setSelected] = useState(null);
  const [sunProgress, setSunProgress] = useState(0);

  useEffect(() => {
    // Reveal elements one by one
    ELEMENTS.forEach((el) => {
      setTimeout(() => {
        setVisible((v) => [...v, el.key]);
      }, el.appearAt + 200);
    });

    // Animate sun rising
    const interval = setInterval(() => {
      setSunProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 70);
    return () => clearInterval(interval);
  }, []);

  const pick = (el) => {
    if (selected || !visible.includes(el.key)) return;
    setSelected(el);
    setTimeout(() => onComplete(el.key), 1200);
  };

  // Sunrise sky color: dark blue → orange glow
  const skyBg = `linear-gradient(180deg,
    rgba(${Math.round(10 + sunProgress * .5)},${Math.round(8 + sunProgress * .3)},${Math.round(38 + sunProgress * .1)},1) 0%,
    rgba(${Math.round(30 + sunProgress * 1.2)},${Math.round(15 + sunProgress * .6)},${Math.round(60 + sunProgress * .2)},1) 40%,
    rgba(${Math.round(80 + sunProgress * 1.5)},${Math.round(40 + sunProgress)},${Math.round(10)},1) 100%
  )`;

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <style>{`
        @keyframes sunRise { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
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
        Mimpi kamu 10 tahun lagi?
      </p>

      {/* Sunrise panorama */}
      <div style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        background: skyBg, border: "1px solid rgba(255,176,32,.15)",
        marginBottom: 18, padding: "20px 16px 16px",
        minHeight: 160, transition: "background 1s",
      }}>
        {/* Sun */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "radial-gradient(circle, #fffde7, #ffb020)",
          margin: "0 auto 16px",
          transform: `translateY(${Math.max(0, 20 - sunProgress * .2)}px)`,
          opacity: Math.min(1, sunProgress * .015),
          animation: "sunGlow 3s ease-in-out infinite",
          transition: "transform .5s, opacity .5s",
        }} />

        {/* Horizon line */}
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, transparent, rgba(255,176,32,${Math.min(.6, sunProgress * .006)}), transparent)`,
          marginBottom: 14,
        }} />

        {/* Tip text */}
        {visible.length < ELEMENTS.length && (
          <p style={{ fontSize: 12, color: "rgba(255,210,162,.7)", fontWeight: 600, margin: 0 }}>
            Elemen bermunculan saat fajar terbit...
          </p>
        )}
      </div>

      {/* Elements grid */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
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
                width: "calc(50% - 8px)",
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
