import React, { useMemo, useState } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;600&family=Quicksand:wght@400;500;600;700&display=swap');
`;

const STREAMS = {
  bet: { name: "Business Enterprise Technology", short: "Business Enterprise Tech", tint: "#ffd36e" },
  aib: { name: "Artificial Intelligence for Business", short: "AI for Business", tint: "#7fd4ff" },
};

const PERSONAS = {
  analyst: {
    key: "analyst", emoji: "📈", name: "Sang Penerjemah Bisnis", role: "Business Analyst",
    stream: "bet", glow: "#ffd36e",
    fortune:
      "Kamu jembatan antara bos yang maunya 'pokoknya naik' dan data yang bilang kenyataannya. Masa depan: kamu yang ditanya tiap rapat penting dan jawabanmu selalu 'tergantung datanya' dulu. 📊",
    prospek: "Business Analyst · Systems Analyst · Data Analyst · Project Manager",
    courses: ["Business Intelligence", "Business Analytics", "Modern Analytics", "Enterprise Business Process"],
  },
  social: {
    key: "social", emoji: "📱", name: "Sang Pembaca Sinyal", role: "Social Media Analyst",
    stream: "bet", glow: "#ff9ad1",
    fortune:
      "Kamu bisa baca 'mood' internet kayak ramalan bintang. 2030: satu campaign-mu trending nasional dan kamu tetap mantengin engagement rate jam 2 pagi sambil senyum sendiri. 📱",
    prospek: "Social Media Analyst · Social Media Consultant · Web Analytics Consultant",
    courses: ["Social Media Fundamental", "Social Informatics", "Modern Analytics"],
  },
  builder: {
    key: "builder", emoji: "🤝", name: "Sang Penasihat Solusi", role: "IT Consultant",
    stream: "bet", glow: "#ffb86b",
    fortune:
      "Kamu jembatan antara 'maunya bisnis' dan 'apa yang teknologi bisa'. Masa depan: perusahaan datang sambil bilang 'tolong, sistem kami ribet banget' dan kamu yang bikin semuanya jadi masuk akal. 🤝",
    prospek: "IT Consultant · Information Management Consultant · Programming Consultant · Systems Analyst",
    courses: ["Information Systems Analysis and Design", "Enterprise Business Process", "IT Governance & Security"],
  },
  ml: {
    key: "ml", emoji: "🤖", name: "Sang Pelatih Mesin", role: "Machine Learning Engineer",
    stream: "aib", glow: "#7fd4ff",
    fortune:
      "Kamu mengajari mesin jadi pintar dan suatu hari modelmu menebak hal yang kamu sendiri tidak nyangka. Tenang, kamu yang melatihnya, kamu yang pegang kendali. 🤖",
    prospek: "Machine Learning Engineer · Data Scientist · AI Developer",
    courses: ["Machine Learning & Foundations", "Deep Learning for Business", "Foundations of Artificial Intelligence"],
  },
  smart: {
    key: "smart", emoji: "💡", name: "Sang Penasihat AI", role: "AI Consultant",
    stream: "aib", glow: "#9af5c8",
    fortune:
      "Kamu paham AI bukan buat gaya-gayaan, tapi buat mecahin masalah nyata. Masa depan: perusahaan nanya 'AI-nya enaknya dipakai di mana ya?' dan kamu yang kasih jawaban paling pas. 💡",
    prospek: "AI Consultant · AI Solutions Specialist · Technology Consultant",
    courses: ["Smart Application", "Basic Artificial Intelligence", "Information Retrieval"],
  },
  cognitive: {
    key: "cognitive", emoji: "🔭", name: "Sang Peramal Data", role: "Data Scientist",
    stream: "aib", glow: "#c4a8ff",
    fortune:
      "Kamu meramal masa depan bukan pakai bola kristal, tapi pakai data. Perusahaan rebutan kamu buat menebak tren sebelum terjadi dan tebakanmu nyeremin akuratnya. 🔭",
    prospek: "Data Scientist · AI Analyst · Data Engineer",
    courses: ["Machine Learning & Foundations", "Deep Learning for Business", "Information Retrieval"],
  },
};

const AREAS = [
  {
    id: "launch",
    name: "Launch Base",
    emoji: "🪐",
    guide: "Commander Arka",
    line: "Pilot, pilih sinyal awal misi kita.",
    description: "Roket lepas dari bumi. Di launch base, kamu menentukan orientasi misi pertama.",
    arrivalStory: "Roket berhasil lock orbit pertama. Commander Arka membuka dua modul keputusan.",
    point: { x: 14, y: 76 },
    choices: [
      { text: "Baca arah bisnis dari data", tag: "biz" },
      { text: "Baca perilaku audiens digital", tag: "aud" },
    ],
  },
  {
    id: "nebula",
    name: "Nebula Sistem",
    emoji: "🛰️",
    guide: "Tech Guardian",
    line: "Kita masuk zona arsitektur. Pilih lintasan teknis.",
    description: "Kabut nebula menyimpan peta enterprise. Keputusanmu menentukan gaya eksekusi solusi.",
    arrivalStory: "Panel taktis menyala. Tech Guardian meminta kamu menautkan modul ke jalur yang tepat.",
    point: { x: 36, y: 56 },
    choices: [
      { text: "Rancang solusi sistem", tag: "sys" },
      { text: "Pilih strategi AI terapan", tag: "ai" },
    ],
  },
  {
    id: "orbit",
    name: "Orbit Data",
    emoji: "🌌",
    guide: "Data Sage",
    line: "Satelit membaca data real-time. Pilih mode analisis.",
    description: "Kumpulan sinyal membentuk pola. Kamu memilih antara eksperimen model atau investigasi pola.",
    arrivalStory: "Data Sage membentangkan dua relay core. Satu untuk model, satu untuk insight pola.",
    point: { x: 62, y: 40 },
    choices: [
      { text: "Latih model prediktif", tag: "model" },
      { text: "Ungkap pola tersembunyi", tag: "pattern" },
    ],
  },
  {
    id: "moon",
    name: "Moon Gate",
    emoji: "🌕",
    guide: "AI Oracle",
    line: "Gerbang final aktif. Pilih peran terakhirmu.",
    description: "Di sisi terang bulan, keputusan finalmu akan mengunci identitas profesi Business IT.",
    arrivalStory: "AI Oracle menunggu di gerbang. Satu drop terakhir menentukan masa depanmu.",
    point: { x: 84, y: 24 },
    choices: [
      { text: "Penghubung strategi dan eksekusi", tag: "bridge" },
      { text: "Spesialis insight berbasis data", tag: "insight" },
    ],
  },
];

function pickPersona(path) {
  const signature = path.join("-");
  const map = {
    "biz-sys-model-bridge": "builder",
    "biz-sys-model-insight": "analyst",
    "biz-sys-pattern-bridge": "builder",
    "biz-sys-pattern-insight": "analyst",
    "biz-ai-model-bridge": "smart",
    "biz-ai-model-insight": "ml",
    "biz-ai-pattern-bridge": "smart",
    "biz-ai-pattern-insight": "cognitive",
    "aud-sys-model-bridge": "social",
    "aud-sys-model-insight": "analyst",
    "aud-sys-pattern-bridge": "social",
    "aud-sys-pattern-insight": "cognitive",
    "aud-ai-model-bridge": "smart",
    "aud-ai-model-insight": "ml",
    "aud-ai-pattern-bridge": "social",
    "aud-ai-pattern-insight": "cognitive",
  };

  return PERSONAS[map[signature] || "analyst"];
}

function Starfield() {
  const stars = useMemo(
    () =>
      Array.from({ length: 46 }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 1.6 + 0.6,
        delay: Math.random() * 4,
        dur: Math.random() * 3 + 2,
      })),
    []
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "#ffffff",
            opacity: 0.75,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function MissionMap({ areas, currentAreaIndex, landedAreaIndex, rocketPos, isTraveling, onPlanetClick }) {
  const points = areas.map((area) => area.point);
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div style={{ position: "relative", height: 250, borderRadius: 18, border: "1px solid rgba(255,255,255,.16)", background: "linear-gradient(180deg, rgba(8,15,40,.5), rgba(7,10,28,.75))", overflow: "hidden" }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.8 }}>
        <polyline points={polyline} fill="none" stroke="rgba(127,212,255,0.32)" strokeWidth="1.8" strokeDasharray="2.2 2.2" />
      </svg>

      {areas.map((area, idx) => {
        const isActive = idx === currentAreaIndex;
        const isDone = idx < currentAreaIndex;
        const isLanded = idx === landedAreaIndex;
        return (
          <button
            key={area.id}
            onClick={() => onPlanetClick(idx)}
            disabled={!isActive || isTraveling || landedAreaIndex !== null}
            style={{
              position: "absolute",
              left: `${area.point.x}%`,
              top: `${area.point.y}%`,
              transform: "translate(-50%, -50%)",
              width: isLanded ? 64 : 56,
              height: isLanded ? 64 : 56,
              borderRadius: "50%",
              border: isActive ? "2px solid #7fd4ff" : "1px solid rgba(255,255,255,.24)",
              background: isDone
                ? "radial-gradient(circle at 35% 30%, #9cecff, #327de0)"
                : "radial-gradient(circle at 35% 30%, #1f2f63, #0d1638)",
              boxShadow: isActive ? "0 0 24px rgba(127,212,255,.45)" : "none",
              color: "#fff",
              cursor: isActive && !isTraveling && landedAreaIndex === null ? "pointer" : "default",
              transition: "all .25s ease",
              zIndex: 2,
              padding: 0,
            }}
            title={area.name}
          >
            <div style={{ fontSize: 24, lineHeight: 1 }}>{area.emoji}</div>
          </button>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: `${rocketPos.x}%`,
          top: `${rocketPos.y}%`,
          transform: "translate(-50%, -50%)",
          fontSize: 34,
          transition: "left .8s cubic-bezier(.2,.9,.2,1), top .8s cubic-bezier(.2,.9,.2,1)",
          filter: "drop-shadow(0 0 8px rgba(127,212,255,.5))",
          zIndex: 3,
          animation: isTraveling ? "none" : "floaty 2.6s ease-in-out infinite",
        }}
      >
        🚀
      </div>
    </div>
  );
}

export default function OrbitRocketAdventure({ onBack }) {
  const [screen, setScreen] = useState("intro");
  const [currentAreaIndex, setCurrentAreaIndex] = useState(0);
  const [landedAreaIndex, setLandedAreaIndex] = useState(null);
  const [path, setPath] = useState([]);
  const [isTraveling, setIsTraveling] = useState(false);
  const [rocketPos, setRocketPos] = useState({ x: 8, y: 86 });
  const [draggingChoice, setDraggingChoice] = useState(false);
  const [missionLog, setMissionLog] = useState(["Mission log siap. Klik planet pertama untuk memulai."]);

  const currentArea = AREAS[currentAreaIndex];
  const result = useMemo(() => pickPersona(path), [path]);
  const stream = STREAMS[result.stream];

  const startMission = () => {
    setScreen("adventure");
    setCurrentAreaIndex(0);
    setLandedAreaIndex(null);
    setPath([]);
    setIsTraveling(false);
    setRocketPos({ x: 8, y: 86 });
    setDraggingChoice(false);
    setMissionLog(["Mission dimulai. Klik planet Launch Base."]);
  };

  const onPlanetClick = (idx) => {
    if (idx !== currentAreaIndex || isTraveling || landedAreaIndex !== null) return;

    setIsTraveling(true);
    setRocketPos(AREAS[idx].point);
    setMissionLog((prev) => [...prev, `Meluncur ke ${AREAS[idx].name}...`]);

    setTimeout(() => {
      setIsTraveling(false);
      setLandedAreaIndex(idx);
      setMissionLog((prev) => [...prev, AREAS[idx].arrivalStory]);
    }, 860);
  };

  const resolveChoice = (choiceTag) => {
    if (landedAreaIndex === null || isTraveling) return;

    const nextPath = [...path, choiceTag];
    const isLast = currentAreaIndex === AREAS.length - 1;

    setPath(nextPath);
    setDraggingChoice(false);

    if (isLast) {
      setScreen("result");
      setMissionLog((prev) => [...prev, "Moon Gate selesai. Identitas profesi terkonfirmasi."]);
      return;
    }

    const nextArea = AREAS[currentAreaIndex + 1];
    setLandedAreaIndex(null);
    setCurrentAreaIndex((v) => v + 1);
    setMissionLog((prev) => [...prev, `Route unlocked: ${nextArea.name}. Klik planet berikutnya.`]);
  };

  const restart = () => {
    setScreen("intro");
    setCurrentAreaIndex(0);
    setLandedAreaIndex(null);
    setPath([]);
    setIsTraveling(false);
    setRocketPos({ x: 8, y: 86 });
    setDraggingChoice(false);
    setMissionLog(["Mission log siap. Klik planet pertama untuk memulai."]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        fontFamily: "'Quicksand', sans-serif",
        color: "#f4f7ff",
        background:
          "radial-gradient(120% 90% at 50% -10%, #1d2e5f 0%, #111f47 35%, #0a1330 70%, #060b1d 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 18px",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <style>{FONTS}</style>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.25;transform:scale(.8)} 50%{opacity:1;transform:scale(1.15)} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes rise { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .choice-drop:hover { border-color: rgba(127,212,255,.75) !important; }
      `}</style>

      <Starfield />

      <div style={{ position: "relative", width: "100%", maxWidth: 700, zIndex: 2 }}>
        {screen === "intro" && (
          <div style={{ textAlign: "center", animation: "rise .5s ease both" }}>
            <div style={{ fontSize: 58, marginBottom: 8, animation: "floaty 3s ease-in-out infinite" }}>🚀</div>
            <h1
              style={{
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 40,
                letterSpacing: 3,
                margin: "0 0 8px",
                color: "#9fe6ff",
                textShadow: "0 0 18px rgba(127,212,255,.5)",
              }}
            >
              ORBIT ADVENTURE
            </h1>
            <p style={{ opacity: 0.88, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 18px" }}>
              Mini-game eksplorasi 4 planet: klik planet untuk berpindah, lalu drag modul keputusan ke jalur pilihan guide di setiap planet.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    border: "1.5px solid rgba(127,212,255,.4)",
                    background: "rgba(127,212,255,.08)",
                    color: "#a8ecff",
                    fontWeight: 700,
                    borderRadius: 34,
                    padding: "13px 24px",
                    cursor: "pointer",
                    fontSize: 15,
                  }}
                >
                  ← Pilih Game Lain
                </button>
              )}
              <button
                onClick={startMission}
                style={{
                  border: "none",
                  background: "linear-gradient(135deg,#a8ecff,#7fd4ff)",
                  color: "#07203f",
                  fontWeight: 700,
                  borderRadius: 34,
                  padding: "13px 30px",
                  cursor: "pointer",
                  fontSize: 15,
                }}
              >
                Mulai Misi Interaktif
              </button>
            </div>
          </div>
        )}

        {screen === "adventure" && (
          <div
            style={{
              animation: "rise .4s ease both",
              background: "linear-gradient(165deg, rgba(255,255,255,.10), rgba(255,255,255,.04))",
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: 20,
              backdropFilter: "blur(8px)",
              padding: "18px 18px 16px",
            }}
          >
            <p style={{ margin: "0 0 10px", fontSize: 12, opacity: 0.75, letterSpacing: 1.2, textTransform: "uppercase" }}>
              Click and Move Route
            </p>

            <MissionMap
              areas={AREAS}
              currentAreaIndex={currentAreaIndex}
              landedAreaIndex={landedAreaIndex}
              rocketPos={rocketPos}
              isTraveling={isTraveling}
              onPlanetClick={onPlanetClick}
            />

            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,.16)", background: "rgba(255,255,255,.04)", padding: "10px 12px" }}>
                <strong style={{ color: "#9fe6ff" }}>Mission Log</strong>
                <div style={{ marginTop: 6, fontSize: 14, lineHeight: 1.55 }}>
                  {missionLog.slice(-3).map((log, idx) => (
                    <div key={`${log}-${idx}`}>• {log}</div>
                  ))}
                </div>
              </div>

              {landedAreaIndex === null && (
                <div style={{ borderRadius: 12, border: "1px dashed rgba(127,212,255,.55)", background: "rgba(127,212,255,.1)", padding: "10px 12px" }}>
                  Klik planet aktif untuk mendarat di area berikutnya.
                </div>
              )}

              {landedAreaIndex !== null && (
                <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,.18)", background: "rgba(7,12,33,.55)", padding: "12px 12px" }}>
                  <p style={{ margin: "0 0 6px", textTransform: "uppercase", fontSize: 12, letterSpacing: 1.2, opacity: 0.72 }}>
                    {currentArea.name}
                  </p>
                  <h3 style={{ margin: "0 0 8px", fontFamily: "'Cinzel', serif", color: "#dff6ff" }}>
                    {currentArea.emoji} {currentArea.guide}
                  </h3>

                  <div style={{ borderRadius: 12, border: "1px dashed rgba(159,230,255,.5)", background: "rgba(127,212,255,.12)", padding: "8px 10px", marginBottom: 8 }}>
                    "{currentArea.line}"
                  </div>
                  <p style={{ margin: "0 0 12px", lineHeight: 1.6 }}>{currentArea.description}</p>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <div
                      draggable
                      onDragStart={() => setDraggingChoice(true)}
                      onDragEnd={() => setDraggingChoice(false)}
                      style={{
                        borderRadius: 999,
                        padding: "8px 12px",
                        border: "1px solid rgba(255,255,255,.25)",
                        background: draggingChoice ? "rgba(127,212,255,.2)" : "rgba(255,255,255,.08)",
                        cursor: "grab",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      Drag: Decision Core
                    </div>
                    <span style={{ fontSize: 12, opacity: 0.7 }}>Drop ke salah satu pilihan di bawah</span>
                  </div>

                  <div style={{ display: "grid", gap: 9 }}>
                    {currentArea.choices.map((choice) => (
                      <button
                        key={choice.tag}
                        className="choice-drop"
                        onClick={() => resolveChoice(choice.tag)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          resolveChoice(choice.tag);
                        }}
                        style={{
                          border: "1.5px solid rgba(255,255,255,.22)",
                          borderRadius: 12,
                          background: "rgba(255,255,255,.05)",
                          color: "#eff7ff",
                          textAlign: "left",
                          padding: "11px 12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          transition: "all .2s",
                        }}
                      >
                        {choice.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {screen === "result" && (
          <div
            style={{
              textAlign: "center",
              animation: "rise .55s ease both",
              background: "linear-gradient(165deg, rgba(255,255,255,.10), rgba(255,255,255,.04))",
              border: "1px solid rgba(255,255,255,.18)",
              borderRadius: 20,
              backdropFilter: "blur(8px)",
              padding: "20px 18px",
            }}
          >
            <p style={{ margin: "0 0 10px", opacity: 0.68, letterSpacing: 2, fontSize: 12, textTransform: "uppercase" }}>
              Misi Selesai
            </p>

            <div
              style={{
                width: 144,
                height: 144,
                borderRadius: "50%",
                margin: "0 auto 14px",
                display: "grid",
                placeItems: "center",
                background: "radial-gradient(circle at 35% 30%, #1b2c58, #0a1533)",
                border: `2px solid ${result.glow}`,
                boxShadow: `0 0 34px ${result.glow}66, inset 0 0 24px ${result.glow}33`,
              }}
            >
              <div style={{ fontSize: 42 }}>{result.emoji}</div>
            </div>

            <h3
              style={{
                margin: "0 0 4px",
                color: result.glow,
                fontFamily: "'Cinzel Decorative', serif",
                fontSize: 27,
              }}
            >
              {result.name}
            </h3>
            <p style={{ margin: "0 0 10px", opacity: 0.85, fontWeight: 600 }}>{result.role}</p>

            <div
              style={{
                display: "inline-block",
                marginBottom: 12,
                background: stream.tint,
                color: "#0b1430",
                padding: "6px 14px",
                borderRadius: 24,
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              Streaming: {stream.name}
            </div>

            <p style={{ margin: "0 0 12px", lineHeight: 1.65 }}>{result.fortune}</p>

            <p style={{ margin: "0 0 6px", opacity: 0.7, textTransform: "uppercase", fontSize: 11, letterSpacing: 1.2 }}>
              Mata kuliah yang menantimu
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: 10 }}>
              {result.courses.map((course) => (
                <span
                  key={course}
                  style={{
                    fontSize: 12,
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: `1px solid ${result.glow}66`,
                    background: `${result.glow}1f`,
                  }}
                >
                  {course}
                </span>
              ))}
            </div>

            <p style={{ margin: "0 0 14px", color: result.glow, fontWeight: 600 }}>{result.prospek}</p>

            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button
                onClick={restart}
                style={{
                  border: "1.5px solid rgba(255,255,255,.3)",
                  background: "rgba(255,255,255,.07)",
                  color: "#f2f8ff",
                  fontWeight: 700,
                  borderRadius: 28,
                  padding: "11px 22px",
                  cursor: "pointer",
                }}
              >
                Ulangi Misi
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    border: "1.5px solid rgba(127,212,255,.4)",
                    background: "rgba(127,212,255,.08)",
                    color: "#a8ecff",
                    fontWeight: 700,
                    borderRadius: 28,
                    padding: "11px 22px",
                    cursor: "pointer",
                  }}
                >
                  ← Kembali ke Hub
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
