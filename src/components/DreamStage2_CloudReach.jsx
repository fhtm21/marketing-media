import React, { useState, useCallback, useRef, useEffect } from 'react';

export default function DreamStage2_CloudReach({ onInteraction, stage }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [result, setResult] = useState(null);
  const intervalRef = useRef(null);

  const islands = [
    { height: 25, emoji: "🌈", label: "Pelangi Awan", archetype: "design" },
    { height: 50, emoji: "⛰️", label: "Puncak Aspirasi", archetype: "strat" },
    { height: 75, emoji: "🚪", label: "Pintu Langit", archetype: "trail" },
    { height: 100, emoji: "⭐", label: "Bintang Impian", archetype: "create" },
  ];

  const startHold = useCallback(() => {
    if (isHolding || result) return;
    setIsHolding(true);
    const start = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const newProgress = Math.min(100, (elapsed / 2000) * 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(intervalRef.current);
        setIsHolding(false);
        const selected = islands.reduce((prev, curr) => 
          newProgress >= curr.height ? curr : prev
        );
        setResult(selected);
      }
    }, 16);
  }, [isHolding, result]);

  const stopHold = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsHolding(false);
    setProgress(0);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (result) {
      onInteraction({
        type: "cloudReach",
        stage,
        value: { height: result.height, archetype: result.archetype, speed: Math.min(1, progress / 100) }
      });
    }
  }, [result, onInteraction, stage]);

  return (
    <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto", minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🦘</div>
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "22px",
          fontWeight: 800,
          color: "#a0379a",
          margin: "0 0 8px",
          textAlign: "center",
        }}>Tahan untuk Melompat Tinggi</h2>
        <p style={{ fontSize: "15px", color: "rgba(160, 55, 154, 0.7)", margin: 0, maxWidth: "300px", textAlign: "center" }}>
          Semakin lama ditahan, semakin tinggi dan jauh jangkauanmu
        </p>
      </div>

      <div style={{ position: "relative", height: "220px", marginBottom: "24px", position: "relative" }}>
        {/* Sky gradient */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(180deg, #87CEEB 0%, #E0F6FF 60%, #FFF5E6 100%)",
          borderRadius: "20px",
          overflow: "hidden",
        }} />

        {/* Floating clouds */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          pointerEvents: "none",
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${-10 + i * 20}%`,
              top: `${20 + i * 15}%`,
              width: `${80 + i * 30}px`,
              height: `${30 + i * 10}px`,
              background: "rgba(255,255,255,0.6)",
              borderRadius: "50%",
              animation: `floatCloud ${12 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          ))}
        </div>

        {/* Stars */}
        <div style={{
          position: "absolute",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          pointerEvents: "none",
        }}>
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              width: "2px",
              height: "2px",
              background: "#fff",
              borderRadius: "50%",
              opacity: 0.6,
              animation: `twinkle ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          ))}
        </div>

        {/* Islands */}
        {islands.map((island, i) => (
          <div key={i} style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            top: `${Math.max(10, Math.min(85, island.height))}%`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: progress >= island.height - 15 ? 1 : 0.4,
            transition: "opacity 0.4s",
            pointerEvents: "none",
          }}>
            <div style={{
              background: "rgba(255,255,255,0.9)",
              borderRadius: "16px",
              padding: "12px 16px",
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
            }}>
              <div style={{ fontSize: "28px", marginBottom: "4px" }}>{island.emoji}</div>
              <div style={{ fontFamily: "'Fredoka', sans-serif", fontSize: "13px", fontWeight: 700, color: "#333" }}>
                {island.label}
              </div>
              <div style={{ fontSize: "11px", color: "#666", fontStyle: "italic" }}>{island.label === "Pelangi Awan" ? "Keindahan dan detail" : 
                island.label === "Puncak Aspirasi" ? "Strategi dan perencanaan" : 
                island.label === "Pintu Langit" ? "Keberanian berpetualang" : 
                "Kreativitas tanpa batas"}</div>
            </div>
          </div>
        ))}

        {/* Kangaroo with bounce animation */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: `${Math.max(5, Math.min(80, 15 + progress * 0.65))}%`,
          transform: "translateX(-50%)",
          fontSize: "36px",
          transition: "bottom 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 10,
          animation: isHolding ? "bounce 1.5s infinite" : "none",
        }}>
          🦘
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div style={{
          height: "12px",
          background: "rgba(255,255,255,0.3)",
          borderRadius: "6px",
          overflow: "hidden",
          marginBottom: "8px",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #667eea, #764ba2)",
            transition: "width 0.1s linear",
            borderRadius: "6px",
            boxShadow: "0 0 8px rgba(102,126,234,0.3)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(160, 55, 154, 0.7) }}>
          <span>Dasar</span>
          <span>{progress >= 100 ? "Puncak!" : `${Math.round(progress)}%`}</span>
        </div>
      </div>

      <button
        onMouseDown={startHold}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={startHold}
        onTouchEnd={stopHold}
        disabled={result}
        style={{
          width: "100%",
          padding: "18px",
          background: result 
            ? "linear-gradient(135deg, #667eea, #764ba2)"
            : "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          fontSize: "16px",
          fontWeight: 700,
          fontFamily: "'Fredoka', sans-serif",
          cursor: result ? "default" : "pointer",
          transition: "all 0.2s",
          boxShadow: "0 6px 16px rgba(102,126,234,0.4)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {result ? 
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>{result.emoji}</span>
            <span>Sampai di {result.label}!</span>
          </div>
        : isHolding ? 
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🚀</span>
            <span style={{ fontSize: "14px" }}>Meliombot...</span>
          </div>
        : 
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>👇</span>
            <span style={{ fontSize: "14px" }}>Tahan & Lepas</span>
          </div>
        }
      </button>

      {result && (
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
            Sentuh untuk lanjut ke mimpi berikutnya
          </div>
        </div>
      )}
    </div>
  );
}