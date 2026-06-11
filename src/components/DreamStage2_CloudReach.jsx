import React, { useState, useRef, useEffect } from "react";

// Stage 2 — Click & Hold Power Meter
// Q: "Kalau punya startup, kamu paling pengen pegang bagian…"
// Mechanic: Tekan & tahan → power bar naik → release → karakter lompat ke pulau

const ISLANDS = [
  { key: "create", emoji: "⭐", name: "Bintang Impian", label: "Marketing & Branding", color: "#ff5fa8", pMin: 0,  pMax: 28 },
  { key: "design", emoji: "🌈", name: "Pelangi Awan",   label: "Produk & UX",           color: "#b06bff", pMin: 28, pMax: 55 },
  { key: "strat",  emoji: "⛰️", name: "Puncak Aspirasi", label: "Bisnis & Operasional",  color: "#ffb020", pMin: 55, pMax: 78 },
  { key: "trail",  emoji: "🚪", name: "Pintu Langit",    label: "Visi & Arah Besar",     color: "#ff7a59", pMin: 78, pMax: 101 },
];

// % from top of the play area for each island
const ISLAND_TOP = [82, 57, 33, 10];

function getIslandByPower(p) {
  return ISLANDS.find(i => p >= i.pMin && p < i.pMax) || ISLANDS[0];
}

