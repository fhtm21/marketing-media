import React, { useState, useEffect } from 'react';
import { SPRINT_CONFIGS } from '../data/expeditionData.js';
import { EXPEDITION_PHASES } from '../engine/phases.js';
import { calcExpeditionScore } from '../engine/scoring.js';
import { SOUNDS } from '../engine/synthPlay.js';
import InsightModal from './InsightModal.jsx';
import ExpeditionBriefing from './Expedition/ExpeditionBriefing.jsx';
import SprintBoard from './Expedition/SprintBoard.jsx';
import SprintResult from './Expedition/SprintResult.jsx';

const MAX_HP = 80;

/**
 * Expedition — Root komponen Module 5: Expedition Sprint.
 * Phase machine: briefing → planning → resolving → sprintDone → (briefing|completed|gameover)
 *
 * @param {{ onExit: () => void, onComplete: (score: number) => void }} props
 */
export default function Expedition({ onExit, onComplete }) {
  const [phase,       setPhase]       = useState(EXPEDITION_PHASES.BRIEFING);
  const [sprintIdx,   setSprintIdx]   = useState(0);
  const [currentHP,   setCurrentHP]   = useState(MAX_HP);
  const [totalDmg,    setTotalDmg]    = useState(0);
  const [totalBonus,  setTotalBonus]  = useState(0);
  const [totalScore,  setTotalScore]  = useState(0);
  const [sprintsDone, setSprintsDone] = useState(0);
  const [lastResults, setLastResults] = useState(null);
  const [lastDamage,  setLastDamage]  = useState(0);
  const [lastBonus,   setLastBonus]   = useState(0);
  const [showInsight, setShowInsight] = useState(false);
  const [showGuide,   setShowGuide]   = useState(false);
  const [isDesktop,   setIsDesktop]   = useState(() => window.innerWidth >= 800);

  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const sprint      = SPRINT_CONFIGS[sprintIdx];
  const isLastSprint = sprintIdx === SPRINT_CONFIGS.length - 1;
  const LIVES_MAX   = MAX_HP;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleStart = () => setPhase(EXPEDITION_PHASES.PLANNING);

  const handleResolve = (results, damage, bonus) => {
    const newHP = Math.max(0, currentHP - damage);
    setCurrentHP(newHP);
    setTotalDmg(p => p + damage);
    
    // Perfect clear bonus: 15 XP if all obstacles cleared (damage is 0)
    const clearedCount = results.filter(r => r.cleared).length;
    const isPerfect = clearedCount === results.length;
    const perfectXP = isPerfect ? 15 : 0;
    
    const finalBonus = bonus + perfectXP;
    setTotalBonus(p => p + finalBonus);
    setLastResults(results);
    setLastDamage(damage);
    setLastBonus(finalBonus);

    // Bugfix: newDone increments if sprint is survived, representing successfully cleared sprints
    const newDone = sprintsDone + (newHP > 0 ? 1 : 0);
    setSprintsDone(newDone);

    // Sprint XP
    const sprintXP = calcExpeditionScore(
      newHP > 0 ? 1 : 0,
      damage,
      sprint.maxHP,
      finalBonus,
    );
    setTotalScore(p => p + sprintXP);

    if (newHP <= 0) {
      SOUNDS.obstacleFailed();
      setPhase(EXPEDITION_PHASES.SPRINT_DONE);
    } else {
      setPhase(EXPEDITION_PHASES.SPRINT_DONE);
    }
  };

  const handleNext = () => {
    if (currentHP <= 0) {
      setPhase(EXPEDITION_PHASES.GAMEOVER);
      return;
    }
    if (isLastSprint) {
      setShowInsight(true);
    } else {
      setSprintIdx(p => p + 1);
      setPhase(EXPEDITION_PHASES.BRIEFING);
      SOUNDS.sprintComplete();
    }
  };

  const handleRestart = () => {
    setSprintIdx(0);
    setCurrentHP(MAX_HP);
    setTotalDmg(0);
    setTotalBonus(0);
    setTotalScore(0);
    setSprintsDone(0);
    setLastResults(null);
    setLastDamage(0);
    setLastBonus(0);
    setPhase(EXPEDITION_PHASES.BRIEFING);
    setShowGuide(false);
  };

  // XP for last sprint result display
  const lastSprintXP = lastResults
    ? calcExpeditionScore(
        currentHP > 0 ? 1 : 0,
        lastDamage, sprint.maxHP, lastBonus,
      )
    : 0;

  const isGameOver = phase === EXPEDITION_PHASES.GAMEOVER || (phase === EXPEDITION_PHASES.SPRINT_DONE && currentHP <= 0);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(155deg, #020c1b 0%, #051a1a 50%, #020c1b 100%)',
      color: '#fff', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @keyframes EX_rise  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes EX_float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes EX_pulse { 0%,100%{box-shadow:0 0 16px rgba(20,184,166,.3)} 50%{box-shadow:0 0 32px rgba(20,184,166,.65)} }
        @keyframes EX_pulse_b { 0%,100%{box-shadow:0 0 16px rgba(14,165,233,.3)} 50%{box-shadow:0 0 32px rgba(14,165,233,.65)} }
        @keyframes EX_topo_scroll {
          from { background-position: 0 0; }
          to   { background-position: 40px 40px; }
        }
      `}</style>

      {/* Topographic map background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          linear-gradient(rgba(20,184,166,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20,184,166,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        animation: 'EX_topo_scroll 12s linear infinite',
      }} />

      {/* Floating contour rings */}
      {[...Array(4)].map((_, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute',
          left: `${15 + i * 22}%`,
          top: `${20 + (i % 2) * 35}%`,
          width: `${80 + i * 40}px`,
          height: `${80 + i * 40}px`,
          borderRadius: '50%',
          border: `1px solid rgba(20,184,166,${0.04 + i * 0.02})`,
          animation: `EX_float ${4 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* ═══ HUD ═════════════════════════════════════════════════════════════ */}
      <header style={{
        position: 'relative', zIndex: 10,
        height: isDesktop ? 52 : 46, padding: `0 ${isDesktop ? 20 : 12}px`,
        background: 'rgba(2,12,27,.92)', borderBottom: '1px solid rgba(20,184,166,.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, boxSizing: 'border-box',
      }}>
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onExit}
            style={{
              fontSize: 11, color: 'rgba(20,184,166,.7)', fontWeight: 700,
              background: 'transparent', border: 'none', cursor: 'pointer',
              transition: 'opacity .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            ← Hub
          </button>
          {isDesktop && <>
            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.07)' }} />
            <span style={{
              fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2,
              color: '#14b8a6', background: 'rgba(20,184,166,.09)',
              border: '1px solid rgba(20,184,166,.2)', borderRadius: 20, padding: '2px 10px',
            }}>
              🏔️ Expedition Sprint · Sprint {sprintIdx + 1}/{SPRINT_CONFIGS.length}
            </span>
          </>}
        </div>

        {/* Center: HP bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9.5, color: '#475569', fontWeight: 700 }}>HP</span>
          <div style={{
            width: isDesktop ? 120 : 80, height: 8,
            background: 'rgba(255,255,255,.07)', borderRadius: 4, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${Math.max(0, (currentHP / MAX_HP) * 100)}%`,
              background: currentHP > MAX_HP * 0.5
                ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                : currentHP > MAX_HP * 0.25
                  ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                  : 'linear-gradient(90deg, #f43f5e, #e11d48)',
              transition: 'width .5s ease',
              boxShadow: '0 0 8px rgba(74,222,128,.4)',
            }} />
          </div>
          <span style={{
            fontSize: 10, fontFamily: 'monospace', fontWeight: 800,
            color: currentHP > MAX_HP * 0.5 ? '#4ade80' : currentHP > MAX_HP * 0.25 ? '#fbbf24' : '#f43f5e',
          }}>
            {Math.max(0, currentHP)}
          </span>
        </div>

        {/* Right: XP */}
        <div style={{
          background: 'rgba(2,12,27,.8)', border: '1px solid rgba(20,184,166,.18)',
          borderRadius: 20, padding: '3px 13px',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 8, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>XP</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fbbf24', fontSize: 14 }}>
            {totalScore}
          </span>
        </div>
      </header>

      {/* ═══ CONTENT (above background) ════════════════════════════════════ */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* BRIEFING */}
        {phase === EXPEDITION_PHASES.BRIEFING && (
          <ExpeditionBriefing
            sprint={sprint}
            sprintNumber={sprintIdx + 1}
            totalSprints={SPRINT_CONFIGS.length}
            currentHP={currentHP}
            maxHP={MAX_HP}
            onStart={handleStart}
            onExit={onExit}
            isDesktop={isDesktop}
          />
        )}

        {/* PLANNING (game board) */}
        {phase === EXPEDITION_PHASES.PLANNING && (
          <SprintBoard
            sprint={sprint}
            isDesktop={isDesktop}
            onResolve={handleResolve}
            onExit={onExit}
            onToggleGuide={() => setShowGuide(p => !p)}
          />
        )}

        {/* SPRINT DONE */}
        {phase === EXPEDITION_PHASES.SPRINT_DONE && lastResults && (
          <SprintResult
            sprint={sprint}
            results={lastResults}
            totalDamage={lastDamage}
            bonusXP={lastBonus}
            sprintXP={lastSprintXP}
            currentHP={currentHP}
            maxHP={MAX_HP}
            isLastSprint={isLastSprint}
            isGameOver={isGameOver}
            isDesktop={isDesktop}
            onNext={handleNext}
            onRestart={handleRestart}
            onExit={onExit}
          />
        )}

        {/* GAME OVER standalone screen */}
        {phase === EXPEDITION_PHASES.GAMEOVER && (
          <GameOverScreen
            totalScore={totalScore}
            sprintsDone={sprintsDone}
            isDesktop={isDesktop}
            onRestart={handleRestart}
            onExit={onExit}
          />
        )}
      </div>

      {/* Guide Overlay Modal */}
      {showGuide && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,12,27,.82)', backdropFilter: 'blur(8px)',
          zIndex: 100, padding: isDesktop ? '32px 40px' : '16px 12px',
        }}>
          <div style={{
            width: '100%', maxWidth: 540,
            background: 'linear-gradient(165deg, #061a1a, #020c1b)',
            border: '2.5px solid #14b8a6', borderRadius: 20,
            boxShadow: '0 0 40px rgba(20,184,166,0.38), inset 0 0 20px rgba(20,184,166,0.1)',
            padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 14,
            animation: 'EX_rise 0.3s ease both',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(20,184,166,.22)', paddingBottom: 8 }}>
              <h3 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 900, color: '#14b8a6', margin: 0 }}>
                🧭 MANUAL EXPEDISI AGILE
              </h3>
              <button
                onClick={() => setShowGuide(false)}
                style={{
                  background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)',
                  color: '#14b8a6', borderRadius: '50%', width: 24, height: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, cursor: 'pointer', fontWeight: 800,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 300, paddingRight: 4 }}>
              {/* Objective */}
              <div>
                <span style={{ fontSize: 9, color: '#14b8a6', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Tujuan Utama:
                </span>
                <p style={{ fontSize: 10.5, color: '#94a3b8', margin: '2px 0 0', lineHeight: 1.5 }}>
                  Gunakan <strong style={{ color: '#fff' }}>3 Action Points (AP)</strong> setiap turn untuk mengalokasikan anggota tim ke obstacle yang cocok.
                  Tingkatkan total strength (STR) di tiap obstacle agar melewati batas kesulitan (`difficulty * 2`).
                </p>
              </div>

              {/* Roles list */}
              <div>
                <span style={{ fontSize: 9, color: '#14b8a6', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                  Spesialisasi Tim (Bonus STR +2):
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4 }}>
                  {[
                    { role: 'Scout 🗺️', spec: 'Navigation ❄️/🗻', cost: '1 AP', desc: 'Cocok untuk badai salju & longsoran terrain.' },
                    { role: 'Engineer 🔧', spec: 'Equipment 🛷/🧭', cost: '1 AP', desc: 'Unggul mengatasi sled rusak & error GPS.' },
                    { role: 'Medic 🩺', spec: 'Medical 🤕/😞', cost: '1 AP', desc: 'Cocok menangani penguin cedera & morale rendah.' },
                    { role: 'Analyst 📊', spec: 'Data/Logistics 💾/📦', cost: '1 AP', desc: 'Efektif mengatasi korupsi data & logistik.' },
                    { role: 'Leader 🦅', spec: 'Semua Bidang (Bonus STR +1)', cost: '2 AP', desc: 'Fighter andalan yang kuat di segala obstacle.' }
                  ].map((it, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 8, padding: '5px 8px', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', gap: 10,
                    }}>
                      <div style={{ minWidth: 80 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: '#e0f2fe' }}>{it.role}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 7, textTransform: 'uppercase', color: '#14b8a6', fontWeight: 800 }}>Spesialisasi</div>
                        <div style={{ fontSize: 9.5, color: '#64748b' }}>{it.desc}</div>
                      </div>
                      <div style={{ textAlign: 'right', minWidth: 46 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '1px 5px', borderRadius: 4 }}>
                          {it.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonus tips */}
              <div style={{ background: 'rgba(20,184,166,0.04)', border: '1px solid rgba(20,184,166,0.12)', borderRadius: 10, padding: '8px 10px' }}>
                <span style={{ fontSize: 9, color: '#fbbf24', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                  💡 TIPS & TRICKS:
                </span>
                <ul style={{ fontSize: 9.5, color: '#64748b', margin: '4px 0 0', paddingLeft: 12, lineHeight: 1.5 }}>
                  <li>All-Clear Bonus: Selesaikan sprint tanpa ada kegagalan obstacle untuk mendapatkan <strong style={{ color: '#fbbf24' }}>+15 XP Perfect Clear</strong>.</li>
                  <li>Keyboard shortcut `1` - `5` untuk memilih kartu tim, lalu klik slot obstacle target.</li>
                  <li>Tekan `Esc` untuk deselect kartu, dan `Enter` untuk meresolve sprint!</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 12.5,
                color: '#020c1b', background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
                border: 'none', padding: '10px 24px', borderRadius: 20, cursor: 'pointer',
                textAlign: 'center', alignSelf: 'center', marginTop: 4,
              }}
            >
              OK, SAYA MENGERTI
            </button>
          </div>
        </div>
      )}

      {/* Insight Modal */}
      <InsightModal
        isOpen={showInsight}
        moduleTitle="Expedition Sprint"
        concept="Agile Project Management"
        insightText={sprint.insightText}
        scoreXP={totalScore}
        onContinue={() => { setShowInsight(false); onComplete(totalScore); }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Game Over Screen
// ─────────────────────────────────────────────────────────────────────────────
function GameOverScreen({ totalScore, sprintsDone, isDesktop, onRestart, onExit }) {
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
        textAlign: 'center', animation: 'EX_rise 0.4s ease both',
        boxShadow: '0 0 50px rgba(244,63,94,.08), 0 24px 60px rgba(0,0,0,.5)',
      }}>
        <div style={{ fontSize: 54, marginBottom: 8 }}>🏔️</div>
        <p style={{
          fontSize: 9, color: '#f43f5e', fontWeight: 800, letterSpacing: 2.5,
          textTransform: 'uppercase', margin: '0 0 6px',
        }}>
          Ekspedisi Gagal!
        </p>
        <h3 style={{
          fontFamily: "'Orbitron', sans-serif", fontSize: 18, fontWeight: 900,
          color: '#fca5a5', margin: '0 0 10px',
        }}>
          Sprint Health Habis
        </h3>
        <p style={{ fontSize: 11, color: '#64748b', lineHeight: 1.65, margin: '0 0 16px' }}>
          Tim tidak mampu mengatasi obstacle-obstacle Arctic. Rencanakan ulang resource allocation-mu!
        </p>
        <div style={{
          background: 'rgba(244,63,94,.08)', border: '1px solid rgba(244,63,94,.18)',
          borderRadius: 12, padding: '10px 16px', marginBottom: 22,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
            Sprints Cleared: {sprintsDone}/3
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 800, color: '#fbbf24' }}>
            {totalScore} XP
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexDirection: isDesktop ? 'row' : 'column' }}>
          <button
            onClick={onRestart}
            style={{
              flex: 1, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14,
              color: '#020c1b', background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
              border: 'none', padding: '13px 16px', borderRadius: 40, cursor: 'pointer',
              animation: 'EX_pulse 2s ease-in-out infinite',
            }}
          >
            🔄 Coba Lagi
          </button>
          <button
            onClick={onExit}
            style={{
              flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12,
              color: '#64748b', background: 'transparent',
              border: '1px solid rgba(100,116,139,.2)', padding: '13px 16px',
              borderRadius: 40, cursor: 'pointer',
            }}
          >
            ← Hub
          </button>
        </div>
      </div>
    </div>
  );
}
