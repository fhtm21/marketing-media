import React from 'react';

/**
 * Merender ilustrasi SVG kustom berdasarkan ID kartu konten.
 *
 * @param {string} cardId - ID unik kartu konten (c1_1 s.d. c3_5)
 * @returns {React.ReactNode}
 */
export function getCardIllustration(cardId) {
  switch (cardId) {
    // ─── LEVEL 1: LESTARIKAN GLETSER (Gen-Z Chicks) ───
    case 'c1_1': // Meme Lingkungan (Penguin berkeringat memeluk es thermometer)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <defs>
            <linearGradient id="iceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          {/* Background glowing circle */}
          <circle cx="100" cy="50" r="40" fill="rgba(56,189,248,0.12)" />
          {/* Ice Block */}
          <rect x="70" y="30" width="60" height="50" rx="8" fill="url(#iceGrad)" stroke="#0ea5e9" strokeWidth="1.5" />
          {/* Thermometer */}
          <rect x="140" y="25" width="8" height="50" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <circle cx="144" cy="70" r="8" fill="#ef4444" />
          <rect x="142" y="30" width="4" height="40" fill="#ef4444" />
          {/* Sweating drops */}
          <path d="M60 40 Q55 45 57 50 T62 43" fill="#38bdf8" />
          <path d="M128 25 Q125 30 127 35 T132 28" fill="#38bdf8" />
          {/* Penguin Emoji in center */}
          <text x="100" y="62" fontSize="30" textAnchor="middle">🐧</text>
          <text x="115" y="45" fontSize="12" textAnchor="middle">💦</text>
        </svg>
      );

    case 'c1_2': // Laporan Korporat (Kertas tabel membosankan dengan silang merah)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <rect x="70" y="15" width="60" height="70" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
          {/* Grid lines */}
          <line x1="75" y1="28" x2="125" y2="28" stroke="#334155" strokeWidth="1.5" />
          <line x1="75" y1="40" x2="125" y2="40" stroke="#334155" strokeWidth="1.5" />
          <line x1="75" y1="52" x2="125" y2="52" stroke="#334155" strokeWidth="1.5" />
          <line x1="75" y1="64" x2="125" y2="64" stroke="#334155" strokeWidth="1.5" />
          <line x1="75" y1="76" x2="125" y2="76" stroke="#334155" strokeWidth="1.5" />
          <line x1="95" y1="28" x2="95" y2="76" stroke="#334155" strokeWidth="1.5" />
          {/* Giant red Cross */}
          <line x1="85" y1="30" x2="115" y2="70" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <line x1="115" y1="30" x2="85" y2="70" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <text x="100" y="85" fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="800" fontFamily="sans-serif">TOO BORING</text>
        </svg>
      );

    case 'c1_3': // Tantangan Interaktif (Penguin dengan headphone menari)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <defs>
            <linearGradient id="neonGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="50" r="42" fill="url(#neonGrad)" opacity="0.15" />
          <circle cx="100" cy="50" r="30" fill="none" stroke="url(#neonGrad)" strokeWidth="2" strokeDasharray="4 4" />
          {/* Musical Notes */}
          <text x="65" y="35" fontSize="16" fill="#a855f7">🎵</text>
          <text x="135" y="45" fontSize="16" fill="#ec4899">🎶</text>
          <text x="125" y="25" fontSize="14" fill="#eab308">⭐️</text>
          {/* Dancing Penguin */}
          <g transform="translate(100, 50) rotate(10) translate(-100, -50)">
            <text x="100" y="60" fontSize="36" textAnchor="middle">🐧</text>
          </g>
          <text x="100" y="32" fontSize="12" fill="#fff" fontWeight="800" textAnchor="middle">✨ DANCE ✨</text>
        </svg>
      );

    case 'c1_4': // Konten Industri (Pabrik asap batu bara di atas es)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <rect x="40" y="80" width="120" height="4" fill="#ef4444" opacity="0.4" />
          {/* Factory Silhouettes */}
          <path d="M50 80 L50 40 L70 55 L70 40 L90 55 L90 80 Z" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          {/* Chimneys */}
          <rect x="110" y="35" width="12" height="45" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="130" y="25" width="12" height="55" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          {/* Dark Smoke */}
          <circle cx="116" cy="24" r="7" fill="#475569" opacity="0.8" />
          <circle cx="123" cy="18" r="9" fill="#334155" opacity="0.8" />
          <circle cx="136" cy="14" r="8" fill="#475569" opacity="0.8" />
          <circle cx="148" cy="10" r="10" fill="#1e293b" opacity="0.9" />
          {/* Warning Sign */}
          <polygon points="100,35 90,55 110,55" fill="#ef4444" stroke="#fff" strokeWidth="1" />
          <text x="100" y="52" fontSize="12" fill="#fff" fontWeight="900" textAnchor="middle">!</text>
        </svg>
      );

    case 'c1_5': // Edukasi Santai (Gletser es biru berkilau di bawah matahari cerah)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <defs>
            <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="glacierGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
          <circle cx="140" cy="35" r="18" fill="url(#sunGrad)" />
          {/* Glaciers */}
          <polygon points="20,90 60,35 100,90" fill="url(#glacierGrad)" stroke="#bae6fd" strokeWidth="1" />
          <polygon points="70,90 120,20 170,90" fill="url(#glacierGrad)" stroke="#bae6fd" strokeWidth="1" opacity="0.9" />
          <polygon points="120,90 150,50 180,90" fill="url(#glacierGrad)" stroke="#bae6fd" strokeWidth="1" opacity="0.7" />
          {/* Sparkles */}
          <text x="50" y="30" fontSize="10" fill="#fde047">✨</text>
          <text x="105" y="15" fontSize="14" fill="#38bdf8">❄️</text>
          <text x="100" y="85" fontSize="30" textAnchor="middle">🐧</text>
        </svg>
      );

    // ─── LEVEL 2: SMART FISHING FINDER (Business B2B) ───
    case 'c2_1': // Radar B2B (Kapal memancarkan gelombang sonar ke ikan)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          {/* Boat */}
          <path d="M60 25 L140 25 L125 45 L75 45 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          <rect x="90" y="12" width="20" height="13" fill="#334155" />
          <line x1="100" y1="12" x2="100" y2="4" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="100" cy="4" r="2" fill="#ef4444" />
          {/* Water Line */}
          <line x1="20" y1="45" x2="180" y2="45" stroke="#0ea5e9" strokeWidth="2" />
          {/* Radar Waves */}
          <path d="M100 48 A22 22 0 0 1 100 85" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          <path d="M100 48 A36 36 0 0 1 100 95" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          {/* Fish silhouettes */}
          <text x="85" y="70" fontSize="12" opacity="0.8">🐟</text>
          <text x="110" y="65" fontSize="10" opacity="0.8">🐠</text>
          <text x="98" y="82" fontSize="11" opacity="0.9">🐟</text>
        </svg>
      );

    case 'c2_2': // Post Informal (Penguin berjoget dengan balon pesan lucu)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <circle cx="100" cy="50" r="42" fill="rgba(244,63,94,0.08)" />
          {/* Chat Bubble */}
          <path d="M50 15 H145 V55 H90 L75 68 L75 55 H50 Z" fill="#1e293b" stroke="#fb7185" strokeWidth="1.5" />
          <text x="97" y="38" fontSize="16" fill="#fff" textAnchor="middle">🤪 MANCING GOKIL 🤪</text>
          {/* Dancing Penguin */}
          <text x="155" y="75" fontSize="36">🐧</text>
          <text x="25" y="55" fontSize="24">⛵</text>
        </svg>
      );

    case 'c2_3': // Grafik Intelijen Pasar (Diagram batang kenaikan ekspor)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <defs>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
          </defs>
          <line x1="50" y1="80" x2="160" y2="80" stroke="#475569" strokeWidth="2" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="#475569" strokeWidth="2" />
          {/* 3 Bars */}
          <rect x="65" y="55" width="20" height="25" fill="url(#greenGrad)" stroke="#22c55e" strokeWidth="1" />
          <rect x="95" y="40" width="20" height="40" fill="url(#greenGrad)" stroke="#22c55e" strokeWidth="1" />
          <rect x="125" y="25" width="20" height="55" fill="url(#greenGrad)" stroke="#22c55e" strokeWidth="1" />
          {/* Growing Arrow */}
          <path d="M60 62 L95 42 L130 20 L130 32 M130 20 L118 20" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x="160" y="35" fontSize="12" fill="#22c55e" fontWeight="800">+12%</text>
          <text x="160" y="48" fontSize="8" fill="#94a3b8" fontWeight="800">YoY</text>
        </svg>
      );

    case 'c2_4': // Kapten Sedih (Topi kapten, tetes air mata, barel kosong)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          {/* Oil Barrel */}
          <rect x="50" y="40" width="30" height="40" rx="2" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="50" y1="50" x2="80" y2="50" stroke="#ef4444" strokeWidth="1" />
          <line x1="50" y1="70" x2="80" y2="70" stroke="#ef4444" strokeWidth="1" />
          <circle cx="65" cy="60" r="5" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          <line x1="60" y1="65" x2="70" y2="55" stroke="#ef4444" strokeWidth="1.5" />
          {/* Captain Hat */}
          <path d="M125 35 Q140 25 155 35 L160 42 L120 42 Z" fill="#fff" stroke="#1e3a8a" strokeWidth="1.5" />
          <rect x="120" y="42" width="40" height="6" fill="#1e3a8a" />
          <circle cx="140" cy="38" r="2.5" fill="#eab308" />
          {/* Sad face penguin */}
          <text x="140" y="76" fontSize="32">🐧</text>
          {/* Tear Drop */}
          <path d="M150 63 Q154 68 152 72 T146 72 Z" fill="#38bdf8" />
          <text x="98" y="30" fontSize="16" fill="#ef4444">⛽ 📉</text>
        </svg>
      );

    case 'c2_5': // Pameran Produk (Mockup dashboard handphone monitor suhu)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          {/* Phone Frame */}
          <rect x="75" y="10" width="50" height="80" rx="8" fill="#020c1b" stroke="#38bdf8" strokeWidth="2" />
          {/* Screen elements */}
          <circle cx="100" cy="15" r="2.5" fill="#334155" />
          {/* Chart visual inside screen */}
          <circle cx="100" cy="45" r="18" fill="none" stroke="#1e293b" strokeWidth="3" />
          <path d="M85 53 A18 18 0 0 1 115 53" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" />
          <text x="100" y="47" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="900" fontFamily="monospace">-2.4°C</text>
          <text x="100" y="55" fontSize="5" fill="#22c55e" textAnchor="middle" fontWeight="800">SAFE TEMPERATURE</text>
          {/* Temperature Alarm indicator */}
          <rect x="85" y="68" width="30" height="10" rx="3" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="0.5" />
          <text x="100" y="75" fontSize="5" fill="#22c55e" textAnchor="middle" fontWeight="800">CLOUDBACKUP OK</text>
        </svg>
      );

    // ─── LEVEL 3: ECO-GLAMPING PREMIUM (Eco-Tourists) ───
    case 'c3_1': // Geodesic Dome (Glass Dome under starry night aurora)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <defs>
            <linearGradient id="auroraGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Stars */}
          <circle cx="35" cy="20" r="0.7" fill="#fff" />
          <circle cx="70" cy="15" r="0.5" fill="#fff" />
          <circle cx="155" cy="22" r="0.8" fill="#fff" />
          <circle cx="120" cy="12" r="0.6" fill="#fff" />
          {/* Aurora wavy ribbon */}
          <path d="M20 25 Q60 10 100 25 T180 25" fill="none" stroke="url(#auroraGrad)" strokeWidth="8" strokeLinecap="round" opacity="0.65" />
          {/* Geodesic Dome (triangulated hemisphere) */}
          <path d="M70 80 A30 30 0 0 1 130 80 Z" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.5" />
          <line x1="70" y1="80" x2="130" y2="80" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Triangle lattices */}
          <line x1="100" y1="50" x2="100" y2="80" stroke="#38bdf8" strokeWidth="1" />
          <line x1="100" y1="50" x2="80" y2="68" stroke="#38bdf8" strokeWidth="1" />
          <line x1="100" y1="50" x2="120" y2="68" stroke="#38bdf8" strokeWidth="1" />
          <line x1="80" y1="68" x2="120" y2="68" stroke="#38bdf8" strokeWidth="1" />
          <line x1="80" y1="68" x2="70" y2="80" stroke="#38bdf8" strokeWidth="1" />
          <line x1="120" y1="68" x2="130" y2="80" stroke="#38bdf8" strokeWidth="1" />
          <line x1="80" y1="68" x2="100" y2="80" stroke="#38bdf8" strokeWidth="1" />
          <line x1="120" y1="68" x2="100" y2="80" stroke="#38bdf8" strokeWidth="1" />
          <text x="100" y="44" fontSize="10" fill="#06b6d4" textAnchor="middle" fontWeight="800">GLAMPING DOME</text>
        </svg>
      );

    case 'c3_2': // Kereta salju bising (Sled memancarkan gelombang suara menakuti singa laut)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          {/* Fast Sled outline */}
          <path d="M40 65 L85 65 L95 55 L70 50 L55 50 Z" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" />
          <path d="M35 70 Q95 70 100 58" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          {/* Loud Speaker sound waves */}
          <path d="M98 46 Q110 30 120 46" fill="none" stroke="#ef4444" strokeWidth="2" />
          <path d="M104 40 Q122 18 135 40" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.7" />
          <path d="M110 34 Q134 6 150 34" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.4" />
          {/* Frightened wildlife */}
          <text x="155" y="68" fontSize="28">🦭</text>
          <text x="162" y="46" fontSize="16" fill="#ef4444">⚠️</text>
          <text x="65" y="40" fontSize="12" fill="#ef4444" fontWeight="900" textAnchor="middle">NOISY SLED</text>
        </svg>
      );

    case 'c3_3': // Siluet Pendaki (Menyusuri gletser terjal)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          {/* Steep Ice Mountain */}
          <polygon points="20,90 120,25 180,90" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          <polygon points="120,25 105,45 130,55 120,25" fill="#38bdf8" opacity="0.3" />
          {/* Hikers walking up */}
          <circle cx="70" cy="58" r="3.5" fill="#38bdf8" />
          <line x1="68" y1="62" x2="72" y2="58" stroke="#38bdf8" strokeWidth="1" />

          <circle cx="95" cy="42" r="3.5" fill="#38bdf8" />
          <line x1="93" y1="46" x2="97" y2="42" stroke="#38bdf8" strokeWidth="1" />

          <circle cx="115" cy="29" r="3.5" fill="#38bdf8" />
          <line x1="113" y1="33" x2="117" y2="29" stroke="#38bdf8" strokeWidth="1" />
          {/* Safety Rope connecting hikers */}
          <path d="M70 58 Q82 52 95 42 Q105 35 115 29" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="2 2" />
          <text x="100" y="86" fontSize="8" fill="#94a3b8" textAnchor="middle" fontWeight="700">LIMITED GUIDED EXPEDITION</text>
        </svg>
      );

    case 'c3_4': // Komersialisasi Lahan (Gedung beton di atas es mencair)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          {/* Cracked melting ice base */}
          <line x1="30" y1="80" x2="170" y2="80" stroke="#0ea5e9" strokeWidth="3" />
          <path d="M75 80 L79 87 L83 80 L95 80 L98 89 L104 80 M130 80 L135 90 L140 80" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
          {/* Giant Commercial Building blocks */}
          <rect x="55" y="30" width="30" height="50" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="90" y="20" width="35" height="60" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="130" y="45" width="22" height="35" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
          {/* Dollar signs in air */}
          <text x="70" y="22" fontSize="16" fill="#ef4444" fontWeight="bold">$</text>
          <text x="108" y="14" fontSize="16" fill="#ef4444" fontWeight="bold">$</text>
          <text x="141" y="36" fontSize="12" fill="#ef4444" fontWeight="bold">$</text>
          {/* Warning text */}
          <text x="100" y="94" fontSize="8" fill="#ef4444" textAnchor="middle" fontWeight="800">THREAT TO HABITAT</text>
        </svg>
      );

    case 'c3_5': // Fasilitas Eco Luxury (Sup hangat di samping panel surya)
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <defs>
            <linearGradient id="solarGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
          </defs>
          {/* Solar Panel */}
          <rect x="40" y="40" width="45" height="35" rx="2" fill="url(#solarGrad)" stroke="#38bdf8" strokeWidth="1.5" transform="skewX(-10)" />
          {/* Panel Grid Lines */}
          <line x1="42" y1="57" x2="80" y2="57" stroke="#38bdf8" strokeWidth="0.8" transform="skewX(-10)" />
          <line x1="53" y1="40" x2="43" y2="75" stroke="#38bdf8" strokeWidth="0.8" transform="skewX(-10)" />
          <line x1="68" y1="40" x2="58" y2="75" stroke="#38bdf8" strokeWidth="0.8" transform="skewX(-10)" />
          {/* Steaming Food bowl */}
          <path d="M120 65 C120 78, 160 78, 160 65 Z" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
          <line x1="115" y1="65" x2="165" y2="65" stroke="#64748b" strokeWidth="1.5" />
          {/* Rising Steam */}
          <path d="M130 57 Q127 50 131 44 T128 35" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M140 54 Q137 47 141 41 T138 32" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M150 56 Q147 49 151 43 T148 34" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
          {/* Solar Sun */}
          <circle cx="62" cy="20" r="8" fill="#fde047" />
          <text x="140" y="86" fontSize="8.5" fill="#10b981" textAnchor="middle" fontWeight="800">SOLAR ENERGY COOKE</text>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 100" style={svgStyle}>
          <circle cx="100" cy="50" r="30" fill="rgba(255,255,255,0.05)" />
          <text x="100" y="58" fontSize="24" textAnchor="middle">📱</text>
        </svg>
      );
  }
}

const svgStyle = {
  width: '100%',
  height: '100%',
  maxHeight: '120px',
  display: 'block',
  margin: '0 auto',
  overflow: 'visible',
};
