import React, { useState, useCallback, useMemo } from "react";

export default function DreamStage3_ConstellationAim({ onInteraction, stage }) {
  const [selectedStars, setSelectedStars] = useState([]);
  const [completed, setCompleted] = useState(false);

  const patterns = useMemo(() => [
    { id: "trailblazer", emoji: "🌟", name: "Jejak Perintis", archetype: "trail", pattern: [[10, 20], [30, 15], [50, 25], [70, 10], [90, 20]] },
    { id: "builder", emoji: "⚡", name: "Kekuatan Teknik", archetype: "tech", pattern: [[20, 30], [40, 30], [40, 50], [60, 50], [80, 30]] },
    { id: "creator", emoji: "🎨", name: "Pelangi Kreativitas", archetype: "create", pattern: [[15, 40], [35, 20], [55, 40], [75, 20], [85, 40]] },
    { id: "harmony", emoji: "💎", name: "Keseimbangan", archetype: "design", pattern: [[20, 60], [40, 40], [60, 60], [80, 40]] },
    { id: "growth", emoji: "🌱", name: "Pertumbuhan", archetype: "change", pattern: [[30, 70], [50, 50], [50, 70], [70, 40]] },
    { id: "strategist", emoji: "🧭", name: "Strategi", archetype: "strat", pattern: [[15, 80], [45, 60], [75, 80], [45, 80]] },
  ], []);

  const stars = useMemo(() => {
    return patterns.flatMap((p, pi) => 
      p.pattern.map((pos, si) => ({
        id: `${pi}-${si}`,
        x: pos[0],
        y: pos[1],
        patternId: p.id,
        emoji: p.emoji,
      }))
    );
  }, [patterns]);

  const handleSelect = useCallback((star) => {
    if (completed) return;
    setSelectedStars(prev => {
      const newSelected = [...prev, star];
      if (newSelected.length >= 5) {
        setCompleted(true);
        setTimeout(() => onInteraction({
          type: "constellationAim",
          stage,
          value: { pattern: star.patternId, archetype: star.patternId, accuracy: 1 }
        }), 300);
      }
      return newSelected;
    });
  }, [completed, onInteraction, stage]);

  const activePattern = selectedStars[0]?.patternId;

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>⭐</div>
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#a0379a",
          margin: "0 0 8px",
          textAlign: "center",
        }}>Bentuk Konstelasi Mimpi</h2>
        <p style={{ fontSize: "15px", color: "rgba(160, 55, 154, 0.7)", margin: 0, maxWidth: "300px", textAlign: "center" }}>
          Hubungkan bintang-bintang untuk menemukan pola hidupmu
        </p>
      </div>

      <div style={{ position: "relative", height: "240px", marginBottom: "24px", background: "linear-gradient(180deg, #0c1445 0%, #1a237e 100%)", borderRadius: "20px", overflow: "hidden", position: "relative" }}>
        {/* Background stars */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          pointerEvents: "none",
        }}>
          {[...Array(30)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: "#fff",
              borderRadius: "50%",
              opacity: `${Math.random() * 0.5 + 0.2}`,
              animation: `twinkle ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
          ))}
        </div>

        {/* Constellation lines */}
        {!completed && selectedStars.length > 0 && (
          <svg style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            pointerEvents: "none",
          }}>
            {selectedStars.map((star, index) => {
              const nextStar = selectedStars[index + 1];
              if (!nextStar) return null;
              
              return (
                <line
                  key={index}
                  x1={`${star.x}%`}
                  y1={`${star.y}%`}
                  x2={`${nextStar.x}%`}
                  y2={`${nextStar.y}%`}
                  stroke="rgba(255,215,0,0.6)"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              );
            })}
          </svg>
        )}

        {/* Stars */}
        {stars.map((star) => {
          const isSelected = selectedStars.some(s => s.id === star.id);
          const isHovered = false; // We don't have hover state in this simplified version
          
          return (
            <button
              key={star.id}
              onClick={() => handleSelect(star)}
              disabled={completed}
              style={{
                position: "absolute",
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: "40px",
                height: "40px",
                background: isSelected 
                  ? "radial-gradient(circle, #fff5e6, #ffe24d)"
                  : "rgba(255,255,255,0.8)",
                border: isSelected 
                  ? "2px solid #FFD700"
                  : "2px solid rgba(255,255,255,0.5)",
                borderRadius: "50%",
                cursor: completed ? "default" : "pointer",
                transform: "translate(-50%, -50%) scale(1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isSelected 
                  ? "0 0 12px rgba(255,215,0,0.5)"
                  : "0 2px 6px rgba(0,0,0,0.1)",
                zIndex: 10,
              }}
            >
              {isSelected && (
                <div style={{ 
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#b8860b",
                  textShadow: "0 0 4px rgba(255,215,0,0.5)",
                }}>
                  {star.emoji}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {completed && activePattern && (
        <div style={{ 
          background: "linear-gradient(135deg, #fff5e6, #ffe24d)",
          borderRadius: "16px",
          padding: "20px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>
            {patterns.find(p => p.id === activePattern)?.emoji}
          </div>
          <h3 style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "18px",
            fontWeight: 800,
            margin: "0 0 6px",
            color: "#333",
          }}>
            {patterns.find(p => p.id === activePattern)?.name}
          </h3>
          <p style={{ fontSize: "14px", color: "#666", maxWidth: "280px", margin: "0 auto", lineHeight: "1.5" }}>
            {patterns.find(p => p.id === activePattern)?.name === "Jejak Perintis" ? 
              "Jalur zigzag yang berani dan penuh petualangan" : 
              patterns.find(p => p.id === activePattern)?.name === "Kekuatan Teknik" ?
                "Struktur yang kuat dan terorganisir dengan baik" :
                patterns.find(p => p.id === activePattern)?.name === "Pelangi Kreativitas" ?
                  "Aliran kreativitas yang bebas dan penuh warna" :
                patterns.find(p => p.id === activePattern)?.name === "Keseimbangan" ?
                  "Keharmonisan yang seimbang dan damai" :
                patterns.find(p => p.id === activePattern)?.name === "Pertumbuhan" ?
                  "Pertumbuhan yang bertahap namun pasti seperti tumbuhnya pohon" :
                "Pola strategi yang tajam dan teliti seperti peta yang terperinci"
            }
          </p>
        </div>
      )}
      
      {!completed && selectedStars.length > 0 && (
        <div style={{ marginTop: "16px", textAlign: "center", fontSize: "14px", color: "#666" }}>
          {selectedStars.length}/5 bintang terhubung
        </div>
      )}
      
      {completed && (
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
            Konstelasi Terbentuk! Sentuh untuk lanjut
          </div>
        </div>
      )}
    </div>
  );
}