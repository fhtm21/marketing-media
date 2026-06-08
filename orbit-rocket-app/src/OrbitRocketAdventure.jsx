import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";

// ============================================================
// ORBIT ROCKET ADVENTURE v2 — Mission Control Gamified
// User adalah pilot roket, menjelajahi 7 planet cosmos Business IT
// Cockpit UI · Character Operators · Typewriter Dialog
// Multitype Gamification: Click / Keyboard / Speed / Streak
// Business IT Program — Binus @Bekasi
// ============================================================

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;1,400&family=Quicksand:wght@400;500;600;700&display=swap');
`;

// ── Streaming meta ──────────────────────────────────────────
const STREAMS = {
  bet: { name: "Business Enterprise Technology", short: "Business Enterprise Tech", tint: "#ffd36e", fg: "#1a1140" },
  aib: { name: "Artificial Intelligence for Business", short: "AI for Business", tint: "#7fd4ff", fg: "#07203f" },
};

// ── Persona catalog (dari OrbitQuiz) ───────────────────────
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

// ── 7 Planets — tiap planet = 1 pertanyaan dari OrbitQuiz ──
const PLANETS = [
  {
    id: "earth", name: "Bumi Station", emoji: "🌍", color: "#4a9eff",
    px: 7, py: 68,
    guide: { name: "Commander Arka", role: "Chief Navigator", emoji: "👨‍🚀", accent: "#ffd36e" },
    dialog: "Pilot, selamat bergabung dalam Misi ORBIT! Aku Commander Arka, navigator kepala ekspedisimu. Kita akan kunjungi 7 titik penting di cosmos untuk menemukan jalur profesimu di Business IT. Siap untuk lepas landas?",
    question: "Pas ngerjain proyek bareng, kamu paling 'nyala' kalau lagi…",
    options: [
      { t: "Ngubah data jadi keputusan & strategi", to: "analyst" },
      { t: "Nyariin solusi teknologi paling pas buat tim", to: "builder" },
      { t: "Ngulik model biar bisa prediksi sesuatu", to: "ml" },
      { t: "Ngegali data buat nemuin jawaban tersembunyi", to: "cognitive" },
    ],
  },
  {
    id: "nebula", name: "Nebula Digital", emoji: "🌌", color: "#ff9ad1",
    px: 21, py: 55,
    guide: { name: "Signal Master", role: "Digital Analyst", emoji: "📡", accent: "#ff9ad1" },
    dialog: "Sinyal cosmos sangat kuat di sini, Pilot! Aku Signal Master, spesialis perilaku digital. Nebula ini penuh dengan pola dari jutaan orang di internet. Pertanyaanku untukmu...",
    question: "Weekend ideal versi kamu?",
    options: [
      { t: "Mantengin dashboard, tren & angka bisnis", to: "analyst" },
      { t: "Bedah kenapa sebuah konten bisa viral", to: "social" },
      { t: "Bantuin teman benerin masalah laptop/sistemnya", to: "builder" },
      { t: "Nyobain tools AI baru buat mecahin masalah", to: "smart" },
    ],
  },
  {
    id: "asteroid", name: "Asteroid Wawasan", emoji: "☄️", color: "#ffb86b",
    px: 35, py: 43,
    guide: { name: "Data Sage", role: "Pattern Keeper", emoji: "📊", accent: "#7fd4ff" },
    dialog: "Luar biasa, Pilot! Kamu sampai di Asteroid Wawasan. Aku Data Sage, penjaga pola tersembunyi cosmos. Asteroid ini mengandung kristal data murni yang memancarkan kebenaran...",
    question: "Hal yang bikin kamu paling 'wah'?",
    options: [
      { t: "Nemu pola tersembunyi di balik data", to: "analyst" },
      { t: "Paham banget perilaku orang di internet", to: "social" },
      { t: "Mesin yang bisa belajar sendiri dari data", to: "ml" },
      { t: "Prediksi dari data yang ternyata akurat banget", to: "cognitive" },
    ],
  },
  {
    id: "kepler", name: "Stasiun Kepler", emoji: "🛰️", color: "#ffb86b",
    px: 50, py: 36,
    guide: { name: "Tech Guardian", role: "Systems Architect", emoji: "⚙️", accent: "#ffb86b" },
    dialog: "Selamat di pusat komando Stasiun Kepler! Aku Tech Guardian, arsitek sistem cosmos. Di sini kita tentukan pertanyaan strategis yang paling menggerakkan pikiranmu...",
    question: "Pertanyaan yang paling pengen kamu pecahin?",
    options: [
      { t: "\"Strategi bisnis ini bakal cuan nggak?\"", to: "analyst" },
      { t: "\"Gimana caranya brand ini meledak di sosmed?\"", to: "social" },
      { t: "\"Sistem apa yang paling pas buat masalah ini?\"", to: "builder" },
      { t: "\"AI mana yang paling pas buat masalah bisnis ini?\"", to: "smart" },
    ],
  },
  {
    id: "sigma", name: "Cloud Sigma", emoji: "💫", color: "#9af5c8",
    px: 65, py: 43,
    guide: { name: "Data Sage", role: "Pattern Keeper", emoji: "📊", accent: "#9af5c8" },
    dialog: "Cloud Sigma — awan kosmik paling misterius di galaksi kita. Aku Data Sage lagi! Di sini kita temukan skill impian yang tersembunyi di antara bintang-bintang...",
    question: "Skill impian yang pengen banget kamu kuasai?",
    options: [
      { t: "Business Intelligence & analitik data", to: "analyst" },
      { t: "Social media analytics & listening", to: "social" },
      { t: "Machine Learning & deep learning", to: "ml" },
      { t: "Ngeramal tren pakai data (data science)", to: "cognitive" },
    ],
  },
  {
    id: "zeta", name: "Ring Zeta", emoji: "🪐", color: "#c4a8ff",
    px: 79, py: 55,
    guide: { name: "AI Oracle", role: "AI Visionary", emoji: "🔮", accent: "#c4a8ff" },
    dialog: "Pilot, kamu sudah sangat dekat! Aku AI Oracle, penjaga visi masa depan. Di Ring Zeta, kecerdasan buatan adalah nafas kehidupan. Bayangkan asisten AI impianmu...",
    question: "Kalau punya asisten AI pribadi, kamu mau dia jago…",
    options: [
      { t: "Bikin & atur konten otomatis", to: "social" },
      { t: "Bantu nyariin solusi pas buat tiap masalah", to: "builder" },
      { t: "Makin pinter sendiri tiap dikasih data", to: "ml" },
      { t: "Kasih rekomendasi cerdas buat ambil keputusan", to: "smart" },
    ],
  },
  {
    id: "moon", name: "Moon Gate", emoji: "🌕", color: "#ffd36e",
    px: 93, py: 68,
    guide: { name: "Commander Arka", role: "Chief Navigator", emoji: "👨‍🚀", accent: "#ffd36e" },
    dialog: "Pilot! Ini Moon Gate — gerbang akhir misi kita! Aku Commander Arka kembali untuk menyaksikan keputusan finalmu. Jawab dengan hati, bukan hanya pikiran. Cosmos sedang memperhatikan...",
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
  const key = order.find((k) => scores[k] === max) || "analyst";
  return PERSONAS[key];
}

// ── Starfield ───────────────────────────────────────────────
function Starfield({ count = 55 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 2.2 + 0.4,
      delay: Math.random() * 5, dur: Math.random() * 3 + 2,
      color: i % 7 === 0 ? "#7fd4ff" : i % 11 === 0 ? "#ffd36e" : i % 13 === 0 ? "#ff9ad1" : "#fff",
      opacity: Math.random() * 0.5 + 0.2,
    })), [count]
  );
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s, i) => (
        <span key={i} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, borderRadius: "50%",
          background: s.color, opacity: s.opacity,
          animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// ── Space Map (viewport atas) ───────────────────────────────
function SpaceMap({ currentIdx, rocketPos, traveling }) {
  const pathStr = PLANETS.map(p => `${p.px},${p.py}`).join(" ");
  return (
    <div style={{
      position: "relative", height: 162,
      background: "linear-gradient(180deg,rgba(1,4,18,.97) 0%,rgba(4,9,28,.95) 100%)",
      borderRadius: "14px 14px 0 0",
      border: "1px solid rgba(127,212,255,.18)", borderBottom: "none",
      overflow: "hidden",
    }}>
      <Starfield count={48} />
      {/* SVG path */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a9eff" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#7fd4ff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffd36e" stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <polyline points={pathStr} fill="none" stroke="url(#pg)" strokeWidth="0.5" strokeDasharray="1.3 1.6" />
        {PLANETS.slice(0, Math.max(0, currentIdx)).map((p, i) => (
          <line key={i}
            x1={PLANETS[i].px} y1={PLANETS[i].py}
            x2={PLANETS[i + 1] ? PLANETS[i + 1].px : p.px}
            y2={PLANETS[i + 1] ? PLANETS[i + 1].py : p.py}
            stroke="rgba(127,212,255,.28)" strokeWidth="0.45" />
        ))}
      </svg>

      {/* Planet nodes */}
      {PLANETS.map((planet, i) => {
        const isDone = i < currentIdx, isCurrent = i === currentIdx;
        const sz = isCurrent ? 38 : isDone ? 28 : 22;
        return (
          <div key={planet.id} style={{
            position: "absolute", left: `${planet.px}%`, top: `${planet.py}%`,
            transform: "translate(-50%,-50%)", zIndex: 2,
          }}>
            <div style={{
              width: sz, height: sz, borderRadius: "50%",
              background: isDone
                ? `radial-gradient(circle at 35% 30%,${planet.color}cc,${planet.color}55)`
                : isCurrent
                  ? `radial-gradient(circle at 35% 30%,${planet.color}88,${planet.color}33)`
                  : "rgba(255,255,255,.04)",
              border: isCurrent
                ? `2px solid ${planet.color}`
                : isDone ? `1.5px solid ${planet.color}77` : "1px solid rgba(255,255,255,.1)",
              boxShadow: isCurrent ? `0 0 18px ${planet.color}66` : isDone ? `0 0 8px ${planet.color}33` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: isCurrent ? 17 : isDone ? 12 : 9,
              transition: "all .4s ease",
            }}>{planet.emoji}</div>
            {isCurrent && (
              <div style={{
                position: "absolute", top: "calc(100% + 2px)", left: "50%",
                transform: "translateX(-50%)", fontSize: 6,
                color: planet.color, whiteSpace: "nowrap",
                fontFamily: "'Orbitron',monospace", fontWeight: 700, letterSpacing: 0.4,
              }}>{planet.name}</div>
            )}
          </div>
        );
      })}

      {/* Rocket — outer div handles position+transition, inner div handles float animation */}
      <div style={{
        position: "absolute", left: `${rocketPos.x}%`, top: `${rocketPos.y}%`,
        transform: "translate(-50%,-50%)",
        transition: traveling
          ? "left 1.1s cubic-bezier(.2,.9,.2,1), top 1.1s cubic-bezier(.2,.9,.2,1)"
          : "none",
        zIndex: 10,
      }}>
        <div style={{
          fontSize: 22,
          filter: "drop-shadow(0 0 7px rgba(127,212,255,.65))",
          animation: traveling ? "none" : "floaty 2.5s ease-in-out infinite",
          transform: traveling ? "rotate(-28deg) scale(1.1)" : "none",
          transition: "transform .3s ease",
        }}>🚀</div>
      </div>
      {traveling && (
        <div style={{
          position: "absolute", left: `${rocketPos.x}%`, top: `${rocketPos.y + 3}%`,
          transform: "translate(-50%,-50%) rotate(-28deg)",
          fontSize: 11, opacity: .45, filter: "blur(1px)", pointerEvents: "none", zIndex: 9,
        }}>💨</div>
      )}

      {/* Map label */}
      <div style={{
        position: "absolute", top: 6, left: 10,
        fontFamily: "'Orbitron',monospace", fontSize: 7, letterSpacing: 2,
        color: "rgba(127,212,255,.4)", fontWeight: 700,
      }}>ORBIT MISSION MAP</div>
    </div>
  );
}

// ── Cockpit HUD strip ───────────────────────────────────────
function CockpitHUD({ planetIdx, score, speedStreak, bonusFlash }) {
  const fuel = Math.max(5, Math.round(((PLANETS.length - planetIdx) / PLANETS.length) * 100));
  const fuelGrad = fuel > 50
    ? "linear-gradient(90deg,#00d97e,#4a9eff)"
    : fuel > 25 ? "linear-gradient(90deg,#ffb86b,#ff8844)"
      : "linear-gradient(90deg,#ff5555,#ff8844)";
  const fuelGlow = fuel > 50 ? "rgba(0,217,126,.45)" : "rgba(255,100,100,.45)";

  return (
    <div style={{
      background: "linear-gradient(180deg,#060c1b 0%,#040810 100%)",
      borderLeft: "1px solid rgba(127,212,255,.18)",
      borderRight: "1px solid rgba(127,212,255,.18)",
      padding: "7px 12px",
      display: "flex", gap: 10, alignItems: "center",
      position: "relative",
    }}>
      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,180,255,.018) 3px,rgba(0,180,255,.018) 4px)",
      }} />
      {/* Corner brackets */}
      {[[0,0,"top","left"],[0,0,"top","right"],[0,0,"bottom","left"],[0,0,"bottom","right"]].map((_,i) => {
        const sides = [["top","left"],["top","right"],["bottom","left"],["bottom","right"]][i];
        return (
          <div key={i} style={{
            position:"absolute", [sides[0]]: 0, [sides[1]]: 0, width: 7, height: 7,
            borderTop: sides[0]==="top" ? "2px solid rgba(127,212,255,.5)" : "none",
            borderBottom: sides[0]==="bottom" ? "2px solid rgba(127,212,255,.5)" : "none",
            borderLeft: sides[1]==="left" ? "2px solid rgba(127,212,255,.5)" : "none",
            borderRight: sides[1]==="right" ? "2px solid rgba(127,212,255,.5)" : "none",
          }} />
        );
      })}

      {/* Fuel gauge */}
      <div style={{ flex: 1, zIndex: 1 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
          <span style={{ fontSize: 7, color: "#4a8fff", fontFamily: "'Orbitron',monospace", letterSpacing: 1 }}>FUEL</span>
          <span style={{ fontSize: 7, color: "rgba(255,255,255,.3)", fontFamily: "'Orbitron',monospace" }}>{fuel}%</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,.08)", borderRadius: 3, border: "1px solid rgba(74,143,255,.22)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${fuel}%`, background: fuelGrad, borderRadius: 3,
            transition: "width .6s ease", boxShadow: `0 0 5px ${fuelGlow}`,
          }} />
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", gap: 3, alignItems: "center", zIndex: 1 }}>
        {PLANETS.map((_, i) => (
          <div key={i} style={{
            width: i === planetIdx ? 10 : 5, height: 5, borderRadius: 5,
            background: i < planetIdx ? "#7fd4ff" : i === planetIdx ? "#ffd36e" : "rgba(255,255,255,.14)",
            transition: "all .3s", boxShadow: i === planetIdx ? "0 0 6px rgba(255,211,110,.6)" : "none",
          }} />
        ))}
      </div>

      {/* Score */}
      <div style={{ textAlign: "right", zIndex: 1, minWidth: 56 }}>
        <div style={{ fontSize: 7, color: "#4a8fff", fontFamily: "'Orbitron',monospace", letterSpacing: 1, marginBottom: 1 }}>SCORE</div>
        <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 15, fontWeight: 700, color: "#ffd36e", lineHeight: 1 }}>
          {String(score).padStart(4, "0")}
        </div>
      </div>

      {/* Streak badge */}
      {speedStreak >= 2 && (
        <div style={{
          zIndex: 1,
          background: "linear-gradient(135deg,rgba(255,100,50,.28),rgba(255,184,50,.18))",
          border: "1px solid rgba(255,150,50,.5)",
          borderRadius: 6, padding: "2px 6px",
          fontFamily: "'Orbitron',monospace", fontSize: 7, color: "#ffb86b", fontWeight: 700,
        }}>🔥×{speedStreak}</div>
      )}

      {/* Bonus flash */}
      {bonusFlash && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: "'Orbitron',monospace", fontSize: 10, fontWeight: 700,
          color: bonusFlash === "speed" ? "#00ff88" : "#ffb86b",
          textShadow: `0 0 12px ${bonusFlash === "speed" ? "#00ff88" : "#ffb86b"}`,
          animation: "bonusPop .7s ease-out forwards",
          whiteSpace: "nowrap", zIndex: 20, pointerEvents: "none",
        }}>
          {bonusFlash === "speed" ? "⚡ SPEED BONUS +50" : `🔥 STREAK ×${speedStreak} +30`}
        </div>
      )}
    </div>
  );
}

