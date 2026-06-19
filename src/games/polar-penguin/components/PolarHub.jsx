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
        @keyframes PH_pulse  { 0%,100%{box-shadow:0 0 10px rgba(56,189,248,.3)} 50%{box-shadow:0 0 25px rgba(56,189,248,.6)} }
        @keyframes PH_fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes PH_glow   { 0%,100%{opacity:.6} 50%{opacity:1} }
        .PH_card { transition: transform .2s, box-shadow .2s; cursor:pointer; }
        .PH_card:hover { transform: translateX(4px); }
        .PH_card-locked { cursor: not-allowed; }
        .PH_node { transition: transform .15s; }
        .PH_node:hover { transform: scale(1.08); }
        .PH_mode-btn { transition: all .2s; border:none; cursor:pointer; }
        .PH_link { transition: opacity .2s; text-decoration:none; }
        .PH_link:hover { opacity: .75; }
      `}</style>

      {/* ── Header ── */}
      <header style={{
        padding: '14px 20px', flexShrink: 0,
        background: 'rgba(2,12,27,0.9)',
        borderBottom: '1px solid rgba(56,189,248,0.15)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onBack}
            style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
              color: 'rgba(56,189,248,.7)', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: '4px 0',
            }}
          >
            ← Hub
          </button>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.1)' }} />
          <div>
            <p style={{ fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, margin: 0, opacity: .8 }}>
              POLAR IT PORTAL
            </p>
            <p style={{ fontSize: 7.5, color: '#475569', fontWeight: 700, margin: 0, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              BINUS @Bekasi
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Total Score */}
          <div style={{
            background: 'rgba(2,12,27,.8)', border: '1px solid rgba(56,189,248,.2)',
            padding: '4px 10px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Score:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fbbf24', fontSize: 13 }}>{totalScore}</span>
          </div>
          {/* Info button */}
          <button
            aria-label="Info BINUS @Bekasi"
            onClick={() => setShowBinusInfo(true)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)',
              color: '#38bdf8', cursor: 'pointer', fontSize: 13, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}
          >ℹ</button>
        </div>
      </header>

      {/* ── Play Mode Toggle ── */}
      <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
        <div style={{
          display: 'flex', padding: 4,
          background: 'rgba(7,21,37,.8)', borderRadius: 12,
          border: '1px solid rgba(56,189,248,.12)',
        }}>
          {[
            { key: 'journey', label: 'Guided Journey', color: '#0ea5e9' },
            { key: 'freeplay', label: 'Sandbox Free-Play', color: '#06b6d4' },
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
                color: playMode === m.key ? '#020c1b' : '#64748b',
                boxShadow: playMode === m.key ? `0 2px 12px ${m.color}44` : 'none',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p style={{
          fontSize: 10, color: '#475569', textAlign: 'center', margin: '8px 0 0',
          fontWeight: 600, lineHeight: 1.5,
        }}>
          {playMode === 'journey'
            ? 'Selesaikan modul berurutan untuk mendapatkan Business IT certification.'
            : 'Semua modul terbuka — eksplorasi bebas tanpa batasan urutan.'}
        </p>
      </div>

      {/* ── Journey Title ── */}
      <div style={{ textAlign: 'center', padding: '16px 20px 8px', flexShrink: 0 }}>
        <h2 style={{
          fontSize: 13, fontWeight: 800, color: '#e0f2fe',
          letterSpacing: 2, textTransform: 'uppercase', margin: 0,
        }}>Arctic IT Pipeline</h2>
      </div>

      {/* ── Module Timeline ── */}
      <div style={{ flex: 1, padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {MODULES_CONFIG.map((mod, index) => {
          const isUnlocked = playMode === 'freeplay' || !mod.requires || !!completedModules[mod.requires];
          const isCompleted = !!completedModules[mod.id];
          const isActive = isUnlocked && !isCompleted;
          const isLocked = !isUnlocked;

          let nodeStyle = {};
          let cardBg = {};
          let statusLabel = '';
          let statusColor = '#475569';

          if (isCompleted) {
            nodeStyle = { background: '#10b981', border: '2px solid #10b981', color: '#020c1b' };
            cardBg = { background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.3)' };
            statusLabel = 'Station Mastered';
            statusColor = '#10b981';
          } else if (isActive) {
            nodeStyle = {
              background: '#0ea5e9', border: '2px solid #38bdf8', color: '#fff',
              animation: 'PH_pulse 2.5s ease-in-out infinite',
            };
            cardBg = {
              background: 'rgba(14,165,233,.08)', border: '1px solid rgba(56,189,248,.35)',
              boxShadow: '0 4px 20px rgba(14,165,233,.1)',
            };
            statusLabel = mod.active ? 'Active Station' : 'Preview Only';
            statusColor = '#38bdf8';
          } else {
            nodeStyle = { background: 'rgba(15,23,42,.8)', border: '2px solid #1e293b', color: '#334155' };
            cardBg = { background: 'rgba(15,23,42,.4)', border: '1px solid rgba(30,41,59,.6)', opacity: isLocked ? .55 : .7 };
            statusLabel = isLocked ? 'Pipeline Locked' : 'Unlocked';
            statusColor = '#334155';
          }

          return (
            <div key={mod.id} style={{ display: 'flex', alignItems: 'stretch', gap: 10, animation: `PH_fadeIn .4s ${index * .08}s ease both` }}>
              {/* Left: node + connector */}
              <div style={{ width: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                {/* Connector line above */}
                {index > 0 && (
                  <div style={{
                    width: 2, height: 14, marginBottom: 2, borderRadius: 2,
                    background: isCompleted || (MODULES_CONFIG[index - 1] && !!completedModules[MODULES_CONFIG[index - 1].id])
                      ? 'linear-gradient(to bottom, #10b981, #059669)'
                      : 'rgba(30,41,59,.6)',
                  }} />
                )}

                {/* Node button */}
                <button
                  className="PH_node"
                  onClick={() => handleSelectModule(mod)}
                  aria-label={`${mod.title}: ${statusLabel}`}
                  style={{
                    width: 44, height: 44, borderRadius: 12, fontSize: 18,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isLocked ? 'not-allowed' : 'pointer', border: 'none',
                    flexShrink: 0, position: 'relative',
                    ...nodeStyle,
                  }}
                >
                  {isCompleted
                    ? <CHECK_ICON />
                    : isLocked
                      ? <LOCK_ICON />
                      : mod.icon}
                </button>

                {/* Connector line below */}
                {index < MODULES_CONFIG.length - 1 && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 14, marginTop: 2, borderRadius: 2,
                    background: isCompleted
                      ? 'linear-gradient(to bottom, #059669, #10b981)'
                      : 'rgba(30,41,59,.6)',
                  }} />
                )}
              </div>

              {/* Right: info card */}
              <div
                className={isLocked ? 'PH_card-locked' : 'PH_card'}
                onClick={() => handleSelectModule(mod)}
                role="button"
                tabIndex={isLocked ? -1 : 0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelectModule(mod)}
                style={{
                  flex: 1, borderRadius: 14, padding: '10px 14px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center',
                  gap: 2, minHeight: 64,
                  ...cardBg,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 8, textTransform: 'uppercase', letterSpacing: 1.5,
                    fontWeight: 800, color: statusColor,
                  }}>
                    {statusLabel}
                  </span>
                  {isCompleted && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, color: '#10b981',
                      background: 'rgba(16,185,129,.12)', padding: '2px 8px', borderRadius: 20,
                    }}>
                      +{completedModules[mod.id].score} XP
                    </span>
                  )}
                  {!mod.active && !isCompleted && (
                    <span style={{
                      fontSize: 8, fontWeight: 800, color: '#f59e0b',
                      background: 'rgba(245,158,11,.1)', padding: '2px 8px', borderRadius: 20,
                    }}>
                      Coming Soon
                    </span>
                  )}
                </div>
                <h3 style={{
                  fontSize: 12, fontWeight: 800, margin: '2px 0 0',
                  color: isLocked ? '#334155' : '#e0f2fe',
                  textTransform: 'uppercase', letterSpacing: 0.5,
                }}>
                  {mod.title}
                </h3>
                <p style={{
                  fontSize: 10, margin: 0, fontWeight: 600,
                  color: isLocked ? '#1e293b' : '#64748b',
                }}>
                  {mod.concept}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <footer style={{
        textAlign: 'center', padding: '12px 20px 16px', flexShrink: 0,
        borderTop: '1px solid rgba(30,41,59,.6)',
      }}>
        <p style={{ fontSize: 8, color: '#334155', fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 6px' }}>
          BINUS @Bekasi — Business Information Technology
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
