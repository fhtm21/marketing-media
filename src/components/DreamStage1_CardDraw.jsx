import React, { useState } from "react";

// Stage 1 — Card Draw
// Q: "Pas punya ide bisnis, hal pertama yang kamu lakuin?"
// Scoring: trail | design | tech | strat

const CARDS = [
  {
    key: "trail",
    frontEmoji: "🚀",
    title: "Kartu Fajar",
    subtitle: "The Pioneer",
    desc: "Langsung eksekusi, mikir belakangan",
    color: "#ff7a59",
    floatAnim: "cf0",
    delay: "0s",
  },
  {
    key: "design",
    frontEmoji: "✨",
    title: "Kartu Jiwa",
    subtitle: "The Innovator",
    desc: "Sketsa tampilan & rasanya buat user",
    color: "#b06bff",
    floatAnim: "cf1",
    delay: "0.3s",
  },
  {
    key: "tech",
    frontEmoji: "👑",
    title: "Kartu Warisan",
    subtitle: "The Successor",
    desc: "Rapihin & kembangin yang sudah ada",
    color: "#5b8cff",
    floatAnim: "cf2",
    delay: "0.6s",
  },
  {
    key: "strat",
    frontEmoji: "📈",
    title: "Kartu Strategi",
    subtitle: "The Strategist",
    desc: "Hitung dulu: bisa cuan & jalan nggak?",
    color: "#ffb020",
    floatAnim: "cf3",
    delay: "0.9s",
  },
];

export default function DreamStage1_CardDraw({ onComplete }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const pick = (card) => {
    if (selected) return;
    setSelected(card);
    setTimeout(() => setRevealed(true), 420);
    setTimeout(() => onComplete(card.key), 1700);
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <style>{`
        @keyframes cf0 { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-16px) rotate(3deg)} }
        @keyframes cf1 { 0%,100%{transform:translateY(-5px) rotate(2deg)} 50%{transform:translateY(10px) rotate(-3deg)} }
        @keyframes cf2 { 0%,100%{transform:translateY(3px) rotate(-2deg)} 50%{transform:translateY(-14px) rotate(4deg)} }
        @keyframes cf3 { 0%,100%{transform:translateY(-2px) rotate(3deg)} 50%{transform:translateY(-18px) rotate(-2deg)} }
        @keyframes cardReveal { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        .dcard-btn { cursor:pointer; transition: box-shadow .25s, opacity .4s; border:none; padding:0; }
        .dcard-btn:hover:not(:disabled) { filter: brightness(1.15); }
      `}</style>

      <p style={{
        fontSize: 11, letterSpacing: 3, textTransform: "uppercase",
        color: "#c4a8ff", fontWeight: 700, margin: "0 0 10px", opacity: .85,
      }}>
        ✦ Langkah 1 dari 7 — Kartu Takdir ✦
      </p>
      <h2 style={{
        fontFamily: "'Fredoka', sans-serif", fontSize: 22, fontWeight: 700,
        color: "#fff", margin: "0 0 6px", textShadow: "0 2px 18px rgba(196,168,255,.5)",
      }}>
        Dari Bintang Mana Mimpimu?
      </h2>
      <p style={{ fontSize: 13.5, color: "#c4a8ff", fontWeight: 600, margin: "0 0 28px", opacity: .9 }}>
        Pas punya ide bisnis, hal pertama yang kamu lakuin?
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", padding: "0 4px" }}>
        {CARDS.map((card) => {
          const isSelected = selected?.key === card.key;
          const isDimmed = selected && !isSelected;
          return (
            <button
              key={card.key}
              className="dcard-btn"
              onClick={() => pick(card)}
              disabled={!!selected}
              style={{
                width: 138,
                minHeight: 192,
                borderRadius: 22,
                border: isSelected && revealed
                  ? `2px solid ${card.color}`
                  : "1.5px solid rgba(255,255,255,0.11)",
                background: isSelected && revealed
                  ? `linear-gradient(160deg, ${card.color}55, rgba(22,12,50,0.95))`
                  : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(14px)",
                boxShadow: isSelected && revealed
                  ? `0 0 30px ${card.color}55, 0 16px 40px rgba(0,0,0,.5)`
                  : "0 8px 28px rgba(0,0,0,.35)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                padding: "20px 12px",
                animation: selected ? "none" : `${card.floatAnim} ${4.5 + CARDS.indexOf(card) * .6}s ease-in-out ${card.delay} infinite`,
                opacity: isDimmed ? 0.22 : 1,
                cursor: selected ? "default" : "pointer",
                transition: "opacity .5s, background .4s, border .4s, box-shadow .4s",
              }}
            >
              {/* Card face */}
              <div style={{
                fontSize: 42, marginBottom: 12,
                filter: isSelected && revealed ? "none" : "grayscale(1) brightness(.35)",
                transition: "filter .5s",
              }}>
                {isSelected && revealed ? card.frontEmoji : "🌙"}
              </div>

              <div style={{
                fontFamily: "'Fredoka', sans-serif", fontSize: 15, fontWeight: 700,
                color: isSelected && revealed ? "#fff" : "#5a4a7a",
                marginBottom: 4, transition: "color .4s",
              }}>
                {isSelected && revealed ? card.title : "Misteri"}
              </div>

              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
                color: isSelected && revealed ? card.color : "#3a2a5a",
                marginBottom: 10, textTransform: "uppercase",
              }}>
                {isSelected && revealed ? card.subtitle : "· · ·"}
              </div>

              {isSelected && revealed ? (
                <div style={{
                  fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.85)",
                  lineHeight: 1.45, textAlign: "center",
                  animation: "cardReveal .4s ease both",
                }}>
                  {card.desc}
                </div>
              ) : (
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(196,168,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "rgba(196,168,255,.25)",
                }}>
                  ✦
                </div>
              )}
            </button>
          );
        })}
      </div>

      {!selected && (
        <p style={{ marginTop: 20, fontSize: 13, color: "#c4a8ff", fontWeight: 600, opacity: .7 }}>
          ✨ Sentuh kartu yang memanggilmu...
        </p>
      )}
      {selected && revealed && (
        <p style={{
          marginTop: 18, fontSize: 13.5, color: "#ffe24d", fontWeight: 700,
          opacity: .95, animation: "cardReveal .5s ease both",
        }}>
          ✦ {selected.title} telah memilihmu ✦
        </p>
      )}
    </div>
  );
}
