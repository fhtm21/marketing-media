import React, { useState, useEffect } from "react";

// ================================================================
// DreamResult — Genshin Impact-style tarot card reveal
// Phases: 0=dark → 1=flash+glow → 2=card rise+particles → 3=details
// Desktop: card left (sticky) + details right
// Mobile: card top + details scroll below
// ================================================================

const N_PARTICLES = 24;

export default function DreamResult({ result, onRestart, onBack }) {
  const [phase, setPhase]         = useState(0);
  const [burst, setBurst]         = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 800);

  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    if (!result) return;
    const timers = [
      setTimeout(() => setPhase(1), 180),
      setTimeout(() => setPhase(2), 720),
      setTimeout(() => { setBurst(true); }, 760),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [result]);

  if (!result) return null;

  // Burst particles arranged radially
  const particles = Array.from({ length: N_PARTICLES }, (_, i) => {
    const angle = (i / N_PARTICLES) * 2 * Math.PI;
    const dist  = 80 + (i % 5) * 30;
    return {
      x:     Math.sin(angle) * dist,
      y:    -Math.cos(angle) * dist,
      size:  2 + (i % 5) * 1.4,
      color: i % 3 === 0 ? result.glow : i % 3 === 1 ? "#ffe24d" : "rgba(255,255,255,.75)",
      delay: (i % 7) * 0.038,
      dur:   0.55 + (i % 4) * 0.18,
    };
  });

  const cardW = isDesktop ? 268 : 225;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      fontFamily: "'Nunito', sans-serif", color: "#fff",
      background: phase >= 1
        ? `radial-gradient(ellipse 90% 70% at 50% 40%, ${result.glow}1c 0%, #030112 65%)`
        : "#030112",
      transition: "background 1.1s ease",
      overflow: "auto",
    }}>
      <style>{`
        @keyframes DR_flash  { 0%{opacity:.95} 100%{opacity:0} }
        @keyframes DR_cardIn { 0%{opacity:0;transform:translateY(90px) scale(.78) rotate(-5deg)} 55%{transform:translateY(-14px) scale(1.04) rotate(1.8deg)} 100%{opacity:1;transform:none} }
        @keyframes DR_float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes DR_shimmer{ 0%{background-position:-400% 0} 100%{background-position:400% 0} }
        @keyframes DR_glow   { 0%,100%{text-shadow:0 0 22px ${result?.glow}} 50%{text-shadow:0 0 45px ${result?.glow},0 0 80px ${result?.glow}66} }
        @keyframes DR_starIn { 0%{transform:scale(0) rotate(-180deg);opacity:0} 70%{transform:scale(1.35)} 100%{transform:scale(1);opacity:1} }
        @keyframes DR_slide  { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes DR_ambient{ 0%,100%{opacity:.45} 50%{opacity:.8} }
        @keyframes DR_corner { 0%,100%{opacity:.22} 50%{opacity:.6} }
        @keyframes DR_tagIn  { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        @keyframes DR_pinIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .DR_btn { transition:transform .2s,opacity .2s; border:none; cursor:pointer; }
        .DR_btn:hover { transform:translateY(-2px); opacity:.85; }
        .DR_back { transition:opacity .2s; border:none; cursor:pointer; background:transparent; }
        .DR_back:hover { opacity:.6; }
      `}</style>

      {/* ── Radial flash ── */}
      {phase === 1 && (
        <div style={{
          position:"fixed", inset:0, zIndex:210,
          background:`radial-gradient(circle at 50% 38%, ${result.glow}cc 0%, ${result.glow}30 50%, transparent 80%)`,
          animation:"DR_flash 1s ease-out both",
          pointerEvents:"none",
        }} />
      )}

      {/* ── Ambient glow orb ── */}
      {phase >= 1 && (
        <div style={{
          position:"fixed", left:"50%",
          top: isDesktop ? "44%" : "28%",
          transform:"translate(-50%,-50%)",
          width:520, height:520, borderRadius:"50%",
          background:`radial-gradient(circle, ${result.glow}1e 0%, transparent 70%)`,
          pointerEvents:"none",
          animation:"DR_ambient 4s ease-in-out infinite",
        }} />
      )}

      {/* ── Particles ── */}
      {phase >= 2 && particles.map((p, i) => (
        <div key={i} style={{
          position:"fixed",
          left:"50%", top: isDesktop ? "38%" : "26%",
          width:p.size, height:p.size, borderRadius:"50%",
          background:p.color,
          boxShadow:`0 0 ${p.size * 2.5}px ${p.color}`,
          transform: burst
            ? `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px)) scale(0)`
            : "translate(-50%,-50%) scale(1)",
          opacity: burst ? 0 : 1,
          transition:`transform ${p.dur}s ease-out ${p.delay}s, opacity .45s ease-out .12s`,
          pointerEvents:"none",
        }} />
      ))}

      {/* ── Page layout ── */}
      <div style={{
        minHeight:"100vh",
        display:"flex",
        flexDirection: isDesktop ? "row" : "column",
        alignItems: isDesktop ? "flex-start" : "stretch",
        justifyContent: isDesktop ? "center" : "flex-start",
        gap: isDesktop ? 56 : 0,
        padding: isDesktop ? "40px max(48px,calc(50vw - 540px))" : 0,
        boxSizing:"border-box",
      }}>

        {/* ═══════════════════════════════════
            TAROT CARD
        ═══════════════════════════════════ */}
        <div style={{
          display:"flex", justifyContent:"center",
          padding: isDesktop ? "52px 0" : "38px 0 20px",
          flexShrink:0,
          position: isDesktop ? "sticky" : "relative",
          top: isDesktop ? 0 : "auto",
          alignSelf: isDesktop ? "flex-start" : "auto",
          height: isDesktop ? "100vh" : "auto",
          alignItems: isDesktop ? "center" : "flex-start",
        }}>
          {phase >= 2 && (
            <div style={{
              width:cardW,
              borderRadius:30,
              background:`linear-gradient(168deg, rgba(14,5,38,.97) 0%, ${result.glow}15 48%, rgba(5,2,16,.98) 100%)`,
              border:`2px solid ${result.glow}88`,
              boxShadow:[
                `0 0 60px ${result.glow}44`,
                `0 0 120px ${result.glow}16`,
                `0 40px 90px rgba(0,0,0,.85)`,
                `inset 0 1px 0 rgba(255,255,255,.09)`,
              ].join(","),
              padding:"28px 20px 24px",
              position:"relative", overflow:"hidden",
              animation:"DR_cardIn .95s cubic-bezier(.34,1.42,.64,1) both, DR_float 5s ease-in-out 1.4s infinite",
            }}>

              {/* Shimmer sweep */}
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(110deg, transparent 32%, rgba(255,255,255,.065) 50%, transparent 68%)",
                backgroundSize:"400% 100%",
                animation:"DR_shimmer 6s linear 1.2s infinite",
                pointerEvents:"none",
              }} />

              {/* Corner ornaments */}
              {[{t:10,l:10},{t:10,r:10},{b:10,l:10},{b:10,r:10}].map((pos,i) => (
                <div key={i} style={{
                  position:"absolute", ...pos,
                  fontSize:13, color:`${result.glow}55`,
                  animation:`DR_corner ${2+i*.6}s ease-in-out ${i*.3}s infinite`,
                }}>✦</div>
              ))}

              {/* Top label */}
              <div style={{ fontSize:7, letterSpacing:2.5, color:`${result.glow}77`, textTransform:"uppercase", textAlign:"center", marginBottom:22, fontWeight:700 }}>
                DIGITAL BUSINESS INNOVATION
              </div>

              {/* Glow orb + emoji */}
              <div style={{ textAlign:"center", marginBottom:18 }}>
                <div style={{
                  display:"inline-flex",
                  width: isDesktop ? 108 : 95,
                  height: isDesktop ? 108 : 95,
                  borderRadius:"50%",
                  background:`radial-gradient(circle, ${result.glow}38 0%, ${result.glow}0e 65%, transparent 100%)`,
                  border:`1.5px solid ${result.glow}44`,
                  alignItems:"center", justifyContent:"center",
                  fontSize: isDesktop ? 64 : 56,
                  boxShadow:`0 0 40px ${result.glow}55, inset 0 0 22px ${result.glow}14`,
                }}>
                  {result.emoji}
                </div>
              </div>

              {/* Name */}
              {phase >= 3 && (
                <div style={{
                  fontFamily:"'Fredoka',sans-serif",
                  fontSize: isDesktop ? 23 : 20,
                  fontWeight:700, textAlign:"center", color:"#fff", marginBottom:5,
                  animation:"DR_glow 2.5s ease-in-out infinite, DR_slide .5s ease both",
                }}>
                  {result.name}
                </div>
              )}

              {/* Type */}
              <div style={{ fontSize:9.5, letterSpacing:1.5, textTransform:"uppercase", textAlign:"center", color:result.glow, marginBottom:18, opacity:.88 }}>
                {result.type}
              </div>

              {/* Stars (Genshin-style rarity) */}
              {phase >= 3 && (
                <div style={{ textAlign:"center", letterSpacing:3, marginBottom:16 }}>
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} style={{
                      color:result.glow, fontSize:18, display:"inline-block",
                      animation:`DR_starIn .45s cubic-bezier(.34,1.56,.64,1) ${.07+i*.1}s both`,
                    }}>{s}</span>
                  ))}
                </div>
              )}

              {/* Divider */}
              <div style={{ height:1, background:`linear-gradient(90deg,transparent,${result.glow}77,transparent)`, marginBottom:14 }} />

              {/* Power */}
              <div style={{ fontSize:11, textAlign:"center", color:"rgba(255,255,255,.62)", fontWeight:700, marginBottom:10 }}>
                ⚡ {result.power}
              </div>

              {/* Bottom label */}
              <div style={{ fontSize:7, letterSpacing:1.5, color:"rgba(255,255,255,.25)", textTransform:"uppercase", textAlign:"center" }}>
                BINUS @BEKASI
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════
            DETAILS PANEL
        ═══════════════════════════════════ */}
        {phase >= 4 && (
          <div style={{
            flex:1,
            padding: isDesktop ? "52px 40px 64px 0" : "0 18px 60px",
            animation:"DR_slide .7s ease both",
            overflowY: isDesktop ? "auto" : "visible",
            maxHeight: isDesktop ? "100vh" : "none",
          }}>
            {/* Label */}
            <p style={{ fontSize:10.5, letterSpacing:2.5, textTransform:"uppercase", color:result.glow, fontWeight:700, margin:"0 0 12px", opacity:.8 }}>
              ✦ Tipe Founder Kamu Adalah ✦
            </p>

            {/* Big name */}
            <h2 style={{
              fontFamily:"'Fredoka',sans-serif",
              fontSize: isDesktop ? 40 : 30,
              fontWeight:700, margin:"0 0 8px", color:"#fff", lineHeight:1.1,
              textShadow:`0 4px 24px ${result.glow}55`,
            }}>
              {result.name}
            </h2>

            {/* Type badge */}
            <div style={{
              display:"inline-block", fontSize:12, fontWeight:800, letterSpacing:.5,
              color:result.glow, background:"rgba(255,255,255,.06)",
              border:`1px solid ${result.glow}55`, borderRadius:30,
              padding:"5px 18px", margin:"0 0 20px",
            }}>
              {result.type}
            </div>

            {/* Dream reading */}
            <div style={{
              background:"rgba(255,255,255,.04)", border:`1px solid ${result.glow}22`,
              borderRadius:20, padding:"18px 22px", marginBottom:20,
              backdropFilter:"blur(8px)",
            }}>
              <p style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:result.glow, fontWeight:700, margin:"0 0 10px", opacity:.75 }}>
                ✦ Ramalan Impianmu
              </p>
              <p style={{ fontSize:14, lineHeight:1.78, margin:0, fontWeight:600, color:"rgba(255,255,255,.88)", fontStyle:"italic" }}>
                {result.dreamReading}
              </p>
            </div>

            {/* Fortune */}
            <div style={{
              background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.08)",
              borderRadius:16, padding:"14px 18px", marginBottom:22,
            }}>
              <p style={{ fontSize:13.5, lineHeight:1.7, margin:0, fontWeight:600, color:"rgba(255,255,255,.8)" }}>
                {result.fortune}
              </p>
            </div>

            {/* Courses */}
            <p style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:result.glow, fontWeight:700, margin:"0 0 10px", opacity:.7 }}>
              ✧ Mata Kuliah yang Menantimu
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
              {result.courses.map((c, i) => (
                <span key={i} style={{
                  fontSize:12, fontWeight:700, padding:"7px 15px", borderRadius:20,
                  background:`${result.glow}18`, border:`1px solid ${result.glow}44`, color:"#fff",
                  animation:`DR_tagIn .4s ${i*.1}s ease both`,
                }}>{c}</span>
              ))}
            </div>

            {/* Career */}
            <p style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:result.glow, fontWeight:700, margin:"0 0 6px", opacity:.7 }}>
              ✧ Jalur Karier Impianmu
            </p>
            <p style={{ fontSize:14.5, fontWeight:800, margin:"0 0 24px", lineHeight:1.6, color:"rgba(255,255,255,.9)" }}>
              {result.prospek}
            </p>

            {/* PIN callout */}
            <div style={{
              background:"#ffe24d", borderRadius:18, padding:"15px 22px", marginBottom:26,
              color:"#6a1f6a", fontSize:13.5, fontWeight:700, lineHeight:1.6,
              animation:"DR_pinIn .5s .15s ease both",
            }}>
              📸 Foto hasilmu untuk story, lalu tunjukkan ke kakak booth buat tukar{" "}
              <b>PIN {result.type}</b>-mu! 🎁
            </div>

            {/* Actions */}
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center" }}>
              <button className="DR_btn" onClick={onRestart} style={{
                fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:16,
                color:"#fff", background:"rgba(255,255,255,.1)",
                border:"1.5px solid rgba(255,255,255,.28)",
                padding:"12px 28px", borderRadius:40,
              }}>
                🔄 Cek tipe founder teman
              </button>
              <button className="DR_back" onClick={onBack} style={{
                fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:13,
                color:"rgba(196,168,255,.6)", padding:"10px 18px",
              }}>
                ← Game Hub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
