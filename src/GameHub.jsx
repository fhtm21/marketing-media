import React, { useState, useEffect } from "react";
import OrbitRocketAdventure from "./OrbitRocketAdventure";
import StartupDestinyRPG from "./StartupDestinyRPG";
import PolarPenguinGame from "./games/polar-penguin/index";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=Orbitron:wght@700;900&display=swap');
`;

const GAMES = [
  {
    id: "polar",
    emoji: "🐧",
    title: "Polar IT Portal",
    program: "Business Information Technology",
    rank: "A-RANK GATE",
    description: "Kuasai konsep strategis Business IT melalui tiga simulasi modul interaktif.",
    tags: ["E-Commerce Analytics", "System Topology", "Digital Marketing"],
    accent: "#00f0ff",
    glowColor: "rgba(0, 240, 255, 0.4)",
    activity: "Mengelola harga pasar arktik, merancang jalur routing jaringan igloo bebas hambatan, serta menyusun target kombinasi hashtag kampanye marketing.",
    guide: "Menguji kemampuan demand forecasting, perancangan redundansi jaringan (topology layout), dan strategi targeting audiens sosial media.",
    competencies: [
      { name: "Business Analytics", level: 90, color: "#f48120" },
      { name: "Social Media Strategy", level: 85, color: "#00f0ff" },
      { name: "IT Entrepreneurship", level: 95, color: "#10b981" }
    ],
    careers: ["E-Commerce Analyst", "Digital Marketer", "Network Systems Architect"]
  },
  {
    id: "orbit",
    emoji: "🚀",
    title: "ORBIT Adventure",
    program: "Business Information Technology",
    rank: "S-RANK GATE",
    description: "Eksplorasi planet karir dan selesaikan tantangan adopsi teknologi korporasi.",
    tags: ["Enterprise Tech", "AI for Business", "Career Mapping"],
    accent: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.4)",
    activity: "Mempelajari kasus adopsi teknologi di berbagai industri, merancang arsitektur sistem enterprise, dan menganalisis peran kecerdasan buatan (AI) bagi bisnis.",
    guide: "Menguji pemahaman tentang sistem enterprise, analisis keselarasan bisnis-IT, serta keputusan pemilihan adopsi kecerdasan buatan.",
    competencies: [
      { name: "Business Analytics", level: 95, color: "#f48120" },
      { name: "Social Media Strategy", level: 80, color: "#00f0ff" },
      { name: "IT Entrepreneurship", level: 90, color: "#10b981" }
    ],
    careers: ["IT Consultant", "Business Analyst", "Enterprise Solution Architect"]
  },
  {
    id: "destiny",
    emoji: "🦄",
    title: "Startup Destiny",
    program: "Digital Business Innovation",
    rank: "B-RANK GATE",
    description: "Uji karakter kepemimpinan technopreneur dalam skenario bisnis krusial.",
    tags: ["Technopreneur", "Designpreneur", "Innovation"],
    accent: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.4)",
    activity: "Mengambil keputusan strategis dalam 7 fase pembangunan startup teknologi, mulai dari pendanaan awal, operasional, hingga strategi scaling produk.",
    guide: "Menguji insting wirausaha teknologi (technopreneurship), analisis profil manajemen risiko, serta pemahaman design thinking dalam berinovasi.",
    competencies: [
      { name: "Business Analytics", level: 85, color: "#f48120" },
      { name: "Social Media Strategy", level: 90, color: "#00f0ff" },
      { name: "IT Entrepreneurship", level: 95, color: "#10b981" }
    ],
    careers: ["Tech Founder / CEO", "Product Manager", "Digital Strategist"]
  }
];

function playHubSound(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'select') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'hover') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'launch') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(987.77, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // Fail-soft
  }
}

function PanelCorners({ color }) {
  const c = color || "rgba(0, 240, 255, 0.3)";
  return (
    <>
      <div style={{ position: "absolute", top: -1, left: -1, width: 10, height: 10, borderTop: `2px solid ${c}`, borderLeft: `2px solid ${c}`, borderTopLeftRadius: 8, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: -1, right: -1, width: 10, height: 10, borderTop: `2px solid ${c}`, borderRight: `2px solid ${c}`, borderTopRightRadius: 8, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -1, left: -1, width: 10, height: 10, borderBottom: `2px solid ${c}`, borderLeft: `2px solid ${c}`, borderBottomLeftRadius: 8, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderBottom: `2px solid ${c}`, borderRight: `2px solid ${c}`, borderBottomRightRadius: 8, pointerEvents: "none" }} />
    </>
  );
}

function renderGatePortal(gameId, accent) {
  return (
    <svg viewBox="0 0 200 200" style={{ width: "100%", height: "100%" }} className="holo-float hud-portal-svg">
      <defs>
        <radialGradient id="portalEnergy" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.85" />
          <stop offset="45%" stopColor={accent} stopOpacity="0.45" />
          <stop offset="85%" stopColor="#030611" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#030611" stopOpacity="0" />
        </radialGradient>
        
        <filter id="portalGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Outer Spinning Runes */}
      <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="80" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="15, 35, 10, 20" className="holo-rotate" style={{ transformOrigin: "center" }} />
      <circle cx="100" cy="100" r="72" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="5, 15, 8, 10" className="holo-rotate-reverse" style={{ transformOrigin: "center" }} />
      
      {/* Energy core */}
      <circle cx="100" cy="100" r="62" fill="url(#portalEnergy)" filter="url(#portalGlow)" />
      
      {/* Spirals */}
      <g className="holo-rotate" style={{ transformOrigin: "center", animationDuration: "7s" }}>
        <path d="M 100,52 A 48,48 0 0,1 148,100 A 48,48 0 0,1 100,148 A 48,48 0 0,1 52,100 Z" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="18, 12" />
        <path d="M 100,66 A 34,34 0 0,1 134,100 A 34,34 0 0,1 100,134 A 34,34 0 0,1 66,100 Z" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="8, 12" opacity="0.4" />
      </g>
      
      <g className="holo-rotate-reverse" style={{ transformOrigin: "center", animationDuration: "9s" }}>
        <path d="M 100,58 A 42,42 0 0,1 142,100 A 42,42 0 0,1 100,142 A 42,42 0 0,1 58,100 Z" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="25, 20" opacity="0.35" />
        <path d="M 100,74 A 26,26 0 0,1 126,100 A 26,26 0 0,1 100,126 A 26,26 0 0,1 74,100 Z" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="4, 6" />
      </g>

      <circle cx="100" cy="100" r="16" fill="rgba(3, 6, 17, 0.95)" stroke={accent} strokeWidth="2" />
      <text x="100" y="104" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="'Orbitron', sans-serif" fontWeight="900" letterSpacing="0.5">GATE</text>
    </svg>
  );
}

export default function GameHub() {
  const [active, setActive] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState("polar");
  const [timeStr, setTimeStr] = useState("12:00:00");
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const [latency, setLatency] = useState(14);
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    
    const interval = setInterval(() => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("id-ID"));
    }, 1000);

    const latInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 6) + 12);
    }, 3000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      clearInterval(latInterval);
    };
  }, []);

  // Trigger progress bar animations on load or game change
  useEffect(() => {
    setAnimateProgress(false);
    const timer = setTimeout(() => {
      setAnimateProgress(true);
    }, 60);
    return () => clearTimeout(timer);
  }, [selectedGameId]);

  if (active === "orbit") return <OrbitRocketAdventure onBack={() => setActive(null)} />;
  if (active === "destiny") return <StartupDestinyRPG onBack={() => setActive(null)} />;
  if (active === "polar") return <PolarPenguinGame onBack={() => setActive(null)} />;

  const game = GAMES.find(g => g.id === selectedGameId) || GAMES[0];

  const handleSelectGame = (id) => {
    setSelectedGameId(id);
    playHubSound('select');
  };

  const handleLaunchGame = (id) => {
    playHubSound('launch');
    setTimeout(() => {
      setActive(id);
    }, 220);
  };

  return (
    <div style={{
      height: "100vh", width: "100vw", position: "relative", overflow: "hidden",
      fontFamily: "'Nunito', sans-serif", color: "#fff",
      background: "#030611",
      display: "flex", flexDirection: "column",
      boxSizing: "border-box",
    }}>
      <style>{FONTS}</style>
      <style>{`
        /* Cyberpunk Space Grid Background */
        .HUD_grid_bg {
          position: absolute; inset: 0;
          background-image: 
            radial-gradient(circle at center, rgba(10, 25, 47, 0.4) 0%, rgba(2, 4, 10, 0.99) 100%),
            linear-gradient(0deg, transparent 24%, rgba(0, 240, 255, 0.02) 25%, rgba(0, 240, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.02) 75%, rgba(0, 240, 255, 0.02) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 240, 255, 0.02) 25%, rgba(0, 240, 255, 0.02) 26%, transparent 27%, transparent 74%, rgba(0, 240, 255, 0.02) 75%, rgba(0, 240, 255, 0.02) 76%, transparent 77%, transparent);
          background-size: 100% 100%, 36px 36px, 36px 36px;
          z-index: 1;
          pointer-events: none;
        }

        /* Scanline Anim */
        @keyframes scanlineMove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .HUD_scanline {
          position: absolute; inset: 0;
          background: linear-gradient(
            rgba(0, 240, 255, 0.03) 0%,
            rgba(0, 240, 255, 0) 10%,
            rgba(0, 240, 255, 0) 90%,
            rgba(0, 240, 255, 0.03) 100%
          );
          background-size: 100% 100%;
          animation: scanlineMove 12s linear infinite;
          pointer-events: none;
          z-index: 2;
        }

        /* Ambient scan stripes */
        .HUD_stripes {
          position: absolute; inset: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%);
          background-size: 100% 4px;
          opacity: 0.2;
          pointer-events: none;
          z-index: 2;
        }

        /* Twinkle stars */
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.6; }
        }

        /* High-tech Cyber Buttons */
        .hud-btn {
          transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
          border: 1px solid rgba(0, 240, 255, 0.15);
          background: rgba(5, 12, 28, 0.45);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .hud-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.15), transparent);
          transition: left 0.4s;
        }
        .hud-btn:hover::before {
          left: 100%;
        }
        .hud-btn:hover {
          border-color: rgba(0, 240, 255, 0.45);
          background: rgba(0, 240, 255, 0.06);
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);
          transform: translateX(4px);
        }
        .hud-btn-active {
          border-color: #f48120 !important;
          background: rgba(244, 129, 32, 0.12) !important;
          box-shadow: 0 0 15px rgba(244, 129, 32, 0.2);
        }
        .hud-btn-active::after {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0; width: 3px;
          background: #f48120;
        }

        .hud-panel {
          position: relative;
          border: 1px solid rgba(0, 240, 255, 0.12);
          background: rgba(6, 14, 28, 0.65);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.35);
        }

        /* Slanted panel styles */
        .hud-btn-slanted {
          position: relative;
          clip-path: polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%);
        }

        /* Cyberpunk Scrollbars */
        .cyber-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .cyber-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .cyber-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 240, 255, 0.2);
          border-radius: 2px;
        }
        .cyber-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 240, 255, 0.4);
        }

        /* SVG Hologram Animations */
        @keyframes holoRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes holoRotateRev {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes holoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .holo-rotate {
          animation: holoRotate 20s linear infinite;
        }
        .holo-rotate-reverse {
          animation: holoRotateRev 15s linear infinite;
        }
        .holo-float {
          animation: holoFloat 3s ease-in-out infinite;
        }

        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 12px rgba(244, 129, 32, 0.4); filter: brightness(1); }
          50% { box-shadow: 0 0 26px rgba(244, 129, 32, 0.85); filter: brightness(1.15); }
        }
        .play-btn-pulse {
          animation: pulseGlow 2s infinite;
          transition: all 0.22s;
        }
        .play-btn-pulse:hover {
          transform: scale(1.02) skewX(-10deg) !important;
        }
        .play-btn-pulse:active {
          transform: scale(0.98) skewX(-10deg) !important;
        }

        /* Dynamic Height Responsiveness */
        .hud-main {
          padding: 20px 30px;
          gap: 16px;
        }
        .hud-title-block {
          height: 44px;
          margin-bottom: 6px;
        }
        .hud-title-text {
          font-size: 26px;
        }
        .hud-subtitle-text {
          font-size: 11px;
          margin: 4px 0 0;
        }
        .hud-grid {
          gap: 20px;
        }
        .hud-col1-panel {
          padding: 18px 14px;
          gap: 12px;
        }
        .hud-col1-list {
          gap: 12px;
        }
        .hud-col1-btn {
          padding: 16px 14px;
        }
        .hud-col1-btn span {
          font-size: 24px;
        }
        .hud-col1-btn-title {
          font-family: 'Orbitron', sans-serif;
          font-weight: 900;
          font-size: 14px;
        }
        .hud-col1-btn-desc {
          font-size: 10.5px;
        }
        .hud-col2-panel {
          padding: 20px 24px;
          gap: 12px;
        }
        .hud-portal-wrapper {
          min-height: 130px;
        }
        .hud-portal-dashed {
          width: 150px;
          height: 150px;
        }
        .hud-portal-svg {
          max-height: 155px !important;
        }
        .hud-col2-title {
          font-size: 24px;
        }
        .hud-col2-desc {
          font-size: 14.5px;
        }
        .hud-objectives-box {
          padding: 14px 16px;
          gap: 10px;
        }
        .hud-obj-row {
          gap: 3px;
        }
        .hud-obj-label {
          font-size: 9.5px;
        }
        .hud-obj-text {
          font-size: 13px;
        }
        .hud-launch-btn {
          padding: 14px 0;
          font-size: 14px;
        }
        .hud-col3-panel {
          padding: 16px 18px;
          gap: 16px;
        }
        .hud-col3-sec-gap {
          gap: 12px;
        }
        .hud-capability-row {
          gap: 5px;
        }
        .hud-capability-row .label-text {
          font-size: 12px;
        }
        .hud-capability-row .value-text {
          font-size: 12px;
        }
        .hud-progress-bar {
          height: 8px;
        }
        .hud-career-list {
          gap: 8px;
        }
        .hud-career-card {
          padding: 10px 12px;
        }
        .hud-career-card span {
          font-size: 12.5px;
        }

        @media (max-height: 800px) {
          .hud-main {
            padding: 12px 20px;
            gap: 10px;
          }
          .hud-title-block {
            height: 32px;
            margin-bottom: 2px;
          }
          .hud-title-text {
            font-size: 20px;
          }
          .hud-subtitle-text {
            font-size: 9.5px;
            margin: 2px 0 0;
          }
          .hud-grid {
            gap: 12px;
          }
          .hud-col1-panel {
            padding: 10px;
            gap: 8px;
          }
          .hud-col1-list {
            gap: 8px;
          }
          .hud-col1-btn {
            padding: 10px 10px;
          }
          .hud-col1-btn span {
            font-size: 18px;
          }
          .hud-col1-btn-title {
            font-size: 12px;
          }
          .hud-col1-btn-desc {
            font-size: 9.5px;
          }
          .hud-col2-panel {
            padding: 12px 16px;
            gap: 8px;
          }
          .hud-portal-wrapper {
            min-height: 90px;
          }
          .hud-portal-dashed {
            width: 110px;
            height: 110px;
          }
          .hud-portal-svg {
            max-height: 115px !important;
          }
          .hud-col2-title {
            font-size: 18px;
            margin-bottom: 2px !important;
          }
          .hud-col2-desc {
            font-size: 12px;
          }
          .hud-objectives-box {
            padding: 8px 12px;
            gap: 6px;
          }
          .hud-obj-row {
            gap: 1px;
          }
          .hud-obj-label {
            font-size: 8px;
          }
          .hud-obj-text {
            font-size: 11px;
          }
          .hud-launch-btn {
            padding: 10px 0;
            font-size: 12px;
          }
          .hud-col3-panel {
            padding: 12px 14px;
            gap: 10px;
          }
          .hud-col3-sec-gap {
            gap: 8px;
          }
          .hud-capability-row {
            gap: 3px;
          }
          .hud-capability-row .label-text {
            font-size: 10.5px;
          }
          .hud-capability-row .value-text {
            font-size: 10.5px;
          }
          .hud-progress-bar {
            height: 6px;
          }
          .hud-career-list {
            gap: 6px;
          }
          .hud-career-card {
            padding: 6px 10px;
          }
          .hud-career-card span {
            font-size: 11px;
          }
        }

        @media (max-height: 650px) {
          .hud-main {
            padding: 8px 15px;
            gap: 6px;
          }
          .hud-title-block {
            height: 24px;
            margin-bottom: 0px;
          }
          .hud-title-text {
            font-size: 16px;
          }
          .hud-subtitle-text {
            display: none;
          }
          .hud-grid {
            gap: 8px;
          }
          .hud-col1-panel {
            padding: 8px;
            gap: 6px;
          }
          .hud-col1-list {
            gap: 6px;
          }
          .hud-col1-btn {
            padding: 8px 8px;
          }
          .hud-col1-btn span {
            font-size: 16px;
          }
          .hud-col1-btn-title {
            font-size: 11px;
          }
          .hud-col1-btn-desc {
            font-size: 9px;
          }
          .hud-col2-panel {
            padding: 8px 12px;
            gap: 6px;
          }
          .hud-portal-wrapper {
            min-height: 60px;
          }
          .hud-portal-dashed {
            width: 80px;
            height: 80px;
          }
          .hud-portal-svg {
            max-height: 85px !important;
          }
          .hud-col2-title {
            font-size: 15px;
            margin-bottom: 0px !important;
          }
          .hud-col2-desc {
            font-size: 11px;
          }
          .hud-objectives-box {
            padding: 6px 10px;
            gap: 4px;
          }
          .hud-obj-row {
            gap: 0px;
          }
          .hud-obj-label {
            font-size: 7.5px;
          }
          .hud-obj-text {
            font-size: 10px;
            line-height: 1.3 !important;
          }
          .hud-launch-btn {
            padding: 8px 0;
            font-size: 10.5px;
          }
          .hud-col3-panel {
            padding: 8px 10px;
            gap: 6px;
          }
          .hud-col3-sec-gap {
            gap: 4px;
          }
          .hud-capability-row {
            gap: 2px;
          }
          .hud-capability-row .label-text {
            font-size: 9.5px;
          }
          .hud-capability-row .value-text {
            font-size: 9.5px;
          }
          .hud-progress-bar {
            height: 5px;
          }
          .hud-career-list {
            gap: 4px;
          }
          .hud-career-card {
            padding: 4px 8px;
          }
          .hud-career-card span {
            font-size: 10px;
          }
        }
      `}</style>

      {/* Latar Belakang Siber */}
      <div className="HUD_grid_bg" />
      <div className="HUD_scanline" />
      <div className="HUD_stripes" />

      {/* Star Particles */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 143.5) % 100}%`,
          top: `${(i * 87.7) % 100}%`,
          width: i % 4 === 0 ? 2 : 1,
          height: i % 4 === 0 ? 2 : 1,
          borderRadius: "50%",
          background: "#fff",
          opacity: 0.15 + (i % 4) * 0.05,
          animation: `twinkle ${2 + (i % 3)}s ease-in-out ${(i % 3) * 0.5}s infinite`,
          pointerEvents: "none",
          zIndex: 1
        }} />
      ))}

      {/* ── HEADER (Fixed height: 56px) ── */}
      <header style={{
        height: 56, width: "100%", padding: "0 20px",
        borderBottom: "1px solid rgba(0, 240, 255, 0.15)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxSizing: "border-box", zIndex: 10,
        background: "rgba(3, 6, 17, 0.9)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f48120", boxShadow: "0 0 8px #f48120" }} />
          <div>
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: 13, fontWeight: 900,
              letterSpacing: 2, color: "#fff"
            }}>
              BINUS UNIVERSITY
            </span>
            <span style={{ fontSize: 9.5, color: "#f48120", fontWeight: 800, marginLeft: 8, letterSpacing: 1 }}>
              @BEKASI
            </span>
          </div>
        </div>

        {/* Diagnostic widgets */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "monospace", fontSize: 9.5, color: "#475569" }}>
          {isDesktop && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#334155" }}>SYS:</span>
                <span style={{ color: "#10b981", fontWeight: "bold" }}>ONLINE</span>
              </div>
              <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#334155" }}>TEMP:</span>
                <span style={{ color: "#f48120" }}>37.4°C</span>
              </div>
              <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#334155" }}>LATENCY:</span>
                <span style={{ color: "#00f0ff" }}>{latency}ms</span>
              </div>
              <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#334155" }}>SECTOR:</span>
                <span style={{ color: "#e2e8f0" }}>BUSINESS_IT</span>
              </div>
              <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.1)" }} />
            </>
          )}
          <span style={{ color: "#f48120", fontWeight: "bold" }}>{timeStr}</span>
        </div>
      </header>

      {/* ── MAIN AREA (Viewport Locked, Spacious Desktop) ── */}
      {isDesktop ? (
        /* ── DESKTOP LAYOUT (3 columns, large typography, beautiful scale) ── */
        <main className="hud-main" style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          justifyContent: "flex-start",
          zIndex: 10,
          boxSizing: "border-box",
          overflow: "hidden",
          margin: 0
        }}>
          {/* Header Title Block */}
          <div className="hud-title-block" style={{ textAlign: "center", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 className="hud-title-text" style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              margin: 0,
              letterSpacing: 3,
              background: "linear-gradient(90deg, #f48120, #ff9f43, #00f0ff, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 0 20px rgba(0, 240, 255, 0.15)"
            }}>
              GAME YOUR FUTURE PORTAL
            </h1>
            <p className="hud-subtitle-text" style={{ color: "#64748b", fontWeight: 800, letterSpacing: 1, textTransform: "uppercase" }}>
              School of Information Systems • Business Information Technology
            </p>
          </div>

          {/* 3-Column HUD Grid */}
          <div className="hud-grid" style={{
            width: "100%",
            maxWidth: "1240px",
            margin: "0 auto",
            display: "grid", gridTemplateColumns: "310px 1.4fr 310px",
            flex: 1,
            minHeight: 0,
            overflow: "hidden"
          }}>
            {/* Column 1: Gate Registry (Game Selector) */}
            <div className="hud-panel hud-col1-panel" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
              <PanelCorners color="rgba(0, 240, 255, 0.2)" />
              <div style={{ paddingBottom: 8, borderBottom: "1px solid rgba(0, 240, 255, 0.15)" }}>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'Orbitron', sans-serif" }}>
                  📂 GATE REGISTRY
                </span>
              </div>

              <div className="hud-col1-list" style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
                {GAMES.map((g) => {
                  const isActive = g.id === selectedGameId;
                  return (
                    <button
                      key={g.id}
                      className={`hud-btn ${isActive ? 'hud-btn-active' : ''} hud-col1-btn`}
                      onClick={() => handleSelectGame(g.id)}
                      onMouseEnter={() => playHubSound('hover')}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        borderRadius: 8,
                        textAlign: "left", color: "#fff",
                        fontFamily: "'Nunito', sans-serif"
                      }}
                    >
                      <span>{g.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span className="hud-col1-btn-title" style={{
                            color: isActive ? g.accent : '#e2e8f0',
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            textShadow: isActive ? `0 0 10px ${g.accent}88` : "none"
                          }}>
                            {g.title}
                          </span>
                          <span style={{ fontSize: "9px", fontWeight: "900", color: g.accent, opacity: isActive ? 1 : 0.6, fontFamily: "'Orbitron', sans-serif" }}>
                            {g.rank.split(" ")[0]}
                          </span>
                        </div>
                        <div className="hud-col1-btn-desc" style={{ color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                          {g.program}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Holographic Gate Portal & Description (Solo Leveling inspired) */}
            <div className="hud-panel cyber-scroll hud-col2-panel" style={{
              display: "flex", flexDirection: "column",
              justifyContent: "space-between", overflowY: "auto", height: "100%",
              boxShadow: `inset 0 0 30px ${game.accent}15`,
              borderColor: `${game.accent}44`
            }}>
              <PanelCorners color={game.accent} />
              
              {/* Header Ranks */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <span style={{
                  fontSize: "10px", fontWeight: "900", color: game.accent,
                  background: `${game.accent}15`, border: `1px solid ${game.accent}44`,
                  borderRadius: 4, padding: "4px 10px", textTransform: "uppercase", letterSpacing: 1.5,
                  fontFamily: "'Orbitron', sans-serif"
                }}>
                  {game.program}
                </span>
                
                <span style={{
                  fontSize: "12px", fontWeight: "900", color: "#fff",
                  background: game.accent,
                  borderRadius: 4, padding: "4px 12px",
                  fontFamily: "'Orbitron', sans-serif",
                  boxShadow: `0 0 10px ${game.accent}66`,
                  letterSpacing: 1
                }}>
                  {game.rank}
                </span>
              </div>

              {/* Swirling Gate Vortex */}
              <div className="hud-portal-wrapper" style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
                overflow: "hidden"
              }}>
                <div className="hud-portal-dashed" style={{
                  position: "absolute",
                  borderRadius: "50%",
                  border: `2px dashed ${game.accent}22`,
                  boxShadow: `0 0 30px ${game.accent}15`
                }} />
                {renderGatePortal(game.id, game.accent)}
              </div>

              {/* Slanted Cyberpunk Action Button (Moved to Middle) */}
              <div style={{ display: "flex", justifyContent: "center", flexShrink: 0, margin: "8px 0" }}>
                <button
                  onClick={() => handleLaunchGame(game.id)}
                  className="play-btn-pulse hud-btn-slanted hud-launch-btn"
                  style={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    color: "#fff",
                    background: `linear-gradient(135deg, ${game.accent}, #f48120)`,
                    borderRadius: 4,
                    letterSpacing: 2,
                    cursor: "pointer",
                    border: "none",
                    boxShadow: `0 0 15px ${game.accent}66`,
                    width: "100%",
                    transform: "skewX(-10deg)",
                    textTransform: "uppercase"
                  }}
                >
                  <span style={{ display: "inline-block", transform: "skewX(10deg)" }}>
                    ENTER GATE // CLEAR SIMULATION ⚔️
                  </span>
                </button>
              </div>

              {/* Title & Description */}
              <div style={{ flexShrink: 0, textAlign: "center" }}>
                <h2 className="hud-col2-title" style={{
                  fontWeight: "900", margin: "0 0 6px",
                  fontFamily: "'Orbitron', sans-serif", letterSpacing: 1,
                  textShadow: `0 0 15px ${game.accent}66`,
                  color: "#fff"
                }}>
                  {game.emoji} {game.title}
                </h2>
                <p className="hud-col2-desc" style={{ lineHeight: "1.55", color: "#e2e8f0", margin: 0, fontWeight: "700" }}>
                  {game.description}
                </p>
              </div>

              {/* Activity & Guide Box (Highly Readable) */}
              <div className="hud-objectives-box" style={{
                background: "rgba(3, 6, 17, 0.5)",
                border: "1px solid rgba(0, 240, 255, 0.12)",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
                flexShrink: 0
              }}>
                <div className="hud-obj-row" style={{ display: "flex", flexDirection: "column" }}>
                  <span className="hud-obj-label" style={{ color: game.accent, fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: 1 }}>
                    ⚡ ACTIVE OBJECTIVES (AKTIVITAS)
                  </span>
                  <p className="hud-obj-text" style={{ color: "#cbd5e1", margin: 0, fontWeight: 600, lineHeight: 1.45 }}>
                    {game.activity}
                  </p>
                </div>
                
                <div className="hud-obj-row" style={{ display: "flex", flexDirection: "column" }}>
                  <span className="hud-obj-label" style={{ color: "#f48120", fontWeight: 900, fontFamily: "'Orbitron', sans-serif", letterSpacing: 1 }}>
                    🔍 TARGET ASSESSMENT (MENGUJI)
                  </span>
                  <p className="hud-obj-text" style={{ color: "#cbd5e1", margin: 0, fontWeight: 600, lineHeight: 1.45 }}>
                    {game.guide}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 3: RPG stats and career outcomes */}
            <div className="hud-panel hud-col3-panel" style={{ display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
              <PanelCorners color="rgba(0, 240, 255, 0.2)" />
              
              {/* Section A: RPG Stats HUD */}
              <div className="hud-col3-sec-gap" style={{ display: "flex", flexDirection: "column", flex: 1.3 }}>
                <div style={{ paddingBottom: 6, borderBottom: "1px solid rgba(0, 240, 255, 0.15)" }}>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'Orbitron', sans-serif" }}>
                    ⚔️ HUNTER CAPABILITIES
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }} className="hud-col3-sec-gap">
                  {game.competencies.map((comp, idx) => {
                    const shortName = idx === 0 ? "ANL" : idx === 1 ? "SOC" : "ENT";
                    return (
                      <div key={idx} className="hud-capability-row" style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "900", fontFamily: "'Orbitron', sans-serif" }}>
                          <span className="label-text" style={{ color: "#e2e8f0" }}>{shortName} <span style={{ fontSize: "9px", color: "#64748b", fontWeight: "bold" }}>({comp.name})</span></span>
                          <span className="value-text" style={{ color: comp.color, textShadow: `0 0 8px ${comp.color}55` }}>{comp.level} / 100</span>
                        </div>
                        <div className="hud-progress-bar" style={{ width: "100%", background: "rgba(255,255,255,0.03)", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{
                            height: "100%",
                            width: animateProgress ? `${comp.level}%` : "0%",
                            background: `linear-gradient(90deg, ${comp.color}cc, ${comp.color})`,
                            borderRadius: "4px",
                            boxShadow: `0 0 10px ${comp.color}`,
                            transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)"
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section B: Career outcomes as Expedition Rewards */}
              <div className="hud-col3-sec-gap" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ paddingBottom: 6, borderBottom: "1px solid rgba(0, 240, 255, 0.15)" }}>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 800, textTransform: "uppercase", letterSpacing: 2, fontFamily: "'Orbitron', sans-serif" }}>
                    🏆 EXPEDITION REWARDS
                  </span>
                </div>

                <div className="hud-career-list" style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
                  <span style={{ fontSize: "9.5px", color: "#64748b", fontWeight: "bold", fontFamily: "monospace" }}>UNLOCKABLE CAREER PATHS:</span>
                  {game.careers.map((career, idx) => (
                    <div key={idx} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)", borderRadius: 8
                    }} className="hud-btn-slanted hud-career-card">
                      <div style={{ width: 6, height: 6, background: game.accent, borderRadius: "50%", boxShadow: `0 0 6px ${game.accent}` }} />
                      <span style={{ fontWeight: "800", color: "#cbd5e1", fontFamily: "'Nunito', sans-serif" }}>{career}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* ── MOBILE LAYOUT (tabbed, strict fit, zero scroll, large typography) ── */
        <main style={{
          height: "calc(100vh - 90px)",
          padding: "10px",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 10,
          boxSizing: "border-box",
          overflow: "hidden"
        }}>
          {/* Mobile compact title */}
          <div style={{ textAlign: "center", height: 26, flexShrink: 0 }}>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "16px",
              fontWeight: 900,
              margin: 0,
              letterSpacing: 1.5,
              background: "linear-gradient(90deg, #f48120, #ff9f43, #00f0ff, #a855f7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              BINUS BIT PORTAL
            </h1>
          </div>

          {/* Game Selector Tabs */}
          <div style={{
            display: "flex",
            background: "rgba(6, 14, 28, 0.7)",
            borderRadius: 10,
            border: "1px solid rgba(0, 240, 255, 0.15)",
            padding: "4px",
            gap: 4,
            flexShrink: 0
          }}>
            {GAMES.map((g) => {
              const isActive = g.id === selectedGameId;
              return (
                <button
                  key={g.id}
                  onClick={() => handleSelectGame(g.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 2px",
                    background: isActive ? "rgba(244, 129, 32, 0.1)" : "transparent",
                    border: "none",
                    borderBottom: isActive ? "2px solid #f48120" : "2px solid transparent",
                    borderRadius: 6,
                    color: isActive ? "#f48120" : "#64748b",
                    transition: "all 0.2s"
                  }}
                >
                  <span style={{ fontSize: 16 }}>{g.emoji}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, fontFamily: "'Orbitron', sans-serif" }}>
                    {g.title.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Detail Panel (zero scroll, readable font size) */}
          <div className="hud-panel" style={{
            flex: 1,
            marginTop: 8,
            marginBottom: 8,
            padding: "12px 14px",
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: `inset 0 0 15px ${game.accent}11`,
            borderColor: `${game.accent}22`,
            overflow: "hidden"
          }}>
            <PanelCorners color={game.accent} />

            {/* Header info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  fontSize: 8.5, fontWeight: 900, color: game.accent,
                  background: `${game.accent}15`, border: `1px solid ${game.accent}33`,
                  borderRadius: 4, padding: "2px 8px", textTransform: "uppercase"
                }}>
                  {game.rank}
                </span>
                <span style={{ fontSize: 8.5, color: "#475569", fontFamily: "monospace" }}>SIM_{game.id.toUpperCase()}</span>
              </div>

              <h2 style={{
                fontSize: 15, fontWeight: 900, fontFamily: "'Orbitron', sans-serif", margin: "2px 0 0"
              }}>
                {game.emoji} {game.title}
              </h2>
            </div>

            {/* Schematic Illustration (Scaled down for mobile view) */}
            <div style={{
              height: 54,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(5, 12, 28, 0.3)",
              border: "1px solid rgba(0, 240, 255, 0.05)",
              borderRadius: 6,
              padding: "2px",
              overflow: "hidden",
              flexShrink: 0
            }}>
              <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
                {renderGatePortal(game.id, game.accent)}
              </div>
            </div>

            {/* Activity & Guide Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0 }}>
              <div style={{ fontSize: 11, lineHeight: 1.35, color: "#cbd5e1" }}>
                <span style={{ color: game.accent, fontWeight: "bold" }}>Aktivitas: </span>
                {game.activity}
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.35, color: "#cbd5e1" }}>
                <span style={{ color: "#f48120", fontWeight: "bold" }}>Menguji: </span>
                {game.guide}
              </div>
            </div>

            {/* Mobile Competencies Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 4 }}>
                {game.competencies.map((comp, idx) => (
                  <div key={idx} style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 4,
                    padding: "4px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: 7, color: "#64748b", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {comp.name.split(" ")[0]}
                    </div>
                    <div style={{ fontSize: 9.5, fontWeight: 900, color: comp.color }}>
                      {comp.level}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Slanted Launch Button */}
            <button
              onClick={() => handleLaunchGame(game.id)}
              className="play-btn-pulse hud-btn-slanted"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900, fontSize: 12,
                color: "#fff",
                background: `linear-gradient(135deg, ${game.accent}, #f48120)`,
                padding: "10px 0",
                borderRadius: 4,
                letterSpacing: 1.5,
                border: "none",
                width: "100%",
                boxShadow: `0 0 10px ${game.accent}44`,
                cursor: "pointer",
                flexShrink: 0,
                transform: "skewX(-10deg)"
              }}
            >
              <span style={{ display: "inline-block", transform: "skewX(10deg)" }}>
                ENTER GATE ⚔️
              </span>
            </button>
          </div>
        </main>
      )}

      {/* ── FOOTER (Fixed height: 34px) ── */}
      <footer style={{
        height: 34, width: "100%", padding: "0 20px",
        borderTop: "1px solid rgba(0, 240, 255, 0.12)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        boxSizing: "border-box", zIndex: 10,
        background: "rgba(3, 6, 17, 0.8)",
      }}>
        <span style={{ fontSize: 8.5, letterSpacing: 1.5, opacity: 0.4, textTransform: "uppercase", fontWeight: 700 }}>
          SYS PORTAL TERMINAL v2.0.0
        </span>
        <span style={{ fontSize: 8.5, letterSpacing: 1.5, opacity: 0.4, textTransform: "uppercase", fontWeight: 700 }}>
          BINUS UNIVERSITY @BEKASI
        </span>
      </footer>
    </div>
  );
}
