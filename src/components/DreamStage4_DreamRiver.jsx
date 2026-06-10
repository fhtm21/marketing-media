import React, { useState, useCallback } from "react";

export default function DreamStage4_DreamRiver({ onInteraction, stage }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);

  const steps = [
    {
      question: "Sungai impian membelah dua. Mana yang kamu ikuti?",
      options: [
        { id: "innovation", emoji: "💡", name: "Jalan Inovasi", archetype: "create", desc: "Ide yang terang dan baru" },
        { id: "wisdom", emoji: "📚", name: "Jalan Kebijaksanaan", archetype: "strat", desc: "Pengetahuan yang dalam dan luas" },
        { id: "compassion", emoji: "🌿", name: "Jalan Kasih", archetype: "change", desc: "Perubahan yang membutuhkan dan membantu" },
        { id: "adventure", emoji: "🗺️", name: "Jalan Petualangan", archetype: "trail", desc: "Petualangan yang penuh dengan baru" },
      ],
    },
    {
      question: "Di jembatan, apa yang kamu lakukan?",
      options: [
        { id: "cross", emoji: "🌉", name: "Ciptakan jembatan", archetype: "design", desc: "Membangun sesuatu yang baru dan berguna" },
        { id: "negotiate", emoji: "🤝", name: "Negosiasi bersama", archetype: "tech", desc: "Bekerjasama untuk mencapai tujuan bersama" },
        { id: "fly", emoji: "🕊️", name: "Terbang melintasi", archetype: "create", desc: "Mencari jalan baru dan alternatives" },
        { id: "help", emoji: "🤲", name: "Bantu orang lain", archetype: "change", desc: "Membantu dan mendukung orang lain" },
      ],
    },
    {
      question: "Di danau, apa yang kamu lihat?",
      options: [
        { id: "reflection", emoji: "🪞", name: "Refleksi diri", archetype: "design", desc: "Melihat diri sendiri dengan jernih" },
        { id: "map", emoji: "🗺️", name: "Peta masa depan", archetype: "strat", desc: "Merencanakan langkah ke depan dengan jelas" },
        { id: "stars", emoji: "⭐", name: "Bintang-bintang", archetype: "trail", desc: "Mimpi dan harapan yang cerah di depan mata" },
        { id: "lotus", emoji: "🪷", name: "Bunga lotus", archetype: "change", desc: "Kehidupan yang baru dan suci dari kesulitan" },
      ],
    },
  ];

  const handleChoice = useCallback((opt) => {
    setSelected(opt);
    setTimeout(() => {
      onInteraction({
        type: "dreamRiver",
        stage,
        value: { path: opt.id, archetype: opt.archetype, step }
      });
      
      if (step < steps.length - 1) {
        setTimeout(() => {
          setStep(s => s + 1);
          setSelected(null);
        }, 400);
      }
    }, 300);
  }, [onInteraction, stage, step]);

  const q = steps[step];

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🌊</div>
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#a0379a",
          margin: "0 0 8px",
          textAlign: "center",
        }}>Journey Along the Dream River</h2>
        <p style={{ fontSize: "15px", color: "rgba(160, 55, 154, 0.7)", margin: 0, maxWidth: "300px", textAlign: "center" }}>
          Ikuti aliran sungai dan buat pilihan pada setiap persimpangan
        </p>
      </div>

      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center", gap: "8px" }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: i <= step ? "20px" : "8px",
            height: "8px",
            borderRadius: "4px",
            background: i <= step ? "#5b8cff" : "rgba(255,255,255,0.3)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>

      <h3 style={{
        fontFamily: "'Fredoka', sans-serif",
        fontSize: "18px",
        fontWeight: 700,
        textAlign: "center",
        marginBottom: "16px",
        color: "#a0379a",
      }}>🌊 {q.question}</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {q.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleChoice(opt)}
            disabled={selected}
            style={{
              background: selected?.id === opt.id 
                ? `linear-gradient(135deg, #fff5e6, #ffe24d)` 
                : "#fff",
              border: `2px solid ${selected?.id === opt.id ? "#ffb020" : "#e0e0e0"}`,
              borderRadius: "16px",
              padding: "20px",
              cursor: selected ? "default" : "pointer",
              textAlign: "center",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
               boxShadow: selected?.id === opt.id 
                 ? `0 8px 16px ${selected?.id === opt.id ? "#ffb02033" : "#e0e0e033"}`
                 : "0 4px 8px rgba(0,0,0,0.1)",
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
              fontSize: "28px",
              marginBottom: "8px",
            }}>{opt.emoji}</div>
            <div style={{ 
              position: "relative",
              zIndex: 2,
              fontFamily: "'Fredoka', sans-serif",
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "4px",
              textAlign: "center",
            }}>{opt.name}</div>
            <div style={{ 
              position: "relative",
              zIndex: 2,
              fontSize: "13px",
              color: "#666",
              textAlign: "center",
              lineHeight: "1.4",
            }}>{opt.desc}</div>
          </button>
        ))}
      </div>
      
      {selected && (
        <div style={{ marginTop: "24px", textAlign: "center" }}>
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
            Pilihan Ter konfirmasi! Sentuh untuk lanjut
          </div>
        </div>
      )}
    </div>
  );
}