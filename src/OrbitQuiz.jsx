import React, { useState, useMemo } from "react";

// ============================================================
// ORBIT — Open Ramalan Business Information Technology
// Kuis ramalan profesi -> mata kuliah -> streaming
// Business IT Program — Binus @Bekasi
// Fokus 2 streaming: Business Enterprise Technology & AI for Business
// ============================================================

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;600&family=Quicksand:wght@400;500;600;700&display=swap');
`;

// Streaming meta
const STREAMS = {
  bet: { name: "Business Enterprise Technology", short: "Business Enterprise Tech", tint: "#ffd36e" },
  aib: { name: "Artificial Intelligence for Business", short: "AI for Business", tint: "#7fd4ff" },
};

// ---- Persona definitions (profesi dari katalog BIT) ----
const PERSONAS = {
  analyst: {
    key: "analyst", emoji: "📈", name: "Sang Penerjemah Bisnis", role: "Business Analyst",
    stream: "bet", glow: "#ffd36e",
    fortune:
      "Kamu jembatan antara bos yang maunya 'pokoknya naik' dan data yang bilang kenyataannya. Masa depan: kamu yang ditanya tiap rapat penting — dan jawabanmu selalu 'tergantung datanya' dulu. 📊",
    prospek: "Business Analyst · Systems Analyst · Data Analyst · Project Manager",
    courses: ["Business Intelligence", "Business Analytics", "Modern Analytics", "Enterprise Business Process"],
  },
  social: {
    key: "social", emoji: "📱", name: "Sang Pembaca Sinyal", role: "Social Media Analyst",
    stream: "bet", glow: "#ff9ad1",
    fortune:
      "Kamu bisa baca 'mood' internet kayak ramalan bintang. 2030: satu campaign-mu trending nasional — dan kamu tetap mantengin engagement rate jam 2 pagi sambil senyum sendiri. 📱",
    prospek: "Social Media Analyst · Social Media Consultant · Web Analytics Consultant",
    courses: ["Social Media Fundamental", "Social Informatics", "Modern Analytics"],
  },
  builder: {
    key: "builder", emoji: "🤝", name: "Sang Penasihat Solusi", role: "IT Consultant",
    stream: "bet", glow: "#ffb86b",
    fortune:
      "Kamu jembatan antara 'maunya bisnis' dan 'apa yang teknologi bisa'. Masa depan: perusahaan datang sambil bilang 'tolong, sistem kami ribet banget' — dan kamu yang bikin semuanya jadi masuk akal. 🤝",
    prospek: "IT Consultant · Information Management Consultant · Programming Consultant · Systems Analyst",
    courses: ["Information Systems Analysis and Design", "Enterprise Business Process", "IT Governance & Security"],
  },
  ml: {
    key: "ml", emoji: "🤖", name: "Sang Pelatih Mesin", role: "Machine Learning Engineer",
    stream: "aib", glow: "#7fd4ff",
    fortune:
      "Kamu mengajari mesin jadi pintar — dan suatu hari modelmu menebak hal yang kamu sendiri nggak nyangka. Tenang, kamu yang melatihnya, kamu yang pegang kendali. 🤖",
    prospek: "Machine Learning Engineer · Data Scientist · AI Developer",
    courses: ["Machine Learning & Foundations", "Deep Learning for Business", "Foundations of Artificial Intelligence"],
  },
  smart: {
    key: "smart", emoji: "💡", name: "Sang Penasihat AI", role: "AI Consultant",
    stream: "aib", glow: "#9af5c8",
    fortune:
      "Kamu paham AI bukan buat gaya-gayaan, tapi buat mecahin masalah nyata. Masa depan: perusahaan nanya 'AI-nya enaknya dipakai di mana ya?' — dan kamu yang kasih jawaban paling pas. 💡",
    prospek: "AI Consultant · AI Solutions Specialist · Technology Consultant",
    courses: ["Smart Application", "Basic Artificial Intelligence", "Information Retrieval"],
  },
  cognitive: {
    key: "cognitive", emoji: "🔭", name: "Sang Peramal Data", role: "Data Scientist",
    stream: "aib", glow: "#c4a8ff",
    fortune:
      "Kamu meramal masa depan bukan pakai bola kristal, tapi pakai data. Perusahaan rebutan kamu buat 'menebak' tren sebelum terjadi — dan tebakanmu nyeremin akuratnya. 🔭",
    prospek: "Data Scientist · AI Analyst · Data Engineer",
    courses: ["Machine Learning & Foundations", "Deep Learning for Business", "Information Retrieval"],
  },
};

// ---- Quiz: tiap opsi menambah poin ke 1 persona ----
const QUESTIONS = [
  {
    q: "Pas ngerjain proyek bareng, kamu paling 'nyala' kalau lagi…",
    options: [
      { t: "Ngubah data jadi keputusan & strategi", to: "analyst" },
      { t: "Nyariin solusi teknologi paling pas buat tim", to: "builder" },
      { t: "Ngulik model biar bisa prediksi sesuatu", to: "ml" },
      { t: "Ngegali data buat nemuin jawaban tersembunyi", to: "cognitive" },
    ],
  },
  {
    q: "Weekend ideal versi kamu?",
    options: [
      { t: "Mantengin dashboard, tren & angka bisnis", to: "analyst" },
      { t: "Bedah kenapa sebuah konten bisa viral", to: "social" },
      { t: "Bantuin teman benerin masalah laptop/sistemnya", to: "builder" },
      { t: "Nyobain tools AI baru buat mecahin masalah", to: "smart" },
    ],
  },
  {
    q: "Hal yang bikin kamu paling 'wah'?",
    options: [
      { t: "Nemu pola tersembunyi di balik data", to: "analyst" },
      { t: "Paham banget perilaku orang di internet", to: "social" },
      { t: "Mesin yang bisa belajar sendiri dari data", to: "ml" },
      { t: "Prediksi dari data yang ternyata akurat banget", to: "cognitive" },
    ],
  },
  {
    q: "Pertanyaan yang paling pengen kamu pecahin?",
    options: [
      { t: "\"Strategi bisnis ini bakal cuan nggak?\"", to: "analyst" },
      { t: "\"Gimana caranya brand ini meledak di sosmed?\"", to: "social" },
      { t: "\"Sistem apa yang paling pas buat masalah ini?\"", to: "builder" },
      { t: "\"AI mana yang paling pas buat masalah bisnis ini?\"", to: "smart" },
    ],
  },
  {
    q: "Skill impian yang pengen banget kamu kuasai?",
    options: [
      { t: "Business Intelligence & analitik data", to: "analyst" },
      { t: "Social media analytics & listening", to: "social" },
      { t: "Machine Learning & deep learning", to: "ml" },
      { t: "Ngeramal tren pakai data (data science)", to: "cognitive" },
    ],
  },
  {
    q: "Kalau punya asisten AI pribadi, kamu mau dia jago…",
    options: [
      { t: "Bikin & atur konten otomatis", to: "social" },
      { t: "Bantu nyariin solusi pas buat tiap masalah", to: "builder" },
      { t: "Makin pinter sendiri tiap dikasih data", to: "ml" },
      { t: "Kasih rekomendasi cerdas buat ambil keputusan", to: "smart" },
    ],
  },
  {
    q: "Mimpi kamu 10 tahun lagi?",
    options: [
      { t: "Jadi penasihat teknologi andalan perusahaan", to: "builder" },
      { t: "Menciptakan AI yang ngubah cara orang kerja", to: "ml" },
      { t: "Bikin produk super pintar yang viral", to: "smart" },
      { t: "Meramal masa depan lewat data raksasa", to: "cognitive" },
    ],
  },
];

function Starfield() {
  const stars = useMemo(
    () => Array.from({ length: 70 }).map(() => ({
      left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 2 + 1, delay: Math.random() * 4, dur: Math.random() * 3 + 2,
    })), []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s, i) => (
        <span key={i} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, borderRadius: "50%", background: "#fff",
          opacity: 0.7, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

export default function OrbitQuiz() {
  const [screen, setScreen] = useState("intro");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ analyst: 0, social: 0, builder: 0, ml: 0, smart: 0, cognitive: 0 });
  const [picked, setPicked] = useState(null);

  const result = useMemo(() => {
    const max = Math.max(...Object.values(scores));
    const order = ["analyst", "ml", "builder", "cognitive", "social", "smart"];
    const key = order.find((k) => scores[k] === max) || "analyst";
    return PERSONAS[key];
  }, [scores]);

  const choose = (to, idx) => {
    setPicked(idx);
    setTimeout(() => {
      setScores((s) => ({ ...s, [to]: s[to] + 1 }));
      setPicked(null);
      if (step + 1 < QUESTIONS.length) setStep(step + 1);
      else setScreen("result");
    }, 280);
  };

  const restart = () => {
    setScores({ analyst: 0, social: 0, builder: 0, ml: 0, smart: 0, cognitive: 0 });
    setStep(0); setPicked(null); setScreen("intro");
  };

  const wrap = {
    minHeight: "100vh", width: "100%", position: "relative",
    fontFamily: "'Quicksand', sans-serif", color: "#f4f0ff",
    background: "radial-gradient(120% 90% at 50% -10%, #2a1d5e 0%, #160f3a 38%, #0a0723 72%, #05030f 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "28px 18px", boxSizing: "border-box", overflow: "hidden",
  };
  const card = { position: "relative", width: "100%", maxWidth: 480, zIndex: 2 };
  const display = { fontFamily: "'Cinzel Decorative', serif" };
  const stream = STREAMS[result.stream];

  return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.2;transform:scale(.7)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes rise { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinSlow { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        .opt:hover { transform: translateY(-2px); border-color: rgba(255,211,110,.8) !important; box-shadow: 0 8px 26px rgba(255,211,110,.18); }
        .opt:active { transform: scale(.98); }
        .glowbtn:hover { box-shadow: 0 0 38px rgba(255,211,110,.55); transform: translateY(-2px); }
      `}</style>

      <Starfield />
      <div style={{
        position: "absolute", top: "-90px", right: "-70px", width: 240, height: 240, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #ffe9b0, #ffce6e 45%, #d99a2b 100%)",
        filter: "blur(2px)", opacity: 0.35, animation: "floaty 7s ease-in-out infinite",
      }} />

      {/* INTRO */}
      {screen === "intro" && (
        <div style={{ ...card, textAlign: "center", animation: "rise .6s ease both" }}>
          <div style={{ fontSize: 54, animation: "floaty 5s ease-in-out infinite" }}>🔮</div>
          <h1 style={{ ...display, fontSize: 46, letterSpacing: 4, margin: "8px 0 2px", color: "#ffd36e", textShadow: "0 0 24px rgba(255,211,110,.45)" }}>ORBIT</h1>
          <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7, margin: 0 }}>
            Open Ramalan Business Information Technology
          </p>
          <div style={{ height: 1, width: 90, margin: "20px auto", background: "linear-gradient(90deg,transparent,#ffd36e,transparent)" }} />
          <p style={{ fontSize: 17, lineHeight: 1.65, opacity: 0.92, fontWeight: 500, maxWidth: 370, margin: "0 auto 6px" }}>
            Bintang sudah menunggu. ✨ Jawab 7 pertanyaan, biarkan semesta meramalkan <b style={{ color: "#ffd36e" }}>profesi masa depanmu</b> — lengkap dengan <b style={{ color: "#ffd36e" }}>streaming</b> yang paling cocok di Business IT.
          </p>
          <p style={{ fontSize: 13, opacity: 0.6, margin: "10px 0 24px" }}>
            Selesai meramal? Foto hasilmu & tukar dengan <b>PIN</b> sesuai takdirmu 🎁
          </p>
          <button onClick={() => setScreen("quiz")} className="glowbtn" style={{
            fontFamily: "'Quicksand',sans-serif", fontWeight: 700, fontSize: 17, color: "#1a1140",
            background: "linear-gradient(135deg,#ffe39a,#ffd36e)", border: "none", padding: "15px 40px",
            borderRadius: 40, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 0 26px rgba(255,211,110,.4)", transition: "all .25s",
          }}>Mulai Meramal 🌙</button>
        </div>
      )}

      {/* QUIZ */}
      {screen === "quiz" && (
        <div style={{ ...card, animation: "rise .45s ease both" }} key={step}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 22 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{
                width: i === step ? 26 : 9, height: 9, borderRadius: 9,
                background: i <= step ? "#ffd36e" : "rgba(255,255,255,.18)", transition: "all .3s",
              }} />
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 12, letterSpacing: 2, opacity: 0.55, margin: "0 0 6px", textTransform: "uppercase" }}>
            Ramalan ke-{step + 1} dari {QUESTIONS.length}
          </p>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 23, fontWeight: 600, textAlign: "center", lineHeight: 1.4, margin: "0 0 26px", color: "#fff" }}>
            {QUESTIONS[step].q}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {QUESTIONS[step].options.map((o, idx) => (
              <button key={idx} className="opt" onClick={() => choose(o.to, idx)} style={{
                fontFamily: "'Quicksand',sans-serif", fontWeight: 600, fontSize: 15.5, textAlign: "left",
                color: "#f4f0ff", cursor: "pointer",
                background: picked === idx ? "rgba(255,211,110,.22)" : "rgba(255,255,255,.06)",
                border: "1.5px solid rgba(255,255,255,.14)", padding: "16px 18px", borderRadius: 16,
                transition: "all .2s", backdropFilter: "blur(4px)",
              }}>{o.t}</button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {screen === "result" && (
        <div style={{ ...card, textAlign: "center", animation: "rise .6s ease both" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, opacity: 0.6, textTransform: "uppercase", margin: "0 0 14px" }}>
            ✦ Semesta telah memutuskan ✦
          </p>

          {/* PIN */}
          <div style={{ position: "relative", display: "inline-block", margin: "4px 0 18px", animation: "pop .6s ease both" }}>
            <div style={{ position: "absolute", inset: -18, borderRadius: "50%", background: `radial-gradient(circle, ${result.glow}55, transparent 70%)`, animation: "spinSlow 14s linear infinite" }} />
            <div style={{
              position: "relative", width: 152, height: 152, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #1f1652, #0c0828)",
              border: `2.5px solid ${result.glow}`, boxShadow: `0 0 40px ${result.glow}66, inset 0 0 24px ${result.glow}33`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              margin: "0 auto", padding: 8, boxSizing: "border-box",
            }}>
              <div style={{ fontSize: 44, lineHeight: 1 }}>{result.emoji}</div>
              <div style={{ fontSize: 8.5, letterSpacing: 1, marginTop: 6, fontWeight: 700, color: result.glow }}>BUSINESS IT PROGRAM</div>
              <div style={{ fontSize: 8, letterSpacing: 1, opacity: 0.85, fontWeight: 600 }}>BINUS @BEKASI</div>
            </div>
          </div>

          <h2 style={{ ...display, fontSize: 28, color: result.glow, margin: "0 0 2px", textShadow: `0 0 22px ${result.glow}55` }}>{result.name}</h2>
          <p style={{ fontSize: 13.5, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.78, margin: "0 0 12px", fontWeight: 600 }}>{result.role}</p>

          {/* Stream badge */}
          <div style={{
            display: "inline-block", fontSize: 12.5, fontWeight: 700, color: "#0c0828",
            background: stream.tint, borderRadius: 30, padding: "6px 16px", marginBottom: 16,
            boxShadow: `0 0 18px ${stream.tint}66`,
          }}>
            ✦ Streaming: {stream.name}
          </div>

          <div style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 18, padding: "16px 20px", backdropFilter: "blur(4px)", marginBottom: 16 }}>
            <p style={{ fontSize: 15.5, lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{result.fortune}</p>
          </div>

          {/* Courses */}
          <p style={{ fontSize: 11.5, letterSpacing: 1.5, opacity: 0.55, textTransform: "uppercase", margin: "0 0 8px" }}>
            Mata kuliah yang menantimu
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, justifyContent: "center", marginBottom: 16 }}>
            {result.courses.map((c, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 20,
                background: `${result.glow}1f`, border: `1px solid ${result.glow}66`, color: "#fff",
              }}>{c}</span>
            ))}
          </div>

          <p style={{ fontSize: 11.5, letterSpacing: 1.5, opacity: 0.55, textTransform: "uppercase", margin: "0 0 4px" }}>Jalur kariermu</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: result.glow, margin: "0 0 20px", lineHeight: 1.5 }}>{result.prospek}</p>

          <div style={{
            fontSize: 13, lineHeight: 1.6, opacity: 0.92, fontWeight: 600,
            background: "linear-gradient(135deg, rgba(255,211,110,.16), rgba(255,211,110,.06))",
            border: "1px dashed rgba(255,211,110,.5)", borderRadius: 14, padding: "12px 16px", marginBottom: 20,
          }}>
            📸 Foto hasilmu untuk story, lalu tunjukkan ke kakak booth untuk menukar <b>PIN {result.role}</b>-mu! 🎁
          </div>

          <button onClick={restart} style={{
            fontFamily: "'Quicksand',sans-serif", fontWeight: 700, fontSize: 15, color: "#f4f0ff",
            background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.25)",
            padding: "12px 30px", borderRadius: 40, cursor: "pointer", transition: "all .2s",
          }}>🔄 Ramal lagi untuk teman</button>

          <p style={{ ...display, fontSize: 13, letterSpacing: 4, color: "#ffd36e", opacity: 0.85, marginTop: 24 }}>ORBIT</p>
        </div>
      )}
    </div>
  );
}
