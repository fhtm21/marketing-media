import React, { useState, useRef } from "react";

// Stage 4 — Dream River Swipe Fork Navigation
// Q: "Weekend ideal versi kamu?"
// Mechanic: 2 fork decisions via swipe/drag left or right → combo → archetype
//
// Fork 1: Spontan vs Terencana
// Fork 2 (depends on F1): sub-question specific to the leaning
//
// Combos → archetype:
//   L + L (Spontan + Ekspresi & Kreasi)          → create
//   L + R (Spontan + Jelajah & Peluang)           → trail
//   R + L (Terencana + Bantu & Dampak)            → change
//   R + R (Terencana + Kembangkan & Warisan)      → tech

const FORKS = [
  {
    id: 0,
    river: "Sungai Pertama",
    question: "Waktu luang ada, kamu...",
    left:  { label: "Langsung action!",    icon: "⚡", desc: "Spontan & eksekutif", hint: "swipe kiri ←" },
    right: { label: "Mikir dulu matang",   icon: "🧭", desc: "Terencana & strategis", hint: "swipe kanan →" },
  },
  {
    // Shown after Left on Fork 1 (Spontan)
    id: "1L",
    river: "Persimpangan Timur",
    question: "Kamu lebih suka...",
    left:  { label: "Bikin konten & brand", icon: "🎬", desc: "Ekspresi & kreasi", hint: "swipe kiri ←" },
    right: { label: "Nyari peluang baru",   icon: "🔭", desc: "Jelajah & explore", hint: "swipe kanan →" },
    resultMap: { left: "create", right: "trail" },
  },
  {
    // Shown after Right on Fork 1 (Terencana)
    id: "1R",
    river: "Persimpangan Barat",
    question: "Kamu lebih suka...",
    left:  { label: "Bantu & beri dampak",  icon: "🌿", desc: "Orang & komunitas",  hint: "swipe kiri ←" },
    right: { label: "Kembangkan bisnis",    icon: "🤝", desc: "Warisan & sistem",   hint: "swipe kanan →" },
    resultMap: { left: "change", right: "tech" },
  },
];

const SWIPE_THRESHOLD = 55;

