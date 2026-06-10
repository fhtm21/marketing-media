import React, { useState, useMemo, useEffect, useCallback } from "react";
import DreamStage1_CardDraw from "./components/DreamStage1_CardDraw";
import DreamStage2_CloudReach from "./components/DreamStage2_CloudReach";
import DreamStage3_ConstellationAim from "./components/DreamStage3_ConstellationAim";
import DreamStage4_DreamRiver from "./components/DreamStage4_DreamRiver";
import DreamStage5_WishTree from "./components/DreamStage5_WishTree";
import DreamStage6_MoonMirror from "./components/DreamStage6_MoonMirror";
import DreamStage7_SunrisePath from "./components/DreamStage7_SunrisePath";
import { calculateScores, getDominantArchetype } from "./utils/scoring";
import { generateDreamyResult, getStageTitle, getStageSubtitle } from "./utils/results";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=Playfair+Display:wght@700;800;900&display=swap');
`;

const DREAM_GRADIENTS = [
  "linear-gradient(135deg, #ff6fb5 0%, #a06bff 50%, #5b8cff 100%)",
  "linear-gradient(135deg, #87CEEB 0%, #E0F6FF 50%, #FFF5E6 100%)",
  "linear-gradient(135deg, #0c1445 0%, #1a237e 50%, #283593 100%)",
  "linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%)",
  "linear-gradient(135deg, #228B22 0%, #006400 50%, #0d1117 100%)",
  "linear-gradient(135deg, #1a1a2e 0%, #0f0c29 100%)",
  "linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)",
];

const STAR_COUNT = 80;

const createParticles = () => Array.from({ length: STAR_COUNT }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  opacity: Math.random() * 0.7 + 0.3,
  animationDuration: Math.random() * 3 + 2,
  animationDelay: Math.random() * 2,
}));

export default function StartupDestinyRPG({ onBack }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [interactions, setInteractions] = useState([]);
  const [particles] = useState(createParticles);
  const [stageTransition, setStageTransition] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleInteraction = useCallback((interaction) => {
    setInteractions(prev => [...prev, interaction]);
    setStageTransition(true);
    setTimeout(() => {
      if (currentStage < 6) {
        setCurrentStage(prev => prev + 1);
      } else {
        setCurrentStage(7);
      }
      setStageTransition(false);
    }, 500);
  }, [currentStage]);

  const scores = useMemo(() => calculateScores(interactions), [interactions]);
  const dominantArchetype = useMemo(() => getDominantArchetype(scores), [scores]);
  const result = useMemo(() => generateDreamyResult(scores, dominantArchetype), [scores, dominantArchetype]);

  const resetGame = () => {
    setCurrentStage(0);
    setInteractions([]);
    setShowIntro(false);
  };

  const handleStart = () => {
    setShowIntro(false);
  };

  const renderStage = () => {
    if (showIntro) return null;
    
    switch (currentStage) {
      case 0:
        return <DreamStage1_CardDraw onInteraction={handleInteraction} stage={currentStage} />;
      case 1:
        return <DreamStage2_CloudReach onInteraction={handleInteraction} stage={currentStage} />;
      case 2:
        return <DreamStage3_ConstellationAim onInteraction={handleInteraction} stage={currentStage} />;
      case 3:
        return <DreamStage4_DreamRiver onInteraction={handleInteraction} stage={currentStage} />;
      case 4:
        return <DreamStage5_WishTree onInteraction={handleInteraction} stage={currentStage} />;
      case 5:
        return <DreamStage6_MoonMirror onInteraction={handleInteraction} stage={currentStage} />;
      case 6:
        return <DreamStage7_SunrisePath onInteraction={handleInteraction} stage={currentStage} />;
      case 7:
        return <ResultScreen result={result} onRestart={resetGame} onBack={onBack} />;
      default:
        return null;
    }
  };

  if (showIntro) {
    return <IntroScreen onStart={handleStart} onBack={onBack} />;
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
      color: "#fff",
      background: DREAM_GRADIENTS[currentStage] || DREAM_GRADIENTS[0],
      backgroundSize: "300% 300%",
      animation: "dreamFlow 20s ease infinite",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes dreamFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes floatDream {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px var(--glow-color); }
          50% { box-shadow: 0 0 40px 10px var(--glow-color); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .stage-enter {
          animation: slideIn 0.5s ease-out;
        }
        .dream-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dream-card:hover {
          transform: translateY(-5px) scale(1.02);
        }
      `}</style>

      {/* Dynamic particle background */}
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "#fff",
            opacity: p.opacity,
            animation: `starTwinkle ${p.animationDuration}s ease-in-out ${p.animationDelay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Floating decorative elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        fontSize: "48px",
        opacity: 0.3,
        animation: "floatDream 8s ease-in-out infinite",
        pointerEvents: "none",
      }}>✨</div>
      <div style={{
        position: "absolute",
        top: "15%",
        right: "8%",
        fontSize: "52px",
        opacity: 0.25,
        animation: "floatDream 7s ease-in-out infinite",
        pointerEvents: "none",
      }}>🚀</div>
      <div style={{
        position: "absolute",
        bottom: "15%",
        left: "7%",
        fontSize: "40px",
        opacity: 0.2,
        animation: "floatDream 9s ease-in-out infinite",
        pointerEvents: "none",
      }}>💡</div>
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "10%",
        fontSize: "36px",
        opacity: 0.25,
        animation: "floatDream 6s ease-in-out infinite",
        pointerEvents: "none",
      }}>🌟</div>

      {/* Header with stage info */}
      <div style={{
        position: "fixed",
        top: "20px",
        left: 0,
        right: 0,
        textAlign: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}>
        <div style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "18px",
          fontWeight: 800,
          color: "#fff",
          textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          marginBottom: "4px",
          letterSpacing: "1px",
        }}>
          {getStageTitle(currentStage)}
        </div>
        <div style={{
          fontSize: "14px",
          color: "rgba(255,255,255,0.85)",
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}>
          {getStageSubtitle(currentStage)}
        </div>
      </div>

      {/* Progress indicator */}
      <div style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: "12px",
        zIndex: 100,
        pointerEvents: "none",
      }}>
        {[0, 1, 2, 3, 4, 5, 6].map((stageIndex) => {
          const isActive = stageIndex === currentStage;
          const isCompleted = stageIndex < currentStage;
          const stageInfo = [
            { emoji: "🌟", color: "#ffecd2" },
            { emoji: "☁️", color: "#87CEEB" },
            { emoji: "⭐", color: "#FFD700" },
            { emoji: "🌊", color: "#5b8cff" },
            { emoji: "🌳", color: "#2ecc8f" },
            { emoji: "🪞", color: "#ffb020" },
            { emoji: "🌅", color: "#ff7a59" },
          ];
          const info = stageInfo[stageIndex];
          
          return (
            <div
              key={stageIndex}
              style={{
                width: isActive ? "40px" : "12px",
                height: "12px",
                borderRadius: "6px",
                background: isActive
                  ? info.color
                  : isCompleted
                    ? "#fff"
                    : "rgba(255,255,255,0.3)",
                transition: "all 0.4s cubic-bezier(0.3, 0, 0.2, 1)",
                boxShadow: isActive ? `0 0 20px ${info.color}` : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {isActive && (
                <span style={{
                  fontSize: "16px",
                  animation: "floatDream 3s ease-in-out infinite",
                }}>{info.emoji}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Main content container */}
      <div style={{
        width: "100%",
        maxWidth: "520px",
        zIndex: 2,
        opacity: stageTransition ? 0.7 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.12)",
          borderRadius: "24px",
          padding: "32px 28px",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          pointerEvents: "auto",
        }}>
          {renderStage()}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 100,
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          color: "#fff",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "10px 20px",
          borderRadius: "30px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          backdropFilter: "blur(10px)",
        }}
      >
        ← Kembali
      </button>
    </div>
  );
}

// Intro Screen Component
function IntroScreen({ onStart, onBack }) {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
      color: "#fff",
      background: "linear-gradient(135deg, #ff6fb5 0%, #a06bff 50%, #5b8cff 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes introFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatIntro {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      {/* Background particles */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${(i * 137.508) % 100}%`,
            top: `${(i * 97.312) % 100}%`,
            width: i % 7 === 0 ? "4px" : "2px",
            height: i % 7 === 0 ? "4px" : "2px",
            borderRadius: "50%",
            background: "#fff",
            opacity: 0.2 + (i % 5) * 0.1,
            animation: `starTwinkle ${2 + (i % 4)}s ease-in-out ${(i % 3) * 0.7}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div style={{
        textAlign: "center",
        animation: "introFade 1s ease-out",
        maxWidth: "400px",
      }}>
        {/* Logo/Emoji */}
        <div style={{
          fontSize: "80px",
          marginBottom: "20px",
          animation: "floatIntro 6s ease-in-out infinite",
        }}>🦄</div>

        {/* Title */}
        <h1 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "48px",
          fontWeight: 800,
          margin: "0 0 10px",
          letterSpacing: "2px",
          textShadow: "0 4px 20px rgba(0,0,0,0.2)",
          background: "linear-gradient(90deg, #ffe24d, #ff6fb5, #a06bff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Startup Destiny
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "16px",
          fontWeight: 700,
          opacity: 0.9,
          margin: "0 0 30px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}>
          Digital Business Innovation · Binus @Bekasi
        </p>

        {/* Description */}
        <div style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "30px",
          backdropFilter: "blur(10px)",
        }}>
          <p style={{
            fontSize: "15px",
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 600,
          }}>
            Setiap founder hebat punya tipe-nya sendiri. 🌟<br />
            Jawab 7 petualangan impian, dan temukan <b>tipe founder</b> yang ada di dalam dirimu!
          </p>
        </div>

        {/* Rewards info */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          marginBottom: "30px",
          fontSize: "14px",
          fontWeight: 700,
          opacity: 0.9,
        }}>
          <span>📸</span>
          <span>Foto hasilmu & tukar PIN founder-mu!</span>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={onBack} style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700,
            fontSize: "15px",
            color: "rgba(255,255,255,0.8)",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "12px 24px",
            borderRadius: "30px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
            Kembali
          </button>
          <button onClick={onStart} style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 800,
            fontSize: "16px",
            color: "#a0379a",
            background: "#ffe24d",
            border: "none",
            padding: "12px 32px",
            borderRadius: "30px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          }}>
            Mulai Petualangan 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

// Result Screen Component (Enhanced)
function ResultScreen({ result, onRestart, onBack }) {
  return (
    <div style={{
      animation: "scaleIn 0.5s ease-out",
      textAlign: "center",
    }}>
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes rotateGem {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "18px",
          fontWeight: 800,
          color: "#a0379a",
          marginBottom: "8px",
          letterSpacing: "2px",
        }}>
          ✦ Hasil Impianmu ✦
        </div>
        <div style={{
          fontSize: "13px",
          color: "rgba(255,255,255,0.7)",
          fontWeight: 600,
          letterSpacing: "1px",
        }}>
          Digital Business Innovation · Binus @Bekasi
        </div>
      </div>

      {/* Main Result Card */}
      <div style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: "20px",
        padding: "28px 24px",
        marginBottom: "24px",
        color: "#333",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        {/* Decorative gem */}
        <div style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          width: "120px",
          height: "120px",
          background: `radial-gradient(circle, ${result.glow}44, transparent)`,
          borderRadius: "50%",
          filter: "blur(10px)",
        }} />

        {/* Archetype emoji with glow */}
        <div style={{
          fontSize: "72px",
          marginBottom: "12px",
          filter: `drop-shadow(0 0 20px ${result.glow})`,
        }}>{result.emoji}</div>

        {/* Archetype name */}
        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: "28px",
          fontWeight: 800,
          margin: "0 0 6px",
          color: "#1a1a2e",
          letterSpacing: "0.5px",
        }}>{result.name}</h2>

        {/* Type badge */}
        <div style={{
          display: "inline-block",
          fontSize: "15px",
          fontWeight: 800,
          color: result.glow,
          background: "rgba(0,0,0,0.08)",
          borderRadius: "30px",
          padding: "6px 16px",
          marginBottom: "12px",
          border: `1px solid ${result.glow}4`,
        }}>{result.type}</div>

        {/* Power description */}
        <p style={{
          fontSize: "14px",
          lineHeight: 1.5,
          color: "#555",
          margin: "0 0 16px",
          fontWeight: 700,
        }}>
          ⚡ Kekuatan utama: {result.power}
        </p>

        {/* Dreamy reading */}
        <div style={{
          background: "rgba(255,255,255,0.5)",
          borderRadius: "14px",
          padding: "18px",
          marginBottom: "16px",
        }}>
          <p style={{
            fontSize: "14px",
            lineHeight: 1.7,
            margin: 0,
            color: "#333",
            fontWeight: 600,
            whiteSpace: "pre-line",
          }}>
            {result.dreamyReading}
          </p>
        </div>

        {/* Courses */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{
            fontSize: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#666",
            margin: "0 0 8px",
            fontWeight: 700,
          }}>Mata kuliah yang menantimu</p>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            justifyContent: "center",
          }}>
            {result.courses.map((course, i) => (
              <span key={i} style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "6px 12px",
                borderRadius: "20px",
                background: "rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.1)",
                color: "#333",
              }}>{course}</span>
            ))}
          </div>
        </div>

        {/* Career path */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{
            fontSize: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#666",
            margin: "0 0 6px",
            fontWeight: 700,
          }}>Jalur kariermu</p>
          <p style={{
            fontSize: "15px",
            fontWeight: 800,
            margin: 0,
            color: "#1a1a2e",
            lineHeight: 1.4,
          }}>{result.prospek}</p>
        </div>

        {/* PIN reward */}
        <div style={{
          fontSize: "14px",
          lineHeight: 1.5,
          fontWeight: 700,
          background: "#ffe24d",
          color: "#a0379a",
          borderRadius: "14px",
          padding: "14px 18px",
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}>
          <span>📸</span>
          <span>Foto hasilmu untuk story, lalu tunjukkan ke kakak booth buat tukar <b>PIN {result.key.toUpperCase()}</b>-mu! 🎁</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button onClick={onBack} style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 700,
          fontSize: "15px",
          color: "rgba(255,255,255,0.8)",
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "12px 24px",
          borderRadius: "30px",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}>
          ← Kembali
        </button>
        <button onClick={onRestart} style={{
          fontFamily: "'Fredoka', sans-serif",
          fontWeight: 800,
          fontSize: "15px",
          color: "#a0379a",
          background: "#ffe24d",
          border: "none",
          padding: "12px 28px",
          borderRadius: "30px",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
        }}>
          🔄 Cek Teman
        </button>
      </div>
    </div>
  );
}