// ── Character Dialog (typewriter) ───────────────────────────
function CharacterDialog({ guide, dialog, onProceed }) {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => { setIdx(0); setDone(false); }, [dialog]);

  useEffect(() => {
    if (done) return;
    if (idx >= dialog.length) { setDone(true); return; }
    const t = setTimeout(() => setIdx(i => i + 1), 19);
    return () => clearTimeout(t);
  }, [idx, dialog, done]);

  const handleClick = () => {
    if (!done) { setIdx(dialog.length); setDone(true); }
    else onProceed?.();
  };

  return (
    <div onClick={handleClick} style={{
      background: "linear-gradient(145deg,rgba(6,12,28,.96),rgba(4,8,20,.98))",
      border: `1px solid ${guide.accent}33`,
      borderLeft: `3px solid ${guide.accent}88`,
      borderRadius: 12, padding: "11px 13px",
      cursor: "pointer", userSelect: "none",
    }}>
      {/* Character header */}
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
          background: `radial-gradient(circle at 35% 30%,${guide.accent}2e,rgba(4,8,20,.9))`,
          border: `2px solid ${guide.accent}50`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 19, boxShadow: `0 0 12px ${guide.accent}22`,
          animation: "guidePulse 3s ease-in-out infinite",
        }}>{guide.emoji}</div>
        <div>
          <div style={{
            fontFamily: "'Orbitron',monospace", fontSize: 9.5,
            color: guide.accent, letterSpacing: 1.2, fontWeight: 700,
          }}>{guide.name.toUpperCase()}</div>
          <div style={{ fontSize: 8.5, color: "rgba(255,255,255,.36)", letterSpacing: .5 }}>{guide.role}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 8.5, fontFamily: "'Orbitron',monospace", color: done ? guide.accent : "rgba(255,255,255,.28)" }}>
          {done ? "[ TAP → ]" : "..."}
        </div>
      </div>
      {/* Text */}
      <div style={{ fontSize: 13.5, lineHeight: 1.65, color: "rgba(255,255,255,.88)", fontFamily: "'Exo 2',sans-serif", minHeight: 46 }}>
        "{dialog.slice(0, idx)}{!done && <span style={{ opacity: .6, animation: "blink .7s step-end infinite" }}>▌</span>}"
      </div>
    </div>
  );
}

