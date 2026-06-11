import React from "react";

export default function DreamIntro({ onStart, onBack }) {
  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", textAlign: "center", animation: "rise .7s ease both" }}>
      <style>{`
        @keyframes breathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes shimmerText {
          0%,100%{background-position:0% 50%}
          50%{background-position:100% 50%}
        }
        .intro-cta {
          transition: transform .22s, box-shadow .22s;
          border: none; cursor: pointer;
        }
        .intro-cta:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(0,0,0,.3) !important; }
        .intro-cta:active { transform: scale(.97); }
        .intro-back {
          transition: opacity .2s;
          border: none; cursor: pointer; background: transparent;
        }
        .intro-back:hover { opacity: .75; }
      `}</style>

      {/* Floating orbs background */}
      <div style={{ position: "relative", marginBottom: 28 }}>
        {[
          { top: -30, left: "10%", size: 90, color: "rgba(196,168,255,.06)" },
          { top: -10, right: "5%", size: 70, color: "rgba(135,206,235,.05)" },
          { top: 20, left: "40%", size: 50, color: "rgba(255,180,162,.04)" },
        ].map((orb, i) => (
          <div key={i} style={{
            position: "absolute",
            top: orb.top, left: orb.left, right: orb.right,
            width: orb.size, height: orb.size,
            borderRadius: "50%", background: orb.color,
            filter: "blur(20px)", pointerEvents: "none",
          }} />
        ))}

        {/* Main unicorn / icon */}
        <div style={{ fontSize: 88, animation: "breathe 4s ease-in-out infinite", lineHeight: 1 }}>
          🦄
        </div>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Fredoka', sans-serif",
        fontSize: "clamp(36px, 10vw, 52px)",
        fontWeight: 700,
        margin: "0 0 6px",
        background: "linear-gradient(90deg, #c4a8ff, #87CEEB, #ffb4a2, #ffe24d, #c4a8ff)",
        backgroundSize: "300% 300%",
        animation: "shimmerText 6s ease infinite",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        letterSpacing: 1,
      }}>
        Startup Destiny
      </h1>

      <p style={{
        fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase",
        opacity: .75, fontWeight: 700, color: "#c4a8ff", margin: "0 0 6px",
      }}>
        Digital Business Innovation · Binus @Bekasi
      </p>

      {/* Divider */}
      <div style={{
        height: 1, width: 80, margin: "18px auto",
        background: "linear-gradient(90deg, transparent, rgba(196,168,255,.5), transparent)",
      }} />

      {/* Description */}
      <p style={{
        fontSize: 16, lineHeight: 1.65, fontWeight: 600,
        color: "rgba(255,255,255,.88)", maxWidth: 360, margin: "0 auto 10px",
      }}>
        Alam impian menunggumu. ✨ Jalani <b>7 pengalaman ajaib</b> dan temukan
        {" "}<b>tipe founder</b> yang tersembunyi dalam dirimu.
      </p>
      <p style={{
        fontSize: 13, opacity: .75, margin: "0 0 28px", fontWeight: 600, color: "#c4a8ff",
      }}>
        Selesai? Foto hasilmu & tukar dengan <b>PIN founder</b>-mu 🎁
      </p>

      {/* Floating star decorations */}
      <div style={{ display: "flex", justifyContent: "center", gap: 14, fontSize: 18, opacity: .55, marginBottom: 28 }}>
        {["🌙", "⭐", "✨", "🌟", "💫"].map((s, i) => (
          <span key={i} style={{ animation: `breathe ${3 + i * .4}s ease-in-out ${i * .3}s infinite` }}>{s}</span>
        ))}
      </div>

      {/* CTA */}
      <button
        className="intro-cta"
        onClick={onStart}
        style={{
          fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 19,
          color: "#1a0a2e",
          background: "linear-gradient(135deg, #ffe24d, #ffb020)",
          padding: "16px 44px", borderRadius: 40,
          boxShadow: "0 12px 32px rgba(255,176,32,.35)",
          marginBottom: 16, display: "block", width: "100%", maxWidth: 300, margin: "0 auto 16px",
        }}
      >
        Masuki Alam Mimpi ✨
      </button>

      {/* Back */}
      <button
        className="intro-back"
        onClick={onBack}
        style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: 13,
          color: "rgba(196,168,255,.65)", padding: "8px 20px",
        }}
      >
        ← Kembali ke Game Hub
      </button>
    </div>
  );
}
