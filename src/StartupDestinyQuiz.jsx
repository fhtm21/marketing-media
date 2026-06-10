import React, { useState, useCallback, useMemo } from "react";
import { calculateScores, getDominantArchetype } from "./utils/scoring";
import { generateDreamyResult, getStageTitle, getStageSubtitle } from "./utils/results";
import { ARCHETYPES } from "./utils/archetypes";

import DreamStage1_CardDraw from "./components/DreamStage1_CardDraw";
import DreamStage2_CloudReach from "./components/DreamStage2_CloudReach";
import DreamStage3_ConstellationAim from "./components/DreamStage3_ConstellationAim";
import DreamStage4_DreamRiver from "./components/DreamStage4_DreamRiver";
import DreamStage5_WishTree from "./components/DreamStage5_WishTree";
import DreamStage6_MoonMirror from "./components/DreamStage6_MoonMirror";
import DreamStage7_SunrisePath from "./components/DreamStage7_SunrisePath";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
`;

const TOTAL_STAGES = 7;

export default function StartupDestinyQuiz({ onBack }) {
  const [screen, setScreen] = useState("intro");
  const [currentStage, setCurrentStage] = useState(0);
  const [interactions, setInteractions] = useState([]);
  const [scores, setScores] = useState({
    trail: 0, tech: 0, create: 0, design: 0, change: 0, strat: 0
  });

  const result = useMemo(() => {
    if (screen !== "result") return null;
    const finalScores = calculateScores(interactions);
    const dominant = getDominantArchetype(finalScores);
    return generateDreamyResult(finalScores, dominant);
  }, [screen, interactions]);

  const handleInteraction = useCallback((interactionData) => {
    setInteractions(prev => [...prev, interactionData]);
    
    const newInteractions = [...interactions, interactionData];
    const newScores = calculateScores(newInteractions);
    setScores(newScores);
    
    setTimeout(() => {
      if (currentStage < TOTAL_STAGES - 1) {
        setCurrentStage(prev => prev + 1);
      } else {
        setScreen("result");
      }
    }, 1200);
  }, [currentStage, interactions]);

  const restart = useCallback(() => {
    setCurrentStage(0);
    setInteractions([]);
    setScores({ trail: 0, tech: 0, create: 0, design: 0, change: 0, strat: 0 });
    setScreen("intro");
  }, []);

  const stageTitle = getStageTitle(currentStage);
  const stageSubtitle = getStageSubtitle(currentStage);

  const stageComponents = {
    0: DreamStage1_CardDraw,
    1: DreamStage2_CloudReach,
    2: DreamStage3_ConstellationAim,
    3: DreamStage4_DreamRiver,
    4: DreamStage5_WishTree,
    5: DreamStage6_MoonMirror,
    6: DreamStage7_SunrisePath,
  };

  const StageComponent = stageComponents[currentStage];

  return (
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden",
      fontFamily: "'Nunito', sans-serif", color: "#fff",
      background: "linear-gradient(135deg, #ff6fb5 0%, #a06bff 50%, #5b8cff 100%)",
      backgroundSize: "200% 200%", animation: "flow 14s ease infinite",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 18px", boxSizing: "border-box",
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes flow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes floaty { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-14px) rotate(6deg)} }
        @keyframes rise { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        @keyframes twinkle { 0%,100% {opacity:.2; transform:scale(1)} 50% {opacity:.8; transform:scale(1.3)} }
        @keyframes pulse { 0%,100%{opacity:.8; transform:scale(1)} 50%{opacity:1; transform:scale(1.05)} }
      `}</style>

      {/* Floating dreamy elements */}
      <div style={{ position:"absolute", top:"8%", left:"8%", fontSize:30, opacity:.5, animation:"floaty 6s ease-in-out infinite" }}>✨</div>
      <div style={{ position:"absolute", top:"14%", right:"10%", fontSize:34, opacity:.55, animation:"floaty 7s ease-in-out infinite" }}>🌙</div>
      <div style={{ position:"absolute", bottom:"10%", left:"12%", fontSize:26, opacity:.5, animation:"floaty 8s ease-in-out infinite" }}>💫</div>
      <div style={{ position:"absolute", bottom:"18%", right:"15%", fontSize:28, opacity:.45, animation:"floaty 7.5s ease-in-out infinite" }}>⭐</div>

      {/* INTRO SCREEN */}
      {screen === "intro" && (
        <div style={{
          position: "relative", zIndex: 2, textAlign: "center",
          maxWidth: 480, width: "100%", animation: "rise .6s ease both",
        }}>
          <div style={{ fontSize: 64, animation: "floaty 5s ease-in-out infinite", marginBottom: 16 }}>
            💫
          </div>
          <h1 style={{
            fontFamily: "'Fredoka', sans-serif", fontSize: 42, fontWeight: 700,
            letterSpacing: 1, margin: "6px 0 8px",
            textShadow: "0 4px 24px rgba(160,107,255,.4)",
          }}>
            Startup Destiny
          </h1>
          <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: .9, margin: 0, fontWeight: 700 }}>
            Digital Business Innovation • BINUS @ Bekasi
          </p>
          <div style={{ height: 2, width: 100, margin: "20px auto", background: "rgba(255,255,255,.6)", borderRadius: 2 }} />
          <p style={{ fontSize: 16, lineHeight: 1.7, fontWeight: 600, maxWidth: 400, margin: "0 auto 8px" }}>
            Setiap founder hebat punya tipe-nya sendiri. 🌟<br />
            Jawab 7 misi mimpi, dan temukan <b>tipe founder</b> yang ada di dalam dirimu!
          </p>
          <p style={{ fontSize: 13, opacity: .9, margin: "10px 0 24px", fontWeight: 600 }}>
            Selesai? Foto hasilmu & tukar dengan <b>PIN founder</b>-mu! 🎴
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            {onBack && (
              <button onClick={onBack} style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16, color: "#fff",
                background: "rgba(255,255,255,.18)", border: "1.5px solid rgba(255,255,255,.5)",
                padding: "15px 24px", borderRadius: 40, cursor: "pointer", transition: "all .25s",
              }}>
                ← Pilih Game Lain
              </button>
            )}
            <button onClick={() => setScreen("game")} style={{
              fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 18, color: "#a0379a",
              background: "#ffe24d", border: "none",
              padding: "15px 42px", borderRadius: 40, cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,.18)", transition: "all .25s",
            }}>
              Mulai Petualangan 🚀
            </button>
          </div>
        </div>
      )}

      {/* GAME SCREEN */}
      {screen === "game" && (
        <div style={{
          position: "relative", zIndex: 2, textAlign: "center",
          maxWidth: 600, width: "100%", animation: "rise .5s ease both",
        }}>
          {/* Progress indicator */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 14 }}>
            {Array.from({ length: TOTAL_STAGES }).map((_, i) => (
              <div key={i} style={{
                width: i <= currentStage ? 24 : 8,
                height: 8,
                borderRadius: 8,
                background: i <= currentStage ? "#ffe24d" : "rgba(255,255,255,.4)",
                transition: "all .3s",
              }} />
            ))}
          </div>

          {/* Stage info */}
          <div style={{
            fontSize: 11, letterSpacing: 2, opacity: .9, margin: "0 0 4px",
            textTransform: "uppercase", fontWeight: 700,
          }}>
            Chapter {currentStage + 1} of {TOTAL_STAGES}
          </div>
          <div style={{
            fontFamily: "'Fredoka', sans-serif", fontSize: 15,
            fontWeight: 600, opacity: .95, margin: "0 0 6px",
          }}>
            {stageTitle} ✨
          </div>
          <div style={{
            fontSize: 12, opacity: .85, margin: "0 0 24px", fontStyle: "italic",
          }}>
            {stageSubtitle}
          </div>

          {/* Stage component container */}
          <div style={{
            background: "rgba(255,255,255,.9)", border: "1px solid rgba(255,255,255,.4)",
            borderRadius: 24, padding: "28px 20px", boxShadow: "0 8px 40px rgba(0,0,0,.12)",
            backdropFilter: "blur(10px)",
          }}>
            {StageComponent && (
              <StageComponent 
                onInteraction={handleInteraction}
                stage={currentStage}
              />
            )}
          </div>
        </div>
      )}

      {/* RESULT SCREEN */}
      {screen === "result" && result && (
        <div style={{
          position: "relative", zIndex: 2, textAlign: "center",
          width: "100%", animation: "rise .6s ease both",
          maxHeight: "100vh", height: "100vh", overflowY: "auto",
          padding: "16px 12px",
          boxSizing: "border-box",
        }}>
          <div style={{
            maxWidth: 420, margin: "0 auto",
            background: "rgba(255,255,255,.96)",
            borderRadius: 24, padding: "24px 18px",
            boxShadow: "0 8px 40px rgba(0,0,0,.18)",
          }}>
            <div style={{
              fontSize: 12, letterSpacing: 2.5, opacity: .95, textTransform: "uppercase",
              margin: "0 0 14px", fontWeight: 700, color: "#a0379a",
            }}>
              ✨ Tipe Founder Kamu Adalah ✨
            </div>

            {/* Badge */}
            <div style={{
              position: "relative", display: "inline-block", margin: "2px 0 16px",
              animation: "pop .55s ease both",
            }}>
              <div style={{
                position: "absolute", inset: -20, borderRadius: "50%",
                background: `radial-gradient(circle,${result.glow}33,transparent 62%)`,
                animation: "floaty 8s ease-in-out infinite",
              }} />
              <div style={{
                position: "relative", width: 130, height: 130, borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%,#fff,#e8f0ff)",
                border: `3px solid ${result.glow}`,
                boxShadow: `0 0 34px ${result.glow}50, inset 0 0 18px ${result.glow}18`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto",
              }}>
                <div style={{ fontSize: 44, lineHeight: 1 }}>{result.emoji}</div>
              </div>
            </div>

            <h2 style={{
              fontFamily: "'Fredoka', sans-serif", fontSize: 26, fontWeight: 700,
              margin: "0 0 4px", textShadow: `0 3px 16px ${result.glow}44`,
              color: result.glow,
            }}>
              {result.name}
            </h2>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 800,
              color: result.glow, background: "#fff", borderRadius: 30,
              padding: "4px 14px", margin: "6px 0 10px",
            }}>
              {result.type}
            </div>

            {/* Dreamy fortune card */}
            <div style={{
              background: "#fff", border: "1px solid rgba(255,255,255,.85)",
              borderRadius: 18, padding: "18px 16px", marginBottom: 18,
              boxShadow: "0 2px 12px rgba(0,0,0,.06)",
            }}>
              <div style={{
                fontFamily: "'Fredoka', sans-serif", fontSize: 12,
                color: "#a0379a", marginBottom: 8, fontWeight: 700,
                letterSpacing: 1,
              }}>
                🔮 Ramalan Bintang Founder-Mu
              </div>
              <p style={{
                fontSize: 14, lineHeight: 1.6, margin: 0, fontWeight: 600,
                color: "#4a3a6a", fontStyle: "italic",
              }}>
                "{result.dreamyReading}"
              </p>
            </div>

            {/* Power */}
            <div style={{
              fontSize: 12, fontWeight: 700, margin: "0 0 14px", color: "#fff",
              background: "rgba(0,0,0,.15)", display: "inline-block",
              padding: "7px 18px", borderRadius: 20,
            }}>
              ⚡ Kekuatan: {result.power}
            </div>

            {/* Courses */}
            <div style={{ margin: "14px 0" }}>
              <div style={{
                fontSize: 10, letterSpacing: 2, opacity: .9, textTransform: "uppercase",
                margin: "0 0 8px", fontWeight: 700,
              }}>
                Mata Kuliah yang Menantimu
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {result.courses.map((c, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 20,
                    background: `${result.glow}22`, border: `1px solid ${result.glow}55`,
                    color: "#fff",
                  }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Career */}
            <div style={{ margin: "14px 0 16px" }}>
              <div style={{
                fontSize: 10, letterSpacing: 2, opacity: .9, textTransform: "uppercase",
                margin: "0 0 5px", fontWeight: 700,
              }}>
                Jalur Kariermu
              </div>
              <p style={{ fontSize: 13, fontWeight: 800, margin: 0, lineHeight: 1.5 }}>
                {result.prospek}
              </p>
            </div>

            {/* PIN exchange */}
            <div style={{
              fontSize: 13, fontWeight: 700, background: "#ffe24d", color: "#a0379a",
              borderRadius: 16, padding: "12px 14px", marginBottom: 18,
            }}>
              🎴 Foto hasilmu untuk story, lalu tunjukkan ke kakak booth<br />
              buat tukar <b>PIN {result.type}</b>-mu! ✨
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={restart} style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff",
                background: "rgba(255,255,255,.18)", border: "1.5px solid rgba(255,255,255,.5)",
                padding: "11px 26px", borderRadius: 40, cursor: "pointer",
              }}>
                🔄 Cek Tipe Founder Teman
              </button>
              {onBack && (
                <button onClick={onBack} style={{
                  fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14, color: "#fff",
                  background: "rgba(255,255,255,.18)", border: "1.5px solid rgba(255,255,255,.5)",
                  padding: "11px 26px", borderRadius: 40, cursor: "pointer",
                }}>
                  ← Kembali ke Hub
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
