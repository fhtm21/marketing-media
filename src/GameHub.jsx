import React, { useState } from "react";
import OrbitRocketAdventure from "./OrbitRocketAdventure";
import StartupDestinyRPG from "./StartupDestinyRPG";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=Orbitron:wght@700;900&display=swap');
`;

const GAMES = [
  {
    id: "orbit",
    emoji: "🚀",
    title: "ORBIT Adventure",
    program: "Business Information Technology",
    description: "Jelajahi galaksi, jawab tantangan di setiap planet, dan temukan profesi BIT-mu!",
    tags: ["Business Enterprise Tech", "AI for Business"],
    gradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    accent: "#7fd4ff",
    tagBg: "rgba(127,212,255,0.18)",
    tagBorder: "rgba(127,212,255,0.45)",
    glowColor: "#7fd4ff",
    btnBg: "linear-gradient(90deg,#ffd36e,#ff8c42)",
    btnColor: "#1a1a2e",
    btnText: "Mulai Petualangan 🚀",
  },
  {
    id: "destiny",
    emoji: "🦄",
    title: "Startup Destiny",
    program: "Digital Business Innovation",
    description: "Jawab 7 pertanyaan dan temukan tipe founder yang ada di dalam dirimu!",
    tags: ["Technopreneur", "Designpreneur", "Entrepreneurship"],
    gradient: "linear-gradient(135deg, #ff6fb5 0%, #a06bff 50%, #5b8cff 100%)",
    accent: "#ffe24d",
    tagBg: "rgba(255,226,77,0.18)",
    tagBorder: "rgba(255,226,77,0.45)",
    glowColor: "#ffe24d",
    btnBg: "#ffe24d",
    btnColor: "#a0379a",
    btnText: "Temukan Tipe Founder ✨",
  },
];

export default function GameHub() {
  const [active, setActive] = useState(null); // null | "orbit" | "destiny"

  if (active === "orbit") return <OrbitRocketAdventure onBack={() => setActive(null)} />;
  if (active === "destiny") return <StartupDestinyRPG onBack={() => setActive(null)} />;

  return (
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden",
      fontFamily: "'Nunito', sans-serif", color: "#fff",
      background: "linear-gradient(160deg, #0a0a1a 0%, #12143a 40%, #1a0a2e 70%, #0d1a2e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "0 18px 48px", boxSizing: "border-box",
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:.2; transform:scale(1); }
          50% { opacity:.8; transform:scale(1.3); }
        }
        @keyframes floaty {
          0%,100% { transform:translateY(0) rotate(0deg); }
          50% { transform:translateY(-14px) rotate(8deg); }
        }
        @keyframes rise {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%,100% { background-position:0% 50%; }
          50%      { background-position:100% 50%; }
        }
        .game-card {
          transition: transform .25s, box-shadow .25s;
          cursor: pointer;
        }
        .game-card:hover {
          transform: translateY(-6px) scale(1.02);
        }
        .play-btn {
          transition: transform .2s, box-shadow .2s, filter .2s;
          border: none;
          cursor: pointer;
        }
        .play-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .play-btn:active {
          transform: scale(.97);
        }
      `}</style>

      {/* Star field */}
      {[...Array(60)].map((_, i) => (
        <div key={i} style={{
          position: "fixed",
          left: `${(i * 137.508) % 100}%`,
          top: `${(i * 97.312) % 100}%`,
          width: i % 5 === 0 ? 3 : 2,
          height: i % 5 === 0 ? 3 : 2,
          borderRadius: "50%",
          background: "#fff",
          opacity: .15 + (i % 7) * .05,
          animation: `twinkle ${2 + (i % 5)}s ease-in-out ${(i % 3) * .7}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Header */}
      <div style={{ textAlign: "center", animation: "rise .7s ease both", marginTop: 52, marginBottom: 8 }}>
        <div style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", opacity: .7, fontWeight: 700, marginBottom: 8 }}>
          BINUS University @Bekasi
        </div>
        <div style={{ fontSize: 13, letterSpacing: 2.5, textTransform: "uppercase", opacity: .6, fontWeight: 700, marginBottom: 20 }}>
          School of Information Systems
        </div>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: "clamp(36px, 8vw, 64px)",
          fontWeight: 900,
          letterSpacing: 2,
          background: "linear-gradient(90deg, #7fd4ff, #c4a8ff, #ffe24d, #ff8c42)",
          backgroundSize: "300% 300%",
          animation: "shimmer 5s ease infinite",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1.1,
          marginBottom: 6,
        }}>
          GAME YOUR FUTURE
        </div>
        <div style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "clamp(15px, 3vw, 20px)",
          fontWeight: 600,
          opacity: .85,
          letterSpacing: .5,
        }}>
          Pilih game-mu dan temukan jalur impianmu! 🌟
        </div>
        <div style={{ height: 2, width: 80, margin: "22px auto 0", background: "rgba(255,255,255,.35)", borderRadius: 2 }} />
      </div>

      {/* Game cards */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: 28, justifyContent: "center",
        marginTop: 40, width: "100%", maxWidth: 1000,
        animation: "rise .9s .15s ease both",
      }}>
        {GAMES.map((g) => (
          <div key={g.id} className="game-card" style={{
            width: "100%", maxWidth: 420,
            borderRadius: 28,
            background: g.gradient,
            boxShadow: `0 0 0 1.5px ${g.glowColor}33, 0 20px 60px rgba(0,0,0,.55)`,
            overflow: "hidden",
            position: "relative",
          }}>
            {/* Glow top accent */}
            <div style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "60%", height: 3,
              background: `linear-gradient(90deg, transparent, ${g.glowColor}, transparent)`,
              borderRadius: "0 0 8px 8px",
            }} />

            <div style={{ padding: "32px 28px 28px" }}>
              {/* Emoji */}
              <div style={{
                fontSize: 64, lineHeight: 1, marginBottom: 16,
                animation: "floaty 5s ease-in-out infinite",
                display: "inline-block",
              }}>{g.emoji}</div>

              {/* Title */}
              <h2 style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: 30, fontWeight: 700, margin: "0 0 4px",
                textShadow: `0 3px 16px ${g.glowColor}66`,
              }}>{g.title}</h2>

              {/* Program badge */}
              <div style={{
                display: "inline-block", fontSize: 11.5, fontWeight: 800,
                letterSpacing: 1, textTransform: "uppercase",
                color: g.accent, background: "rgba(0,0,0,.25)",
                border: `1px solid ${g.glowColor}55`,
                borderRadius: 20, padding: "4px 12px", marginBottom: 14,
              }}>{g.program}</div>

              {/* Description */}
              <p style={{
                fontSize: 15, lineHeight: 1.65, fontWeight: 600,
                margin: "0 0 20px", opacity: .92,
              }}>{g.description}</p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 24 }}>
                {g.tags.map((tag, i) => (
                  <span key={i} style={{
                    fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
                    background: g.tagBg, border: `1px solid ${g.tagBorder}`, color: "#fff",
                  }}>{tag}</span>
                ))}
              </div>

              {/* CTA Button */}
              <button className="play-btn" onClick={() => setActive(g.id)} style={{
                fontFamily: "'Fredoka', sans-serif",
                fontWeight: 700, fontSize: 17,
                color: g.btnColor,
                background: g.btnBg,
                padding: "14px 36px",
                borderRadius: 40,
                boxShadow: `0 8px 24px rgba(0,0,0,.25)`,
                width: "100%",
              }}>{g.btnText}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 48, fontSize: 12, letterSpacing: 1.5, opacity: .4,
        textTransform: "uppercase", fontWeight: 700, textAlign: "center",
        animation: "rise 1s .3s ease both",
      }}>
        SIS Open House · BINUS @Bekasi
      </div>
    </div>
  );
}