// ── Timer bar (response-time indicator) ────────────────────
function TimerBar({ active }) {
  const [pct, setPct] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);
  const DURATION = 10000;

  useEffect(() => {
    if (!active) { setPct(0); return; }
    startRef.current = Date.now();
    const tick = () => {
      const e = Math.min(Date.now() - startRef.current, DURATION);
      setPct((e / DURATION) * 100);
      if (e < DURATION) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [active]);

  const isQuick = pct < 50;
  const barColor = isQuick ? "#00d97e" : pct < 80 ? "#ffb86b" : "#ff5555";

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
        <span style={{ fontSize: 7.5, fontFamily: "'Orbitron',monospace", color: "rgba(127,212,255,.4)", letterSpacing: 1 }}>RESPONSE TIME</span>
        {isQuick && <span style={{ fontSize: 7.5, fontFamily: "'Orbitron',monospace", color: "#00d97e" }}>⚡ SPEED ZONE</span>}
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,.06)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`, background: barColor,
          borderRadius: 2, boxShadow: `0 0 4px ${barColor}66`,
          transition: "background .3s",
        }} />
      </div>
    </div>
  );
}

// ── Traveling panel ─────────────────────────────────────────
function TravelingPanel({ nextPlanet }) {
  return (
    <div style={{ textAlign: "center", padding: "22px 0", animation: "travPulse .6s ease-in-out infinite alternate" }}>
      <div style={{ fontSize: 30, marginBottom: 10 }}>🚀</div>
      <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 10, color: "#7fd4ff", letterSpacing: 2, marginBottom: 4 }}>
        {nextPlanet ? "NAVIGATING TO..." : "MISSION COMPLETE!"}
      </div>
      <div style={{
        fontFamily: "'Orbitron',monospace", fontSize: 13, fontWeight: 700, letterSpacing: 1,
        color: nextPlanet?.color || "#ffd36e",
      }}>
        {nextPlanet ? `${nextPlanet.emoji} ${nextPlanet.name.toUpperCase()}` : "✦ PROFESI DITEMUKAN ✦"}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%", background: "#7fd4ff",
            animation: `blink .9s ease-in-out ${i * 0.22}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function OrbitRocketAdventure() {
  const [screen, setScreen] = useState("intro");
  const [subPhase, setSubPhase] = useState("dialog"); // dialog | choosing | traveling
  const [planetIdx, setPlanetIdx] = useState(0);
  const [scores, setScores] = useState({ analyst: 0, social: 0, builder: 0, ml: 0, smart: 0, cognitive: 0 });
  const [score, setScore] = useState(0);
  const [speedStreak, setSpeedStreak] = useState(0);
  const [questionStart, setQuestionStart] = useState(null);
  const [bonusFlash, setBonusFlash] = useState(null);
  const [rocketPos, setRocketPos] = useState({ x: PLANETS[0].px, y: PLANETS[0].py });
  const [traveling, setTraveling] = useState(false);
  const [nextPlanetForTravel, setNextPlanetForTravel] = useState(null);

  const planet = PLANETS[planetIdx];
  const persona = useMemo(() => computeResult(scores), [scores]);
  const pStream = STREAMS[persona.stream];

  // ── Start / restart ──
  const startGame = useCallback(() => {
    setPlanetIdx(0);
    setScores({ analyst: 0, social: 0, builder: 0, ml: 0, smart: 0, cognitive: 0 });
    setScore(0); setSpeedStreak(0); setBonusFlash(null);
    setRocketPos({ x: PLANETS[0].px, y: PLANETS[0].py });
    setTraveling(false); setNextPlanetForTravel(null);
    setSubPhase("dialog"); setScreen("game");
  }, []);

  // ── Dialog done → show question ──
  const onDialogDone = useCallback(() => {
    setSubPhase("choosing");
    setQuestionStart(Date.now());
  }, []);

  // ── Pick an answer ──
  const pick = useCallback((option) => {
    if (subPhase !== "choosing") return;
    const elapsed = questionStart ? (Date.now() - questionStart) / 1000 : 99;
    const isQuick = elapsed < 5;
    const newStreak = isQuick ? speedStreak + 1 : 0;
    let newScore = score + 100;
    let flash = null;
    if (isQuick) { newScore += 50; flash = "speed"; }
    if (newStreak >= 3) { newScore += 30; flash = "streak"; }

    setScores(s => ({ ...s, [option.to]: s[option.to] + 1 }));
    setScore(newScore);
    setSpeedStreak(newStreak);
    if (flash) { setBonusFlash(flash); setTimeout(() => setBonusFlash(null), 1500); }

    const isLast = planetIdx + 1 >= PLANETS.length;
    if (isLast) {
      setSubPhase("traveling");
      setNextPlanetForTravel(null);
      setTimeout(() => setScreen("result"), 1200);
    } else {
      const next = PLANETS[planetIdx + 1];
      setNextPlanetForTravel(next);
      setSubPhase("traveling");
      setTraveling(true);
      setTimeout(() => setRocketPos({ x: next.px, y: next.py }), 80);
      setTimeout(() => {
        setTraveling(false);
        setNextPlanetForTravel(null);
        setPlanetIdx(p => p + 1);
        setSubPhase("dialog");
      }, 1550);
    }
  }, [subPhase, questionStart, speedStreak, score, planetIdx]);

  // ── Keyboard shortcuts A/B/C/D ──
  useEffect(() => {
    if (subPhase !== "choosing") return;
    const keyMap = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
    const handler = (e) => {
      const i = keyMap[e.key.toLowerCase()];
      if (i !== undefined && planet.options[i]) pick(planet.options[i]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [subPhase, planet, pick]);

  // ────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", width: "100%", position: "relative",
      fontFamily: "'Exo 2', sans-serif", color: "#e8f0ff",
      background: "radial-gradient(130% 100% at 50% -5%,#0e1b3a 0%,#07112a 35%,#050b1e 70%,#020610 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px 16px", boxSizing: "border-box", overflow: "hidden",
    }}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes twinkle{0%,100%{opacity:.1;transform:scale(.65)}50%{opacity:.95;transform:scale(1.25)}}
        @keyframes floaty{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-7px) rotate(4deg)}}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes guidePulse{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:1;transform:scale(1.07)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes bonusPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}30%{opacity:1;transform:translate(-50%,-50%) scale(1.2)}100%{opacity:0;transform:translate(-50%,-75%) scale(1)}}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pop{0%{transform:scale(.5);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @keyframes rocketBounce{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-16px) scale(1.08)}}
        @keyframes travPulse{from{opacity:.7}to{opacity:1}}
        .cta-btn:hover{box-shadow:0 0 40px rgba(127,212,255,.55)!important;transform:translateY(-2px) scale(1.02)!important}
        .opt-btn{transition:all .18s ease!important}
        .opt-btn:hover{transform:translateX(5px)!important;border-color:rgba(127,212,255,.65)!important;background:rgba(127,212,255,.09)!important;box-shadow:0 4px 20px rgba(127,212,255,.12)!important}
        .opt-btn:active{transform:scale(.97)!important}
      `}</style>

      <Starfield count={65} />
      {/* Nebula glows */}
      <div style={{ position:"absolute",top:"-8%",right:"-8%",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(127,212,255,.06) 0%,transparent 70%)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"-5%",left:"-8%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,rgba(196,168,255,.05) 0%,transparent 70%)",pointerEvents:"none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: 520, zIndex: 2 }}>

        {/* ═══════════════ INTRO ═══════════════ */}
        {screen === "intro" && (
          <div style={{ textAlign: "center", animation: "rise .65s ease both" }}>
            <div style={{ fontSize: 9, fontFamily: "'Orbitron',monospace", letterSpacing: 3, color: "rgba(127,212,255,.5)", marginBottom: 8 }}>
              BINUS @BEKASI — BUSINESS IT PROGRAM
            </div>
            <div style={{ fontSize: 58, marginBottom: 4, animation: "rocketBounce 3s ease-in-out infinite" }}>🚀</div>
            <h1 style={{
              fontFamily: "'Orbitron',monospace", fontSize: 42, fontWeight: 900, letterSpacing: 4,
              margin: "6px 0 2px", color: "#7fd4ff",
              textShadow: "0 0 30px rgba(127,212,255,.5),0 0 60px rgba(127,212,255,.2)",
            }}>ORBIT</h1>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9.5, letterSpacing: 3, color: "#4a8fff", marginBottom: 16 }}>
              ROCKET ADVENTURE
            </div>
            <div style={{ height: 1, width: 80, margin: "0 auto 18px", background: "linear-gradient(90deg,transparent,#7fd4ff,transparent)" }} />

            <p style={{ fontSize: 15, lineHeight: 1.75, opacity: .88, maxWidth: 380, margin: "0 auto 12px" }}>
              Jadilah <b style={{ color: "#7fd4ff" }}>pilot roket</b> yang menjelajahi <b style={{ color: "#ffd36e" }}>7 planet cosmos</b> Business IT! Jawab setiap misi bersama character guide dan temukan profesi masa depanmu.
            </p>

            {/* How to play */}
            <div style={{
              margin: "14px auto", maxWidth: 380,
              background: "rgba(127,212,255,.05)", border: "1px solid rgba(127,212,255,.18)",
              borderRadius: 12, padding: "12px 14px", fontSize: 12.5, lineHeight: 1.65, textAlign: "left",
            }}>
              <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, color: "#7fd4ff", letterSpacing: 1.5, marginBottom: 7 }}>🎮 HOW TO PLAY</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div>💬 Baca dialog character operator, tap untuk lanjut ke pertanyaan</div>
                <div>⚡ Jawab dalam 5 detik → <b style={{ color: "#00d97e" }}>+50 Speed Bonus!</b></div>
                <div>🔥 3x berturut-turut → <b style={{ color: "#ffb86b" }}>Streak Bonus +30!</b></div>
                <div>⌨️ Bisa tekan <b style={{ color: "#7fd4ff" }}>A / B / C / D</b> di keyboard</div>
              </div>
            </div>

            <div style={{
              margin: "0 auto 22px", maxWidth: 380,
              background: "rgba(255,211,110,.05)", border: "1px dashed rgba(255,211,110,.3)",
              borderRadius: 10, padding: "8px 14px",
              fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.72)",
            }}>
              📸 Foto hasil misimu & tukar <b style={{ color: "#ffd36e" }}>PIN profesimu</b> di booth!
            </div>

            <button onClick={startGame} className="cta-btn" style={{
              fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 13, letterSpacing: 2,
              color: "#04081a", background: "linear-gradient(135deg,#a8ddff,#7fd4ff,#5ec8ff)",
              border: "none", padding: "14px 38px", borderRadius: 40, cursor: "pointer",
              boxShadow: "0 0 28px rgba(127,212,255,.4)", transition: "all .25s",
            }}>▶ LAUNCH MISSION</button>
          </div>
        )}

        {/* ═══════════════ GAME ═══════════════ */}
        {screen === "game" && (
          <div style={{ animation: "rise .4s ease both" }}>
            {/* Space viewport */}
            <SpaceMap currentIdx={planetIdx} rocketPos={rocketPos} traveling={traveling} />

            {/* HUD */}
            <CockpitHUD planetIdx={planetIdx} score={score} speedStreak={speedStreak} bonusFlash={bonusFlash} />

            {/* Main panel */}
            <div style={{
              background: "linear-gradient(165deg,rgba(10,16,38,.97),rgba(6,11,26,.99))",
              border: "1px solid rgba(127,212,255,.17)", borderTop: "none",
              borderRadius: "0 0 14px 14px", padding: "13px 13px 14px",
            }}>
              {/* — DIALOG — */}
              {subPhase === "dialog" && (
                <CharacterDialog
                  key={`dialog-${planetIdx}`}
                  guide={planet.guide}
                  dialog={planet.dialog}
                  onProceed={onDialogDone}
                />
              )}

              {/* — TRAVELING — */}
              {subPhase === "traveling" && (
                <TravelingPanel nextPlanet={nextPlanetForTravel} />
              )}

              {/* — CHOOSING — */}
              {subPhase === "choosing" && (
                <div style={{ animation: "rise .3s ease both" }}>
                  {/* Planet badge */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6, marginBottom: 9,
                    padding: "5px 10px",
                    background: `${planet.color}0d`, border: `1px solid ${planet.color}2c`,
                    borderRadius: 8,
                  }}>
                    <span style={{ fontSize: 13 }}>{planet.emoji}</span>
                    <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 8.5, color: planet.color, letterSpacing: .8, fontWeight: 700 }}>
                      {planet.name.toUpperCase()} — MISI {planetIdx + 1}/{PLANETS.length}
                    </span>
                    <span style={{ marginLeft: "auto", fontFamily: "'Orbitron',monospace", fontSize: 7.5, color: "rgba(127,212,255,.38)" }}>A/B/C/D</span>
                  </div>

                  {/* Timer */}
                  <TimerBar key={`timer-${planetIdx}`} active />

                  {/* Question */}
                  <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, margin: "8px 0 12px", color: "#e8f0ff", fontFamily: "'Exo 2',sans-serif" }}>
                    {planet.question}
                  </div>

                  {/* Options */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {planet.options.map((opt, i) => (
                      <button key={i} className="opt-btn" onClick={() => pick(opt)} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        fontFamily: "'Exo 2',sans-serif", fontWeight: 600, fontSize: 14,
                        textAlign: "left", color: "rgba(255,255,255,.88)", cursor: "pointer",
                        background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.11)",
                        padding: "11px 13px", borderRadius: 10,
                      }}>
                        <span style={{
                          minWidth: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          background: "rgba(127,212,255,.08)", border: "1px solid rgba(127,212,255,.26)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "'Orbitron',monospace", fontSize: 8.5, fontWeight: 700, color: "#7fd4ff",
                        }}>{["A","B","C","D"][i]}</span>
                        {opt.t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════ RESULT ═══════════════ */}
        {screen === "result" && (
          <div style={{ textAlign: "center", animation: "rise .65s ease both" }}>
            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 8, letterSpacing: 3, color: "rgba(127,212,255,.5)", margin: "0 0 12px" }}>
              ✦ MISI SELESAI — PROFESI TERIDENTIFIKASI ✦
            </div>

            {/* Score summary */}
            <div style={{
              display: "flex", justifyContent: "center", gap: 14, marginBottom: 14,
              padding: "8px 16px",
              background: "rgba(127,212,255,.05)", border: "1px solid rgba(127,212,255,.15)",
              borderRadius: 10,
            }}>
              {[["FINAL SCORE", String(score), "#ffd36e"], ["PLANETS", String(PLANETS.length), "#7fd4ff"], ...(speedStreak >= 3 ? [["STREAK", `${speedStreak}×`, "#ffb86b"]] : [])].map(([label, val, color]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 7.5, color: "#4a8fff", letterSpacing: 1 }}>{label}</div>
                  <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 22, fontWeight: 700, color }}>{val}</div>
                </div>
              )).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <div key={`d${i}`} style={{ width: 1, background: "rgba(127,212,255,.2)" }} />, el], [])}
            </div>

            {/* Persona badge */}
            <div style={{ position: "relative", display: "inline-block", margin: "4px 0 14px", animation: "pop .7s ease both" }}>
              <div style={{
                position: "absolute", inset: -22, borderRadius: "50%",
                background: `radial-gradient(circle,${persona.glow}38,transparent 68%)`,
                animation: "spinSlow 14s linear infinite",
              }} />
              <div style={{
                position: "relative", width: 150, height: 150, borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%,#1a2a50,#07102a)",
                border: `2px solid ${persona.glow}`,
                boxShadow: `0 0 40px ${persona.glow}55,inset 0 0 22px ${persona.glow}18`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                margin: "0 auto", padding: 8, boxSizing: "border-box",
              }}>
                <div style={{ fontSize: 44, lineHeight: 1 }}>{persona.emoji}</div>
                <div style={{ fontSize: 7.5, letterSpacing: 1, marginTop: 6, fontFamily: "'Orbitron',monospace", fontWeight: 700, color: persona.glow }}>BUSINESS IT PROGRAM</div>
                <div style={{ fontSize: 7, letterSpacing: .5, opacity: .8, fontFamily: "'Orbitron',monospace" }}>BINUS @BEKASI</div>
              </div>
            </div>

            <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 21, fontWeight: 700, letterSpacing: 1, color: persona.glow, margin: "0 0 3px", textShadow: `0 0 20px ${persona.glow}44` }}>
              {persona.name}
            </h2>
            <p style={{ fontSize: 11.5, letterSpacing: 1.5, textTransform: "uppercase", opacity: .72, margin: "0 0 12px", fontWeight: 600, fontFamily: "'Exo 2',sans-serif" }}>
              {persona.role}
            </p>

            {/* Streaming badge */}
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700,
              color: pStream.fg, background: pStream.tint,
              borderRadius: 30, padding: "6px 16px", marginBottom: 14,
              boxShadow: `0 0 16px ${pStream.tint}55`, fontFamily: "'Exo 2',sans-serif",
            }}>
              ✦ Streaming: {pStream.name}
            </div>

            {/* Fortune */}
            <div style={{ background: "rgba(255,255,255,.045)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 14, padding: "13px 15px", marginBottom: 13, backdropFilter: "blur(4px)" }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, margin: 0, fontFamily: "'Exo 2',sans-serif" }}>{persona.fortune}</p>
            </div>

            {/* Courses */}
            <p style={{ fontSize: 9.5, letterSpacing: 1.5, opacity: .5, textTransform: "uppercase", margin: "0 0 7px", fontFamily: "'Orbitron',monospace" }}>Mata Kuliah Yang Menantimu</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 13 }}>
              {persona.courses.map((c, i) => (
                <span key={i} style={{ fontSize: 11.5, fontWeight: 600, padding: "5px 10px", borderRadius: 20, background: `${persona.glow}18`, border: `1px solid ${persona.glow}55`, color: "#fff", fontFamily: "'Exo 2',sans-serif" }}>{c}</span>
              ))}
            </div>

            {/* Career path */}
            <p style={{ fontSize: 9.5, letterSpacing: 1.5, opacity: .5, textTransform: "uppercase", margin: "0 0 4px", fontFamily: "'Orbitron',monospace" }}>Jalur Kariermu</p>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: persona.glow, margin: "0 0 15px", lineHeight: 1.55, fontFamily: "'Exo 2',sans-serif" }}>{persona.prospek}</p>

            {/* CTA */}
            <div style={{
              fontSize: 12.5, lineHeight: 1.65, fontWeight: 600,
              background: "linear-gradient(135deg,rgba(127,212,255,.09),rgba(127,212,255,.04))",
              border: "1px dashed rgba(127,212,255,.38)", borderRadius: 12,
              padding: "10px 14px", marginBottom: 18, fontFamily: "'Exo 2',sans-serif",
            }}>
              📸 Foto hasil misimu & tukarkan <b style={{ color: "#7fd4ff" }}>PIN {persona.role}</b>-mu di booth! 🎁
            </div>

            <button onClick={startGame} style={{
              fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 10.5, letterSpacing: 1.2,
              color: "rgba(255,255,255,.75)", background: "rgba(255,255,255,.06)",
              border: "1px solid rgba(255,255,255,.18)", padding: "11px 24px",
              borderRadius: 40, cursor: "pointer", transition: "all .2s",
            }}>↩ RESTART MISSION</button>

            <div style={{ fontFamily: "'Orbitron',monospace", fontSize: 9.5, letterSpacing: 4, color: "rgba(127,212,255,.55)", marginTop: 20 }}>ORBIT</div>
          </div>
        )}

      </div>
    </div>
  );
}
