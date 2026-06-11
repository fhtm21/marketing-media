import React, { useState, useMemo, useEffect, useRef } from "react";
import { initScores, addScore, getResult } from "./utils/scoring";

import DreamIntro              from "./components/DreamIntro";
import DreamResult             from "./components/DreamResult";
import DreamStage1_CardDraw    from "./components/DreamStage1_CardDraw";
import DreamStage2_CloudReach  from "./components/DreamStage2_CloudReach";
import DreamStage3_ConstellationAim from "./components/DreamStage3_ConstellationAim";
import DreamStage4_DreamRiver  from "./components/DreamStage4_DreamRiver";
import DreamStage5_WishTree    from "./components/DreamStage5_WishTree";
import DreamStage6_MoonMirror  from "./components/DreamStage6_MoonMirror";
import DreamStage7_SunrisePath from "./components/DreamStage7_SunrisePath";

// ════════════════════════════════════════════════════════════════
// STARTUP DESTINY RPG — Visual Novel Layout + Responsive
// Desktop: Scene Panel (left) | Minigame (right) + Dialogue bar
// Mobile : Scene Header + Minigame + Dialogue bar (stacked)
// ════════════════════════════════════════════════════════════════

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');`;

const STAGES = [
  DreamStage1_CardDraw,
  DreamStage2_CloudReach,
  DreamStage3_ConstellationAim,
  DreamStage4_DreamRiver,
  DreamStage5_WishTree,
  DreamStage6_MoonMirror,
  DreamStage7_SunrisePath,
];

// Per-stage visual novel data
const STAGE_VN = [
  {
    accent:    "#c4a8ff",
    label:     "Kartu Takdir",
    emoji:     "🌙",
    sceneTitle:"Malam Pengetahuan",
    sceneBg:   "linear-gradient(155deg, #10082e 0%, #1c1050 50%, #0c0820 100%)",
    narrator:  "Penjaga Mimpi",
    dialogue:  "Di antara bintang-bintang yang tak terhitung, empat kartu melayang khusus untukmu. Masing-masing menyimpan sebuah sisi dari jiwa seorang pendiri. Biarkan intuisimu yang memilih — bukan pikiranmu.",
  },
  {
    accent:    "#87CEEB",
    label:     "Pulau Impian",
    emoji:     "☁️",
    sceneTitle:"Langit Tanpa Batas",
    sceneBg:   "linear-gradient(180deg, #060e1e 0%, #0a1a3a 50%, #0d2248 100%)",
    narrator:  "Penjaga Mimpi",
    dialogue:  "Di antara awan-awan lembut, pulau-pulau impian melayang di ketinggian yang berbeda. Tekan dan tahan... rasakan dorongan dari dalam dirimu. Seberapa tinggi hasratmu membawamu?",
  },
  {
    accent:    "#c4a8ff",
    label:     "Rasi Bintang",
    emoji:     "✨",
    sceneTitle:"Langit Para Pelopor",
    sceneBg:   "linear-gradient(135deg, #06041c 0%, #10082c 50%, #080618 100%)",
    narrator:  "Penjaga Mimpi",
    dialogue:  "Ribuan bintang tersebar di langit mimpimu. Beberapa di antaranya saling terhubung, membentuk rasi bintangmu sendiri. Klik lima bintang yang terasa memanggil jiwamu — percayai apa yang kamu rasakan.",
  },
  {
    accent:    "#a8e6cf",
    label:     "Sungai Impian",
    emoji:     "🌊",
    sceneTitle:"Aliran Takdir",
    sceneBg:   "linear-gradient(180deg, #04100a 0%, #091e10 50%, #0c2414 100%)",
    narrator:  "Penjaga Mimpi",
    dialogue:  "Sungai impian mengalir dan bercabang. Di setiap persimpangan ada dua jalan yang menunggumu. Geser ke arah yang terasa paling alami — biarkan naluri memilih, bukan logika.",
  },
  {
    accent:    "#ffe8a8",
    label:     "Pohon Harapan",
    emoji:     "🌳",
    sceneTitle:"Taman Jiwa",
    sceneBg:   "linear-gradient(160deg, #060c04 0%, #0c1808 50%, #0a1406 100%)",
    narrator:  "Penjaga Mimpi",
    dialogue:  "Di taman mimpi yang tenang, pohon tua bercahaya menunggu. Setiap lentera adalah sebuah harapan. Pilih yang paling memanggil hatimu — seret ke atas untuk menggantungkannya di pohon.",
  },
  {
    accent:    "#c4a8ff",
    label:     "Kolam Bulan",
    emoji:     "🌕",
    sceneTitle:"Cermin Jiwa",
    sceneBg:   "linear-gradient(180deg, #070618 0%, #0e0c2c 50%, #0a0820 100%)",
    narrator:  "Penjaga Mimpi",
    dialogue:  "Di bawah cahaya bulan purnama, kolam yang tenang menjadi cermin jiwamu. Bayangan di dalamnya adalah versi dirimu yang sesungguhnya. Pilih bayangan mana yang paling kamu kenali.",
  },
  {
    accent:    "#ffb4a2",
    label:     "Fajar Impian",
    emoji:     "🌅",
    sceneTitle:"Akhir Perjalanan",
    sceneBg:   "linear-gradient(180deg, #0c0608 0%, #1e0c0a 50%, #2c1208 100%)",
    narrator:  "Penjaga Mimpi",
    dialogue:  "Fajar terakhir perjalananmu muncul di ufuk timur. Satu per satu, elemen mimpi terungkap oleh cahaya. Apa yang pertama kali menarik perhatianmu ketika hari baru dimulai?",
  },
];

