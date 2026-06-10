import React, { useState, useMemo } from "react";

// ============================================================
// STARTUP DESTINY — kembaran ORBIT untuk program
// Digital Business Innovation — Binus @Bekasi
// Kuis "tipe founder kamu" -> arketipe -> mata kuliah -> pin
// Grounded ke konten kewirausahaan di katalog (Digital
// Technopreneur, Designpreneur, jalur Entrepreneurship, ENPR).
// ============================================================

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap');
`;

const ARCH = {
  trail: {
    key: "trail", emoji: "🚀", name: "Sang Perintis", type: "Digital Startup Founder",
    power: "Eksekusi + baca peluang digital", glow: "#ff7a59",
    fortune:
      "Kamu tipe yang udah jalan sebelum yang lain selesai mikir. 2031: startup digital-mu udah pivot 3 kali, dapet investor di pivot ke-4 — dan kamu masih sempet mulai ide baru. 🚀",
    prospek: "Global Entrepreneur · Entrepreneur · Digital Business Specialist",
    courses: ["Digital Innovation", "Launch Creative Business Startup", "Startup Funding"],
  },
  tech: {
    key: "tech", emoji: "👑", name: "Sang Penerus", type: "Digital Business Successor",
    power: "Bawa usaha lama ke ranah digital", glow: "#5b8cff",
    fortune:
      "Kamu nggak harus mulai dari nol — keahlianmu bikin usaha yang udah ada jadi naik kelas. 2031: bisnis keluarga/warisanmu kamu sulap jadi brand digital yang dikenal se-Indonesia. 👑",
    prospek: "Business Developer · Digital Business Specialist · Small Business Consultant",
    courses: ["Enterprise Business Process", "Family Business", "Information Systems Management, Strategy and Acquisition"],
  },
  create: {
    key: "create", emoji: "🎨", name: "Sang Kreator", type: "Digital Marketing Entrepreneur",
    power: "Branding + data buat dongkrak jualan", glow: "#ff5fa8",
    fortune:
      "Kamu jago bikin orang naksir sama sesuatu. 2031: brand buatanmu trending, dan kompetitor sibuk niru gaya kontenmu. 🎨",
    prospek: "Digital Business Specialist · Business Developer",
    courses: ["Marketing for Entrepreneur", "Data and Information Management", "Commercializing Emerging Technology"],
  },
  design: {
    key: "design", emoji: "✨", name: "Sang Inovator Produk", type: "Digital Product Innovator",
    power: "Rancang produk digital yang dicintai", glow: "#b06bff",
    fortune:
      "Kamu bikin produk yang bikin orang mikir 'kok enak banget ya dipake'. Itu bukan kebetulan — kamu yang ngerancang tiap detail produk digitalnya jadi bisnis beneran. ✨",
    prospek: "Entrepreneur · UX Designer · Digital Business Specialist",
    courses: ["User Experience Research and Design", "Digital Business Project", "Innovative Product Design and Development"],
  },
  change: {
    key: "change", emoji: "🌱", name: "Sang Pengubah", type: "Sustainable Digital Intrapreneur",
    power: "Bisnis berkelanjutan pakai teknologi", glow: "#2ecc8f",
    fortune:
      "Buat kamu, bisnis itu alat buat bikin perubahan. Masa depan: usahamu cuan, pakai teknologi, DAN bikin banyak orang terbantu. Triple win. 🌱",
    prospek: "Intrapreneur · Small Business Consultant · Business Developer",
    courses: ["Sustainable Business Model", "Foundations of Artificial Intelligence", "Business Law and Ethics"],
  },
  strat: {
    key: "strat", emoji: "📈", name: "Sang Penyusun Strategi", type: "Digital Business Strategist",
    power: "Strategi & angka di balik startup", glow: "#ffb020",
    fortune:
      "Kamu lihat bisnis kayak papan catur. 2031: kamu nggak cuma punya satu usaha — kamu bangun & gedein banyak sekaligus. 📈",
    prospek: "Business Planner · Business Analyst · Information System Consultant",
    courses: ["Business Plan", "Information Systems Project Management", "Entrepreneurial Finance and Accounting"],
  },
};

const QUESTIONS = [
  { q: "Pas punya ide bisnis, hal pertama yang kamu lakuin?", options: [
    { t: "Langsung gas eksekusi, mikir belakangan", to: "trail" },
    { t: "Rapihin & kembangin yang udah ada biar makin jalan", to: "tech" },
    { t: "Sketsa gimana tampilan & rasanya buat user", to: "design" },
    { t: "Hitung dulu: ini bisa cuan & jalan nggak", to: "strat" },
  ]},
  { q: "Weekend ideal versi kamu?", options: [
    { t: "Nyari peluang bisnis baru di mana-mana", to: "trail" },
    { t: "Bikin konten / bangun personal brand", to: "create" },
    { t: "Bantuin ngembangin usaha keluarga / teman", to: "tech" },
    { t: "Ikut kegiatan sosial / komunitas", to: "change" },
  ]},
  { q: "Hal yang bikin kamu paling semangat?", options: [
    { t: "Ngeliat ide jadi kenyataan dari nol", to: "trail" },
    { t: "Bikin sesuatu yang viral & dikenal", to: "create" },
    { t: "Bikin produk yang enak & indah dipakai", to: "design" },
    { t: "Nyusun strategi yang bikin bisnis tumbuh", to: "strat" },
  ]},
  { q: "Pujian yang paling kamu suka denger?", options: [
    { t: "\"Beraninya kamu mulai duluan!\"", to: "trail" },
    { t: "\"Idemu kreatif banget!\"", to: "create" },
    { t: "\"Di tanganmu, usahanya jadi makin maju!\"", to: "tech" },
    { t: "\"Kamu bikin perubahan nyata.\"", to: "change" },
  ]},
  { q: "Kalau punya startup, kamu paling pengen pegang bagian…", options: [
    { t: "Visi & arah besar perusahaan", to: "trail" },
    { t: "Marketing & branding", to: "create" },
    { t: "Produk & pengalaman pengguna", to: "design" },
    { t: "Bisnis, operasional & pertumbuhan", to: "strat" },
  ]},
  { q: "Masalah yang paling pengen kamu pecahin?", options: [
    { t: "\"Gimana brand ini dikenal banyak orang?\"", to: "create" },
    { t: "\"Gimana bikin usaha yang udah ada makin gede?\"", to: "tech" },
    { t: "\"Gimana bikin produk yang user jatuh cinta?\"", to: "design" },
    { t: "\"Gimana teknologi bisa bantu banyak orang?\"", to: "change" },
  ]},
  { q: "Mimpi kamu 10 tahun lagi?", options: [
    { t: "Bikin bisnis keluarga/warisan naik kelas jadi digital", to: "tech" },
    { t: "Bikin brand/produk yang dicintai desainnya", to: "design" },
    { t: "Punya bisnis yang bikin dampak sosial", to: "change" },
    { t: "Bangun & gedein banyak usaha sekaligus", to: "strat" },
  ]},
];

export default function StartupDestinyQuiz() {
  const [screen, setScreen] = useState("intro");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ trail:0, tech:0, create:0, design:0, change:0, strat:0 });
  const [picked, setPicked] = useState(null);

  const result = useMemo(() => {
    const max = Math.max(...Object.values(scores));
    const order = ["trail","tech","create","design","change","strat"];
    return ARCH[order.find((k) => scores[k] === max) || "trail"];
  }, [scores]);

  const choose = (to, idx) => {
    setPicked(idx);
    setTimeout(() => {
      setScores((s) => ({ ...s, [to]: s[to] + 1 }));
      setPicked(null);
      if (step + 1 < QUESTIONS.length) setStep(step + 1);
      else setScreen("result");
    }, 260);
  };
  const restart = () => {
    setScores({ trail:0, tech:0, create:0, design:0, change:0, strat:0 });
    setStep(0); setPicked(null); setScreen("intro");
  };

  const wrap = {
    minHeight: "100vh", width: "100%", position: "relative", overflow: "hidden",
    fontFamily: "'Nunito', sans-serif", color: "#fff",
    background: "linear-gradient(135deg, #ff6fb5 0%, #a06bff 50%, #5b8cff 100%)",
    backgroundSize: "200% 200%", animation: "flow 14s ease infinite",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "28px 18px", boxSizing: "border-box",
  };
  const card = { position: "relative", width: "100%", maxWidth: 480, zIndex: 2 };
  const fred = { fontFamily: "'Fredoka', sans-serif" };

  return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes flow { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes floaty { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-12px) rotate(6deg)} }
        @keyframes rise { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pop { 0%{transform:scale(.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
        .opt:hover { transform: translateY(-2px); background: rgba(255,255,255,.28) !important; }
        .opt:active { transform: scale(.98); }
        .cta:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.2); }
      `}</style>

      <div style={{ position:"absolute", top:"8%", left:"8%", fontSize:30, opacity:.5, animation:"floaty 6s ease-in-out infinite" }}>✨</div>
      <div style={{ position:"absolute", top:"14%", right:"10%", fontSize:34, opacity:.55, animation:"floaty 7s ease-in-out infinite" }}>🚀</div>
      <div style={{ position:"absolute", bottom:"10%", left:"12%", fontSize:26, opacity:.5, animation:"floaty 8s ease-in-out infinite" }}>💡</div>

      {/* INTRO */}
      {screen === "intro" && (
        <div style={{ ...card, textAlign:"center", animation:"rise .6s ease both" }}>
          <div style={{ fontSize:64, animation:"floaty 5s ease-in-out infinite" }}>🦄</div>
          <h1 style={{ ...fred, fontSize:44, fontWeight:700, letterSpacing:1, margin:"6px 0 2px", color:"#fff", textShadow:"0 4px 20px rgba(0,0,0,.18)" }}>
            Startup Destiny
          </h1>
          <p style={{ fontSize:12.5, letterSpacing:2, textTransform:"uppercase", opacity:.9, margin:0, fontWeight:700 }}>
            Digital Business Innovation · Binus @Bekasi
          </p>
          <div style={{ height:2, width:90, margin:"20px auto", background:"rgba(255,255,255,.6)", borderRadius:2 }} />
          <p style={{ fontSize:17, lineHeight:1.6, fontWeight:600, maxWidth:380, margin:"0 auto 6px" }}>
            Setiap founder hebat punya tipe-nya sendiri. 🌟 Jawab 7 pertanyaan, dan temukan <b>tipe founder</b> yang ada di dalam dirimu!
          </p>
          <p style={{ fontSize:13, opacity:.9, margin:"10px 0 24px", fontWeight:600 }}>
            Selesai? Foto hasilmu & tukar dengan <b>PIN founder</b>-mu 🎁
          </p>
          <button onClick={() => setScreen("quiz")} className="cta" style={{
            ...fred, fontWeight:700, fontSize:18, color:"#a0379a", background:"#ffe24d",
            border:"none", padding:"15px 42px", borderRadius:40, cursor:"pointer",
            boxShadow:"0 8px 24px rgba(0,0,0,.18)", transition:"all .25s",
          }}>Mulai Petualangan 🚀</button>
        </div>
      )}

      {/* QUIZ */}
      {screen === "quiz" && (
        <div style={{ ...card, animation:"rise .4s ease both" }} key={step}>
          <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:22 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ width:i===step?26:9, height:9, borderRadius:9,
                background:i<=step?"#ffe24d":"rgba(255,255,255,.4)", transition:"all .3s" }} />
            ))}
          </div>
          <p style={{ textAlign:"center", fontSize:12, letterSpacing:2, opacity:.85, margin:"0 0 6px", textTransform:"uppercase", fontWeight:700 }}>
            Langkah {step + 1} dari {QUESTIONS.length}
          </p>
          <h2 style={{ ...fred, fontSize:24, fontWeight:600, textAlign:"center", lineHeight:1.4, margin:"0 0 24px", textShadow:"0 2px 12px rgba(0,0,0,.15)" }}>
            {QUESTIONS[step].q}
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {QUESTIONS[step].options.map((o, idx) => (
              <button key={idx} className="opt" onClick={() => choose(o.to, idx)} style={{
                fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15.5, textAlign:"left", color:"#fff",
                cursor:"pointer", background: picked===idx ? "rgba(255,255,255,.32)" : "rgba(255,255,255,.16)",
                border:"1.5px solid rgba(255,255,255,.35)", padding:"15px 18px", borderRadius:16,
                transition:"all .2s", backdropFilter:"blur(4px)",
              }}>{o.t}</button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {screen === "result" && (
        <div style={{ ...card, textAlign:"center", animation:"rise .6s ease both" }}>
          <p style={{ fontSize:12, letterSpacing:3, opacity:.9, textTransform:"uppercase", margin:"0 0 12px", fontWeight:700 }}>
            ✦ Tipe founder kamu adalah ✦
          </p>

          <div style={{ position:"relative", display:"inline-block", margin:"2px 0 14px", animation:"pop .55s ease both" }}>
            <div style={{ width:140, height:140, borderRadius:"50%", background:"#fff",
              display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto",
              boxShadow:`0 0 0 8px ${result.glow}55, 0 14px 36px rgba(0,0,0,.22)`, flexDirection:"column" }}>
              <div style={{ fontSize:54, lineHeight:1 }}>{result.emoji}</div>
              <div style={{ fontSize:8.5, letterSpacing:.8, marginTop:5, fontWeight:800, color:result.glow }}>DIGITAL BUSINESS INNOVATION</div>
              <div style={{ fontSize:8, letterSpacing:.8, fontWeight:700, color:"#777" }}>BINUS @BEKASI</div>
            </div>
          </div>

          <h2 style={{ ...fred, fontSize:30, fontWeight:700, margin:"0 0 2px", textShadow:"0 3px 16px rgba(0,0,0,.18)" }}>{result.name}</h2>
          <div style={{ display:"inline-block", fontSize:13, fontWeight:800, color:result.glow, background:"#fff",
            borderRadius:30, padding:"5px 16px", margin:"6px 0 4px" }}>{result.type}</div>
          <p style={{ fontSize:13, opacity:.92, margin:"6px 0 16px", fontWeight:700 }}>⚡ Kekuatan utama: {result.power}</p>

          <div style={{ background:"rgba(255,255,255,.18)", border:"1px solid rgba(255,255,255,.32)",
            borderRadius:18, padding:"16px 20px", backdropFilter:"blur(4px)", marginBottom:16 }}>
            <p style={{ fontSize:15.5, lineHeight:1.65, margin:0, fontWeight:600 }}>{result.fortune}</p>
          </div>

          <p style={{ fontSize:11.5, letterSpacing:1.5, opacity:.85, textTransform:"uppercase", margin:"0 0 8px", fontWeight:700 }}>
            Mata kuliah yang menantimu
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center", marginBottom:16 }}>
            {result.courses.map((c, i) => (
              <span key={i} style={{ fontSize:12, fontWeight:700, padding:"6px 12px", borderRadius:20,
                background:"rgba(255,255,255,.22)", border:"1px solid rgba(255,255,255,.45)", color:"#fff" }}>{c}</span>
            ))}
          </div>

          <p style={{ fontSize:11.5, letterSpacing:1.5, opacity:.85, textTransform:"uppercase", margin:"0 0 4px", fontWeight:700 }}>Jalur kariermu</p>
          <p style={{ fontSize:14, fontWeight:800, margin:"0 0 18px", lineHeight:1.5 }}>{result.prospek}</p>

          <div style={{ fontSize:13, lineHeight:1.55, fontWeight:700, background:"#ffe24d", color:"#a0379a",
            borderRadius:14, padding:"12px 16px", marginBottom:20 }}>
            📸 Foto hasilmu untuk story, lalu tunjukkan ke kakak booth buat tukar <b>PIN {result.type}</b>-mu! 🎁
          </div>

          <button onClick={restart} style={{ ...fred, fontWeight:600, fontSize:15, color:"#fff",
            background:"rgba(255,255,255,.18)", border:"1.5px solid rgba(255,255,255,.5)",
            padding:"12px 30px", borderRadius:40, cursor:"pointer" }}>🔄 Cek tipe founder teman</button>
        </div>
      )}
    </div>
  );
}
