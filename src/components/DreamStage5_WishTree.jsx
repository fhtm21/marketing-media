import React, { useState, useRef, useCallback, useEffect } from "react";

// Stage 5 — Drag & Drop Lantern onto the Wish Tree
// Q: "Hal yang bikin kamu paling semangat?"
// Mechanic: Drag satu lantern ke atas → lepas di zona pohon → hang!

const WISHES = [
  { key:"trail",  emoji:"🔥", text:"Ngeliat ide jadi kenyataan dari nol",          color:"#ff7a59" },
  { key:"create", emoji:"🌊", text:"Bikin sesuatu yang viral & dikenal",            color:"#ff5fa8" },
  { key:"design", emoji:"💎", text:"Bikin produk yang enak & indah dipakai",        color:"#b06bff" },
  { key:"strat",  emoji:"🗺️",  text:"Nyusun strategi yang bikin bisnis tumbuh",     color:"#ffb020" },
  { key:"change", emoji:"🌱", text:"Bikin dampak nyata buat banyak orang",          color:"#2ecc8f" },
  { key:"tech",   emoji:"👑", text:"Ngembangin usaha yang udah ada jadi besar",     color:"#5b8cff" },
];

export default function DreamStage5_WishTree({ onComplete }) {
  const [dragging, setDragging]   = useState(null);   // wish object being dragged
  const [dragPos, setDragPos]     = useState({x:0,y:0}); // pointer position (client)
  const [overZone, setOverZone]   = useState(false);  // is dragged lantern over drop zone?
  const [hung, setHung]           = useState(null);   // successfully hung wish
  const [snapBack, setSnapBack]   = useState(null);   // key that snaps back
  const [phase, setPhase]         = useState("idle"); // idle | dragging | success

  const dropZoneRef  = useRef(null);
  const containerRef = useRef(null);
  const isDragging   = useRef(false);

  // ── Check if pointer is over the drop zone ──
  const checkOverZone = useCallback((clientX, clientY) => {
    if (!dropZoneRef.current) return false;
    const rect = dropZoneRef.current.getBoundingClientRect();
    return (
      clientX >= rect.left - 24 && clientX <= rect.right + 24 &&
      clientY >= rect.top  - 24 && clientY <= rect.bottom + 24
    );
  }, []);

  // ── Global pointer move / up ──
  useEffect(() => {
    if (!isDragging.current) return;
    const onMove = (e) => {
      const cx = e.clientX ?? e.touches?.[0]?.clientX;
      const cy = e.clientY ?? e.touches?.[0]?.clientY;
      setDragPos({ x: cx, y: cy });
      setOverZone(checkOverZone(cx, cy));
    };
    const onUp = (e) => {
      if (!isDragging.current || !dragging) return;
      const cx = e.clientX ?? e.changedTouches?.[0]?.clientX;
      const cy = e.clientY ?? e.changedTouches?.[0]?.clientY;
      isDragging.current = false;
      if (checkOverZone(cx, cy)) {
        // ✅ Success
        setPhase("success");
        setHung(dragging);
        setDragging(null);
        setOverZone(false);
        setTimeout(() => onComplete(dragging.key), 1300);
      } else {
        // ❌ Snap back
        setSnapBack(dragging.key);
        setDragging(null);
        setOverZone(false);
        setPhase("idle");
        setTimeout(() => setSnapBack(null), 500);
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend",  onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
  }, [dragging, checkOverZone, onComplete]);

  const startDrag = (e, wish) => {
    if (phase !== "idle") return;
    e.preventDefault();
    const cx = e.clientX ?? e.touches?.[0]?.clientX;
    const cy = e.clientY ?? e.touches?.[0]?.clientY;
    isDragging.current = true;
    setDragging(wish);
    setDragPos({ x: cx, y: cy });
    setPhase("dragging");
  };

  return (
    <div ref={containerRef} style={{ width:"100%", textAlign:"center", userSelect:"none" }}>
      <style>{`
        @keyframes lanternFloat  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes snapBack      { 0%{transform:scale(1.15)} 60%{transform:scale(.92)} 100%{transform:scale(1)} }
        @keyframes hangSuccess   { 0%{transform:translateY(-30px) scale(.8);opacity:0} 70%{transform:translateY(5px) scale(1.1)} 100%{transform:translateY(0) scale(1);opacity:1} }
        @keyframes treeGlow      { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.3)} }
        @keyframes firefly       { 0%,100%{opacity:.15;transform:translate(0,0)} 50%{opacity:.7;transform:translate(6px,-10px)} }
        @keyframes wishRise      { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .lantern-grip { cursor: grab; touch-action: none; }
        .lantern-grip:active { cursor: grabbing; }
      `}</style>

      <p style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:"#a8e6cf", fontWeight:700, margin:"0 0 10px", opacity:.85 }}>
        ✦ Langkah 5 dari 7 — Pohon Harapan ✦
      </p>
      <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontSize:22, fontWeight:700, color:"#fff", margin:"0 0 6px", textShadow:"0 2px 18px rgba(168,230,207,.4)" }}>
        Gantungkan Harapanmu di Pohon Impian
      </h2>
      <p style={{ fontSize:13, color:"#a8e6cf", fontWeight:600, margin:"0 0 16px", opacity:.88 }}>
        Hal yang bikin kamu paling semangat?
      </p>

      {/* ── Tree area (drop zone) ── */}
      <div
        ref={dropZoneRef}
        style={{
          position:"relative", borderRadius:22, marginBottom:14, padding:"16px 16px 12px",
          background: overZone
            ? "rgba(168,230,207,.14)"
            : hung
              ? "rgba(168,230,207,.08)"
              : "rgba(255,255,255,.04)",
          border: overZone
            ? "2px dashed rgba(168,230,207,.7)"
            : hung
              ? "2px solid rgba(168,230,207,.35)"
              : "2px dashed rgba(255,255,255,.12)",
          transition:"all .2s",
          minHeight:140,
        }}
      >
        {/* Tree emoji + trunk */}
        <div style={{ fontSize:14, letterSpacing:2, color:"rgba(168,230,207,.5)", fontWeight:700, marginBottom:8 }}>
          {overZone ? "✦ LEPASKAN DI SINI ✦" : hung ? "✦ HARAPAN TERGANTUNG ✦" : "⬆ SERET LENTERA KE SINI ⬆"}
        </div>

        <div style={{
          fontSize:52, lineHeight:1, filter:"drop-shadow(0 0 16px rgba(168,230,207,.4))",
          animation: overZone ? "treeGlow 1s ease-in-out infinite" : "none",
        }}>
          🌳
        </div>

        {/* Successfully hung lantern */}
        {hung && (
          <div style={{
            position:"absolute", top:10, right:18,
            animation:"hangSuccess .6s cubic-bezier(.34,1.56,.64,1) both",
          }}>
            {/* String */}
            <div style={{ width:2, height:16, background:`linear-gradient(180deg, rgba(255,255,255,.4), ${hung.color}88)`, margin:"0 auto 2px" }} />
            <div style={{
              width:52, height:52, borderRadius:14,
              background:`linear-gradient(135deg, ${hung.color}44, rgba(14,8,40,.92))`,
              border:`2px solid ${hung.color}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:26, boxShadow:`0 0 20px ${hung.color}66`,
            }}>
              {hung.emoji}
            </div>
          </div>
        )}

        {/* Fireflies */}
        {[...Array(4)].map((_,i)=>(
          <div key={i} style={{
            position:"absolute",
            left:`${18+i*20}%`, top:`${30+i*15}%`,
            width:4, height:4, borderRadius:"50%",
            background:"#a8e6cf",
            animation:`firefly ${2.5+i*.8}s ease-in-out ${i*.5}s infinite`,
            pointerEvents:"none",
          }} />
        ))}
      </div>

      {/* ── Lantern grid ── */}
      {!hung && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
          {WISHES.map((wish, i) => {
            const isBeingDragged = dragging?.key === wish.key;
            const isSnapping     = snapBack === wish.key;
            return (
              <div
                key={wish.key}
                className="lantern-grip"
                onMouseDown={(e) => startDrag(e, wish)}
                onTouchStart={(e) => startDrag(e, wish)}
                style={{
                  width:"calc(33.33% - 10px)",
                  borderRadius:16,
                  padding:"12px 10px",
                  background: isBeingDragged
                    ? "rgba(255,255,255,.02)"
                    : `linear-gradient(135deg, ${wish.color}22, rgba(14,8,40,.85))`,
                  border: isBeingDragged
                    ? "1.5px dashed rgba(255,255,255,.1)"
                    : `1.5px solid ${wish.color}44`,
                  boxShadow: isBeingDragged ? "none" : `0 4px 18px rgba(0,0,0,.3)`,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                  opacity: isBeingDragged ? 0.2 : 1,
                  animation: isSnapping
                    ? "snapBack .45s ease both"
                    : `lanternFloat ${4+i*.4}s ease-in-out ${i*.2}s infinite`,
                  transition:"opacity .2s, border .2s",
                  touchAction:"none",
                }}
              >
                {/* Lantern string */}
                <div style={{ width:2, height:10, background:`linear-gradient(180deg,rgba(255,255,255,.25),${wish.color}66)`, borderRadius:2 }} />
                {/* Body */}
                <div style={{
                  width:40, height:40, borderRadius:12,
                  background:`${wish.color}22`, border:`1.5px solid ${wish.color}66`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, boxShadow:`0 0 10px ${wish.color}33`,
                }}>
                  {wish.emoji}
                </div>
                <div style={{ fontSize:10.5, fontWeight:700, color:"rgba(255,255,255,.65)", lineHeight:1.3, textAlign:"center" }}>
                  {wish.text}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Floating drag ghost ── */}
      {dragging && (
        <div style={{
          position:"fixed",
          left: dragPos.x - 26, top: dragPos.y - 26,
          width:52, height:52, borderRadius:14,
          background:`linear-gradient(135deg, ${dragging.color}55, rgba(14,8,40,.9))`,
          border:`2px solid ${dragging.color}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:26, pointerEvents:"none", zIndex:9999,
          boxShadow:`0 0 24px ${dragging.color}88, 0 8px 24px rgba(0,0,0,.5)`,
          transform: overZone ? "scale(1.15)" : "scale(1)",
          transition:"transform .15s",
        }}>
          {dragging.emoji}
        </div>
      )}

      {!dragging && !hung && (
        <p style={{ marginTop:12, fontSize:12, color:"rgba(168,230,207,.55)", fontWeight:600 }}>
          🏮 Drag lentera ke pohon di atas...
        </p>
      )}

      {hung && (
        <div style={{ marginTop:12, animation:"wishRise .5s ease both" }}>
          <p style={{ fontSize:13.5, color:"#ffe24d", fontWeight:700, margin:0 }}>
            ✦ Harapanmu terbang bersama bintang ✦
          </p>
        </div>
      )}
    </div>
  );
}