// Typewriter hook
function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone]           = useState(false);
  const fullRef = useRef(text);

  useEffect(() => {
    fullRef.current = text;
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(fullRef.current.slice(0, i));
      if (i >= fullRef.current.length) { clearInterval(timer); setDone(true); }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  const skipToEnd = () => { setDisplayed(fullRef.current); setDone(true); };

  return { displayed, done, skipToEnd };
}

export default function StartupDestinyRPG({ onBack }) {
  const [screen, setScreen]           = useState("intro"); // intro | playing | result
  const [stage, setStage]             = useState(0);
  const [scores, setScores]           = useState(initScores());
  const [transitioning, setTransitioning] = useState(false);
  const [isDesktop, setIsDesktop]     = useState(() => window.innerWidth >= 800);
  const minigameRef = useRef(null);

  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const result    = useMemo(() => getResult(scores), [scores]);
  const vnData    = STAGE_VN[stage] || STAGE_VN[0];
  const { displayed: dialogText, done: dialogDone, skipToEnd } = useTypewriter(
    screen === "playing" ? vnData.dialogue : "",
    20
  );

  // Scroll minigame area to top on stage change
  useEffect(() => {
    if (minigameRef.current) minigameRef.current.scrollTop = 0;
  }, [stage]);

  const startGame = () => {
    setScores(initScores());
    setStage(0);
    setScreen("playing");
  };

  const handleStageComplete = (key) => {
    const newScores = addScore(scores, key);
    setScores(newScores);
    setTransitioning(true);
    setTimeout(() => {
      if (stage + 1 < STAGES.length) setStage(stage + 1);
      else setScreen("result");
      setTransitioning(false);
    }, 380);
  };

  const restart = () => { setScores(initScores()); setStage(0); setScreen("intro"); };

  const CurrentStage = STAGES[stage];

  // ── Stars & nebula (shared background decorations) ──
  const Stars = () => (
    <>
      {[...Array(50)].map((_, i) => (
        <div key={i} style={{
          position:"fixed",
          left:`${(i * 137.5) % 100}%`, top:`${(i * 97.3) % 100}%`,
          width: i%7===0 ? 2.5 : i%3===0 ? 1.8 : 1.2,
          height: i%7===0 ? 2.5 : i%3===0 ? 1.8 : 1.2,
          borderRadius:"50%", background:"#fff",
          opacity:.08 + (i%8) * .03,
          animation:`SDR_twinkle ${2.5+(i%6)*.6}s ease-in-out ${(i%4)*.7}s infinite`,
          pointerEvents:"none",
        }} />
      ))}
    </>
  );

  return (
    <div style={{
      position:"fixed", inset:0,
      fontFamily:"'Nunito',sans-serif", color:"#fff",
      background:"#080618",
      display:"flex", flexDirection:"column",
      overflow:"hidden",
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes SDR_twinkle { 0%,100%{opacity:.1;transform:scale(1)} 50%{opacity:.65;transform:scale(1.4)} }
        @keyframes SDR_rise    { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes SDR_fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes SDR_float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes SDR_blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes SDR_sceneIn { from{opacity:0;transform:scale(1.04)} to{opacity:1;transform:scale(1)} }
        @keyframes SDR_nebula  { 0%,100%{opacity:.04;transform:scale(1)} 50%{opacity:.07;transform:scale(1.12)} }
        @keyframes SDR_pulse   { 0%,100%{box-shadow:0 0 8px currentColor} 50%{box-shadow:0 0 20px currentColor} }
      `}</style>

      <Stars />

      {/* Nebula blobs */}
      {[
        { top:"5%",  left:"-10%", w:280, c:"rgba(196,168,255,.07)" },
        { top:"55%", right:"-8%", w:240, c:"rgba(135,206,235,.05)" },
        { bottom:"2%",left:"15%", w:200, c:"rgba(255,180,162,.04)" },
      ].map((b,i) => (
        <div key={i} style={{
          position:"fixed",
          top:b.top, bottom:b.bottom, left:b.left, right:b.right,
          width:b.w, height:b.w, borderRadius:"50%",
          background:b.c, filter:"blur(40px)",
          animation:`SDR_nebula ${14+i*3}s ease-in-out ${i*2}s infinite`,
          pointerEvents:"none",
        }} />
      ))}

      {/* ══════════════════ INTRO ══════════════════ */}
      {screen === "intro" && (
        <div style={{
          flex:1, display:"flex", alignItems:"center", justifyContent:"center",
          overflow:"auto", padding:"24px 18px 48px",
        }}>
          <DreamIntro onStart={startGame} onBack={onBack} />
        </div>
      )}

      {/* ══════════════════ PLAYING ══════════════════ */}
      {screen === "playing" && (
        <>
          {/* ── Top Navigation Bar ── */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding: isDesktop ? "14px 28px 12px" : "12px 16px 10px",
            background:"rgba(0,0,0,.35)", backdropFilter:"blur(10px)",
            borderBottom:`1px solid ${vnData.accent}18`,
            flexShrink:0, zIndex:10,
          }}>
            <button onClick={onBack} style={{
              fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13,
              color:`${vnData.accent}99`, background:"transparent", border:"none",
              cursor:"pointer", padding:"4px 8px", transition:"opacity .2s",
            }}>
              ← Hub
            </button>

            <div style={{ fontSize:11, letterSpacing:2, textTransform:"uppercase", color:vnData.accent, fontWeight:700, opacity:.75 }}>
              {vnData.label}
            </div>

            {/* Progress orbs */}
            <div style={{ display:"flex", gap:5, alignItems:"center" }}>
              {STAGES.map((_, i) => (
                <div key={i} style={{
                  width: i === stage ? 20 : 8, height:8, borderRadius:8,
                  background: i <= stage ? vnData.accent : "rgba(255,255,255,.15)",
                  boxShadow: i <= stage ? `0 0 6px ${vnData.accent}` : "none",
                  opacity: i < stage ? .55 : i === stage ? 1 : .3,
                  transition:"all .35s",
                }} />
              ))}
            </div>
          </div>

          {/* ── Main area: Scene + Minigame ── */}
          <div style={{
            flex:1,
            display:"flex",
            flexDirection: isDesktop ? "row" : "column",
            overflow:"hidden",
            minHeight:0,
          }}>

            {/* ─── Scene Panel (left on desktop, header on mobile) ─── */}
            <div style={{
              // Desktop: 33% width, full height; Mobile: auto-height strip
              width: isDesktop ? "33%" : "100%",
              minWidth: isDesktop ? 260 : "auto",
              maxWidth: isDesktop ? 360 : "100%",
              flexShrink: 0,
              position:"relative", overflow:"hidden",
              background: vnData.sceneBg,
              borderRight: isDesktop ? `1px solid ${vnData.accent}18` : "none",
              borderBottom: isDesktop ? "none" : `1px solid ${vnData.accent}18`,
              display:"flex",
              flexDirection: isDesktop ? "column" : "row",
              alignItems:"center",
              justifyContent: isDesktop ? "center" : "flex-start",
              padding: isDesktop ? "32px 20px" : "12px 18px 10px",
              gap: isDesktop ? 0 : 14,
              animation:"SDR_sceneIn .5s ease both",
            }}>
              {/* Scene glow */}
              <div style={{
                position:"absolute", inset:0,
                background:`radial-gradient(ellipse at center, ${vnData.accent}10 0%, transparent 70%)`,
                pointerEvents:"none",
              }} />

              {/* Emoji */}
              <div style={{
                fontSize: isDesktop ? 80 : 44,
                lineHeight:1, flexShrink:0,
                animation:`SDR_float ${4}s ease-in-out infinite`,
                filter:`drop-shadow(0 0 16px ${vnData.accent}66)`,
              }}>
                {vnData.emoji}
              </div>

              {/* Text */}
              <div style={{ textAlign: isDesktop ? "center" : "left" }}>
                {isDesktop && (
                  <div style={{ fontSize:10.5, letterSpacing:2, textTransform:"uppercase", color:vnData.accent, fontWeight:700, opacity:.7, marginBottom:8 }}>
                    Langkah {stage + 1} / {STAGES.length}
                  </div>
                )}
                <div style={{
                  fontFamily:"'Fredoka',sans-serif",
                  fontSize: isDesktop ? 24 : 17,
                  fontWeight:700, color:"#fff",
                  textShadow:`0 2px 16px ${vnData.accent}55`,
                  lineHeight:1.2,
                }}>
                  {vnData.sceneTitle}
                </div>
                {!isDesktop && (
                  <div style={{ fontSize:10, color:`${vnData.accent}88`, fontWeight:700, marginTop:3, letterSpacing:1 }}>
                    Langkah {stage+1} / {STAGES.length}
                  </div>
                )}
              </div>

              {/* Decorative stars (desktop only) */}
              {isDesktop && (
                <div style={{ display:"flex", gap:12, fontSize:16, marginTop:28, opacity:.45 }}>
                  {["✦","✧","✦","✧","✦"].map((s,i)=>(
                    <span key={i} style={{ color:vnData.accent, animation:`SDR_blink ${2+i*.4}s ease-in-out infinite` }}>{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* ─── Minigame Panel ─── */}
            <div
              ref={minigameRef}
              style={{
                flex:1, overflowY:"auto", overflowX:"hidden",
                padding: isDesktop ? "28px 28px 24px" : "16px 14px 12px",
                minHeight:0,
                display:"flex", flexDirection:"column",
              }}
            >
              {!transitioning ? (
                <div key={stage} style={{
                  width:"100%", maxWidth: isDesktop ? 520 : "100%",
                  margin:"0 auto",
                  animation:"SDR_rise .45s ease both",
                  background:"rgba(255,255,255,.04)",
                  backdropFilter:"blur(18px)",
                  border:`1px solid ${vnData.accent}1a`,
                  borderRadius:26,
                  padding: isDesktop ? "26px 22px 28px" : "18px 14px 20px",
                  boxShadow:`0 0 0 1px rgba(255,255,255,.04), 0 20px 52px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.06)`,
                }}>
                  <CurrentStage onComplete={handleStageComplete} />
                </div>
              ) : (
                <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", animation:"SDR_fadeIn .3s ease both" }}>
                  <div style={{ textAlign:"center" }}>
                    <div style={{ fontSize:36, animation:"SDR_float 1s ease-in-out infinite" }}>✨</div>
                    <p style={{ color:vnData.accent, fontWeight:700, fontSize:13, marginTop:10 }}>
                      Memasuki dimensi berikutnya...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─── Dialogue Box ─── */}
          <div
            onClick={skipToEnd}
            style={{
              flexShrink:0,
              background:"rgba(4,2,14,.82)",
              backdropFilter:"blur(16px)",
              borderTop:`1px solid ${vnData.accent}1a`,
              padding: isDesktop ? "14px 28px 16px" : "12px 16px 14px",
              cursor: dialogDone ? "default" : "pointer",
              minHeight: isDesktop ? 82 : 76,
              display:"flex", flexDirection:"column", justifyContent:"center",
              transition:"border-color .4s",
            }}
          >
            {/* Name plate */}
            <div style={{
              display:"inline-flex", alignItems:"center", gap:8, marginBottom:6,
            }}>
              <div style={{ width:28, height:1.5, background:vnData.accent, opacity:.7 }} />
              <span style={{
                fontSize:10.5, letterSpacing:2, textTransform:"uppercase",
                color:vnData.accent, fontWeight:800, opacity:.85,
              }}>
                ✦ {vnData.narrator} ✦
              </span>
              <div style={{ width:28, height:1.5, background:vnData.accent, opacity:.7 }} />
            </div>

            {/* Dialogue text */}
            <div style={{ fontSize: isDesktop ? 14 : 13, lineHeight:1.65, fontWeight:600, color:"rgba(255,255,255,.88)", minHeight:40 }}>
              {dialogText}
              {!dialogDone && (
                <span style={{ display:"inline-block", animation:"SDR_blink .8s infinite", marginLeft:2, color:vnData.accent }}>▋</span>
              )}
              {dialogDone && !isDesktop && (
                <span style={{ fontSize:11, color:`${vnData.accent}55`, marginLeft:6 }}>▸</span>
              )}
            </div>
          </div>
        </>
      )}

      {/* ══════════════════ RESULT ══════════════════ */}
      {screen === "result" && (
        <DreamResult result={result} onRestart={restart} onBack={onBack} />
      )}
    </div>
  );
}
