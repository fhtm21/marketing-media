import React, { useState } from "react";

// Stage 3 — Connect the Stars
// Q: "Masalah yang paling pengen kamu pecahin?"
// Mechanic: Klik 5 bintang bebas → tally per kelompok → konstelasi terbentuk

// 24 stars in a 340×260 SVG. Each belongs to a group (or neutral).
// Groups are loosely clustered so the pattern can be "felt" intuitively.
const STARS = [
  // create — top-left cluster
  { id:0,  x:55,  y:30,  group:"create", r:3.2 },
  { id:1,  x:90,  y:16,  group:"create", r:2.5 },
  { id:2,  x:42,  y:68,  group:"create", r:2.8 },
  { id:3,  x:115, y:48,  group:"create", r:3.0 },
  { id:4,  x:72,  y:92,  group:"create", r:2.4 },
  // tech — top-right cluster
  { id:5,  x:232, y:22,  group:"tech",   r:3.0 },
  { id:6,  x:272, y:42,  group:"tech",   r:2.6 },
  { id:7,  x:258, y:80,  group:"tech",   r:2.8 },
  { id:8,  x:310, y:28,  group:"tech",   r:3.2 },
  { id:9,  x:220, y:64,  group:"tech",   r:2.4 },
  // design — bottom-left cluster
  { id:10, x:48,  y:170, group:"design", r:2.8 },
  { id:11, x:88,  y:194, group:"design", r:3.0 },
  { id:12, x:60,  y:232, group:"design", r:2.5 },
  { id:13, x:120, y:212, group:"design", r:3.2 },
  { id:14, x:36,  y:250, group:"design", r:2.4 },
  // change — bottom-right cluster
  { id:15, x:248, y:184, group:"change", r:2.8 },
  { id:16, x:288, y:208, group:"change", r:3.0 },
  { id:17, x:270, y:248, group:"change", r:2.6 },
  { id:18, x:318, y:172, group:"change", r:3.2 },
  { id:19, x:228, y:232, group:"change", r:2.4 },
  // neutral / noise — scattered in center
  { id:20, x:168, y:42,  group:null,     r:1.8 },
  { id:21, x:152, y:130, group:null,     r:1.6 },
  { id:22, x:176, y:205, group:null,     r:1.8 },
  { id:23, x:162, y:82,  group:null,     r:1.5 },
  { id:24, x:158, y:172, group:null,     r:1.6 },
];

const GROUP_META = {
  create: { name:"Rasi Mercusuar", latin:"Pharos Digitalis",  color:"#ff5fa8", emoji:"🎨",
    question:"Gimana brand ini dikenal banyak orang?",
    lines:[[0,1],[1,3],[3,4],[4,2],[2,0]] },
  tech:   { name:"Rasi Mahkota",   latin:"Corona Hereditas",  color:"#5b8cff", emoji:"👑",
    question:"Gimana bisnis yang ada makin berkembang?",
    lines:[[5,6],[6,7],[7,9],[9,8],[8,5]] },
  design: { name:"Rasi Kristal",   latin:"Crystallum Artis",  color:"#b06bff", emoji:"✨",
    question:"Gimana bikin produk yang user jatuh cinta?",
    lines:[[10,11],[11,13],[13,12],[12,14],[14,10]] },
  change: { name:"Rasi Harmonia",  latin:"Harmonia Viridis",  color:"#2ecc8f", emoji:"🌱",
    question:"Gimana teknologi bisa bantu banyak orang?",
    lines:[[15,18],[18,16],[16,17],[17,19],[19,15]] },
};

const MAX_CLICKS = 5;

function tallyGroup(selected) {
  const count = { create:0, tech:0, design:0, change:0 };
  selected.forEach(s => { if (s.group && count[s.group] !== undefined) count[s.group]++; });
  return Object.entries(count).sort(([,a],[,b]) => b-a)[0][0];
}

