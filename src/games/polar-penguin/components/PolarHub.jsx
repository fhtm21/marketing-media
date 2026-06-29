import React, { useState } from 'react';
import { MODULES_CONFIG } from '../data/modules.js';
import { SOUNDS } from '../engine/synthPlay.js';

const LOCK_ICON = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const CHECK_ICON = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * PolarHub — Journey Map (Module 0).
 * Menampilkan 5 modul sebagai timeline vertikal dengan sistem lock/unlock.
 * Dua mode: Guided Journey (sequential) dan Sandbox Free-Play (semua terbuka).
 *
 * @param {{
 *   completedModules: Record<string, {score:number, concept:string, completedAt:string}>,
 *   totalScore: number,
 *   playMode: 'journey'|'freeplay',
 *   setPlayMode: (mode:string) => void,
 *   onSelectModule: (id:string) => void,
 *   onReset: () => void,
 *   onBack: () => void,
 * }} props
 */
export default function PolarHub({
  completedModules, totalScore, playMode, setPlayMode,
  onSelectModule, onReset, onBack,
}) {
  const [showBinusInfo, setShowBinusInfo] = useState(false);
  const [lockedModal, setLockedModal] = useState(null);
  const hasCompleted = Object.keys(completedModules).length > 0;

  const handleSelectModule = (mod) => {
    if (!mod.active) {
      // Buka coming soon modal
      onSelectModule(mod.id);
      return;
    }

    const isUnlocked = playMode === 'freeplay' || !mod.requires || !!completedModules[mod.requires];
    if (!isUnlocked) {
      SOUNDS.wrong();
      setLockedModal(mod);
    } else {
      SOUNDS.correct();
      onSelectModule(mod.id);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #020c1b 0%, #071525 50%, #020c1b 100%)',
      overflowY: 'auto',
      fontFamily: "'Nunito', sans-serif",
      position: 'relative',
    }}>
      <style>{`
        @keyframes PH_pulse  { 0%,100%{box-shadow:0 0 10px rgba(0,240,255,.3)} 50%{box-shadow:0 0 25px rgba(0,240,255,.65)} }
        @keyframes PH_fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes PH_glow   { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes PH_cyber_scroll {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        .PH_card { transition: transform .22s, box-shadow .22s, background .22s; cursor:pointer; }
        .PH_card:hover { transform: translateX(6px); background: rgba(0,240,255,0.06) !important; box-shadow: 0 0 15px rgba(0,240,255,0.15); }
        .PH_card-locked { cursor: not-allowed; }
        .PH_node { transition: transform .15s, box-shadow .15s; }
        .PH_node:hover { transform: scale(1.12); }
        .PH_mode-btn { transition: all .2s; border:none; cursor:pointer; }
        .PH_link { transition: opacity .2s; text-decoration:none; }
        .PH_link:hover { opacity: .75; }
        .PH_grid_overlay {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: PH_cyber_scroll 30s linear infinite;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* Futuristic Cyber-Grid Background */}
      <div className="PH_grid_overlay" />

      {/* ── Header ── */}
      <header style={{
        padding: '14px 20px', flexShrink: 0,
        background: 'rgba(3,6,17,0.92)',
        borderBottom: '1px solid rgba(0,240,255,0.18)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
              color: 'rgba(0,240,255,.7)', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: '4px 0',
            }}
          >
            ← Hub
          </button>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.1)' }} />
          <div>
            <p style={{ fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase', color: '#00f0ff', fontWeight: 900, margin: 0, fontFamily: "'Orbitron', sans-serif" }}>
              POLAR IT PORTAL
            </p>
            <p style={{ fontSize: 7.5, color: '#f48120', fontWeight: 800, margin: 0, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              BINUS @BEKASI // SYS_V2
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Total Score */}
          <div style={{
            background: 'rgba(3,6,17,.8)', border: '1px solid rgba(0,240,255,.25)',
            padding: '4px 12px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 0 10px rgba(0,240,255,0.15)',
          }}>
            <span style={{ fontSize: 8, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>XP SCORE:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 900, color: '#fbbf24', fontSize: 13 }}>{totalScore}</span>
          </div>
          {/* Info button */}
          <button
            aria-label="Info BINUS @Bekasi"
            onClick={() => setShowBinusInfo(true)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(0,240,255,.1)', border: '1px solid rgba(0,240,255,.25)',
              color: '#00f0ff', cursor: 'pointer', fontSize: 13, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >ℹ</button>
        </div>
      </header>

      {/* ── Play Mode Toggle ── */}
      <div style={{ padding: '14px 20px 0', flexShrink: 0, zIndex: 1 }}>
        <div style={{
          display: 'flex', padding: 4,
          background: 'rgba(3,6,17,.85)', borderRadius: 12,
          border: '1px solid rgba(0,240,255,.15)',
        }}>
          {[
            { key: 'journey', label: 'Guided Journey', color: '#f48120' },
            { key: 'freeplay', label: 'Sandbox Free-Play', color: '#00f0ff' },
          ].map((m) => (
            <button
              key={m.key}
              className="PH_mode-btn"
              onClick={() => {
                setPlayMode(m.key);
                SOUNDS.modeSwitch(m.key === 'journey');
              }}
              style={{
                flex: 1, padding: '8px 6px', borderRadius: 9, fontSize: 11, fontWeight: 800,
                fontFamily: "'Nunito', sans-serif",
                background: playMode === m.key ? m.color : 'transparent',
                color: playMode === m.key ? '#030611' : '#64748b',
                boxShadow: playMode === m.key ? `0 2px 12px ${m.color}55` : 'none',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Guided Targets & Instructions Banner (Easy to Understand) ── */}
      {playMode === 'journey' && (
        <div style={{ padding: '16px 20px 0', flexShrink: 0, zIndex: 1 }}>
          {(() => {
            let stepTitle = "";
            let stepDesc = "";
            let stepTargetId = "";

            if (!completedModules.market) {
              stepTitle = "TARGET 01 // MARKETS FORECAST";
              stepDesc = "Analisis pola cuaca kutub dan tetapkan harga pasokan ikan terbaik di Market Tycoon.";
              stepTargetId = "market";
            } else if (!completedModules.network) {
              stepTitle = "TARGET 02 // ROUTING SCHEMATIC";
              stepDesc = "Hubungkan Igloo Server utama ke semua Client peripheral dengan aman di Network Architect.";
              stepTargetId = "network";
            } else if (!completedModules.trendsetter) {
              stepTitle = "TARGET 03 // AUDIENCE ENGAGEMENT";
              stepDesc = "Susun hashtag digital marketing yang optimal untuk memaksimalkan kampanye di Polar Trendsetter.";
              stepTargetId = "trendsetter";
            } else if (!completedModules.sorter) {
              stepTitle = "TARGET 04 // DATA NORMALIZATION";
              stepDesc = "Sortir paket data transaksional, metadata, dan error log ke tabel relasional di Data Sorter.";
              stepTargetId = "sorter";
            } else if (!completedModules.expedition) {
              stepTitle = "TARGET 05 // AGILE RESOLUTION";
              stepDesc = "Kerahkan tim ekspedisi Arctic secara sprint teratur untuk menyelesaikan ekspedisi.";
              stepTargetId = "expedition";
            } else {
              stepTitle = "🏆 PIPELINE COMPLETED // CERTIFIED";
              stepDesc = "Semua modul berhasil dimasteri! Kamu siap menguasai program kurikulum Business IT BINUS.";
            }

            return (
              <div style={{
                background: "rgba(3, 6, 17, 0.75)",
                border: "1.5px solid #00f0ff",
                borderRadius: 12, padding: "14px 16px",
                boxShadow: "0 0 15px rgba(0, 240, 255, 0.15), inset 0 0 10px rgba(0,240,255,0.05)",
                display: "flex", gap: 12, alignItems: "center"
              }}>
                <span style={{ fontSize: 28 }}>🎯</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "11px", fontWeight: 900, color: "#f48120", fontFamily: "monospace", letterSpacing: 1.2 }}>
                    {stepTitle}
                  </div>
                  <p style={{ fontSize: "13px", color: "#e2e8f0", margin: "4px 0 0", lineHeight: 1.45, fontWeight: "bold" }}>
                    {stepDesc}
                  </p>
                  {stepTargetId && (
                    <button
                      onClick={() => {
                        const targetMod = MODULES_CONFIG.find(m => m.id === stepTargetId);
                        if (targetMod) handleSelectModule(targetMod);
                      }}
                      style={{
                        background: "rgba(0, 240, 255, 0.12)", border: "1px solid rgba(0, 240, 255, 0.4)",
                        color: "#00f0ff", borderRadius: 8, padding: "6px 12px", fontSize: "11px",
                        fontFamily: "monospace", fontWeight: "bold", marginTop: 8, cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(0, 240, 255, 0.2)"}
                      onMouseLeave={e => e.currentTarget.style.background = "rgba(0, 240, 255, 0.12)"}
                    >
                      KLIK UNTUK MEMULAI TARGET ➜
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Journey Title ── */}
      <div style={{ textAlign: 'center', padding: '18px 20px 8px', flexShrink: 0, zIndex: 1 }}>
        <h2 style={{
          fontSize: 14, fontWeight: 900, color: '#e0f2fe',
          letterSpacing: 2.5, textTransform: 'uppercase', margin: 0,
          fontFamily: "'Orbitron', sans-serif", textShadow: "0 0 12px rgba(255,255,255,0.15)"
        }}>
          🐧 ARCTIC DATA PIPELINE MAP
        </h2>
      </div>

      {/* ── Module Timeline ── */}
      <div style={{ flex: 1, padding: '8px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14, zIndex: 1 }}>
        {MODULES_CONFIG.map((mod, index) => {
          const isUnlocked = playMode === 'freeplay' || !mod.requires || !!completedModules[mod.requires];
          const isCompleted = !!completedModules[mod.id];
          const isActive = isUnlocked && !isCompleted;
          const isLocked = !isUnlocked;

          let cardStyle = {};
          let statusLabel = '';
          let statusColor = '#64748b';

          if (isCompleted) {
            cardStyle = {
              background: 'rgba(16,185,129,0.06)',
              borderColor: 'rgba(16,185,129,0.3)',
              boxShadow: '0 4px 12px rgba(16,185,129,0.05)'
            };
            statusLabel = '✓ PIPELINE MASTERED';
            statusColor = '#10b981';
          } else if (isActive) {
            cardStyle = {
              background: 'rgba(0,240,255,0.05)',
              borderColor: 'rgba(0,240,255,0.38)',
              boxShadow: '0 4px 20px rgba(0,240,255,0.12)',
              animation: 'PH_pulse 2.2s ease-in-out infinite'
            };
            statusLabel = mod.active ? '▶ ACTIVE PIPELINE' : '⚙️ PREVIEW SPEC';
            statusColor = '#00f0ff';
          } else {
            cardStyle = {
              background: 'rgba(15,23,42,0.35)',
              borderColor: 'rgba(255,255,255,0.08)',
              opacity: 0.55
            };
            statusLabel = '🔒 PIPELINE LOCKED';
            statusColor = '#64748b';
          }

          return (
            <div
              key={mod.id}
              onClick={() => handleSelectModule(mod)}
              role="button"
              tabIndex={isLocked ? -1 : 0}
              onKeyDown={(e) => e.key === 'Enter' && handleSelectModule(mod)}
              className={isLocked ? 'PH_card-locked' : 'PH_card'}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                border: '1.5px solid', borderRadius: 16, padding: '14px 18px',
                minHeight: 80, transition: 'all 0.2s',
                animation: `PH_fadeIn .35s ${index * .06}s ease both`,
                position: 'relative',
                ...cardStyle
              }}
            >
              {/* Left Side: Large Familiar Status Icon */}
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: isCompleted ? 'rgba(16,185,129,0.15)' : isActive ? 'rgba(0,240,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isCompleted ? '#10b981' : isActive ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, flexShrink: 0
              }}>
                {isCompleted ? '✅' : isLocked ? '🔒' : mod.icon}
              </div>

              {/* Center Info: Large text size for UI/UX principles */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                  <span style={{
                    fontSize: '10px', textTransform: 'uppercase', letterSpacing: 1.5,
                    fontWeight: 900, color: statusColor, fontFamily: 'monospace'
                  }}>
                    {statusLabel}
                  </span>
                  {isCompleted && (
                    <span style={{
                      fontSize: '11px', fontWeight: 900, color: '#10b981',
                      background: 'rgba(16,185,129,0.12)', padding: '2px 8px', borderRadius: 20,
                      fontFamily: 'monospace'
                    }}>
                      +{completedModules[mod.id].score} XP
                    </span>
                  )}
                  {!mod.active && !isCompleted && (
                    <span style={{
                      fontSize: '9px', fontWeight: 900, color: '#f59e0b',
                      background: 'rgba(245,158,11,0.12)', padding: '2px 8px', borderRadius: 20,
                      fontFamily: 'monospace'
                    }}>
                      COMING SOON
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontSize: '16px', fontWeight: 900, margin: 0,
                  color: isLocked ? '#475569' : '#e0f2fe',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                  fontFamily: "'Orbitron', sans-serif",
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {mod.title}
                </h3>
                <p style={{
                  fontSize: '13px', margin: 0, fontWeight: 600,
                  color: isLocked ? '#334155' : '#8492a6',
                }}>
                  {mod.concept}
                </p>
              </div>

              {/* Right Side: Navigation arrow clue */}
              {!isLocked && (
                <div style={{
                  fontSize: 18, color: isCompleted ? '#10b981' : '#00f0ff',
                  opacity: 0.65, display: 'flex', alignItems: 'center'
                }}>
                  ➔
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center', padding: '12px 20px 16px', flexShrink: 0,
        borderTop: '1px solid rgba(0, 240, 255, 0.15)',
        background: 'rgba(3,6,17,0.88)', zIndex: 1
      }}>
        <p style={{ fontSize: 8, color: '#475569', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px', fontFamily: "monospace" }}>
          School of Information Systems • BINUS UNIVERSITY @Bekasi
        </p>
        {hasCompleted && (
          <button
            onClick={onReset}
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: 9, color: '#ef4444', fontWeight: 700,
              background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)',
              borderRadius: 8, padding: '4px 12px', cursor: 'pointer',
            }}
          >
            Reset Progress
          </button>
        )}
      </footer>

      {/* ── Locked Module Modal ── */}
      {lockedModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(2,12,27,.88)', backdropFilter: 'blur(6px)',
            zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24,
          }}
        >
          <div style={{
            width: '100%', maxWidth: 300,
            background: '#071525', border: '1px solid rgba(56,189,248,.2)',
            borderRadius: 18, padding: '24px 20px', textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,.6)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
            <h3 style={{ fontSize: 12, fontWeight: 800, color: '#e0f2fe', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 8px' }}>
              Modul Terkunci
            </h3>
            <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.6, margin: '0 0 10px' }}>
              Selesaikan{' '}
              <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                {MODULES_CONFIG.find(m => m.id === lockedModal.requires)?.title}
              </span>
              {' '}terlebih dahulu untuk membuka modul ini.
            </p>
            <div style={{
              fontSize: 10, color: '#f59e0b', background: 'rgba(245,158,11,.08)',
              border: '1px solid rgba(245,158,11,.2)', borderRadius: 10,
              padding: '8px 12px', marginBottom: 14, lineHeight: 1.55,
            }}>
              💡 Tip: Aktifkan <strong>Sandbox Free-Play</strong> di atas untuk melewati urutan Journey!
            </div>
            <button
              onClick={() => setLockedModal(null)}
              style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
                color: '#e0f2fe', background: 'rgba(56,189,248,.1)',
                border: '1px solid rgba(56,189,248,.2)',
                borderRadius: 10, padding: '10px 20px', cursor: 'pointer',
                width: '100%', textTransform: 'uppercase', letterSpacing: 1,
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ── BINUS Info Modal ── */}
      {showBinusInfo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Informasi BINUS @Bekasi"
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(2,12,27,.92)', backdropFilter: 'blur(8px)',
            zIndex: 50, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20,
          }}
        >
          <div style={{
            width: '100%', maxWidth: 340,
            background: '#071525', border: '1px solid rgba(56,189,248,.2)',
            borderRadius: 20, padding: '24px 20px', maxHeight: '80vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#38bdf8', margin: '0 0 2px' }}>BINUS @Bekasi</h3>
                <p style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>
                  Business Information Technology
                </p>
              </div>
              <button
                aria-label="Tutup info"
                onClick={() => setShowBinusInfo(false)}
                style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 18, padding: '0 4px' }}
              >×</button>
            </div>

            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.7, margin: '0 0 12px' }}>
              Selamat datang di <b>Business IT Simulation Sandbox</b>. Dengan mengelola logistik pasokan, harga jual, dan topologi jaringan, kamu langsung menyentuh modul kurikulum BINUS.
            </p>

            <div style={{
              background: 'rgba(14,165,233,.06)', border: '1px solid rgba(56,189,248,.15)',
              borderRadius: 10, padding: '12px 14px', marginBottom: 16,
            }}>
              <p style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 6px' }}>
                Curriculum Touchpoints
              </p>
              <ul style={{ fontSize: 10.5, color: '#64748b', margin: 0, paddingLeft: 16, lineHeight: 1.9 }}>
                <li>Dynamic Demand Forecasting</li>
                <li>E-Commerce Business Analytics</li>
                <li>System Redundancy & Network Topology</li>
                <li>Consumer Behavioral Models</li>
                <li>Agile Project Management</li>
              </ul>
            </div>

            <a
              href="https://binus.ac.id/bekasi/"
              target="_blank"
              rel="noopener noreferrer"
              className="PH_link"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px', background: 'rgba(14,165,233,.15)',
                border: '1px solid rgba(56,189,248,.3)', borderRadius: 12,
                fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800,
                color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              🌐 Kunjungi Website BINUS @Bekasi
            </a>
            <button
              onClick={() => setShowBinusInfo(false)}
              style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
                color: '#64748b', background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.08)', borderRadius: 10,
                padding: '10px', cursor: 'pointer', width: '100%',
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