export default function DreamStage2_CloudReach({ onComplete }) {
  const [power, setPower]         = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [phase, setPhase]         = useState("ready"); // ready | holding | jumping | landed
  const [landedIsland, setLandedIsland] = useState(null);

  const powerRef   = useRef(0);
  const holdingRef = useRef(false);
  const phaseRef   = useRef("ready");
  const timerRef   = useRef(null);

  const currentIsland = getIslandByPower(power);

  const doJump = () => {
    holdingRef.current = false;
    setIsHolding(false);
    phaseRef.current = "jumping";
    setPhase("jumping");
    const island = getIslandByPower(powerRef.current);
    setTimeout(() => {
      phaseRef.current = "landed";
      setPhase("landed");
      setLandedIsland(island);
      setTimeout(() => onComplete(island.key), 1300);
    }, 750);
  };

  const startHold = (e) => {
    e.preventDefault();
    if (phaseRef.current !== "ready") return;
    holdingRef.current = true;
    phaseRef.current   = "holding";
    setIsHolding(true);
    setPhase("holding");
    timerRef.current = setInterval(() => {
      powerRef.current = Math.min(100, powerRef.current + 1.7);
      setPower(Math.floor(powerRef.current));
      if (powerRef.current >= 100) {
        clearInterval(timerRef.current);
        doJump();
      }
    }, 40);
  };

  const stopHold = (e) => {
    e?.preventDefault();
    if (!holdingRef.current) return;
    clearInterval(timerRef.current);
    holdingRef.current = false;
    if (powerRef.current < 6) {
      powerRef.current = 0;
      setPower(0);
      phaseRef.current = "ready";
      setPhase("ready");
      setIsHolding(false);
      return;
    }
    doJump();
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  // Character top% in play area: from 88% (bottom) up to 5% (top)
  const charTopPct = 88 - power * 0.83;

  return (
    <div style={{ width: "100%", textAlign: "center", userSelect: "none" }}>
      <style>{`
        @keyframes isleFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes charJump   { 0%{transform:translateX(-50%) scale(1)} 40%{transform:translateX(-50%) scale(1.25) translateY(-18px)} 100%{transform:translateX(-50%) scale(1)} }
        @keyframes landBounce { 0%{transform:scale(.7);opacity:0} 65%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes holdPulse  { 0%,100%{box-shadow:0 0 18px rgba(255,255,255,.15)} 50%{box-shadow:0 0 36px rgba(255,255,255,.35)} }
        @keyframes powerFill  { from{height:0} }
      `}</style>

      <p style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#87CEEB", fontWeight:700, margin:"0 0 10px", opacity:.85 }}>
        ✦ Langkah 2 dari 7 — Pulau Impian ✦
      </p>
      <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontSize:22, fontWeight:700, color:"#fff", margin:"0 0 6px", textShadow:"0 2px 18px rgba(135,206,235,.4)" }}>
        Seberapa Tinggi Kamu Meraih?
      </h2>
      <p style={{ fontSize:13, color:"#a8d8ff", fontWeight:600, margin:"0 0 14px", opacity:.88 }}>
        Kalau punya startup, kamu paling pengen pegang bagian…
      </p>

      {/* ── Play area ── */}
      <div style={{
        position:"relative", height:310, width:"100%", borderRadius:22, overflow:"hidden",
        background:"linear-gradient(180deg,rgba(8,14,50,.55) 0%,rgba(15,28,80,.35) 100%)",
        border:"1px solid rgba(135,206,235,.12)", marginBottom:14,
      }}>

        {/* Clouds */}
        {[{l:"6%",t:"12%",w:64},{l:"60%",t:"20%",w:52},{l:"30%",t:"45%",w:40}].map((c,i)=>(
          <div key={i} style={{ position:"absolute", left:c.l, top:c.t, width:c.w, height:c.w*.38,
            background:"rgba(255,255,255,.18)", borderRadius:c.w, filter:"blur(9px)", pointerEvents:"none" }} />
        ))}

        {/* Power bar (left) */}
        <div style={{ position:"absolute", left:12, top:12, bottom:12, width:12, borderRadius:6,
          background:"rgba(255,255,255,.07)", border:"1px solid rgba(255,255,255,.12)", overflow:"hidden" }}>
          <div style={{
            position:"absolute", bottom:0, left:0, right:0, height:`${power}%`,
            background:`linear-gradient(0deg, ${currentIsland.color}cc, ${currentIsland.color}44)`,
            borderRadius:6, transition:"height .08s linear",
            boxShadow:`0 0 8px ${currentIsland.color}77`,
          }} />
          {[28,55,78].map(p=>(
            <div key={p} style={{ position:"absolute", bottom:`${p}%`, left:0, right:0, height:1.5, background:"rgba(255,255,255,.3)" }} />
          ))}
        </div>

        {/* Power % */}
        {phase !== "ready" && (
          <div style={{ position:"absolute", left:28, bottom:10, fontSize:11, fontWeight:800, color:currentIsland.color, letterSpacing:.5 }}>
            {power}%
          </div>
        )}

        {/* Islands */}
        {ISLANDS.map((island, idx) => {
          const isTarget = currentIsland.key === island.key && phase === "holding";
          const isLanded = landedIsland?.key === island.key;
          return (
            <div key={island.key} style={{
              position:"absolute", left:"50%", top:`${ISLAND_TOP[idx]}%`,
              transform:"translate(-50%, -50%)",
              animation:`isleFloat ${4.2+idx*.7}s ease-in-out infinite`,
              zIndex: isLanded ? 3 : 1,
              transition:"filter .3s",
              filter: phase === "holding" && !isTarget ? "brightness(.5)" : "none",
            }}>
              <div style={{
                borderRadius:18, padding:"9px 16px", textAlign:"center", minWidth:110,
                background: isTarget||isLanded ? `linear-gradient(135deg,${island.color}55,rgba(14,8,40,.92))` : "rgba(255,255,255,.06)",
                border: isTarget||isLanded ? `2px solid ${island.color}` : "1.5px solid rgba(255,255,255,.11)",
                boxShadow: isTarget ? `0 0 28px ${island.color}66` : isLanded ? `0 0 40px ${island.color}88` : "none",
                backdropFilter:"blur(12px)", transition:"all .25s",
              }}>
                <div style={{ fontSize:22 }}>{island.emoji}</div>
                <div style={{ fontFamily:"'Fredoka',sans-serif", fontSize:12, fontWeight:700, color: isTarget||isLanded ? island.color : "#c4d8ff", marginTop:3 }}>
                  {island.name}
                </div>
                <div style={{ fontSize:9.5, fontWeight:600, color:"rgba(255,255,255,.5)", marginTop:1 }}>
                  {island.label}
                </div>
              </div>
            </div>
          );
        })}

        {/* Character 🦄 */}
        {phase !== "landed" && (
          <div style={{
            position:"absolute", left:"50%", top:`${charTopPct}%`,
            transform:"translateX(-50%)",
            fontSize:30, lineHeight:1, zIndex:2,
            transition: phase==="holding" ? "top .1s linear" : "top .8s cubic-bezier(.34,1.56,.64,1)",
            animation: phase==="jumping" ? "charJump .75s ease both" : "none",
            filter: phase==="holding" ? `drop-shadow(0 0 10px ${currentIsland.color})` : "none",
          }}>
            🦄
          </div>
        )}

        {/* Landed overlay */}
        {phase === "landed" && landedIsland && (
          <div style={{
            position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
            background:"rgba(0,0,0,.35)", backdropFilter:"blur(5px)",
          }}>
            <div style={{ textAlign:"center", animation:"landBounce .6s cubic-bezier(.34,1.56,.64,1) both" }}>
              <div style={{ fontSize:50, marginBottom:8 }}>{landedIsland.emoji}</div>
              <div style={{ fontFamily:"'Fredoka',sans-serif", fontSize:20, fontWeight:700, color:landedIsland.color }}>
                {landedIsland.name}!
              </div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,.7)", marginTop:4 }}>{landedIsland.label}</div>
            </div>
          </div>
        )}
      </div>

      {/* Hold button */}
      {phase !== "landed" && (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <button
            onMouseDown={startHold} onMouseUp={stopHold} onMouseLeave={stopHold}
            onTouchStart={startHold} onTouchEnd={stopHold}
            style={{
              fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:17,
              width:180, height:58, borderRadius:29,
              background: isHolding
                ? `linear-gradient(135deg,${currentIsland.color},${currentIsland.color}88)`
                : "rgba(255,255,255,.1)",
              border: isHolding ? `2px solid ${currentIsland.color}` : "2px solid rgba(255,255,255,.22)",
              color:"#fff", cursor:"pointer",
              boxShadow: isHolding ? `0 0 32px ${currentIsland.color}55` : "0 4px 16px rgba(0,0,0,.3)",
              transform: isHolding ? "scale(.95)" : "scale(1)",
              transition:"all .12s",
              userSelect:"none", touchAction:"none",
              animation: phase==="ready" ? "holdPulse 2.5s ease-in-out infinite" : "none",
            }}
          >
            {phase==="ready" ? "☁️ TAHAN" : isHolding ? "⬆️ NAIK!" : "🚀 MELUNCUR!"}
          </button>
          {phase==="ready" && (
            <p style={{ fontSize:12, color:"rgba(135,206,235,.6)", fontWeight:600 }}>
              Tahan lama = lompat lebih tinggi ✨
            </p>
          )}
          {phase==="holding" && (
            <p style={{ fontSize:12, color:currentIsland.color, fontWeight:700 }}>
              → {currentIsland.name} ←
            </p>
          )}
        </div>
      )}
    </div>
  );
}
