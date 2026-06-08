import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ============================================================
// ORBIT ROCKET ADVENTURE v3 — Full-Screen Landscape HD
// 7 planets × 7 unique game mechanics
// Cockpit Split-Layout · Character Operators · Typewriter
// Orbs · Drag&Drop · Shoot · Hologram · SkillDrop · Orbit · Hold
// Business IT Program — Binus @Bekasi
// ============================================================

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');`;

const STREAMS = {
  bet: { name: "Business Enterprise Technology", short: "Business Enterprise Tech", tint: "#ffd36e", fg: "#1a1140" },
  aib: { name: "Artificial Intelligence for Business", short: "AI for Business", tint: "#7fd4ff", fg: "#07203f" },
};

const PERSONAS = {
  analyst: {
    key: "analyst", emoji: "📈", name: "Sang Penerjemah Bisnis", role: "Business Analyst",
    stream: "bet", glow: "#ffd36e",
    fortune: "Kamu jembatan antara bos yang maunya 'pokoknya naik' dan data yang bilang kenyataannya. Masa depan: kamu yang ditanya tiap rapat penting — dan jawabanmu selalu 'tergantung datanya' dulu. 📊",
    prospek: "Business Analyst · Systems Analyst · Data Analyst · Project Manager",
    courses: ["Business Intelligence", "Business Analytics", "Modern Analytics", "Enterprise Business Process"],
  },
  social: {
    key: "social", emoji: "📱", name: "Sang Pembaca Sinyal", role: "Social Media Analyst",
    stream: "bet", glow: "#ff9ad1",
    fortune: "Kamu bisa baca 'mood' internet kayak ramalan bintang. 2030: satu campaign-mu trending nasional — dan kamu tetap mantengin engagement rate jam 2 pagi sambil senyum sendiri. 📱",
    prospek: "Social Media Analyst · Social Media Consultant · Web Analytics Consultant",
    courses: ["Social Media Fundamental", "Social Informatics", "Modern Analytics"],
  },
  builder: {
    key: "builder", emoji: "🤝", name: "Sang Penasihat Solusi", role: "IT Consultant",
    stream: "bet", glow: "#ffb86b",
    fortune: "Kamu jembatan antara 'maunya bisnis' dan 'apa yang teknologi bisa'. Masa depan: perusahaan datang sambil bilang 'tolong, sistem kami ribet banget' — dan kamu yang bikin semuanya jadi masuk akal. 🤝",
    prospek: "IT Consultant · Information Management Consultant · Programming Consultant · Systems Analyst",
    courses: ["Information Systems Analysis and Design", "Enterprise Business Process", "IT Governance & Security"],
  },
  ml: {
    key: "ml", emoji: "🤖", name: "Sang Pelatih Mesin", role: "Machine Learning Engineer",
    stream: "aib", glow: "#7fd4ff",
    fortune: "Kamu mengajari mesin jadi pintar — dan suatu hari modelmu menebak hal yang kamu sendiri nggak nyangka. Tenang, kamu yang melatihnya, kamu yang pegang kendali. 🤖",
    prospek: "Machine Learning Engineer · Data Scientist · AI Developer",
    courses: ["Machine Learning & Foundations", "Deep Learning for Business", "Foundations of Artificial Intelligence"],
  },
  smart: {
    key: "smart", emoji: "💡", name: "Sang Penasihat AI", role: "AI Consultant",
    stream: "aib", glow: "#9af5c8",
    fortune: "Kamu paham AI bukan buat gaya-gayaan, tapi buat mecahin masalah nyata. Masa depan: perusahaan nanya 'AI-nya enaknya dipakai di mana ya?' — dan kamu yang kasih jawaban paling pas. 💡",
    prospek: "AI Consultant · AI Solutions Specialist · Technology Consultant",
    courses: ["Smart Application", "Basic Artificial Intelligence", "Information Retrieval"],
  },
  cognitive: {
    key: "cognitive", emoji: "🔭", name: "Sang Peramal Data", role: "Data Scientist",
    stream: "aib", glow: "#c4a8ff",
    fortune: "Kamu meramal masa depan bukan pakai bola kristal, tapi pakai data. Perusahaan rebutan kamu buat 'menebak' tren sebelum terjadi — dan tebakanmu nyeremin akuratnya. 🔭",
    prospek: "Data Scientist · AI Analyst · Data Engineer",
    courses: ["Machine Learning & Foundations", "Deep Learning for Business", "Information Retrieval"],
  },
};

// ── 7 planets, each with unique mechanic type ──────────────
const PLANETS = [
  {
    id: "earth", name: "Bumi Station", emoji: "🌍", color: "#4a9eff", mechanic: "orbs",
    px: 5, py: 70,
    guide: { name: "Commander Arka", role: "Chief Navigator", emoji: "👨‍🚀", accent: "#ffd36e" },
    dialog: "Pilot, selamat bergabung dalam Misi ORBIT! Aku Commander Arka, navigator kepala ekspedisimu. Kita akan kunjungi 7 titik penting di cosmos untuk menemukan jalur profesimu di Business IT. Siap lepas landas?",
    question: "Pas ngerjain proyek bareng, kamu paling 'nyala' kalau lagi…",
    options: [
      { t: "Ngubah data jadi keputusan & strategi", to: "analyst" },
      { t: "Nyariin solusi teknologi paling pas", to: "builder" },
      { t: "Ngulik model biar bisa prediksi sesuatu", to: "ml" },
      { t: "Ngegali data buat nemuin jawaban tersembunyi", to: "cognitive" },
    ],
  },
  {
    id: "nebula", name: "Nebula Digital", emoji: "🌌", color: "#ff9ad1", mechanic: "drag",
    px: 20, py: 57,
    guide: { name: "Signal Master", role: "Digital Analyst", emoji: "📡", accent: "#ff9ad1" },
    dialog: "Sinyal cosmos sangat kuat di sini, Pilot! Aku Signal Master, spesialis perilaku digital. Nebula ini penuh dengan pola dari jutaan orang di internet. Seret sinyal yang tepat ke penerima!",
    question: "Weekend ideal versi kamu?",
    options: [
      { t: "Mantengin dashboard & angka bisnis", to: "analyst" },
      { t: "Bedah kenapa konten bisa viral", to: "social" },
      { t: "Bantuin teman benerin sistem/laptop", to: "builder" },
      { t: "Nyobain tools AI baru buat masalah", to: "smart" },
    ],
  },
  {
    id: "asteroid", name: "Asteroid Wawasan", emoji: "☄️", color: "#ffb86b", mechanic: "shoot",
    px: 35, py: 44,
    guide: { name: "Data Sage", role: "Pattern Keeper", emoji: "📊", accent: "#7fd4ff" },
    dialog: "Luar biasa, Pilot! Kamu sampai di Asteroid Wawasan. Aku Data Sage, penjaga pola cosmos. Asteroid bermuatan data melintas — tembak yang paling resonan denganmu!",
    question: "Hal yang bikin kamu paling 'wah'?",
    options: [
      { t: "Pola tersembunyi di balik data", to: "analyst" },
      { t: "Perilaku orang di internet", to: "social" },
      { t: "Mesin yang bisa belajar sendiri", to: "ml" },
      { t: "Prediksi data yang akurat banget", to: "cognitive" },
    ],
  },
  {
    id: "kepler", name: "Stasiun Kepler", emoji: "🛰️", color: "#ffb86b", mechanic: "hologram",
    px: 50, py: 37,
    guide: { name: "Tech Guardian", role: "Systems Architect", emoji: "⚙️", accent: "#ffb86b" },
    dialog: "Selamat di pusat komando Stasiun Kepler! Aku Tech Guardian, arsitek sistem cosmos. Panel hologram aktif — sentuh panel yang sesuai pertanyaan strategismu!",
    question: "Pertanyaan yang paling pengen kamu pecahin?",
    options: [
      { t: "\"Strategi bisnis ini bakal cuan nggak?\"", to: "analyst" },
      { t: "\"Gimana brand ini meledak di sosmed?\"", to: "social" },
      { t: "\"Sistem apa yang paling pas buat ini?\"", to: "builder" },
      { t: "\"AI mana yang paling pas buat bisnis?\"", to: "smart" },
    ],
  },
  {
    id: "sigma", name: "Cloud Sigma", emoji: "💫", color: "#9af5c8", mechanic: "skilldrop",
    px: 65, py: 44,
    guide: { name: "Data Sage", role: "Pattern Keeper", emoji: "📊", accent: "#9af5c8" },
    dialog: "Cloud Sigma — awan kosmik paling misterius! Aku Data Sage lagi. Fragmen skill bertebaran di sini — seret skill impianmu ke inti analyzer di tengah!",
    question: "Skill impian yang pengen banget kamu kuasai?",
    options: [
      { t: "Business Intelligence & analitik data", to: "analyst" },
      { t: "Social media analytics & listening", to: "social" },
      { t: "Machine Learning & deep learning", to: "ml" },
      { t: "Data science & prediksi tren", to: "cognitive" },
    ],
  },
  {
    id: "zeta", name: "Ring Zeta", emoji: "🪐", color: "#c4a8ff", mechanic: "orbit",
    px: 80, py: 57,
    guide: { name: "AI Oracle", role: "AI Visionary", emoji: "🔮", accent: "#c4a8ff" },
    dialog: "Pilot, kamu sudah sangat dekat! Aku AI Oracle, penjaga visi masa depan. Di Ring Zeta, semua kemungkinan berputar di orbit — klik modul yang tepat dari cincin keputusan!",
    question: "Kalau punya asisten AI pribadi, kamu mau dia jago…",
    options: [
      { t: "Bikin & atur konten otomatis", to: "social" },
      { t: "Bantu nyariin solusi terbaik", to: "builder" },
      { t: "Makin pinter tiap dikasih data", to: "ml" },
      { t: "Kasih rekomendasi cerdas", to: "smart" },
    ],
  },
  {
    id: "moon", name: "Moon Gate", emoji: "🌕", color: "#ffd36e", mechanic: "hold",
    px: 95, py: 70,
    guide: { name: "Commander Arka", role: "Chief Navigator", emoji: "👨‍🚀", accent: "#ffd36e" },
    dialog: "Pilot! Ini Moon Gate — gerbang akhir misi! Aku Commander Arka kembali menyaksikan keputusan finalmu. Tahan tombol pilihanmu hingga penuh — cosmos sedang memperhatikan!",
    question: "Mimpi kamu 10 tahun lagi?",
    options: [
      { t: "Jadi penasihat teknologi andalan perusahaan", to: "builder" },
      { t: "Menciptakan AI yang ngubah cara orang kerja", to: "ml" },
      { t: "Bikin produk super pintar yang viral", to: "smart" },
      { t: "Meramal masa depan lewat data raksasa", to: "cognitive" },
    ],
  },
];

