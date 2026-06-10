import React, { useState, useCallback } from "react";

export default function DreamStage1_CardDraw({ onInteraction, stage }) {
  const [selected, setSelected] = useState(null);
  const [drawn, setDrawn] = useState([]);

  const cards = [
    { id: 1, emoji: "🚀", title: "Perintis", archetype: "trail", desc: "Mulai dari nol" },
    { id: 2, emoji: "⚡", title: "Penerus", archetype: "tech", desc: "Bangun dari warisan" },
    { id: 3, emoji: "🎨", title: "Kreator", archetype: "create", desc: "Ide baru" },
    { id: 4, emoji: "💎", title: "Inovator", archetype: "design", desc: "Detail sempurna" },
  ];

  const drawCard = useCallback((card) => {
    if (drawn.length >= 3 || drawn.some(d => d.id === card.id)) return;
    
    const newDrawn = [...drawn, card];
    setDrawn(newDrawn);
    
    if (newDrawn.length === 3) {
      setTimeout(() => {
        const archetype = newDrawn[0].archetype;
        onInteraction({
          type: "cardDraw",
          stage,
          value: { archetype, cards: newDrawn, points: 1 }
        });
      }, 300);
    }
  }, [drawn, onInteraction, stage]);

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>✨</div>
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#a0379a",
          margin: "0 0 8px",
          textAlign: "center",
        }}>Pilih 3 Mimpi yang Berlapis</h2>
        <p style={{ fontSize: "15px", color: "rgba(160, 55, 154, 0.7)", margin: 0, maxWidth: "300px", textAlign: "center" }}>
          Setiap mimpi mengungkap aspek kepribadian foundermu
        </p>
      </div>

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {cards.map((card) => {
          const isDrawn = drawn.some(d => d.id === card.id);
          return (
            <button
              key={card.id}
              onClick={() => drawCard(card)}
              disabled={isDrawn || drawn.length >= 3}
              style={{
                background: isDrawn 
                  ? `linear-gradient(145deg, #fff, #f0f0f0)`
                  : `linear-gradient(145deg, #ffffff, #e6e6e6)`,
                border: isDrawn 
                  ? `3px solid ${card.archetype === 'trail' ? '#ff7a59' : 
                     card.archetype === 'tech' ? '#5b8cff' : 
                     card.archetype === 'create' ? '#ff5fa8' : '#b06bff'}`
                  : "2px solid #e0e0e0",
                borderRadius: "20px",
                padding: "20px",
                cursor: drawn.length >= 3 || isDrawn ? "default" : "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isDrawn ? "translateY(-2px)" : "translateY(0)",
                boxShadow: isDrawn 
                  ? `0 12px 24px ${card.archetype === 'trail' ? '#ff7a5933' : card.archetype === 'tech' ? '#5b8cff33' : card.archetype === 'create' ? '#ff5fa833' : '#b06bff33'}`
                  : "0 6px 12px rgba(0,0,0,0.1)",
                position: "relative",
                overflow: "hidden",
                minHeight: "120px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ 
                position: "relative",
                zIndex: 2,
                fontSize: "36px",
                marginBottom: "12px",
                filter: isDrawn ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
              }}>{isDrawn ? card.emoji : "🃏"}</div>
              <div style={{ 
                position: "relative",
                zIndex: 2,
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "16px",
                fontWeight: 700,
                marginBottom: "8px",
                textAlign: "center",
              }}>{isDrawn ? card.title : "?"}</div>
              <div style={{ 
                position: "relative",
                zIndex: 2,
                fontSize: "13px",
                color: "#666",
                textAlign: "center",
                lineHeight: "1.4",
              }}>{isDrawn ? card.desc : "Sentuh untuk memilih"}</div>
{!isDrawn && (
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  right: "0",
                  bottom: "0",
                  background: card.archetype === 'trail' ? 'rgba(255,122,89,0.1)' : card.archetype === 'tech' ? 'rgba(91,140,255,0.1)' : card.archetype === 'create' ? 'rgba(255,90,168,0.1)' : 'rgba(176,107,255,0.1)',
                  opacity: 0,
                  transition: "opacity 0.3s",
                 }} >
              )}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "24px", textAlign: "center", fontSize: "16px", color: "#666", fontWeight: 600 }}>
        {drawn.length}/3 terpilih
      </div>

      {drawn.length === 3 && (
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
            Mimpi Terbuka! Sentuh untuk lanjut
          </div>
        </div>
      )}
    </div>
  );
}