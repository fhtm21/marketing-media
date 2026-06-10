import React, { useState, useCallback } from "react";

export default function DreamStage5_WishTree({ onInteraction, stage }) {
  const [selected, setSelected] = useState(null);

  const categories = [
    { id: "success", emoji: "🏆", name: "Kejayaan", archetype: "trail", desc: "Meraih pencapaian dan prestasi" },
    { id: "love", emoji: "💖", name: "Koneksi", archetype: "design", desc: "Membangun hubungan yang profond dan bermakna" },
    { id: "adventure", emoji: "🌍", name: "Petualangan", archetype: "create", desc: "Menjelajahi hal-hal baru dan tidak terduga" },
    { id: "wisdom", emoji: "📖", name: "Pengetahuan", archetype: "strat", desc: "Mendalami ilmu dan pengetahuan yang berguna" },
    { id: "healing", emoji: "🌱", name: "Kesehatan", archetype: "change", desc: "Menyembuhkan dan memperbaiki kondisi baik fisik maupun mental" },
    { id: "innovation", emoji: "💡", name: "Inovasi", archetype: "create", desc: "Menciptakan sesuatu yang baru dan berbeda" },
  ];

  const hangWish = useCallback((cat) => {
    if (selected) return;
    setSelected(cat);
    setTimeout(() => {
      onInteraction({
        type: "wishTree",
        stage,
        value: { category: cat.id, archetype: cat.archetype, depth: 0.8 }
      });
      setSelected(null);
    }, 300);
  }, [onInteraction, stage, selected]);

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌳</div>
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#a0379a",
          margin: "0 0 8px",
          textAlign: "center",
        }}>Gantungkan Harapan di Pohon Kehidupan</h2>
        <p style={{ fontSize: "15px", color: "rgba(160, 55, 154, 0.7)", margin: 0, maxWidth: "300px", textAlign: "center" }}>
          Pilih satu harapan yang dalam dan tembus untuk Anda
        </p>
      </div>

      <div style={{ position: "relative", height: "240px", marginBottom: "24px" }}>
        {/* Tree trunk */}
        <div style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "24px",
          height: "100px",
          background: "linear-gradient(180deg, #8B4513 0%, #654321 50%, #8B4513 100%)",
          borderRadius: "12px 12px 4px 4px",
          zIndex: 2,
        }} />

        {/* Tree canopy */}
        <div style={{
          position: "absolute",
          bottom: "80px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "160px",
          height: "120px",
          background: "radial-gradient(circle at 30% 30%, #228B22, #006400)",
          borderRadius: "50%",
          boxShadow: "0 8px 24px rgba(0,100,0,0.2)",
          zIndex: 1,
        }} />

        {/* Glow effect */}
        <div style={{
          position: "absolute",
          bottom: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "140px",
          height: "100px",
          background: "radial-gradient(circle, rgba(255,215,0,0.2), transparent)",
          borderRadius: "50%",
          zIndex: 0,
        }} />

        {/* Wish positions around the tree */}
        {categories.map((cat, i) => {
          const angle = (i / categories.length) * Math.PI * 1.8 - Math.PI / 2;
          const radius = 80;
          const x = 50 + Math.cos(angle) * (radius / 100) * 100;
          const y = 50 + Math.sin(angle) * (radius / 100) * 100 - 20; // Adjust for tree position
          
          return (
            <button
              key={cat.id}
              onClick={() => hangWish(cat)}
              disabled={selected}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: "50px",
                height: "60px",
                background: selected?.id === cat.id 
                  ? `linear-gradient(135deg, #fff5e6, #ffe24d)` 
                  : "rgba(255,255,255,0.9)",
                border: `2px solid ${selected?.id === cat.id ? "#ff7a59" : "#e0e0e0"}`,
                borderRadius: "12px",
                padding: "8px",
                cursor: selected ? "default" : "pointer",
                textAlign: "center",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: selected?.id === cat.id 
                  ? `0 0 12px ${selected?.id === cat.id ? "#ff7a59" : "#e0e0e0"}33`
                  : "0 2px 6px rgba(0,0,0,0.1)",
                zIndex: 3,
              }}
            >
              <div style={{ 
                fontSize: "20px",
                marginBottom: "4px",
              }}>{cat.emoji}</div>
              <div style={{ 
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                textAlign: "center",
              }}>{cat.name}</div>
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
            Terpilih: {selected.emoji} {selected.name}! Sentuh untuk lanjut
          </div>
        </div>
      )}
    </div>
  );
}