function computeResult(scores) {
  const max = Math.max(...Object.values(scores));
  const order = ["analyst", "ml", "builder", "cognitive", "social", "smart"];
  return PERSONAS[order.find(k => scores[k] === max) || "analyst"];
}

// ── Responsive breakpoint hook ─────────────────────────────
function useIsMobile() {
  const [mob, setMob] = useState(() => typeof window !== "undefined" && window.innerWidth < 700);
  useEffect(() => {
    const h = () => setMob(window.innerWidth < 700);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return mob;
}

// ── Starfield ───────────────────────────────────────────────
function Starfield({ count = 55, fixed = false }) {
  const stars = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 2 + 0.3,
      delay: Math.random() * 5, dur: Math.random() * 3 + 2,
      color: i % 7 === 0 ? "#7fd4ff" : i % 11 === 0 ? "#ffd36e" : i % 17 === 0 ? "#ff9ad1" : "#fff",
    })), [count]);
  return (
    <div style={{ position: fixed ? "fixed" : "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {stars.map((s, i) => (
        <span key={i} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: s.color, opacity: 0.65,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Space Map (full-width top strip) ───────────────────────
function SpaceMap({ currentIdx, rocketPos, traveling, mob }) {
  const pathStr = PLANETS.map(p => `${p.px},${p.py}`).join(" ");
  return (
    <div style={{
      position: "relative", height: mob ? 72 : 120, flexShrink: 0,
      background: "linear-gradient(180deg,#020510 0%,#040918 100%)",
      borderBottom: "1px solid rgba(127,212,255,.12)", overflow: "hidden",
    }}>
      <Starfield count={mob ? 22 : 38} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <polyline points={pathStr} fill="none" stroke="rgba(127,212,255,.15)" strokeWidth="0.45" strokeDasharray="1 1.8" />
        {PLANETS.slice(0, currentIdx).map((_, i) =>
          PLANETS[i + 1] ? <line key={i}
            x1={PLANETS[i].px} y1={PLANETS[i].py}
            x2={PLANETS[i + 1].px} y2={PLANETS[i + 1].py}
            stroke="rgba(127,212,255,.4)" strokeWidth="0.5"
          /> : null
        )}
      </svg>
      {PLANETS.map((planet, i) => {
        const isDone = i < currentIdx, isCurrent = i === currentIdx;
        const sz = isCurrent ? (mob ? 26 : 42) : isDone ? (mob ? 17 : 28) : (mob ? 12 : 20);
        return (
          <div key={planet.id} style={{
            position: "absolute", left: `${planet.px}%`, top: `${planet.py}%`,
            transform: "translate(-50%,-50%)", zIndex: 2,
          }}>
            <div style={{
              width: sz, height: sz, borderRadius: "50%",
              background: isDone
                ? `radial-gradient(circle at 35% 30%,${planet.color}bb,${planet.color}44)`
                : isCurrent ? `radial-gradient(circle at 35% 30%,${planet.color}44,${planet.color}14)` : "rgba(255,255,255,.03)",
              border: isCurrent ? `2px solid ${planet.color}` : isDone ? `1.5px solid ${planet.color}66` : "1px solid rgba(255,255,255,.07)",
              boxShadow: isCurrent ? `0 0 22px ${planet.color}66` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isCurrent ? 20 : isDone ? 13 : 9,
              transition: "all .4s ease",
            }}>{planet.emoji}</div>
            {isCurrent && !mob && (
              <div style={{
                position: "absolute", top: "calc(100% + 3px)", left: "50%",
                transform: "translateX(-50%)", fontSize: 7, color: planet.color,
                whiteSpace: "nowrap", fontFamily: "'Orbitron',monospace", fontWeight: 700, letterSpacing: 0.5,
              }}>{planet.name.toUpperCase()}</div>
            )}
          </div>
        );
      })}
      <div style={{
        position: "absolute", left: `${rocketPos.x}%`, top: `${rocketPos.y}%`,
        transform: "translate(-50%,-50%)",
        transition: traveling ? "left 1.05s cubic-bezier(.2,.9,.2,1), top 1.05s cubic-bezier(.2,.9,.2,1)" : "none",
        zIndex: 10, fontSize: mob ? 13 : 21,
        filter: "drop-shadow(0 0 7px rgba(127,212,255,.7))",
        animation: traveling ? "none" : "floaty 2.5s ease-in-out infinite",
        transform: `translate(-50%,-50%) rotate(${traveling ? "-28deg" : "0deg"})`,
      }}>🚀</div>
      {!mob && <div style={{
        position: "absolute", top: 6, left: 12, zIndex: 3,
        fontFamily: "'Orbitron',monospace", fontSize: 7, letterSpacing: 2.5,
        color: "rgba(127,212,255,.32)", fontWeight: 700,
      }}>ORBIT MISSION MAP</div>}
    </div>
  );
}

// ── Character Dialog (typewriter) ──────────────────────────
function CharDialog({ guide, dialog, phase, onProceed }) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => { setIdx(0); setDone(false); }, [dialog]);
  useEffect(() => {
    if (done || phase !== "dialog") return;
    if (idx >= dialog.length) { setDone(true); return; }
    const t = setTimeout(() => setIdx(i => i + 1), 18);
    return () => clearTimeout(t);
  }, [idx, dialog, done, phase]);
  const handleClick = () => {
    if (!done) { setIdx(dialog.length); setDone(true); }
    else onProceed?.();
  };
  return (
    <div onClick={handleClick} style={{
      flex: 1, cursor: "pointer", userSelect: "none",
      padding: "10px 12px",
      background: "linear-gradient(145deg,rgba(5,11,28,.98),rgba(3,7,18,.99))",
      border: `1px solid ${guide.accent}1e`, borderLeft: `3px solid ${guide.accent}66`,
      borderRadius: 10, overflow: "hidden",
      display: "flex", flexDirection: "column", gap: 8, minHeight: 0,
    }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: `radial-gradient(circle,${guide.accent}1e,rgba(3,7,18,.9))`,
          border: `2px solid ${guide.accent}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, animation: "guidePulse 3s ease-in-out infinite",
        }}>{guide.emoji}</div>
        <div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: guide.accent, letterSpacing: 1.2, fontWeight: 700 }}>{guide.name.toUpperCase()}</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,.32)", letterSpacing: .4 }}>{guide.role}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 8, fontFamily: "'Orbitron',monospace", color: done ? guide.accent : "rgba(255,255,255,.25)" }}>
          {done ? "[ TAP → ]" : "..."}
        </div>
      </div>
      <div style={{ fontSize: 12.5, lineHeight: 1.68, color: "rgba(255,255,255,.85)", fontFamily: "'Exo 2',sans-serif", flex: 1, overflow: "auto" }}>
        "{dialog.slice(0, idx)}{!done && <span style={{ opacity: .6, animation: "blink .7s step-end infinite" }}>▌</span>}"
      </div>
    </div>
  );
}

// ── Cockpit HUD ─────────────────────────────────────────────
function CockpitHUD({ planetIdx, score, speedStreak, bonusFlash }) {
  const fuel = Math.max(5, Math.round(((PLANETS.length - planetIdx) / PLANETS.length) * 100));
  const fuelGrad = fuel > 50 ? "linear-gradient(90deg,#00d97e,#4a9eff)" : fuel > 25 ? "linear-gradient(90deg,#ffb86b,#ff8844)" : "linear-gradient(90deg,#ff5555,#ff8844)";
  return (
    <div style={{ flexShrink: 0, padding: "8px 12px", background: "linear-gradient(180deg,#030810 0%,#020609 100%)", borderTop: "1px solid rgba(127,212,255,.09)", position: "relative" }}>
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <span style={{ fontSize: 7, fontFamily: "'Orbitron',monospace", color: "#4a8fff", letterSpacing: 1 }}>FUEL CELL</span>
          <span style={{ fontSize: 7, fontFamily: "'Orbitron',monospace", color: "rgba(255,255,255,.28)" }}>{fuel}%</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,.06)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${fuel}%`, background: fuelGrad, borderRadius: 2, transition: "width .6s ease" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 7, fontFamily: "'Orbitron',monospace", color: "#4a8fff", letterSpacing: 1 }}>SCORE</div>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 20, fontWeight: 700, color: "#ffd36e", lineHeight: 1 }}>{String(score).padStart(4, "0")}</div>
        </div>
        {speedStreak >= 2 && (
          <div style={{
            background: "linear-gradient(135deg,rgba(255,100,50,.25),rgba(255,184,50,.15))",
            border: "1px solid rgba(255,150,50,.45)", borderRadius: 6,
            padding: "2px 7px", fontFamily: "'Orbitron',monospace", fontSize: 9, color: "#ffb86b", fontWeight: 700,
          }}>🔥 ×{speedStreak}</div>
        )}
        <div style={{ marginLeft: "auto" }}>
          <div style={{ display: "flex", gap: 3 }}>
            {PLANETS.map((_, i) => (
              <div key={i} style={{
                width: i === planetIdx ? 14 : 6, height: 5, borderRadius: 3,
                background: i < planetIdx ? "#7fd4ff" : i === planetIdx ? "#ffd36e" : "rgba(255,255,255,.11)",
                transition: "all .3s",
              }} />
            ))}
          </div>
          <div style={{ fontSize: 7, textAlign: "right", marginTop: 2, fontFamily: "'Orbitron',monospace", color: "rgba(255,255,255,.22)" }}>{planetIdx + 1} / {PLANETS.length}</div>
        </div>
      </div>
      {bonusFlash && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 4px)", left: "50%",
          fontFamily: "'Orbitron',monospace", fontSize: 9, fontWeight: 700,
          color: bonusFlash === "speed" ? "#00ff88" : "#ffb86b",
          textShadow: `0 0 12px ${bonusFlash === "speed" ? "#00ff88" : "#ffb86b"}`,
          animation: "bonusPop .85s ease-out forwards",
          whiteSpace: "nowrap", zIndex: 20, pointerEvents: "none",
        }}>
          {bonusFlash === "speed" ? "⚡ SPEED BONUS +50" : "🔥 STREAK BONUS +30"}
        </div>
      )}
    </div>
  );
}