export default function DreamStage4_DreamRiver({ onComplete }) {
  const [forkIdx, setForkIdx] = useState(0); // 0 → "1L" or "1R"
  const [choices, setChoices] = useState([]); // ["left"|"right", ...]
  const [phase, setPhase]     = useState("idle"); // idle | swiping | transition | done
  const [dragX, setDragX]     = useState(0);
  const [result, setResult]   = useState(null);

  const startX   = useRef(null);
  const isDrag   = useRef(false);

  const currentFork = forkIdx === 0 ? FORKS[0] : forkIdx === "1L" ? FORKS[1] : FORKS[2];
  const dir  = dragX > 20 ? "right" : dragX < -20 ? "left" : null;
  const tilt = Math.min(Math.max(dragX * 0.08, -12), 12);
  const dragPct = Math.min(Math.abs(dragX) / SWIPE_THRESHOLD, 1);

  // ── Pointer handlers ──
  const onPD = (e) => {
    if (phase !== "idle") return;
    e.preventDefault();
    startX.current = e.clientX ?? e.touches?.[0]?.clientX;
    isDrag.current = true;
    setPhase("swiping");
  };
  const onPM = (e) => {
    if (!isDrag.current) return;
    const cx = e.clientX ?? e.touches?.[0]?.clientX;
    setDragX(cx - startX.current);
  };
  const onPU = () => {
    if (!isDrag.current) return;
    isDrag.current = false;
    if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
      const choice = dragX > 0 ? "right" : "left";
      commit(choice);
    } else {
      setDragX(0);
      setPhase("idle");
    }
  };

  const commit = (choice) => {
    const newChoices = [...choices, choice];
    setChoices(newChoices);

    // Animate card flying out
    setDragX(choice === "right" ? 500 : -500);
    setPhase("transition");

    setTimeout(() => {
      setDragX(0);
      if (forkIdx === 0) {
        // Go to fork 2
        setForkIdx(choice === "left" ? "1L" : "1R");
        setPhase("idle");
      } else {
        // Final result
        const archetype = currentFork.resultMap[choice];
        setResult(archetype);
        setPhase("done");
        setTimeout(() => onComplete(archetype), 1300);
      }
    }, 380);
  };

  // Button fallback
  const btnChoose = (side) => {
    if (phase !== "idle") return;
    commit(side);
  };

  return (
    <div style={{ width:"100%", textAlign:"center", userSelect:"none" }}>
      <style>{`
        @keyframes riverFlow { 0%{background-position:0% 0%} 100%{background-position:0% 200%} }
        @keyframes ripple    { 0%{transform:scale(1);opacity:.6} 100%{transform:scale(2.4);opacity:0} }
        @keyframes swipeHint { 0%,100%{transform:translateX(0);opacity:.5} 50%{transform:translateX(8px);opacity:1} }
        @keyframes swipeHintL{ 0%,100%{transform:translateX(0);opacity:.5} 50%{transform:translateX(-8px);opacity:1} }
        @keyframes forkIn    { from{opacity:0;transform:translateY(16px) scale(.94)} to{opacity:1;transform:none} }
        @keyframes resultPop { 0%{transform:scale(.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <p style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#a8e6cf", fontWeight:700, margin:"0 0 10px", opacity:.85 }}>
        ✦ Langkah 4 dari 7 — Sungai Impian ✦
      </p>
      <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontSize:22, fontWeight:700, color:"#fff", margin:"0 0 6px", textShadow:"0 2px 18px rgba(168,230,207,.4)" }}>
        Ikuti Aliran Sungai Mimpimu
      </h2>

      {phase !== "done" && (
        <>
          {/* Fork label */}
          <p style={{ fontSize:11, letterSpacing:2, color:"rgba(168,230,207,.6)", fontWeight:700, textTransform:"uppercase", margin:"0 0 4px" }}>
            {currentFork.river}
          </p>
          <p style={{ fontSize:14, color:"#a8e6cf", fontWeight:600, margin:"0 0 18px", opacity:.9, animation:"forkIn .4s ease both" }}>
            {currentFork.question}
          </p>

          {/* Swipe card + side labels */}
          <div style={{ position:"relative", display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginBottom:16 }}>

            {/* Left option label */}
            <div style={{
              flex:1, textAlign:"right", opacity: dir==="left" ? 1 : .4,
              transition:"opacity .2s",
            }}>
              <div style={{ fontSize:24 }}>{currentFork.left.icon}</div>
              <div style={{ fontFamily:"'Fredoka',sans-serif", fontSize:13, fontWeight:700, color:"#a8e6cf" }}>
                {currentFork.left.label}
              </div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,.5)", fontWeight:600, marginTop:2 }}>
                {currentFork.left.desc}
              </div>
            </div>

            {/* Draggable card */}
            <div
              onMouseDown={onPD} onMouseMove={onPM} onMouseUp={onPU} onMouseLeave={onPU}
              onTouchStart={onPD} onTouchMove={onPM} onTouchEnd={onPU}
              style={{
                width:140, height:170, borderRadius:22, flexShrink:0,
                background: dir==="left"
                  ? "linear-gradient(135deg, rgba(168,230,207,.25), rgba(14,8,40,.9))"
                  : dir==="right"
                    ? "linear-gradient(135deg, rgba(91,140,255,.25), rgba(14,8,40,.9))"
                    : "rgba(255,255,255,.08)",
                border: `2px solid ${dir ? (dir==="left" ? "rgba(168,230,207,.6)" : "rgba(91,140,255,.6)") : "rgba(255,255,255,.15)"}`,
                backdropFilter:"blur(14px)",
                boxShadow:"0 12px 32px rgba(0,0,0,.4)",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:10,
                transform:`translateX(${dragX}px) rotate(${tilt}deg)`,
                transition: phase==="transition" ? "transform .38s cubic-bezier(.4,0,.2,1)" : "none",
                cursor: phase==="idle" ? "grab" : "grabbing",
                touchAction:"none",
              }}
            >
              {/* River visual */}
              <div style={{
                width:32, height:60, borderRadius:16, overflow:"hidden",
                background:"linear-gradient(180deg, rgba(46,204,143,.3), rgba(91,140,255,.3))",
              }}>
                <div style={{
                  width:"100%", height:"200%",
                  background:"repeating-linear-gradient(180deg, rgba(255,255,255,.08) 0px, rgba(255,255,255,.04) 8px, transparent 8px, transparent 16px)",
                  animation:"riverFlow 2s linear infinite",
                }} />
              </div>
              <div style={{ fontSize:22 }}>🌊</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,.55)", fontWeight:600 }}>
                {dir==="left" ? "← Kiri" : dir==="right" ? "Kanan →" : "Geser!"}
              </div>
            </div>

            {/* Right option label */}
            <div style={{
              flex:1, textAlign:"left", opacity: dir==="right" ? 1 : .4,
              transition:"opacity .2s",
            }}>
              <div style={{ fontSize:24 }}>{currentFork.right.icon}</div>
              <div style={{ fontFamily:"'Fredoka',sans-serif", fontSize:13, fontWeight:700, color:"#a8e6cf" }}>
                {currentFork.right.label}
              </div>
              <div style={{ fontSize:10.5, color:"rgba(255,255,255,.5)", fontWeight:600, marginTop:2 }}>
                {currentFork.right.desc}
              </div>
            </div>
          </div>

          {/* Swipe hint arrows */}
          <div style={{ display:"flex", gap:24, justifyContent:"center", alignItems:"center", marginBottom:14 }}>
            <button onClick={()=>btnChoose("left")} style={{
              fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13,
              color:"#a8e6cf", background:"rgba(168,230,207,.1)", border:"1.5px solid rgba(168,230,207,.3)",
              borderRadius:30, padding:"8px 18px", cursor:"pointer", transition:"all .2s",
              animation:"swipeHintL 2s ease-in-out infinite",
            }}>
              ← {currentFork.left.label}
            </button>
            <button onClick={()=>btnChoose("right")} style={{
              fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:13,
              color:"#87CEEB", background:"rgba(91,140,255,.1)", border:"1.5px solid rgba(91,140,255,.3)",
              borderRadius:30, padding:"8px 18px", cursor:"pointer", transition:"all .2s",
              animation:"swipeHint 2s ease-in-out .5s infinite",
            }}>
              {currentFork.right.label} →
            </button>
          </div>

          {/* Progress fork dots */}
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            {[0,1].map(i => (
              <div key={i} style={{
                width:24, height:6, borderRadius:4,
                background: i < choices.length ? "#a8e6cf"
                  : i === choices.length ? "rgba(168,230,207,.6)" : "rgba(255,255,255,.15)",
              }} />
            ))}
          </div>
        </>
      )}

      {/* Result */}
      {phase === "done" && result && (
        <div style={{ animation:"resultPop .6s cubic-bezier(.34,1.56,.64,1) both", marginTop:8 }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🌊</div>
          <p style={{ fontFamily:"'Fredoka',sans-serif", fontSize:18, fontWeight:700, color:"#ffe24d", margin:"0 0 4px" }}>
            Sungai membawamu...
          </p>
          <p style={{ fontSize:13, color:"rgba(255,255,255,.7)", fontWeight:600 }}>
            Arah yang dipilih jiwamu
          </p>
        </div>
      )}
    </div>
  );
}
