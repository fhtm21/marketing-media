import React, { useState, useCallback } from "react";

export default function DreamStage6_MoonMirror({ onInteraction, stage }) {
  const [selected, setSelected] = useState(null);

  const reflections = [
    { id: "leader", emoji: "👑", name: "Pemimpin", archetype: "trail", desc: "Memimpin dan memotivasi dengan integritas" },
    { id: "artist", emoji: "🎭", name: "Seniman", archetype: "create", desc: "Mencipta keindahan dan ekspresi yang menginspirasi" },
    { id: "builder", emoji: "🔨", name: "Pembangun", archetype: "tech", desc: "Membangun sistem dan struktur yang kuat" },
    { id: "healer", emoji: "💚", name: "Penyembuh", archetype: "change", desc: "Menyembuhkan dan memperbaiki dengan empati" },
    { id: "planner", emoji: "📋", name: "Perencana", archetype: "strat", desc: "Merencanakan dengan strategi dan vision yang jelas" },
    { id: "innovator", emoji: "💡", name: "Inovator", archetype: "design", desc: "Menciptakan solusi baru yang mengubah paradigma" },
  ];

  const choose = useCallback((ref) => {
    if (selected) return;
    setSelected(ref);
    setTimeout(() => {
      onInteraction({
        type: "moonMirror",
        stage,
        value: { reflection: ref.id, archetype: ref.archetype, clarity: 0.9 }
      });
      setSelected(null);
    }, 300);
  }, [onInteraction, stage, selected]);

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🪞</div>
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#a0379a",
          margin: "0 0 8px",
          textAlign: "center",
        }}>Lihat Refleksi dalam Kolam Bulan</h2>
        <p style={{ fontSize: "15px", color: "rgba(160, 55, 154, 0.7)", margin: 0, maxWidth: "300px", textAlign: "center" }}>
          Pilih refleksi yang paling meresamba dengan jiwa Anda
        </p>
      </div>

      <div style={{ position: "relative", height: "240px", marginBottom: "24px" }}>
        {/* Moon pool */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background: "radial-gradient(circle at 30% 30%, #1a1a2e 0%, #0f0c29 100%)",
          borderRadius: "50%",
          boxShadow: "0 0 24px rgba(0,0,0,0.3)",
          border: "3px solid rgba(255,255,255,0.2)",
          overflow: "hidden",
        }} />

        {/* Moonlight reflection */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: "80px",
          height: "80px",
          background: "radial-gradient(circle, rgba(255,255,255,0.1), transparent)",
          borderRadius: "50%",
          filter: "blur(12px)",
          zIndex: 2,
        }} />

        {/* Mist effect */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
          animation: "flow 6s ease-in-out infinite",
          pointerEvents: "none",
        }} />

        {/* Reflections */}
        {reflections.map((ref, i) => {
          const angles = [0, 60, 120, 180, 240, 300];
          const angle = angles[i] * (Math.PI / 180);
          const radius = 60;
          const x = 50 + Math.cos(angle) * (radius / 100) * 50;
          const y = 50 + Math.sin(angle) * (radius / 100) * 50;
          
          return (
            <button
              key={ref.id}
              onClick={() => choose(ref)}
              disabled={selected}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: "50px",
                height: "50px",
                background: selected?.id === ref.id 
                  ? `linear-gradient(135deg, #fff5e6, #ffe24d)` 
                  : "rgba(255,255,255,0.8)",
                border: `2px solid ${selected?.id === ref.id ? "#a06bff" : "#e0e0e0"}`,
                borderRadius: "50%",
                padding: "8px",
                cursor: selected ? "default" : "pointer",
                textAlign: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: selected?.id === ref.id 
                  ? `0 0 12px ${selected?.id === ref.id ? "#a06bff" : "#e0e0e0"}33`
                  : "0 2px 6px rgba(0,0,0,0.1)",
                zIndex: 3,
              }}
            >
              <div style={{ 
                fontSize: "18px",
                marginBottom: "4px",
              }}>{ref.emoji}</div>
              <div style={{ 
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                textAlign: "center",
              }}>{ref.name}</div>
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
            Refleksi Terjadi: {selected.emoji} {selected.name}! Sentuh untuk lanjut
          </div>
        </div>
      )}
    </div>
  );
}