// ── Planet scene backdrop ───────────────────────────────────
function PlanetScene({ planet }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Starfield count={55} />
      <div style={{ position: "absolute", width: 340, height: 340, borderRadius: "50%", background: `radial-gradient(circle,${planet.color}14,transparent 68%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", textAlign: "center", animation: "floaty 4s ease-in-out infinite", zIndex: 1 }}>
        <div style={{ fontSize: 100, filter: `drop-shadow(0 0 28px ${planet.color}88)`, lineHeight: 1 }}>{planet.emoji}</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 11, color: planet.color, letterSpacing: 3, marginTop: 10, opacity: .8 }}>{planet.name.toUpperCase()}</div>
      </div>
    </div>
  );
}

// ── Traveling scene ─────────────────────────────────────────
function TravelingScene({ nextPlanet }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Starfield count={70} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 64, filter: "drop-shadow(0 0 22px rgba(127,212,255,.7))", animation: "rocketFly 1.4s ease-in-out infinite" }}>🚀</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9.5, color: "rgba(127,212,255,.45)", letterSpacing: 3, marginTop: 12 }}>WARP DRIVE ACTIVE</div>
        {nextPlanet && (
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 12, fontWeight: 700, color: nextPlanet.color, marginTop: 6 }}>
            {nextPlanet.emoji} {nextPlanet.name.toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GAME MECHANIC 1 — FLOATING ORBS (earth) — CLICK
// ════════════════════════════════════════════════════════════
function MechOrbs({ options, onPick, color, mob }) {
  const [t, setT] = useState(0);
  const rafRef = useRef();
  const startRef = useRef(Date.now());
  const phases = useMemo(() => options.map((_, i) => ({
    xBase: 14 + i * 20, yBase: 25 + i * 14,
    xAmp: 5 + i * 2, yAmp: 11 + i * 2.5,
    xFreq: 0.28 + i * 0.08, yFreq: 0.44 + i * 0.07,
    xPhase: i * 1.5, yPhase: i * 0.9,
  })), [options]);
  useEffect(() => {
    const tick = () => { setT((Date.now() - startRef.current) / 1000); rafRef.current = requestAnimationFrame(tick); };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
  const orbColors = ["#4a9eff", "#ff9ad1", "#ffb86b", "#9af5c8"];
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <Starfield count={30} />
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: "rgba(127,212,255,.45)", letterSpacing: 2, whiteSpace: "nowrap", zIndex: 2 }}>
        KLIK ORB YANG PALING MENCERMINKAN KAMU
      </div>
      {options.map((opt, i) => {
        const p = phases[i];
        const x = p.xBase + Math.sin(t * p.xFreq + p.xPhase) * p.xAmp;
        const y = p.yBase + Math.sin(t * p.yFreq + p.yPhase) * p.yAmp;
        const c = orbColors[i % orbColors.length];
        return (
          <button key={i} onClick={() => onPick(opt)} style={{
            position: "absolute",
            left: `${Math.max(2, Math.min(mob ? 60 : 76, x))}%`,
            top: `${Math.max(12, Math.min(78, y))}%`,
            width: mob ? 100 : 138, height: mob ? 100 : 138, borderRadius: "50%",
            background: `radial-gradient(circle at 38% 32%,${c}44,${c}16)`,
            border: `2px solid ${c}88`,
            boxShadow: `0 0 30px ${c}44, 0 0 70px ${c}18`,
            color: "#fff", fontFamily: "'Exo 2',sans-serif",
            fontSize: mob ? 10 : 11.5, fontWeight: 600, lineHeight: 1.4,
            cursor: "pointer", padding: "8px 14px", textAlign: "center",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "transform .15s, box-shadow .15s", zIndex: 2,
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.14)"; e.currentTarget.style.boxShadow = `0 0 50px ${c}77`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = `0 0 30px ${c}44, 0 0 70px ${c}18`; }}>
            {opt.t}
          </button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GAME MECHANIC 2 — DRAG & DROP (nebula)
// ════════════════════════════════════════════════════════════
function MechDrag({ options, onPick, mob }) {
  const [dragging, setDragging] = useState(null);
  const [hovering, setHovering] = useState(false);
  const cardColors = ["#ff9ad1", "#ffd36e", "#7fd4ff", "#9af5c8"];
  const icons = ["📊", "📱", "⚙️", "🤖"];
  if (mob) return (
    <div style={{ width: "100%", height: "100%", overflow: "auto", padding: "8px 12px 12px", display: "flex", flexDirection: "column", gap: 9, position: "relative" }}>
      <Starfield count={18} />
      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7.5, color: "rgba(127,212,255,.42)", letterSpacing: 1.5, paddingBottom: 4, position: "relative", zIndex: 1, flexShrink: 0 }}>📶 KETUK SINYAL PILIHANMU</div>
      {options.map((opt, i) => (
        <button key={i} onClick={() => onPick(opt)} style={{
          background: `${cardColors[i % cardColors.length]}0e`, border: `1.5px solid ${cardColors[i % cardColors.length]}55`,
          borderRadius: 10, padding: "12px 14px", color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif",
          fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left",
          position: "relative", zIndex: 1, display: "flex", gap: 10, alignItems: "center",
        }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>{icons[i]}</span>{opt.t}
        </button>
      ))}
    </div>
  );
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 0, overflow: "hidden", position: "relative" }}>
      <Starfield count={30} />
      {/* Signal cards */}
      <div style={{ width: 230, flexShrink: 0, display: "flex", flexDirection: "column", gap: 9, padding: "12px 16px", zIndex: 2, height: "100%", justifyContent: "center" }}>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7.5, color: "rgba(255,255,255,.3)", letterSpacing: 1.5, marginBottom: 4 }}>📶 SINYAL TERSEDIA</div>
        {options.map((opt, i) => (
          <div key={i} draggable
            onDragStart={() => setDragging(opt)}
            onDragEnd={() => setDragging(null)}
            style={{
              background: `${cardColors[i % cardColors.length]}0e`,
              border: `1.5px solid ${cardColors[i % cardColors.length]}44`,
              borderRadius: 10, padding: "10px 12px",
              color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif",
              fontSize: 12.5, fontWeight: 600, cursor: "grab",
              userSelect: "none", backdropFilter: "blur(4px)",
              opacity: dragging === opt ? 0.35 : 1,
              transform: dragging === opt ? "scale(.93)" : "scale(1)",
              transition: "opacity .2s, transform .2s",
              display: "flex", gap: 9, alignItems: "center",
              boxShadow: `0 0 12px ${cardColors[i % cardColors.length]}16`,
            }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{icons[i]}</span>
            {opt.t}
          </div>
        ))}
      </div>
      {/* Arrow indicator */}
      <div style={{ zIndex: 2, fontSize: 28, opacity: dragging ? 0.9 : 0.2, transition: "opacity .3s", flexShrink: 0 }}>→</div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setHovering(true); }}
        onDragLeave={() => setHovering(false)}
        onDrop={e => { e.preventDefault(); setHovering(false); if (dragging) { onPick(dragging); setDragging(null); } }}
        style={{
          flex: 1, margin: "16px 20px 16px 10px", borderRadius: 22,
          border: `2px dashed ${hovering ? "#7fd4ff" : "rgba(127,212,255,.25)"}`,
          background: hovering ? "rgba(127,212,255,.1)" : "rgba(127,212,255,.03)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 12,
          transition: "all .25s",
          boxShadow: hovering ? "0 0 44px rgba(127,212,255,.28), inset 0 0 32px rgba(127,212,255,.08)" : "none",
          zIndex: 2,
        }}>
        <div style={{ fontSize: 52, animation: hovering ? "spinSlow 2s linear infinite" : "floaty 3s ease-in-out infinite" }}>📡</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: hovering ? "#7fd4ff" : "rgba(127,212,255,.35)", letterSpacing: 2, textAlign: "center" }}>
          {hovering ? "LEPAS UNTUK KIRIM SINYAL!" : "SERET SINYAL KE SINI"}
        </div>
        {dragging && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", fontFamily: "'Exo 2',sans-serif", textAlign: "center", padding: "0 14px", lineHeight: 1.45 }}>
            "{dragging.t}"
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GAME MECHANIC 3 — SHOOT ASTEROIDS (asteroid) — CLICK MOVING
// ════════════════════════════════════════════════════════════
function MechShoot({ options, onPick }) {
  const [exploded, setExploded] = useState(null);
  const durations = useMemo(() => [5.5, 4.2, 6.8, 3.8], []);
  const delays = useMemo(() => [0, -1.4, -3.1, -2.2], []);
  const tops = useMemo(() => [16, 31, 50, 68], []);
  const handleClick = (opt, i) => { setExploded(i); setTimeout(() => onPick(opt), 380); };
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <Starfield count={40} />
      <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: "rgba(255,184,107,.5)", letterSpacing: 2, whiteSpace: "nowrap", zIndex: 2 }}>
        ☄️ KLIK ASTEROID YANG RESONAN DENGANMU!
      </div>
      {/* laser line hints */}
      {tops.map((top, i) => (
        <div key={i} style={{
          position: "absolute", top: `${top + 3}%`, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg,transparent,rgba(255,184,107,.06),transparent)`,
          pointerEvents: "none", zIndex: 1,
        }} />
      ))}
      {options.map((opt, i) => (
        <button key={i} onClick={() => handleClick(opt, i)} style={{
          position: "absolute",
          top: `${tops[i]}%`,
          fontFamily: "'Exo 2',sans-serif", fontSize: 12.5, fontWeight: 700,
          color: "#fff",
          background: "rgba(255,184,107,.1)",
          border: "1.5px solid rgba(255,184,107,.5)",
          borderRadius: 14, padding: "8px 16px",
          cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
          whiteSpace: "nowrap",
          animation: exploded === i
            ? "explode .38s ease-out forwards"
            : `asteroidMove ${durations[i]}s linear ${delays[i]}s infinite`,
          zIndex: 2, boxShadow: "0 0 14px rgba(255,184,107,.25)",
        }}>
          <span style={{ fontSize: 22 }}>☄️</span>
          {opt.t}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GAME MECHANIC 4 — HOLOGRAM PANELS (kepler) — CLICK GRID
// ════════════════════════════════════════════════════════════
function MechHologram({ options, onPick, color, mob }) {
  const [hovered, setHovered] = useState(null);
  const c = color || "#ffb86b";
  const panelLabels = ["ALPHA", "BETA", "GAMMA", "DELTA"];
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: mob ? "auto" : "hidden" }}>
      <Starfield count={mob ? 18 : 30} />
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: `${c}55`, letterSpacing: 2, whiteSpace: "nowrap", zIndex: 2 }}>
        AKTIFKAN PANEL HOLOGRAM PILIHANMU
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 9 : 14, padding: mob ? "30px 14px 14px" : "30px 24px 16px", zIndex: 2, width: "100%", maxWidth: mob ? "100%" : 660 }}>
        {options.map((opt, i) => (
          <button key={i} onClick={() => onPick(opt)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === i ? `linear-gradient(135deg,${c}22,${c}0c)` : "linear-gradient(135deg,rgba(255,255,255,.04),rgba(255,255,255,.01))",
              border: hovered === i ? `2px solid ${c}bb` : `1px solid ${c}2e`,
              borderRadius: 14, padding: "18px 16px",
              color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif",
              fontSize: 13.5, fontWeight: 600, lineHeight: 1.45,
              cursor: "pointer", textAlign: "left",
              transition: "all .2s",
              boxShadow: hovered === i ? `0 0 30px ${c}44, inset 0 0 22px ${c}08` : "none",
              position: "relative", overflow: "hidden",
            }}>
            <span style={{ position: "absolute", top: 5, left: 5, width: 10, height: 10, borderTop: `2px solid ${c}55`, borderLeft: `2px solid ${c}55` }} />
            <span style={{ position: "absolute", top: 5, right: 5, width: 10, height: 10, borderTop: `2px solid ${c}55`, borderRight: `2px solid ${c}55` }} />
            <span style={{ position: "absolute", bottom: 5, left: 5, width: 10, height: 10, borderBottom: `2px solid ${c}55`, borderLeft: `2px solid ${c}55` }} />
            <span style={{ position: "absolute", bottom: 5, right: 5, width: 10, height: 10, borderBottom: `2px solid ${c}55`, borderRight: `2px solid ${c}55` }} />
            <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: c, letterSpacing: 1, display: "block", marginBottom: 7 }}>PANEL {panelLabels[i]}</span>
            {opt.t}
          </button>
        ))}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GAME MECHANIC 5 — SKILL DRAG TO DROP SLOT (sigma)
