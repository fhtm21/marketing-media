import React, { useState, useEffect, useCallback } from 'react';
import { SORTER_LEVELS, SORTER_ITEM_TYPES, SORTER_TABLES } from '../data/sorterItems.js';
import { SORTER_PHASES } from '../engine/phases.js';
import { calcSorterScore } from '../engine/scoring.js';
import { SOUNDS } from '../engine/synthPlay.js';
import InsightModal from './InsightModal.jsx';
import SorterBriefing from './DataSorter/SorterBriefing.jsx';
import SorterCanvas from './DataSorter/SorterCanvas.jsx';

/**
 * DataSorter — Root komponen Module 4: Data Stream Sorter.
 * Mengorkestrasi phase machine, HUD, sidebar desktop, layar level-done / gameover,
 * dan InsightModal.
 *
 * Phase machine: briefing → playing → levelDone → (briefing | gameover)
 *                gameover → briefing (restart)
 *
 * @param {{ onExit: () => void, onComplete: (score: number) => void }} props
 */
export default function DataSorter({ onExit, onComplete }) {
  const [phase,       setPhase]       = useState(SORTER_PHASES.BRIEFING);
  const [levelIdx,    setLevelIdx]    = useState(0);
  const [lives,       setLives]       = useState(3);
  const [totalScore,  setTotalScore]  = useState(0);
  const [lvlCorrect,  setLvlCorrect]  = useState(0);
  const [lvlProc,     setLvlProc]     = useState(0); // items processed this level
  const [showInsight, setShowInsight] = useState(false);
  const [isDesktop,   setIsDesktop]   = useState(() => window.innerWidth >= 800);

  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const level       = SORTER_LEVELS[levelIdx];
  const isLastLevel = levelIdx === SORTER_LEVELS.length - 1;
  const LIVES_MAX   = 3;

  // ── Phase transitions ────────────────────────────────────────────────────
  const handleStart = () => {
    setLvlCorrect(0);
    setLvlProc(0);
    setPhase(SORTER_PHASES.PLAYING);
  };

  const handleItemSorted = useCallback((isCorrect) => {
    setLvlCorrect(p => p + (isCorrect ? 1 : 0));
    setLvlProc(p => p + 1);
  }, []);

  const handleItemMissed = useCallback(() => {
    setLvlProc(p => p + 1);
    setLives(prev => {
      const next = prev - 1;
      if (next <= 0) setPhase(SORTER_PHASES.GAMEOVER);
      return Math.max(0, next);
    });
  }, []);

  const handleLevelComplete = useCallback((correct, total) => {
    const xp = calcSorterScore(correct, total, lives);
    setTotalScore(p => p + xp);
    setLvlCorrect(correct);
    setLvlProc(total);
    setPhase(SORTER_PHASES.LEVEL_DONE);
  }, [lives]);

  const handleNextLevel = () => {
    if (isLastLevel) {
      setShowInsight(true);
    } else {
      setLevelIdx(p => p + 1);
      setLives(LIVES_MAX);
      setLvlCorrect(0);
      setLvlProc(0);
      setPhase(SORTER_PHASES.BRIEFING);
    }
  };

  const handleRestart = () => {
    setLevelIdx(0);
    setLives(LIVES_MAX);
    setTotalScore(0);
    setLvlCorrect(0);
    setLvlProc(0);
    setPhase(SORTER_PHASES.BRIEFING);
  };

  const livesDisplay = Array.from({ length: LIVES_MAX }, (_, i) => i < lives);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(155deg, #020c1b 0%, #071525 55%, #020c1b 100%)',
      color: '#fff', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @keyframes DS_rise  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes DS_float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes DS_pg    { 0%,100%{box-shadow:0 0 16px rgba(74,222,128,.3)} 50%{box-shadow:0 0 32px rgba(74,222,128,.65)} }
        @keyframes DS_pb    { 0%,100%{box-shadow:0 0 16px rgba(14,165,233,.3)} 50%{box-shadow:0 0 32px rgba(14,165,233,.65)} }
        .DS_btn   { border:none; cursor:pointer; transition:transform .18s,filter .18s; }
        .DS_btn:hover  { transform:translateY(-2px); filter:brightness(1.12); }
        .DS_btn:active { transform:scale(.97); }
        .DS_ghost { border:none; cursor:pointer; background:transparent; transition:opacity .2s; }
        .DS_ghost:hover { opacity:.65; }
      `}</style>

      {/* Cybernetic Animated Background */}
      <SorterGridBackground />

      {/* ═══ Content Layer (above background) ════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>


      {/* ═══ HUD ═════════════════════════════════════════════════════════════ */}
      <header style={{
        height: isDesktop ? 52 : 46, padding: `0 ${isDesktop ? 20 : 12}px`,
        background: 'rgba(2,12,27,.92)', borderBottom: '1px solid rgba(56,189,248,.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, boxSizing: 'border-box', zIndex: 30,
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="DS_ghost" onClick={onExit} style={{ fontSize: 11, color: 'rgba(56,189,248,.65)', fontWeight: 700 }}>
            ← Hub
          </button>
          {isDesktop && <>
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.07)' }} />
            <span style={{
              fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2,
              color: '#0ea5e9', background: 'rgba(14,165,233,.09)',
              border: '1px solid rgba(14,165,233,.2)', borderRadius: 20, padding: '2px 10px',
            }}>
              🗄️ Data Stream Sorter · Lv {levelIdx + 1}/{SORTER_LEVELS.length}
            </span>
          </>}
        </div>

        {/* Center: lives */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {livesDisplay.map((alive, i) => (
            <span key={i} style={{ fontSize: isDesktop ? 18 : 15, opacity: alive ? 1 : 0.2, transition: 'opacity .3s ease' }}>❤️</span>
          ))}
        </div>

        {/* Right: XP */}
        <div style={{
          background: 'rgba(2,12,27,.8)', border: '1px solid rgba(56,189,248,.18)',
          borderRadius: 20, padding: '3px 13px',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 8, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>XP</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fbbf24', fontSize: 14 }}>
            {totalScore}
          </span>
        </div>
      </header>

      {/* ═══ BRIEFING ════════════════════════════════════════════════════════ */}
      {phase === SORTER_PHASES.BRIEFING && (
        <SorterBriefing
          level={level}
          levelNumber={levelIdx + 1}
          totalLevels={SORTER_LEVELS.length}
          onStart={handleStart}
          onExit={onExit}
          isDesktop={isDesktop}
        />
      )}

      {/* ═══ PLAYING ═════════════════════════════════════════════════════════ */}
      {phase === SORTER_PHASES.PLAYING && (
        isDesktop ? (
          /* Desktop: 3-column layout */
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <DesktopInfoSidebar level={level} levelIdx={levelIdx} processed={lvlProc} />
            <SorterCanvas
              level={level}
              isPlaying={true}
              isDesktop={true}
              onItemSorted={handleItemSorted}
              onItemMissed={handleItemMissed}
              onLevelComplete={handleLevelComplete}
            />
            <DesktopLegendSidebar />
          </div>
        ) : (
          /* Mobile: full-width */
          <SorterCanvas
            level={level}
            isPlaying={true}
            isDesktop={false}
            onItemSorted={handleItemSorted}
            onItemMissed={handleItemMissed}
            onLevelComplete={handleLevelComplete}
          />
        )
      )}

      {/* ═══ LEVEL DONE ══════════════════════════════════════════════════════ */}
      {phase === SORTER_PHASES.LEVEL_DONE && (
        <LevelDoneScreen
          levelIdx={levelIdx}
          correct={lvlCorrect}
          total={level.totalItems}
          livesLeft={lives}
          isLastLevel={isLastLevel}
          isDesktop={isDesktop}
          onNext={handleNextLevel}
        />
      )}

      {/* ═══ GAMEOVER ════════════════════════════════════════════════════════ */}
      {phase === SORTER_PHASES.GAMEOVER && (
        <GameOverScreen
          totalScore={totalScore}
          isDesktop={isDesktop}
          onRestart={handleRestart}
          onExit={onExit}
        />
      )}

      {/* ═══ INSIGHT MODAL ═══════════════════════════════════════════════════ */}
      <InsightModal
        isOpen={showInsight}
        moduleTitle="Data Stream Sorter"
        concept="Database Management"
        insightText={level.insightText}
        scoreXP={totalScore}
        onContinue={() => { setShowInsight(false); onComplete(totalScore); }}
      />
      </div>
    </div>
  );
}

function SorterGridBackground() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none'
    }}>
      <style>{`
        @keyframes cyber-scroll {
          from { background-position: 0 0; }
          to { background-position: 0 100%; }
        }
        @keyframes pulse-scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes data-drift {
          0% { transform: translateY(-120%) translateX(0); opacity: 0; }
          10% { opacity: 0.15; }
          90% { opacity: 0.15; }
          100% { transform: translateY(100vh) translateX(15px); opacity: 0; }
        }
        .cyber-grid {
          position: absolute; inset: 0;
          background-image: 
            linear-gradient(rgba(14, 165, 233, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: cyber-scroll 24s linear infinite;
        }
        .scanline {
          position: absolute; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.22), transparent);
          animation: pulse-scanline 6s linear infinite;
        }
      `}</style>
      <div className="cyber-grid" />
      <div className="scanline" />
      
      {/* Falling digital streams (columns) */}
      {[...Array(8)].map((_, i) => {
        const left = 5 + i * 12.5 + Math.random() * 5;
        const dur = 7 + Math.random() * 8;
        const delay = Math.random() * -10;
        const words = ['10101', 'TX_OK', 'DB_CONN', 'SYS_META', 'ERR_302', 'PING', 'INGEST'];
        const label = words[i % words.length];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${left}%`,
              fontFamily: 'monospace',
              fontSize: 9,
              fontWeight: 'bold',
              color: i % 3 === 0 ? '#0ea5e9' : i % 3 === 1 ? '#8b5cf6' : '#f43f5e',
              animation: `data-drift ${dur}s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop Sidebar – Info (Left)
// ─────────────────────────────────────────────────────────────────────────────
function DesktopInfoSidebar({ level, levelIdx, processed }) {
  const pct = Math.min(100, Math.round((processed / level.totalItems) * 100));
  return (
    <div style={{
      width: 204, flexShrink: 0,
      background: 'rgba(6,14,28,.7)', borderRight: '1px solid rgba(56,189,248,.08)',
      padding: '18px 15px', display: 'flex', flexDirection: 'column', gap: 16,
      overflowY: 'auto',
    }}>
      {/* Level badge */}
      <div style={{
        fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2,
        color: '#0ea5e9', background: 'rgba(14,165,233,.08)',
        border: '1px solid rgba(14,165,233,.2)', borderRadius: 20, padding: '3px 10px',
        alignSelf: 'flex-start',
      }}>
        Level {levelIdx + 1} · {level.concept}
      </div>

      {/* Objective */}
      <div>
        <p style={{ fontSize: 7.5, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 5px' }}>
          Objective
        </p>
        <p style={{ fontSize: 10.5, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
          {level.objective}
        </p>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }} />

      {/* Progress */}
      <div>
        <p style={{ fontSize: 7.5, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 7px' }}>
          Progress
        </p>
        <div style={{ fontSize: 11, color: '#64748b', margin: '0 0 7px', display: 'flex', justifyContent: 'space-between' }}>
          <span><span style={{ color: '#e0f2fe', fontWeight: 800 }}>{processed}</span> / {level.totalItems}</span>
          <span style={{ color: '#4ade80', fontWeight: 800 }}>{pct}%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
            transition: 'width .35s ease',
          }} />
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }} />

      {/* Concept box */}
      <div>
        <p style={{ fontSize: 7.5, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 7px' }}>
          Insight
        </p>
        <div style={{
          background: 'rgba(14,165,233,.05)', border: '1px solid rgba(56,189,248,.12)',
          borderRadius: 10, padding: '10px 11px',
        }}>
          <p style={{ fontSize: 10, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            Database relasional menyimpan data di <strong style={{ color: '#38bdf8' }}>tabel yang dinormalisasi</strong> — transaksi, metadata, dan log tersimpan terpisah untuk performa query optimal.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Desktop Sidebar – Legend + Shortcuts (Right)
// ─────────────────────────────────────────────────────────────────────────────
function DesktopLegendSidebar() {
  const shortcuts = [
    { key: 'Drag',    desc: 'item ke tabel' },
    { key: 'Click',   desc: 'item → select' },
    { key: '1',       desc: 'Tabel Transaksi' },
    { key: '2',       desc: 'Tabel Metadata' },
    { key: '3',       desc: 'Error Log' },
  ];
  return (
    <div style={{
      width: 172, flexShrink: 0,
      background: 'rgba(6,14,28,.7)', borderLeft: '1px solid rgba(56,189,248,.08)',
      padding: '18px 13px', display: 'flex', flexDirection: 'column', gap: 16,
      overflowY: 'auto',
    }}>
      {/* Item legend */}
      <div>
        <p style={{ fontSize: 7.5, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 9px' }}>
          Item Legend
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {SORTER_ITEM_TYPES.map(item => {
            const table = SORTER_TABLES.find(t => t.id === item.correctTable);
            return (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: item.bg, border: `1px solid ${item.border}`,
                borderRadius: 9, padding: '6px 9px',
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontSize: 9.5, fontWeight: 800, color: item.color, lineHeight: 1.2 }}>{item.shortLabel}</div>
                  <div style={{ fontSize: 8, color: table.color, opacity: .85, marginTop: 1 }}>{table.icon} {table.shortLabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }} />

      {/* Keyboard shortcuts */}
      <div>
        <p style={{ fontSize: 7.5, color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 9px' }}>
          ⌨️ Shortcuts
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {shortcuts.map(({ key, desc }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <kbd style={{
                background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)',
                borderRadius: 4, padding: '2px 6px', fontFamily: 'monospace',
                fontSize: 9.5, color: '#fbbf24', fontWeight: 700,
                flexShrink: 0, minWidth: 30, textAlign: 'center',
              }}>{key}</kbd>
              <span style={{ fontSize: 9.5, color: '#64748b' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Level Done Screen
// ─────────────────────────────────────────────────────────────────────────────
function LevelDoneScreen({ levelIdx, correct, total, livesLeft, isLastLevel, isDesktop, onNext }) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  const xp       = calcSorterScore(correct, total, livesLeft);
  const grade    = accuracy >= 90 ? 'S' : accuracy >= 75 ? 'A' : accuracy >= 55 ? 'B' : 'C';
  const gradeCol = grade === 'S' ? '#fbbf24' : grade === 'A' ? '#4ade80' : grade === 'B' ? '#0ea5e9' : '#f43f5e';

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isDesktop ? '32px 40px' : '20px 16px', overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: 390,
        background: 'linear-gradient(160deg, #0c1a2e 0%, #071525 100%)',
        border: '1px solid rgba(74,222,128,.22)',
        borderRadius: 22, padding: isDesktop ? '32px 36px' : '24px 20px',
        textAlign: 'center',
        animation: 'DS_rise 0.4s ease both',
        boxShadow: '0 0 60px rgba(74,222,128,.1), 0 24px 64px rgba(0,0,0,.5)',
      }}>
        <div style={{ fontSize: 50, marginBottom: 8, animation: 'DS_float 3s ease-in-out infinite' }}>🎉</div>
        <p style={{ fontSize: 9, color: '#4ade80', fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', margin: '0 0 4px' }}>
          Level {levelIdx + 1} Selesai!
        </p>
        <div style={{
          fontSize: 60, fontWeight: 900, color: gradeCol,
          fontFamily: "'Orbitron', sans-serif", lineHeight: 1, margin: '8px 0',
          textShadow: `0 0 36px ${gradeCol}55`,
        }}>
          {grade}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: isDesktop ? 18 : 12, margin: '16px 0 22px' }}>
          {[
            { label: 'Akurasi',  value: `${accuracy}%`, color: gradeCol },
            { label: 'Benar',    value: `${correct}/${total}`, color: '#4ade80' },
            { label: 'XP Dapat', value: `+${xp}`,      color: '#fbbf24' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 11, padding: '8px 14px',
            }}>
              <div style={{ fontSize: 7.5, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color, marginTop: 3, fontFamily: 'monospace' }}>{value}</div>
            </div>
          ))}
        </div>

        <button
          className="DS_btn"
          onClick={onNext}
          style={{
            fontFamily: "'Fredoka', sans-serif", fontWeight: 700,
            fontSize: 15, color: '#020c1b',
            background: isLastLevel ? 'linear-gradient(90deg, #fbbf24, #f59e0b)' : 'linear-gradient(90deg, #4ade80, #22c55e)',
            padding: '14px 32px', borderRadius: 40, width: '100%',
            boxShadow: isLastLevel ? '0 8px 24px rgba(251,191,36,.35)' : '0 8px 24px rgba(74,222,128,.35)',
            animation: 'DS_pg 2.2s ease-in-out infinite',
          }}
        >
          {isLastLevel ? '🎓 Lihat Insight & Selesai' : `⚡ Lanjut Level ${levelIdx + 2}`}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Game Over Screen
// ─────────────────────────────────────────────────────────────────────────────
function GameOverScreen({ totalScore, isDesktop, onRestart, onExit }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isDesktop ? '32px 40px' : '20px 16px',
    }}>
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'linear-gradient(160deg, #1a0c0c 0%, #0f0707 100%)',
        border: '1px solid rgba(244,63,94,.25)',
        borderRadius: 22, padding: isDesktop ? '32px 36px' : '24px 20px',
        textAlign: 'center',
        animation: 'DS_rise 0.4s ease both',
        boxShadow: '0 0 50px rgba(244,63,94,.08), 0 24px 60px rgba(0,0,0,.5)',
      }}>
        <div style={{ fontSize: 54, marginBottom: 8 }}>💥</div>
        <p style={{ fontSize: 9, color: '#f43f5e', fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', margin: '0 0 6px' }}>
          Pipeline Overloaded!
        </p>
        <h3 style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: 20, fontWeight: 900,
          color: '#fca5a5', margin: '0 0 12px',
        }}>
          Nyawa Habis
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.65, margin: '0 0 16px' }}>
          Terlalu banyak data lolos ke lantai — sistem database overload!
        </p>

        <div style={{
          background: 'rgba(244,63,94,.08)', border: '1px solid rgba(244,63,94,.18)',
          borderRadius: 12, padding: '10px 16px', marginBottom: 22,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>XP Terkumpul</span>
          <span style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: '#fbbf24' }}>
            {totalScore} XP
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, flexDirection: isDesktop ? 'row' : 'column' }}>
          <button
            className="DS_btn"
            onClick={onRestart}
            style={{
              flex: 1, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14,
              color: '#020c1b', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
              padding: '13px 16px', borderRadius: 40,
              animation: 'DS_pb 2s ease-in-out infinite',
            }}
          >
            🔄 Coba Lagi dari Level 1
          </button>
          <button
            className="DS_ghost"
            onClick={onExit}
            style={{
              flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12,
              color: '#64748b', padding: '13px 16px', borderRadius: 40,
              border: '1px solid rgba(100,116,139,.2)',
            }}
          >
            ← Kembali ke Hub
          </button>
        </div>
      </div>
    </div>
  );
}
