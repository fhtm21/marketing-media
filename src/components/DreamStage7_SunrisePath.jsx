import React, { useState, useCallback } from "react";

export default function DreamStage7_SunrisePath({ onInteraction, stage }) {
  const [selected, setSelected] = useState(null);

  const focuses = [
    { id: "horizon", emoji: "🌅", name: "Garis Horison", archetype: "trail", desc: "Memandang jauh ke depan dengan visi dan ambisi" },
    { id: "flowers", emoji: "🌸", name: "Bunga-bunga", archetype: "design", desc: "Menghargai keindahan dan detail di sekitar" },
    { id: "birds", emoji: "🐦", name: "Burung-burung", archetype: "create", desc: "Merasa bebas dan kreatif dalam mengekspresikan diri" },
    { id: "water", emoji: "💧", name: "Air terjun", archetype: "strat", desc: "Menganalisis aliran dan membuat rencana yang terukur" },
    { id: "rocks", emoji: "🪨", name: "Batuan", archetype: "tech", desc: "Membangun fondasi yang kuat dan teknologi yang andal" },
    { id: "light", emoji: "☀️", name: "Cahaya pertama", archetype: "change", desc: "Menghadirkan perubahan positif dan inspirasi baru" },
  ];

  const chooseFocus = useCallback((f) => {
    if (selected) return;
    setSelected(f);
    setTimeout(() => {
      onInteraction({
        type: "sunrisePath",
        stage,
        value: { focus: f.id, archetype: f.archetype, pace: 0.7 }
      });
      setSelected(null);
    }, 300);
  }, [onInteraction, stage, selected]);

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌅</div>
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#a0379a",
          margin: "0 0 8px",
          textAlign: "center",
        }}>Menembus Fajar Baru</h2>
        <p style={{ fontSize: "15px", color: "rgba(160, 55, 154, 0.7)", margin: 0, maxWidth: "300px", textAlign: "center" }}>
          Pilih apa yang Anda saksikan saat fajar pertama terbit
        </p>
      </div>

      <div style={{ position: "relative", height: "240px", marginBottom: "24px" }}>
        {/* Sky gradient */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background: "linear-gradient(180deg, #ffb347 0%, #ffd854 40%, #ffed66 70%, #fff5e6 100%)",
          borderRadius: "20px",
          overflow: "hidden",
        }} />

        {/* Sun */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "36px",
          filter: "drop-shadow(0 0 20px #FFD700)",
          zIndex: 2,
        }}>
          ☀️
        </div>

        {/* Ground */}
        <div style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          height: "60px",
          background: "linear-gradient(180deg, #8B4513 0%, #654321 100%)",
          borderRadius: "20px 20px 0 0",
          boxShadow: "0 -4px 12px rgba(139,69,19,0.3)",
        }} />

        {/* Focus points - arranged in a semi-circle above the ground */}
        {focuses.map((focus, i) => {
          const angles = [30, 50, 70, 110, 130, 150]; // Spread across the top half
          const angle = angles[i] * (Math.PI / 180);
          const radius = 35;
          const x = 50 + Math.cos(angle) * radius;
          const y = 30 + Math.sin(angle) * radius;
          
          return (
            <button
              key={focus.id}
              onClick={() => chooseFocus(focus)}
              disabled={selected}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: "50px",
                height: "60px",
                background: selected?.id === focus.id 
                  ? `linear-gradient(135deg, #fff5e6, #ffe24d)` 
                  : "rgba(255,255,255,0.9)",
                border: `2px solid ${selected?.id === focus.id ? "#ffb020" : "#e0e0e0"}`,
                borderRadius: "12px",
                padding: "8px",
                cursor: selected ? "default" : "pointer",
                textAlign: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: selected?.id === focus.id 
                  ? `0 0 12px ${selected?.id === focus.id ? "#ffb020" : "#e0e0e0"}33`
                  : "0 2px 6px rgba(0,0,0,0.1)",
                zIndex: 3,
              }}
            >
              <div style={{ 
                fontSize: "18px",
                marginBottom: "4px",
              }}>{focus.emoji}</div>
              <div style={{ 
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                textAlign: "center",
              }}>{focus.name}</div>
            </button>
          );
        })}
      </div>
      
      {selected && (
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <div style={{ 
            display: "inline-block",
            background: "linear-gradient(135deg, #ffe24d, #ffd54f)",
            color: "#a0379a",
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            padding: "8px 16px",
            borderRadius: "20px",
            boxShadow: "0 4px 12px rgba(255,226,77,0.3)",
          }}>
            Fajar Terjadi: {selected.emoji} {selected.name}! Sentuh untuk lanjut ke hasil
          </div>
        </div>
      )}
    </div>
  );
}