// ════════════════════════════════════════════════════════════
function MechSkillDrop({ options, onPick, color, mob }) {
  const [dragging, setDragging] = useState(null);
  const [slotHover, setSlotHover] = useState(false);
  const c = color || "#9af5c8";
  const skillCardColors = ["#7fd4ff", "#ff9ad1", "#9af5c8", "#c4a8ff"];
  if (mob) return (
    <div style={{ width: "100%", height: "100%", overflow: "auto", padding: "8px 12px 12px", display: "flex", flexDirection: "column", gap: 9, position: "relative" }}>
      <Starfield count={18} />
      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7.5, color: `${c}66`, letterSpacing: 1.5, paddingBottom: 4, position: "relative", zIndex: 1, flexShrink: 0 }}>💫 KETUK SKILL IMPIANMU</div>
      {options.map((opt, i) => (
        <button key={i} onClick={() => onPick(opt)} style={{
          background: `${skillCardColors[i]}0e`, border: `1.5px solid ${skillCardColors[i]}55`,
          borderRadius: 10, padding: "12px 14px", color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif",
          fontSize: 13.5, fontWeight: 600, cursor: "pointer", textAlign: "left",
          position: "relative", zIndex: 1,
        }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, color: skillCardColors[i], letterSpacing: 1, marginBottom: 4 }}>SKILL.{String(i + 1).padStart(2, "0")}</div>
          {opt.t}
        </button>
      ))}
    </div>
  );
  const positions = [
    { top: "10%", left: "8%" }, { top: "10%", right: "8%", left: "auto" },
    { bottom: "18%", left: "6%" }, { bottom: "18%", right: "6%", left: "auto" },
  ];
  const cardColors = ["#7fd4ff", "#ff9ad1", "#9af5c8", "#c4a8ff"];
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <Starfield count={32} />
      <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: `${c}77`, letterSpacing: 2, whiteSpace: "nowrap", zIndex: 2 }}>
        SERET SKILL IMPIANMU KE INTI ANALYZER
      </div>
      {/* Central drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setSlotHover(true); }}
        onDragLeave={() => setSlotHover(false)}
        onDrop={e => { e.preventDefault(); setSlotHover(false); if (dragging) { onPick(dragging); setDragging(null); } }}
        style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 148, height: 148, borderRadius: "50%",
          border: `2px dashed ${slotHover ? c : `${c}40`}`,
          background: slotHover ? `${c}12` : `${c}06`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 5,
          boxShadow: slotHover ? `0 0 44px ${c}44` : `0 0 22px ${c}16`,
          transition: "all .25s", zIndex: 2,
        }}>
        <div style={{ fontSize: 36, animation: slotHover ? "spinSlow 1.5s linear infinite" : "spinSlow 6s linear infinite" }}>⚙️</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, color: slotHover ? c : `${c}55`, letterSpacing: 1, textAlign: "center" }}>
          {slotHover ? "LEPAS SEKARANG!" : "DROP ZONE"}
        </div>
      </div>
      {/* Skill cards */}
      {options.map((opt, i) => (
        <div key={i} draggable
          onDragStart={() => setDragging(opt)}
          onDragEnd={() => setDragging(null)}
          style={{
            position: "absolute", ...positions[i],
            background: `${cardColors[i]}0e`,
            border: `1.5px solid ${cardColors[i]}44`,
            borderRadius: 12, padding: "9px 11px",
            color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif",
            fontSize: 11.5, fontWeight: 600, cursor: "grab",
            userSelect: "none", maxWidth: 170,
            opacity: dragging === opt ? 0.25 : 1,
            transform: dragging === opt ? "scale(.9)" : "scale(1)",
            transition: "opacity .2s, transform .2s",
            zIndex: 3, backdropFilter: "blur(4px)",
            boxShadow: `0 0 16px ${cardColors[i]}18`,
          }}>
          <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, color: cardColors[i], letterSpacing: 1, marginBottom: 4 }}>SKILL.{String(i + 1).padStart(2, "0")}</div>
          {opt.t}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GAME MECHANIC 6 — ORBITAL RING CLICK (zeta)
// ════════════════════════════════════════════════════════════
function MechOrbit({ options, onPick, color, mob }) {
  const c = color || "#c4a8ff";
  const [hovered, setHovered] = useState(null);
  const positions = [
    { top: mob ? "3%" : "6%", left: "50%", transform: "translateX(-50%)", textAlign: "center" },
    { top: "50%", right: mob ? "1%" : "4%", transform: "translateY(-50%)", textAlign: "right" },
    { bottom: mob ? "3%" : "6%", left: "50%", transform: "translateX(-50%)", textAlign: "center" },
    { top: "50%", left: mob ? "1%" : "4%", transform: "translateY(-50%)", textAlign: "left" },
  ];
  const nodeColors = ["#4a9eff", "#ff9ad1", "#ffb86b", "#9af5c8"];
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}>
      <Starfield count={35} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
        <ellipse cx="50%" cy="50%" rx="43%" ry="39%" fill="none" stroke={`${c}1e`} strokeWidth="1" strokeDasharray="3.5 3" />
        <ellipse cx="50%" cy="50%" rx="33%" ry="28%" fill="none" stroke={`${c}0c`} strokeWidth="0.6" />
      </svg>
      {/* Central planet */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: mob ? 58 : 88, height: mob ? 58 : 88, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%,${c}1e,rgba(3,7,18,.9))`,
        border: `2px solid ${c}44`, boxShadow: `0 0 28px ${c}2e`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: mob ? 24 : 34, animation: "spinSlow 20s linear infinite", zIndex: 2,
      }}>🪐</div>
      <div style={{ position: "absolute", top: `calc(50% + ${mob ? 33 : 50}px)`, left: "50%", transform: "translateX(-50%)", fontFamily: "'Orbitron',monospace", fontSize: 7.5, color: `${c}44`, letterSpacing: 1.5, whiteSpace: "nowrap", zIndex: 2 }}>KLIK MODUL ORBITAL</div>
      {options.map((opt, i) => (
        <div key={i} style={{ position: "absolute", ...positions[i], zIndex: 3, maxWidth: mob ? 128 : 180 }}>
          <button onClick={() => onPick(opt)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === i ? `${nodeColors[i]}22` : `${nodeColors[i]}0c`,
              border: `2px solid ${hovered === i ? nodeColors[i] : `${nodeColors[i]}44`}`,
              borderRadius: 12, padding: mob ? "7px 8px" : "9px 12px",
              color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif",
              fontSize: mob ? 10 : 11.5, fontWeight: 600, cursor: "pointer",
              transition: "all .2s", lineHeight: 1.35,
              boxShadow: hovered === i ? `0 0 26px ${nodeColors[i]}44` : "none",
              width: "100%",
            }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, color: nodeColors[i], letterSpacing: 1, marginBottom: 4 }}>MODULE {["A", "B", "C", "D"][i]}</div>
            {opt.t}
          </button>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// GAME MECHANIC 7 — HOLD TO LAUNCH (moon)
// ════════════════════════════════════════════════════════════
function MechHold({ options, onPick, color, mob }) {
  const c = color || "#ffd36e";
  const FILL_MS = 1700;
  const [charges, setCharges] = useState(options.map(() => 0));
  const intervals = useRef(options.map(() => null));
  const nodeColors = useMemo(() => ["#ffd36e", "#7fd4ff", "#ff9ad1", "#9af5c8"], []);

  const startCharge = useCallback((idx) => {
    if (intervals.current[idx]) return;
    intervals.current[idx] = setInterval(() => {
      setCharges(prev => {
        const next = [...prev];
        next[idx] = Math.min(100, next[idx] + 100 / (FILL_MS / 60));
        if (next[idx] >= 100) {
          clearInterval(intervals.current[idx]);
          intervals.current[idx] = null;
          setTimeout(() => onPick(options[idx]), 80);
        }
        return next;
      });
    }, 60);
  }, [onPick, options]);

  const stopCharge = useCallback((idx) => {
    clearInterval(intervals.current[idx]);
    intervals.current[idx] = null;
    setCharges(prev => { const n = [...prev]; n[idx] = 0; return n; });
  }, []);

  useEffect(() => { return () => intervals.current.forEach(clearInterval); }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Starfield count={42} />
      <div style={{ position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: `${c}66`, letterSpacing: 2, whiteSpace: "nowrap", zIndex: 2 }}>
        🚀 TAHAN TOMBOL PILIHANMU HINGGA 100%
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 9 : 14, padding: mob ? "28px 14px 10px" : "30px 20px 16px", zIndex: 2, width: "100%", maxWidth: mob ? "100%" : 640, overflow: mob ? "auto" : undefined }}>
        {options.map((opt, i) => {
          const pct = charges[i];
          const nc = nodeColors[i];
          const active = pct > 0;
          return (
            <div key={i} style={{ position: "relative" }}>
              <button
                onPointerDown={() => startCharge(i)}
                onPointerUp={() => stopCharge(i)}
                onPointerLeave={() => stopCharge(i)}
                style={{
                  width: "100%", minHeight: mob ? 62 : 86,
                  background: active ? `${nc}10` : "rgba(255,255,255,.03)",
                  border: `2px solid ${active ? nc : `${nc}28`}`,
                  borderRadius: 14, padding: "13px 15px",
                  color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif",
                  fontSize: 12.5, fontWeight: 600, lineHeight: 1.4,
                  cursor: "pointer", textAlign: "left",
                  transition: "border-color .2s, background .2s",
                  boxShadow: active ? `0 0 32px ${nc}30` : "none",
                  position: "relative", overflow: "hidden",
                  userSelect: "none", touchAction: "none",
                }}>
                <div style={{
                  position: "absolute", inset: 0, left: 0, top: 0,
                  width: `${pct}%`, background: `${nc}16`,
                  transition: "width .06s linear", borderRadius: "inherit", pointerEvents: "none",
                }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7.5, color: nc, letterSpacing: 1, marginBottom: 5 }}>
                    LAUNCH {["ALPHA", "BETA", "GAMMA", "DELTA"][i]}
                  </div>
                  {opt.t}
                </div>
              </button>
              <div style={{ height: 3, background: "rgba(255,255,255,.05)", borderRadius: 2, marginTop: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${nc}77,${nc})`, transition: "width .06s linear", boxShadow: active ? `0 0 5px ${nc}` : "none" }} />
              </div>
              {active && (
                <div style={{ textAlign: "center", fontFamily: "'Orbitron',monospace", fontSize: 8, color: nc, marginTop: 2, letterSpacing: 1 }}>
                  {Math.round(pct)}% CHARGED
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Mechanic router ─────────────────────────────────────────
const MECH_MAP = {
  orbs: MechOrbs,
  drag: MechDrag,
  shoot: MechShoot,
  hologram: MechHologram,
  skilldrop: MechSkillDrop,
  orbit: MechOrbit,
  hold: MechHold,
};

// ════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════
export default function OrbitRocketAdventure() {
  const [screen, setScreen] = useState("intro");
  const [subPhase, setSubPhase] = useState("dialog");
  const [planetIdx, setPlanetIdx] = useState(0);
  const [scores, setScores] = useState({ analyst: 0, social: 0, builder: 0, ml: 0, smart: 0, cognitive: 0 });
  const [score, setScore] = useState(0);
  const [speedStreak, setSpeedStreak] = useState(0);
  const [questionStart, setQuestionStart] = useState(null);
  const [bonusFlash, setBonusFlash] = useState(null);
  const [rocketPos, setRocketPos] = useState({ x: PLANETS[0].px, y: PLANETS[0].py });
  const [traveling, setTraveling] = useState(false);
  const [nextPlanet, setNextPlanet] = useState(null);

  const mob = useIsMobile();
  const planet = PLANETS[planetIdx];
  const persona = useMemo(() => computeResult(scores), [scores]);
  const pStream = STREAMS[persona.stream];
  const GameMechanic = MECH_MAP[planet.mechanic];

  const startGame = useCallback(() => {
    setPlanetIdx(0);
    setScores({ analyst: 0, social: 0, builder: 0, ml: 0, smart: 0, cognitive: 0 });
    setScore(0); setSpeedStreak(0); setBonusFlash(null);
    setRocketPos({ x: PLANETS[0].px, y: PLANETS[0].py });
    setTraveling(false); setNextPlanet(null);
    setSubPhase("dialog"); setScreen("game");
  }, []);

  const onDialogDone = useCallback(() => {
    setSubPhase("choosing");
    setQuestionStart(Date.now());
  }, []);

  const pick = useCallback((option) => {
    if (subPhase !== "choosing") return;
    const elapsed = questionStart ? (Date.now() - questionStart) / 1000 : 99;
    const isQuick = elapsed < 6;
    const newStreak = isQuick ? speedStreak + 1 : 0;
    let newScore = score + 100;
    let flash = null;
    if (isQuick) { newScore += 50; flash = "speed"; }
    if (newStreak >= 3) { newScore += 30; flash = "streak"; }
    setScores(s => ({ ...s, [option.to]: s[option.to] + 1 }));
    setScore(newScore); setSpeedStreak(newStreak);
    if (flash) { setBonusFlash(flash); setTimeout(() => setBonusFlash(null), 1600); }
    const isLast = planetIdx + 1 >= PLANETS.length;
    if (isLast) {
      setSubPhase("traveling"); setNextPlanet(null);
      setTimeout(() => setScreen("result"), 1400);
    } else {
      const next = PLANETS[planetIdx + 1];
      setNextPlanet(next); setSubPhase("traveling"); setTraveling(true);
      setTimeout(() => setRocketPos({ x: next.px, y: next.py }), 80);
      setTimeout(() => {
        setTraveling(false); setNextPlanet(null);
        setPlanetIdx(p => p + 1); setSubPhase("dialog");
      }, 1600);
    }
  }, [subPhase, questionStart, speedStreak, score, planetIdx]);

  // keyboard A/B/C/D
  useEffect(() => {
    if (subPhase !== "choosing") return;
    const map = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
    const handler = e => { const i = map[e.key.toLowerCase()]; if (i !== undefined && planet.options[i]) pick(planet.options[i]); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [subPhase, planet, pick]);

  // Base styles
  const BG = "radial-gradient(160% 120% at 50% 0%,#0b1635 0%,#060e22 40%,#030a18 100%)";

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        *{box-sizing:border-box}
        html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#020610}
        @keyframes twinkle{0%,100%{opacity:.1;transform:scale(.6)}50%{opacity:.95;transform:scale(1.3)}}
        @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes guidePulse{0%,100%{opacity:.8;transform:scale(1)}50%{opacity:1;transform:scale(1.1)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes bonusPop{0%{opacity:0;transform:translateX(-50%) scale(.4)}35%{opacity:1;transform:translateX(-50%) translateY(-10px) scale(1.2)}100%{opacity:0;transform:translateX(-50%) translateY(-28px) scale(.9)}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        @keyframes rocketBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-16px) scale(1.07)}}
        @keyframes rocketFly{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-12px) rotate(-6deg)}75%{transform:translateY(10px) rotate(6deg)}}
        @keyframes asteroidMove{from{left:108%}to{left:-32%}}
        @keyframes explode{0%{opacity:1;transform:scale(1)}55%{opacity:.6;transform:scale(1.8)}100%{opacity:0;transform:scale(.15)}}
        @keyframes scanPulse{0%,100%{opacity:.3}50%{opacity:.9}}
        .cta-btn:hover{box-shadow:0 0 50px rgba(127,212,255,.6)!important;transform:translateY(-2px) scale(1.03)!important}
      `}</style>

      {/* ════ INTRO ════ */}
      {screen === "intro" && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          background: BG, overflow: "auto", color: "#e8f0ff", fontFamily: "'Exo 2', sans-serif",
        }}>
          <Starfield count={70} fixed />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 580, width: "100%", padding: "24px 20px", animation: "rise .6s ease both" }}>
            <div style={{ fontSize: 8.5, fontFamily: "'Orbitron',monospace", letterSpacing: 3, color: "rgba(127,212,255,.42)", marginBottom: 10 }}>BINUS @BEKASI — BUSINESS IT PROGRAM</div>
            <div style={{ fontSize: mob ? 52 : 72, marginBottom: 4, animation: "rocketBounce 3s ease-in-out infinite" }}>🚀</div>
            <h1 style={{ fontFamily: "'Orbitron',monospace", fontSize: mob ? 36 : 50, fontWeight: 900, letterSpacing: mob ? 3 : 6, margin: "6px 0 2px", color: "#7fd4ff", textShadow: "0 0 36px rgba(127,212,255,.55),0 0 80px rgba(127,212,255,.2)" }}>ORBIT</h1>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: mob ? 8.5 : 10.5, letterSpacing: mob ? 2.5 : 4, color: "#4a8fff", marginBottom: 18 }}>ROCKET ADVENTURE</div>
            <div style={{ height: 1, width: 80, margin: "0 auto 20px", background: "linear-gradient(90deg,transparent,#7fd4ff,transparent)" }} />
            <p style={{ fontSize: 15, lineHeight: 1.78, opacity: .9, maxWidth: 420, margin: "0 auto 16px" }}>
              Jadilah <b style={{ color: "#7fd4ff" }}>pilot roket</b> menjelajahi <b style={{ color: "#ffd36e" }}>7 planet cosmos</b> Business IT. Tiap planet punya game berbeda — terbang, tembak, seret, orbit, dan lebih!
            </p>
            {/* Mini-game list */}
            <div style={{ margin: "0 auto 20px", maxWidth: 420, background: "rgba(127,212,255,.05)", border: "1px solid rgba(127,212,255,.15)", borderRadius: 14, padding: "14px 18px", fontSize: 13, lineHeight: 1.8, textAlign: "left" }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, color: "#7fd4ff", letterSpacing: 2, marginBottom: 10 }}>🎮 MINI-GAMES PER PLANET</div>
              <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? "5px" : "2px 12px" }}>
                <div>🌍 <b style={{ color: "#4a9eff" }}>Klik Orb Melayang</b></div>
                <div>🌌 <b style={{ color: "#ff9ad1" }}>Drag & Drop Sinyal</b></div>
                <div>☄️ <b style={{ color: "#ffb86b" }}>Tembak Asteroid!</b></div>
                <div>🛰️ <b style={{ color: "#ffb86b" }}>Panel Hologram</b></div>
                <div>💫 <b style={{ color: "#9af5c8" }}>Drag Skill ke Slot</b></div>
                <div>🪐 <b style={{ color: "#c4a8ff" }}>Klik Modul Orbital</b></div>
                <div>🌕 <b style={{ color: "#ffd36e" }}>Hold to Launch! 🚀</b></div>
                <div style={{ color: "rgba(255,255,255,.4)", fontSize: 11.5 }}>⌨️ keyboard A/B/C/D</div>
              </div>
            </div>
            <div style={{ margin: "0 auto 22px", maxWidth: 420, background: "rgba(255,211,110,.04)", border: "1px dashed rgba(255,211,110,.28)", borderRadius: 10, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.68)" }}>
              📸 Foto hasil misimu & tukar <b style={{ color: "#ffd36e" }}>PIN profesimu</b> di booth!
            </div>
            <button onClick={startGame} className="cta-btn" style={{
              fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 13.5, letterSpacing: 2.5,
              color: "#04081a", background: "linear-gradient(135deg,#a8ddff,#7fd4ff,#5ec8ff)",
              border: "none", padding: "15px 44px", borderRadius: 40, cursor: "pointer",
              boxShadow: "0 0 34px rgba(127,212,255,.42)", transition: "all .25s",
            }}>▶ LAUNCH MISSION</button>
          </div>
        </div>
      )}

      {/* ════ GAME ════ */}
      {screen === "game" && (
        <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: BG, overflow: "hidden" }}>
          {/* Top: Space Map */}
          <SpaceMap currentIdx={planetIdx} rocketPos={rocketPos} traveling={traveling} mob={mob} />

          {/* Middle + Bottom: Cockpit (left/bottom) + Arena (right/top) */}
          <div style={{ flex: 1, display: "flex", flexDirection: mob ? "column" : "row", overflow: "hidden", minHeight: 0 }}>

            {/* ─── COCKPIT PANEL (left on desktop, bottom on mobile) ─── */}
            <div style={{
              order: mob ? 2 : 0,
              width: mob ? "100%" : 345, flexShrink: 0,
              maxHeight: mob ? 278 : "none",
              display: "flex", flexDirection: "column",
              background: "linear-gradient(180deg,rgba(4,9,22,.99),rgba(2,6,16,1))",
              borderRight: mob ? "none" : "1px solid rgba(127,212,255,.1)",
              borderTop: mob ? "1px solid rgba(127,212,255,.13)" : "none",
              overflow: "hidden", minHeight: 0,
            }}>
              {/* Planet header bar */}
              <div style={{
                padding: "9px 12px 8px", borderBottom: "1px solid rgba(127,212,255,.07)",
                display: "flex", alignItems: "center", gap: 9, flexShrink: 0,
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  background: `radial-gradient(circle,${planet.color}33,transparent)`,
                  border: `1px solid ${planet.color}55`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                }}>{planet.emoji}</div>
                <div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, color: planet.color, letterSpacing: .9, fontWeight: 700 }}>{planet.name.toUpperCase()}</div>
                  <div style={{ fontSize: 7.5, color: "rgba(255,255,255,.28)", fontFamily: "'Orbitron',monospace" }}>PLANET {planetIdx + 1} OF {PLANETS.length}</div>
                </div>
                {subPhase === "choosing" && (
                  <div style={{ marginLeft: "auto", background: `${planet.color}16`, border: `1px solid ${planet.color}40`, borderRadius: 5, padding: "2px 6px", fontFamily: "'Orbitron',monospace", fontSize: 7, color: planet.color }}>● LIVE</div>
                )}
              </div>

              {/* Dialog / question / traveling */}
              <div style={{ flex: 1, padding: "10px 12px", overflow: "hidden", display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
                {(subPhase === "dialog" || subPhase === "choosing") && (
                  <CharDialog key={`d-${planetIdx}`} guide={planet.guide} dialog={planet.dialog} phase={subPhase} onProceed={onDialogDone} />
                )}
                {subPhase === "choosing" && (
                  <div style={{ flexShrink: 0, background: "rgba(127,212,255,.04)", border: "1px solid rgba(127,212,255,.1)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 7.5, fontFamily: "'Orbitron',monospace", color: "rgba(127,212,255,.38)", letterSpacing: 1, marginBottom: 5 }}>MISI SAAT INI</div>
                    <div style={{ fontSize: 13, lineHeight: 1.52, fontFamily: "'Exo 2',sans-serif", fontWeight: 600, color: "#dff6ff" }}>{planet.question}</div>
                    <div style={{ fontSize: 7.5, fontFamily: "'Orbitron',monospace", color: "rgba(255,255,255,.18)", marginTop: 5 }}>⌨️ KEYBOARD: A / B / C / D</div>
                  </div>
                )}
                {subPhase === "traveling" && (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, animation: "rise .4s ease both" }}>
                    <div style={{ fontSize: 30, animation: "rocketFly 1.2s ease-in-out infinite" }}>🚀</div>
                    <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: "#7fd4ff", letterSpacing: 2, textAlign: "center" }}>NAVIGATING TO</div>
                    {nextPlanet && (
                      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 11, fontWeight: 700, color: nextPlanet.color, textAlign: "center" }}>
                        {nextPlanet.emoji} {nextPlanet.name.toUpperCase()}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                      {[0, 1, 2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "#7fd4ff", animation: `blink .9s ease-in-out ${i * .22}s infinite` }} />)}
                    </div>
                  </div>
                )}
              </div>

              {/* HUD */}
              <CockpitHUD planetIdx={planetIdx} score={score} speedStreak={speedStreak} bonusFlash={bonusFlash} />
            </div>

            {/* ─── GAME ARENA ─── */}
            <div style={{ order: mob ? 1 : 0, flex: 1, position: "relative", overflow: "hidden", background: "radial-gradient(140% 140% at 50% 50%,rgba(10,18,42,.88),rgba(2,5,18,1))", minHeight: mob ? 200 : 0 }}>
              {subPhase === "dialog" && <PlanetScene planet={planet} />}
              {subPhase === "traveling" && <TravelingScene nextPlanet={nextPlanet} />}
              {subPhase === "choosing" && GameMechanic && (
                <GameMechanic key={`gm-${planetIdx}`} options={planet.options} onPick={pick} color={planet.color} mob={mob} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════ RESULT ════ */}
      {screen === "result" && (
        <div style={{ position: "fixed", inset: 0, background: BG, overflow: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", color: "#e8f0ff", fontFamily: "'Exo 2', sans-serif" }}>
          <Starfield count={65} fixed />
          <div style={{ position: "relative", zIndex: 2, maxWidth: 780, width: "100%", padding: "24px 20px", animation: "rise .65s ease both" }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, letterSpacing: 3, color: "rgba(127,212,255,.85)", textAlign: "center", marginBottom: 14 }}>✦ MISI SELESAI — PROFESI TERIDENTIFIKASI ✦</div>

            {/* Score bar */}
            <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 18, background: "rgba(127,212,255,.05)", border: "1px solid rgba(127,212,255,.13)", borderRadius: 12, overflow: "hidden" }}>
              {[["FINAL SCORE", String(score), "#ffd36e"], ["PLANETS VISITED", "7 / 7", "#7fd4ff"], ["SPEED STREAK", speedStreak >= 3 ? `${speedStreak}×🔥` : "—", "#ffb86b"]].map(([label, val, col], i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "10px 8px", borderRight: i < 2 ? "1px solid rgba(127,212,255,.1)" : "none" }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7, color: "#7fb8ff", letterSpacing: 1 }}>{label}</div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: mob ? 15 : 20, fontWeight: 700, color: col, marginTop: 2 }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Persona + details */}
            <div style={{ display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap", flexDirection: mob ? "column" : "row" }}>
              {/* Badge */}
              <div style={{ flex: mob ? "0 0 auto" : "0 0 210px", width: mob ? "100%" : undefined, textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", margin: "0 0 12px", animation: "pop .7s ease both" }}>
                  <div style={{ position: "absolute", inset: -22, borderRadius: "50%", background: `radial-gradient(circle,${persona.glow}2e,transparent 62%)`, animation: "spinSlow 12s linear infinite" }} />
                  <div style={{
                    position: "relative", width: 158, height: 158, borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 30%,#1a2a50,#060f28)",
                    border: `2.5px solid ${persona.glow}`,
                    boxShadow: `0 0 46px ${persona.glow}50, inset 0 0 26px ${persona.glow}16`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    margin: "0 auto",
                  }}>
                    <div style={{ fontSize: 50 }}>{persona.emoji}</div>
                    <div style={{ fontSize: 7.5, fontFamily: "'Orbitron',monospace", fontWeight: 700, color: persona.glow, letterSpacing: .8, marginTop: 7, textAlign: "center", lineHeight: 1.35 }}>BUSINESS IT<br />PROGRAM</div>
                  </div>
                </div>
                <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 15, fontWeight: 700, color: persona.glow, margin: "0 0 3px", lineHeight: 1.2 }}>{persona.name}</h2>
                <p style={{ fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,.82)", margin: "0 0 10px", fontWeight: 600 }}>{persona.role}</p>
                <div style={{ display: "inline-block", fontSize: 11.5, fontWeight: 700, color: pStream.fg, background: pStream.tint, borderRadius: 30, padding: "5px 14px", marginBottom: 12, boxShadow: `0 0 18px ${pStream.tint}50` }}>✦ {pStream.short}</div>
                <div style={{ fontSize: 12, lineHeight: 1.65, fontWeight: 600, color: "rgba(255,255,255,.88)", background: "rgba(127,212,255,.08)", border: "1px dashed rgba(127,212,255,.4)", borderRadius: 10, padding: "8px 10px" }}>
                  📸 Foto & tukar <b style={{ color: "#7fd4ff" }}>PIN {persona.role}</b>!
                </div>
              </div>

              {/* Right details */}
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 12, padding: "13px 14px", marginBottom: 13 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.72, margin: 0, fontStyle: "italic", color: "rgba(255,255,255,.92)", fontFamily: "'Exo 2',sans-serif" }}>{persona.fortune}</p>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 8.5, fontFamily: "'Orbitron',monospace", color: "rgba(127,212,255,.82)", letterSpacing: 1.5, marginBottom: 7 }}>MATA KULIAH YANG MENANTIMU</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {persona.courses.map((c, i) => <span key={i} style={{ fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20, background: `${persona.glow}14`, border: `1px solid ${persona.glow}40`, color: "#fff", fontFamily: "'Exo 2',sans-serif" }}>{c}</span>)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 8.5, fontFamily: "'Orbitron',monospace", color: "rgba(127,212,255,.82)", letterSpacing: 1.5, marginBottom: 6 }}>JALUR KARIER</div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: persona.glow, margin: 0, lineHeight: 1.58, fontFamily: "'Exo 2',sans-serif" }}>{persona.prospek}</p>
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginTop: 22 }}>
              <button onClick={startGame} style={{ fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 10, letterSpacing: 1.5, color: "rgba(255,255,255,.88)", background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.28)", padding: "11px 28px", borderRadius: 40, cursor: "pointer", transition: "all .2s" }}>↩ RESTART MISSION</button>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9, letterSpacing: 4, color: "rgba(127,212,255,.65)", marginTop: 16 }}>ORBIT ROCKET ADVENTURE</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
