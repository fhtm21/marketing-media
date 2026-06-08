import React, { useState, useEffect, useMemo } from "react";

// ============================================================
// ORBIT ROCKET ADVENTURE — Business Information Technology Explorer
// Text adventure style dengan roket eksplorasi ke 4 lokasi
// Business IT Program — Binus @Bekasi
// Fokus 2 streaming: Business Enterprise Technology & AI for Business
// ============================================================

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;600&family=Quicksand:wght@400;500;600;700&display=swap');
`;

// Lokasi eksplorasi
const LOCATIONS = {
  launch: {
    name: "Launch Pad",
    emoji: "🚀",
    description: "Di landasan peluncuran, roket siap meluncur ke cosmos. Angin bertiup kencang, menunggu perintah untuk memulai misi penemuan profesi impianmu.",
    character: "👨‍🚀 Commander",
    characterDialogue: "Selamat datang di misi ORBIT! Saya Commander, pilot andalan Anda. Setiap planet memiliki keajaiban dan tantangan yang berbeda. Siap untuk memulai petualangan?",
    choices: [
      { text: "Siap! Mari jelajahi cosmos!", next: "dataPlanet" },
      { text: "Ceritakan dulu tentang misi ini", next: "info" }
    ]
  },
  dataPlanet: {
    name: "Planet Data",
    emoji: "🌍",
    description: "Planet yang dipenuhi dengan angka dan pola. Di sini, setiap data memberikan cerita. Atmosfernya misterius namun penuh wawasan.",
    character: "📊 Data Sage",
    characterDialogue: "Selamat datang di Planet Data! Saya Data Sage, penjaga kebenaran tersembunyi di balik angka. Di sini, kita akan menemukan pola yang menentukan masa depanmu.",
    choices: [
      { text: "Apa pola yang terlihat di sini?", next: "analyst" },
      { text: "Bagaimana data memengaruhi bisnis?", next: "social" }
    ]
  },
  techPlanet: {
    name: "Planet Teknologi",
    emoji: "🔧",
    description: "Permukaan planet yang dipenuhi dengan mesin canggih dan sistem yang rumit. Setiap teknologi memiliki potensi untuk mengubah dunia.",
    character: "🤖 Tech Guardian",
    characterDialogue: "Selamat datang di Planet Teknologi! Saya Tech Guardian, penjaga inovasi. Di sini, kita akan menemukan solusi teknologi yang paling cocok untuk tantangan masa depan.",
    choices: [
      { text: "Apa solusi teknologi terbaik di sini?", next: "builder" },
      { text: "Bagaimana AI dapat membantu bisnis?", next: "smart" }
    ]
  },
  aiPlanet: {
    name: "Planet AI",
    emoji: "🧠",
    description: "Dimensi di mana kecerdasan buatan berkembang pesat. Di sini, mesin belajar dan meramal masa depan dengan akurasi yang luar biasa.",
    character: "🔮 AI Oracle",
    characterDialogue: "Selamat datang di Planet AI! Saya AI Oracle, penjaga pengetahuan masa depan. Di sini, kita akan meramal profesi impianmu berdasarkan potensi AI.",
    choices: [
      { text: "Apa prediksi AI untuk masa depan?", next: "ml" },
      { text: "Bagaimana data science bekerja di sini?", next: "cognitive" }
    ]
  }
};

// Streaming meta
const STREAMS = {
  bet: { name: "Business Enterprise Technology", short: "Business Enterprise Tech", tint: "#ffd36e" },
  aib: { name: "Artificial Intelligence for Business", short: "AI for Business", tint: "#7fd4ff" },
};

// Persona definitions (tetap dari versi original)
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

// Animasi bintang yang lebih ringan
function Starfield() {
  const stars = useMemo(
    () => Array.from({ length: 50 }).map(() => ({
      left: Math.random() * 100, top: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5, delay: Math.random() * 3, dur: Math.random() * 2 + 1,
    })), []);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {stars.map((s, i) => (
        <span key={i} style={{
          position: "absolute", left: `${s.left}%`, top: `${s.top}%`,
          width: s.size, height: s.size, borderRadius: "50%", background: "#fff",
          opacity: 0.6, animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

// Animasi roket
function Rocket({ position, destination }) {
  const [rocketPosition, setRocketPosition] = useState(position);
  
  useEffect(() => {
    if (destination) {
      const duration = 2000; // 2 detik untuk perpindahan
      const startTime = Date.now();
      const startPos = position;
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Interpolasi posisi
        const currentX = startPos.x + (destination.x - startPos.x) * progress;
        const currentY = startPos.y + (destination.y - startPos.y) * progress;
        
        setRocketPosition({ x: currentX, y: currentY });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [destination, position]);
  
  return (
    <div style={{
      position: "absolute",
      left: `${rocketPosition.x}%`,
      top: `${rocketPosition.y}%`,
      transform: "translate(-50%, -50%)",
      transition: "all 0.3s ease",
      zIndex: 10,
    }}>
      <div style={{
        fontSize: "32px",
        animation: "floaty 3s ease-in-out infinite",
      }}>🚀</div>
    </div>
  );
}

export default function OrbitRocketAdventure() {
  const [screen, setScreen] = useState("intro");
  const [currentLocation, setCurrentLocation] = useState("launch");
  const [rocketPosition, setRocketPosition] = useState({ x: 50, y: 80 });
  const [destination, setDestination] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finalPersona, setFinalPersona] = useState(null);

  const location = LOCATIONS[currentLocation];
  const result = finalPersona || PERSONAS.analyst; // default ke analyst

  const handleChoice = (choice) => {
    setSelectedChoice(choice.text);
    
    // Animasi roket ke lokasi berikutnya
    const nextLocation = LOCATIONS[choice.next];
    const newDestination = { x: 50, y: 30 }; // Posisi di lokasi baru
    
    setTimeout(() => {
      setDestination(newDestination);
      setRocketPosition(newDestination);
      
      setTimeout(() => {
        setCurrentLocation(choice.next);
        setDestination(null);
        setSelectedChoice(null);
        
        // Jika sudah di lokasi terakhir, tampilkan hasil
        if (choice.next === "ml" || choice.next === "cognitive") {
          setTimeout(() => {
            setShowResult(true);
            setFinalPersona(PERSONAS[choice.next]);
          }, 1000);
        }
      }, 1500);
    }, 500);
  };

  const restart = () => {
    setCurrentLocation("launch");
    setRocketPosition({ x: 50, y: 80 });
    setDestination(null);
    setSelectedChoice(null);
    setShowResult(false);
    setFinalPersona(null);
  };

  const wrap = {
    minHeight: "100vh", width: "100%", position: "relative",
    fontFamily: "'Quicksand', sans-serif", color: "#f4f0ff",
    background: "radial-gradient(120% 90% at 50% -10%, #2a1d5e 0%, #160f3a 38%, #0a0723 72%, #05030f 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "28px 18px", boxSizing: "border-box", overflow: "hidden",
  };
  const card = { position: "relative", width: "100%", maxWidth: 520, zIndex: 2 };
  const display = { fontFamily: "'Cinzel Decorative', serif" };
  const stream = STREAMS[result.stream];

  return (
    <div style={wrap}>
      <style>{FONTS}</style>
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.2;transform:scale(.7)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes rise { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes rocketGlow { 0%,100%{box-shadow:0 0 20px rgba(255,211,110,.4)} 50%{box-shadow:0 0 40px rgba(255,211,110,.8)} }
        .choice-btn:hover { transform: translateY(-2px); border-color: rgba(255,211,110,.8) !important; box-shadow: 0 8px 26px rgba(255,211,110,.18); }
        .choice-btn:active { transform: scale(.98); }
        .location-glow { box-shadow: 0 0 30px rgba(255,211,110,.3); }
      `}</style>

      <Starfield />
      
      {/* Background planet effects */}
      <div style={{
        position: "absolute", top: "-50px", right: "-50px", width: 200, height: 200,
        borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffe9b0, #ffce6e 45%, #d99a2b 100%)",
        filter: "blur(3px)", opacity: 0.25, animation: "floaty 8s ease-in-out infinite",
      }} />
      
      <div style={{
        position: "absolute", bottom: "-30px", left: "-30px", width: 180, height: 180,
        borderRadius: "50%", background: "radial-gradient(circle at 65% 70%, #7fd4ff, #4da6ff 45%, #1a75ff 100%)",
        filter: "blur(3px)", opacity: 0.2, animation: "floaty 6s ease-in-out infinite reverse",
      }} />

      {/* Rocket */}
      <Rocket position={rocketPosition} destination={destination} />

      {/* INTRO */}
      {screen === "intro" && (
        <div style={{ ...card, textAlign: "center", animation: "rise .6s ease both" }}>
          <div style={{ fontSize: 64, animation: "floaty 5s ease-in-out infinite" }}>🚀</div>
          <h1 style={{ ...display, fontSize: 46, letterSpacing: 4, margin: "8px 0 2px", color: "#ffd36e", textShadow: "0 0 24px rgba(255,211,110,.45)" }}>ORBIT ROCKET</h1>
          <p style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7, margin: 0 }}>
            Business IT Explorer Mission
          </p>
          <div style={{ height: 1, width: 90, margin: "20px auto", background: "linear-gradient(90deg,transparent,#ffd36e,transparent)" }} />
          <p style={{ fontSize: 17, lineHeight: 1.65, opacity: 0.92, fontWeight: 500, maxWidth: 380, margin: "0 auto 6px" }}>
            Naik roket, jelajahi 4 planet misterius, dan temukan <b style={{ color: "#ffd36e" }}>profesi masa depanmu</b> di cosmos Business IT! 🌌
          </p>
          <p style={{ fontSize: 13, opacity: 0.6, margin: "10px 0 24px" }}>
            Setiap planet memiliki keajaiban yang menunggu penemuanmu
          </p>
          <button onClick={() => setScreen("adventure")} className="glowbtn" style={{
            fontFamily: "'Quicksand',sans-serif", fontWeight: 700, fontSize: 17, color: "#1a1140",
            background: "linear-gradient(135deg,#ffe39a,#ffd36e)", border: "none", padding: "15px 40px",
            borderRadius: 40, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 0 26px rgba(255,211,110,.4)", transition: "all .25s",
          }}>🚀 Launch Mission</button>
        </div>
      )}

      {/* ADVENTURE */}
      {screen === "adventure" && !showResult && (
        <div style={{ ...card, animation: "rise .45s ease both" }}>
          {/* Progress indicator */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
            {Object.keys(LOCATIONS).map((loc, i) => (
              <div key={loc} style={{
                width: i === Object.keys(LOCATIONS).indexOf(currentLocation) ? 20 : 8,
                height: 8, borderRadius: 8,
                background: i <= Object.keys(LOCATIONS).indexOf(currentLocation) ? "#ffd36e" : "rgba(255,255,255,.18)",
                transition: "all .3s",
              }} />
            ))}
          </div>

          {/* Location header */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 8, animation: "pulse 2s ease-in-out infinite" }}>
              {location.emoji}
            </div>
            <h2 style={{ ...display, fontSize: 24, fontWeight: 600, color: "#ffd36e", margin: "0 0 8px" }}>
              {location.name}
            </h2>
            <p style={{ fontSize: 12, letterSpacing: 1, opacity: 0.6, textTransform: "uppercase", margin: 0 }}>
              Sekarang berada di {location.name}
            </p>
          </div>

          {/* Location description */}
          <div style={{
            background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", 
            borderRadius: 16, padding: "16px 20px", backdropFilter: "blur(4px)", 
            marginBottom: 20, fontSize: 15, lineHeight: 1.6
          }}>
            {location.description}
          </div>

          {/* Character */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{location.character.split(' ')[0]}</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#ffd36e", margin: 0 }}>
              {location.character}
            </p>
            <div style={{
              background: "rgba(255,211,110,.1)", border: "1px dashed rgba(255,211,110,.5)",
              borderRadius: 12, padding: "12px 16px", marginTop: 12, fontSize: 14, lineHeight: 1.5
            }}>
              "{location.characterDialogue}"
            </div>
          </div>

          {/* Choices */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {location.choices.map((choice, idx) => (
              <button 
                key={idx} 
                className="choice-btn"
                onClick={() => handleChoice(choice)}
                disabled={selectedChoice !== null}
                style={{
                  fontFamily: "'Quicksand',sans-serif", fontWeight: 600, fontSize: 15, textAlign: "left",
                  color: "#f4f0ff", cursor: "pointer",
                  background: selectedChoice === choice.text ? "rgba(255,211,110,.22)" : "rgba(255,255,255,.06)",
                  border: "1.5px solid rgba(255,255,255,.14)", padding: "14px 16px", borderRadius: 12,
                  transition: "all .2s", backdropFilter: "blur(4px)",
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>

          {selectedChoice && (
            <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, opacity: 0.7 }}>
              🚀 Roket sedang bergerak...
            </div>
          )}
        </div>
      )}

      {/* RESULT */}
      {showResult && (
        <div style={{ ...card, textAlign: "center", animation: "rise .6s ease both" }}>
          <p style={{ fontSize: 12, letterSpacing: 3, opacity: 0.6, textTransform: "uppercase", margin: "0 0 14px" }}>
            ✦ Misi Selesai - Profesi Ditemukan ✦
          </p>

          {/* Rocket arrival animation */}
          <div style={{ position: "relative", display: "inline-block", margin: "4px 0 18px", animation: "pulse .8s ease both" }}>
            <div style={{ position: "absolute", inset: -20, borderRadius: "50%", background: `radial-gradient(circle, ${result.glow}55, transparent 70%)`, animation: "rocketGlow 2s ease-in-out infinite" }} />
            <div style={{
              position: "relative", width: 152, height: 152, borderRadius: "50%",
              background: "radial-gradient(circle at 35% 30%, #1f1652, #0c0828)",
              border: `2.5px solid ${result.glow}`, boxShadow: `0 0 40px ${result.glow}66, inset 0 0 24px ${result.glow}33`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              margin: "0 auto", padding: 8, boxSizing: "border-box",
            }}>
              <div style={{ fontSize: 44, lineHeight: 1 }}>{result.emoji}</div>
              <div style={{ fontSize: 8.5, letterSpacing: 1, marginTop: 6, fontWeight: 700, color: result.glow }}>BUSINESS IT</div>
              <div style={{ fontSize: 8, letterSpacing: 1, opacity: 0.85, fontWeight: 600 }}>EXPLORER</div>
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
            🎯 Selamat! Kamu telah menemukan profesi impianmu melalui eksplorasi cosmos. Wujudkan mimpi menjadi ahli Business IT!
          </div>

          <button onClick={restart} style={{
            fontFamily: "'Quicksand',sans-serif", fontWeight: 700, fontSize: 15, color: "#f4f0ff",
            background: "rgba(255,255,255,.08)", border: "1.5px solid rgba(255,255,255,.25)",
            padding: "12px 30px", borderRadius: 40, cursor: "pointer", transition: "all .2s",
          }}>🚀 Launch New Mission</button>

          <p style={{ ...display, fontSize: 13, letterSpacing: 4, color: "#ffd36e", opacity: 0.85, marginTop: 24 }}>ORBIT ROCKET</p>
        </div>
      )}
    </div>
  );
}