export default function DreamStage3_ConstellationAim({ onComplete }) {
  const [selected, setSelected] = useState([]); // array of star objects
  const [phase, setPhase]       = useState("picking"); // picking | revealing | done
  const [winner, setWinner]     = useState(null);
  const [hovered, setHovered]   = useState(null);

  const clickStar = (star) => {
    if (phase !== "picking") return;
    if (selected.find(s => s.id === star.id)) return; // already selected
    const next = [...selected, star];
    setSelected(next);
    if (next.length === MAX_CLICKS) {
      const w = tallyGroup(next);
      setPhase("revealing");
      setTimeout(() => {
        setWinner(w);
        setPhase("done");
        setTimeout(() => onComplete(w), 1500);
      }, 700);
    }
  };

  const meta  = winner ? GROUP_META[winner] : null;
  const SVG_W = 340;
  const SVG_H = 268;

  // Highlight adjacent stars (same group) on hover
  const nearbyHighlight = hovered
    ? STARS.filter(s => s.group === hovered.group && s.id !== hovered.id && s.group !== null).map(s => s.id)
    : [];

  return (
    <div style={{ width:"100%", textAlign:"center" }}>
      <style>{`
        @keyframes starPop    { 0%{r:1;opacity:0} 60%{r:5} 100%{r:inherit;opacity:1} }
        @keyframes constReveal{ from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        @keyframes twinkleS   { 0%,100%{opacity:.45;r:inherit} 50%{opacity:1;r:calc(inherit + 1px)} }
        .star-dot { cursor:pointer; transition: r .15s; }
        .star-dot:hover { filter: brightness(2); }
      `}</style>

      <p style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#c4a8ff", fontWeight:700, margin:"0 0 10px", opacity:.85 }}>
        ✦ Langkah 3 dari 7 — Rasi Bintang ✦
      </p>
      <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontSize:22, fontWeight:700, color:"#fff", margin:"0 0 6px", textShadow:"0 2px 18px rgba(196,168,255,.5)" }}>
        Konstelasi Apa yang Kamu Lihat?
      </h2>
      <p style={{ fontSize:13, color:"#c4a8ff", fontWeight:600, margin:"0 0 16px", opacity:.88 }}>
        {phase==="picking"
          ? `Klik ${MAX_CLICKS} bintang yang terasa saling terhubung (${selected.length}/${MAX_CLICKS})`
          : phase==="revealing" ? "✨ Membaca konstelasi..." : "✦ Rasi bintangmu terbentuk!"}
      </p>

      {/* Star map SVG */}
      <div style={{
        display:"inline-block", borderRadius:22, overflow:"hidden",
        border:"1px solid rgba(196,168,255,.12)",
        background:"radial-gradient(ellipse at center, rgba(30,15,70,.6) 0%, rgba(8,6,22,.9) 100%)",
        boxShadow:"0 12px 40px rgba(0,0,0,.5)",
        position:"relative", marginBottom:16,
      }}>
        <svg
          width={SVG_W} height={SVG_H}
          style={{ display:"block", touchAction:"none" }}
        >
          {/* Faint constellation lines (winner reveal) */}
          {phase === "done" && meta && meta.lines.map(([a,b], i) => {
            const sa = STARS[a], sb = STARS[b];
            return (
              <line key={i} x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y}
                stroke={meta.color} strokeWidth={1.4} strokeLinecap="round" opacity={.75} />
            );
          })}

          {/* User-drawn lines */}
          {phase !== "done" && selected.map((s, i) => {
            if (i === 0) return null;
            const prev = selected[i-1];
            return (
              <line key={i} x1={prev.x} y1={prev.y} x2={s.x} y2={s.y}
                stroke="rgba(196,168,255,.5)" strokeWidth={1.2} strokeLinecap="round" strokeDasharray="4 3" />
            );
          })}

          {/* Stars */}
          {STARS.map(star => {
            const isSelected    = !!selected.find(s => s.id === star.id);
            const isWinGroup    = phase === "done" && winner && star.group === winner;
            const isNearby      = nearbyHighlight.includes(star.id);
            const selColor      = star.group ? GROUP_META[star.group]?.color : "#fff";
            const baseColor     = isSelected ? selColor
              : isWinGroup     ? meta.color
              : isNearby       ? selColor + "99"
              : "rgba(255,255,255,.55)";
            const radius        = isSelected ? star.r + 2.5 : isWinGroup ? star.r + 1.5 : star.r;
            return (
              <circle
                key={star.id}
                cx={star.x} cy={star.y}
                r={radius}
                fill={baseColor}
                className="star-dot"
                style={{
                  filter: isSelected ? `drop-shadow(0 0 4px ${selColor})` : isWinGroup ? `drop-shadow(0 0 5px ${meta.color})` : "none",
                  cursor: phase==="picking" && !isSelected ? "pointer" : "default",
                  transition:"all .2s",
                }}
                onClick={() => clickStar(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>
      </div>

      {/* Progress dots */}
      {phase === "picking" && (
        <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:12 }}>
          {Array.from({length: MAX_CLICKS}).map((_,i) => (
            <div key={i} style={{
              width:8, height:8, borderRadius:"50%",
              background: i < selected.length ? "#c4a8ff" : "rgba(255,255,255,.2)",
              boxShadow: i < selected.length ? "0 0 6px #c4a8ff" : "none",
              transition:"all .2s",
            }} />
          ))}
        </div>
      )}

      {/* Result reveal */}
      {phase === "done" && meta && (
        <div style={{ animation:"constReveal .6s ease both", textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:6 }}>{meta.emoji}</div>
          <div style={{ fontFamily:"'Fredoka',sans-serif", fontSize:20, fontWeight:700, color:meta.color, marginBottom:2 }}>
            {meta.name}
          </div>
          <div style={{ fontSize:10, letterSpacing:1.5, color:meta.color, opacity:.7, textTransform:"uppercase", marginBottom:8 }}>
            {meta.latin}
          </div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.75)", fontWeight:600, fontStyle:"italic" }}>
            {meta.question}
          </div>
        </div>
      )}

      {phase === "picking" && (
        <p style={{ fontSize:12, color:"rgba(196,168,255,.55)", fontWeight:600 }}>
          🌌 Bintang yang saling dekat mungkin terhubung...
        </p>
      )}
    </div>
  );
}
