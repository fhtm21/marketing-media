import React, { useState, useEffect, useCallback } from 'react';
import { TEAM_CARDS, getObstacle, effectiveStrength, resolveObstacle } from '../../data/expeditionData.js';
import { SOUNDS } from '../../engine/synthPlay.js';

/**
 * SprintBoard — Game board utama Expedition Sprint.
 *
 * Layout Desktop (3-column):
 *   [Team Cards (left)] | [Obstacle Slots (center)] | [AP Tracker + Log (right)]
 *
 * Interaksi:
 *   1. Klik/tekan 1–5 → pilih kartu tim (highlight + sound)
 *   2. Klik obstacle slot → assign kartu ke slot (konsumsi AP)
 *   3. Klik obstacle lagi yg sudah di-assign → unassign (kembalikan AP)
 *   4. Klik "Resolve Sprint" (atau Enter) → emit onResolve dengan hasil
 *
 * @param {{
 *   sprint: import('../../data/expeditionData.js').SprintConfig,
 *   isDesktop: boolean,
 *   onResolve: (results: Array<{obstacle, assignedCards, cleared, totalStrength, required, damageTaken}>, totalDamage: number, bonusXP: number) => void,
 *   onExit: () => void,
 * }} props
 */
export default function SprintBoard({ sprint, isDesktop, onResolve, onExit, onToggleGuide }) {
  // selectedCardId: ID kartu yang sedang dipilih (siap di-assign)
  const [selectedCardId, setSelectedCardId] = useState(null);
  // assignments: { obstacleId: TeamCard[] }
  const [assignments, setAssignments]       = useState({});
  // AP yang tersisa
  const [apLeft, setApLeft]                 = useState(sprint.actionPoints);
  // Log events saat ini
  const [log, setLog]                       = useState([]);
  // Animasi resolving
  const [resolving, setResolving]           = useState(false);

  const addLog = useCallback((msg) => {
    setLog(prev => [msg, ...prev].slice(0, 6));
  }, []);

  // Hitung AP yang dipakai oleh semua assignment saat ini
  const usedAP = Object.values(assignments).flat().reduce(
    (sum, card) => sum + card.apCost, 0
  );

  // ── Keyboard handler ────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (resolving) return;
      const idx = ['1','2','3','4','5'].indexOf(e.key);
      if (idx !== -1) {
        const card = TEAM_CARDS[idx];
        if (card) handleSelectCard(card);
        return;
      }
      if (e.key === 'Enter') handleResolve();
      if (e.key === 'Escape') setSelectedCardId(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [resolving, selectedCardId, assignments, apLeft]); // eslint-disable-line


  // ── Select kartu ─────────────────────────────────────────────────────────
  const handleSelectCard = useCallback((card) => {
    if (resolving) return;
    if (selectedCardId === card.id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(card.id);
      SOUNDS.cardSelect();
    }
  }, [resolving, selectedCardId]);

  // ── Assign / unassign kartu ke obstacle slot ───────────────────────────────
  const handleObstacleClick = useCallback((obstacleId) => {
    if (resolving) return;
    const obstacle = getObstacle(obstacleId);
    if (!obstacle) return;

    const currentlyAssigned = assignments[obstacleId] || [];
    const selectedCard = TEAM_CARDS.find(c => c.id === selectedCardId);

    if (selectedCard) {
      // Cek apakah kartu sudah ada di slot ini
      const alreadyHere = currentlyAssigned.find(c => c.id === selectedCard.id);
      if (alreadyHere) {
        // Unassign jika sama
        setAssignments(prev => ({
          ...prev,
          [obstacleId]: (prev[obstacleId] || []).filter(c => c.id !== selectedCard.id),
        }));
        setApLeft(prev => prev + selectedCard.apCost);
        addLog(`↩️ ${selectedCard.name} unassigned dari ${obstacle.name}`);
        setSelectedCardId(null);
        return;
      }

      // Cek kartu yg sama sedang di-assign di obstacle lain
      const cardAlreadyElsewhere = Object.entries(assignments).find(([oid, cards]) =>
        oid !== obstacleId && cards.find(c => c.id === selectedCard.id)
      );
      if (cardAlreadyElsewhere) {
        addLog(`⚠️ ${selectedCard.name} sudah di-assign ke obstacle lain.`);
        return;
      }

      // Cek AP
      if (apLeft < selectedCard.apCost) {
        addLog(`⚡ AP tidak cukup! ${selectedCard.name} butuh ${selectedCard.apCost} AP.`);
        SOUNDS.obstacleFailed();
        return;
      }

      // Assign
      setAssignments(prev => ({
        ...prev,
        [obstacleId]: [...(prev[obstacleId] || []), selectedCard],
      }));
      setApLeft(prev => prev - selectedCard.apCost);
      SOUNDS.cardAssign();
      addLog(`✅ ${selectedCard.name} ${selectedCard.emoji} → ${obstacle.name}`);
      setSelectedCardId(null);

    } else {
      // Tidak ada kartu dipilih → unassign kartu terakhir dari slot
      if (currentlyAssigned.length > 0) {
        const last = currentlyAssigned[currentlyAssigned.length - 1];
        setAssignments(prev => ({
          ...prev,
          [obstacleId]: prev[obstacleId].slice(0, -1),
        }));
        setApLeft(prev => prev + last.apCost);
        addLog(`↩️ ${last.name} dikembalikan dari ${obstacle.name}`);
      }
    }
  }, [resolving, selectedCardId, assignments, apLeft, addLog]);

  // ── Resolve Sprint ─────────────────────────────────────────────────────────
  const handleResolve = useCallback(() => {
    if (resolving) return;
    setResolving(true);
    SOUNDS.sprintComplete();

    setTimeout(() => {
      const results = sprint.obstacleIds.map(oid => {
        const obstacle      = getObstacle(oid);
        const assignedCards = assignments[oid] || [];
        const { cleared, totalStrength, required } = resolveObstacle(assignedCards, obstacle);
        const damageTaken   = cleared ? 0 : obstacle.damage;
        return { obstacle, assignedCards, cleared, totalStrength, required, damageTaken };
      });

      const totalDamage = results.reduce((sum, r) => sum + r.damageTaken, 0);

      // Bonus XP: 5 per specialty match
      const bonusXP = results.reduce((sum, r) => {
        if (!r.cleared) return sum;
        const bonus = r.assignedCards.filter(c =>
          c.speciality === r.obstacle.type || c.speciality === 'any'
        ).length * 5;
        return sum + bonus;
      }, 0);

      onResolve(results, totalDamage, bonusXP);
    }, 1400);
  }, [resolving, sprint, assignments, onResolve]);

  // ── Computed helpers ────────────────────────────────────────────────────────
  const selectedCard = TEAM_CARDS.find(c => c.id === selectedCardId);

  // Kartu yang sudah di-assign di obstacle manapun
  const assignedCardIds = new Set(Object.values(assignments).flat().map(c => c.id));

  const AP_TOTAL = sprint.actionPoints;

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes EXB_pulse_card {
          0%,100% { box-shadow: 0 0 0 2px rgba(20,184,166,.5), 0 4px 14px rgba(0,0,0,.4); }
          50%     { box-shadow: 0 0 0 3px rgba(20,184,166,1),  0 0 20px rgba(20,184,166,.35), 0 4px 14px rgba(0,0,0,.4); }
        }
        @keyframes EXB_obstacle_glow {
          0%,100% { border-color: rgba(245,158,11,.4); }
          50%     { border-color: rgba(245,158,11,.9); box-shadow: 0 0 16px rgba(245,158,11,.3); }
        }
        @keyframes EXB_resolve_spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .EXB_card { transition: transform .18s, filter .18s; cursor: pointer; }
        .EXB_card:hover { transform: translateY(-3px); filter: brightness(1.12); }
        .EXB_card.EXB_selected { animation: EXB_pulse_card 1s ease-in-out infinite; }
        .EXB_card.EXB_used { opacity: 0.4; cursor: not-allowed; }
        .EXB_obstacle { transition: border-color .2s, box-shadow .2s, background .2s; cursor: pointer; }
        .EXB_obstacle:hover { filter: brightness(1.08); }
        .EXB_obstacle.EXB_targeted { animation: EXB_obstacle_glow 0.9s ease-in-out infinite; }
      `}</style>

      {/* ══ DESKTOP 3-COLUMN LAYOUT ══════════════════════════════════════════ */}
      {isDesktop ? (
        <>
          {/* ── LEFT: Team Cards ── */}
          <div style={{
            width: 200, flexShrink: 0,
            background: 'rgba(6,14,28,.75)', borderRight: '1px solid rgba(56,189,248,.08)',
            padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 8,
            overflowY: 'auto',
          }}>
            <p style={{
              fontSize: 7.5, color: '#14b8a6', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 4px',
            }}>
              👥 Tim Ekspedisi
            </p>
            {TEAM_CARDS.map((card, idx) => {
              const isSelected = selectedCardId === card.id;
              const isUsed     = assignedCardIds.has(card.id);
              return (
                <div
                  key={card.id}
                  className={`EXB_card${isSelected ? ' EXB_selected' : ''}${isUsed ? ' EXB_used' : ''}`}
                  onClick={() => !isUsed && handleSelectCard(card)}
                  style={{
                    background: card.bg, border: `1.5px solid ${isSelected ? card.color : card.border}`,
                    borderRadius: 12, padding: '10px 11px',
                    boxShadow: isSelected ? `0 0 16px ${card.color}44` : '0 4px 12px rgba(0,0,0,.35)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{card.emoji}</span>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: '#e0f2fe', lineHeight: 1.1 }}>
                        {card.name}
                      </div>
                      <div style={{ fontSize: 8, color: card.color, fontWeight: 700 }}>{card.role}</div>
                    </div>
                    <div style={{
                      marginLeft: 'auto', fontSize: 7.5, fontWeight: 800,
                      color: '#fbbf24', background: 'rgba(251,191,36,.1)',
                      border: '1px solid rgba(251,191,36,.2)', borderRadius: 6, padding: '1px 5px',
                    }}>
                      [{idx + 1}]
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    {/* Strength */}
                    <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${(card.strength / 4) * 100}%`,
                        background: card.color, borderRadius: 2,
                      }} />
                    </div>
                    <span style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'monospace', flexShrink: 0 }}>
                      STR {card.strength}
                    </span>
                    <span style={{
                      fontSize: 7.5, fontWeight: 800, color: '#14b8a6',
                      background: 'rgba(20,184,166,.1)', borderRadius: 4, padding: '1px 5px',
                      flexShrink: 0,
                    }}>
                      {card.apCost}AP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CENTER: Obstacle Slots ── */}
          <div style={{
            flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column',
            gap: 14, overflowY: 'auto',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
                <h3 style={{
                  fontFamily: "'Orbitron', sans-serif", fontSize: 15, fontWeight: 900,
                  color: '#e0f2fe', margin: 0,
                }}>
                  {sprint.title}
                </h3>
                <button
                  onClick={onToggleGuide}
                  style={{
                    background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.35)',
                    color: '#14b8a6', borderRadius: 12, padding: '2px 8px', fontSize: 9.5,
                    fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace',
                  }}
                >
                  ❓ MANUAL
                </button>
              </div>
              <p style={{ fontSize: 10, color: '#475569', margin: '4px 0 0' }}>
                {selectedCard
                  ? `📌 ${selectedCard.emoji} ${selectedCard.name} dipilih — klik obstacle untuk assign`
                  : 'Klik kartu tim → klik obstacle untuk assign'}
              </p>
            </div>

            {sprint.obstacleIds.map(oid => {
              const ob = getObstacle(oid);
              if (!ob) return null;
              const assigned = assignments[oid] || [];
              const hasTarget = !!selectedCard;
              const totalStr = assigned.reduce((s, c) => s + effectiveStrength(c, ob), 0);
              const required = ob.difficulty * 2;
              const willClear = totalStr >= required;
              const diffColors = ['', '#4ade80', '#fbbf24', '#f43f5e'];

              return (
                <div
                  key={oid}
                  className={`EXB_obstacle${hasTarget ? ' EXB_targeted' : ''}`}
                  onClick={() => handleObstacleClick(oid)}
                  style={{
                    background: ob.bg,
                    border: `2px solid ${hasTarget && selectedCard ? ob.color : ob.color + '55'}`,
                    borderRadius: 16, padding: '14px 16px',
                    boxShadow: willClear && assigned.length > 0
                      ? '0 0 18px rgba(74,222,128,.25)'
                      : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ fontSize: 32, flexShrink: 0, marginTop: 2 }}>{ob.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', marginBottom: 4,
                      }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: 800, color: '#e0f2fe' }}>{ob.name}</span>
                          <span style={{
                            marginLeft: 8, fontSize: 7.5, fontWeight: 800,
                            color: diffColors[ob.difficulty],
                            background: `${diffColors[ob.difficulty]}18`,
                            border: `1px solid ${diffColors[ob.difficulty]}44`,
                            borderRadius: 8, padding: '1px 6px',
                            textTransform: 'uppercase', letterSpacing: 1,
                          }}>
                            {ob.difficulty === 1 ? 'Easy' : ob.difficulty === 2 ? 'Medium' : 'Hard'}
                          </span>
                        </div>
                        <span style={{
                          fontSize: 8, color: '#64748b', fontFamily: 'monospace', fontWeight: 700,
                        }}>
                          {ob.gridRef}
                        </span>
                      </div>

                      {/* Required strength bar */}
                      <div style={{ marginBottom: 8 }}>
                        <div style={{
                          display: 'flex', justifyContent: 'space-between', marginBottom: 3,
                          fontSize: 8, color: '#475569', fontFamily: 'monospace',
                        }}>
                          <span>STR Required: {required}</span>
                          <span style={{ color: willClear && assigned.length > 0 ? '#4ade80' : '#f43f5e' }}>
                            Current: {totalStr} {willClear && assigned.length > 0 ? '✓ CLEAR' : assigned.length > 0 ? '✗ FAIL' : ''}
                          </span>
                        </div>
                        <div style={{ height: 6, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', borderRadius: 3,
                            width: `${Math.min(100, (totalStr / required) * 100)}%`,
                            background: willClear && assigned.length > 0
                              ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                              : 'linear-gradient(90deg, #f43f5e, #e11d48)',
                            transition: 'width .3s ease',
                          }} />
                        </div>
                      </div>

                      {/* Assigned cards */}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 28 }}>
                        {assigned.length === 0 ? (
                          <div style={{
                            fontSize: 9.5, color: '#334155',
                            fontStyle: 'italic', padding: '4px 0',
                          }}>
                            {hasTarget ? '⬅ Klik untuk assign kartu' : 'Belum ada kartu di-assign'}
                          </div>
                        ) : assigned.map((c, ci) => {
                          const eff = effectiveStrength(c, ob);
                          const bonus = eff > c.strength;
                          return (
                            <div key={ci} style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              background: bonus ? 'rgba(251,191,36,.12)' : c.bg,
                              border: `1px solid ${bonus ? 'rgba(251,191,36,.4)' : c.border}`,
                              borderRadius: 8, padding: '3px 8px', fontSize: 10,
                            }}>
                              <span>{c.emoji}</span>
                              <span style={{ color: '#e0f2fe', fontWeight: 700 }}>{c.name}</span>
                              {bonus && <span style={{ color: '#fbbf24', fontSize: 8, fontWeight: 800 }}>⭐</span>}
                              <span style={{ color: bonus ? '#fbbf24' : c.color, fontSize: 9, fontFamily: 'monospace' }}>
                                +{eff}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {!willClear && assigned.length > 0 && (
                        <div style={{
                          fontSize: 8, color: '#f43f5e', fontWeight: 700,
                          marginTop: 5, fontFamily: 'monospace',
                        }}>
                          ⚠️ Butuh {required - totalStr} STR lagi · Gagal = -{ob.damage} HP
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Resolve button */}
            <button
              onClick={handleResolve}
              disabled={resolving}
              style={{
                fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15,
                color: resolving ? '#475569' : '#020c1b',
                background: resolving
                  ? 'rgba(71,85,105,.3)'
                  : 'linear-gradient(90deg, #14b8a6, #0d9488)',
                border: 'none', padding: '14px 32px', borderRadius: 40,
                cursor: resolving ? 'not-allowed' : 'pointer',
                boxShadow: resolving ? 'none' : '0 0 22px rgba(20,184,166,.35)',
                transition: 'all .2s', marginTop: 6,
              }}
            >
              {resolving
                ? <span>⏳ Resolving Sprint…</span>
                : '⚡ Resolve Sprint (Enter)'}
            </button>
          </div>

          {/* ── RIGHT: AP Tracker + Log ── */}
          <div style={{
            width: 180, flexShrink: 0,
            background: 'rgba(6,14,28,.75)', borderLeft: '1px solid rgba(56,189,248,.08)',
            padding: '16px 13px', display: 'flex', flexDirection: 'column', gap: 14,
            overflowY: 'auto',
          }}>
            {/* AP counter */}
            <div>
              <p style={{
                fontSize: 7.5, color: '#14b8a6', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 8px',
              }}>
                ⚡ Action Points
              </p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Array.from({ length: AP_TOTAL }).map((_, i) => {
                  const spent = i >= apLeft;
                  return (
                    <div key={i} style={{
                      width: 30, height: 30, borderRadius: '50%',
                      background: spent
                        ? 'rgba(71,85,105,.25)'
                        : 'linear-gradient(135deg, #14b8a6, #0d9488)',
                      border: spent ? '1.5px solid rgba(71,85,105,.3)' : 'none',
                      boxShadow: spent ? 'none' : '0 0 10px rgba(20,184,166,.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, transition: 'all .25s',
                    }}>
                      {spent ? '' : '⚡'}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 8, fontSize: 10, fontFamily: 'monospace', color: '#14b8a6', fontWeight: 700 }}>
                {apLeft} / {AP_TOTAL} remaining
              </div>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }} />

            {/* Keyboard shortcuts */}
            <div>
              <p style={{
                fontSize: 7.5, color: '#fbbf24', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 8px',
              }}>
                ⌨️ Shortcuts
              </p>
              {[
                { key: '1–5', desc: 'Pilih kartu' },
                { key: 'Click', desc: 'Assign ke obstacle' },
                { key: 'Enter', desc: 'Resolve sprint' },
                { key: 'Esc', desc: 'Deselect kartu' },
              ].map(({ key, desc }) => (
                <div key={key} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
                  <kbd style={{
                    background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)',
                    borderRadius: 4, padding: '2px 5px', fontFamily: 'monospace',
                    fontSize: 9, color: '#fbbf24', fontWeight: 700, flexShrink: 0,
                    minWidth: 28, textAlign: 'center',
                  }}>{key}</kbd>
                  <span style={{ fontSize: 9, color: '#64748b' }}>{desc}</span>
                </div>
              ))}
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,.06)' }} />

            {/* Turn log */}
            <div>
              <p style={{
                fontSize: 7.5, color: '#38bdf8', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 8px',
              }}>
                📋 Sprint Log
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {log.length === 0 ? (
                  <span style={{ fontSize: 9.5, color: '#334155', fontStyle: 'italic' }}>
                    Log kosong — mulai assign kartu.
                  </span>
                ) : log.map((entry, i) => (
                  <div key={i} style={{
                    fontSize: 9, color: i === 0 ? '#94a3b8' : '#475569',
                    lineHeight: 1.5, transition: 'color .3s',
                  }}>
                    {entry}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ══ MOBILE LAYOUT ══ */
        <MobileBoard
          sprint={sprint}
          selectedCardId={selectedCardId}
          assignments={assignments}
          apLeft={apLeft}
          AP_TOTAL={AP_TOTAL}
          resolving={resolving}
          log={log}
          onSelectCard={handleSelectCard}
          onObstacleClick={handleObstacleClick}
          onResolve={handleResolve}
        />
      )}

      {/* ── Resolving overlay ── */}
      {resolving && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2,12,27,.75)', backdropFilter: 'blur(6px)',
          zIndex: 50,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 48, marginBottom: 12,
              animation: 'EXB_resolve_spin 1s linear infinite',
              display: 'inline-block',
            }}>⚙️</div>
            <p style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 900,
              color: '#14b8a6', margin: 0, letterSpacing: 2,
            }}>
              RESOLVING SPRINT…
            </p>
            <p style={{ fontSize: 10, color: '#475569', margin: '6px 0 0' }}>
              Menghitung hasil assignment tim ekspedisi
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Layout — stacked: AP bar → Obstacles → Card selector
// ─────────────────────────────────────────────────────────────────────────────
function MobileBoard({
  sprint, selectedCardId, assignments, apLeft, AP_TOTAL,
  resolving, log, onSelectCard, onObstacleClick, onResolve,
}) {
  const selectedCard = TEAM_CARDS.find(c => c.id === selectedCardId);
  const assignedCardIds = new Set(Object.values(assignments).flat().map(c => c.id));

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* AP bar (top) */}
      <div style={{
        padding: '8px 12px',
        background: 'rgba(6,14,28,.85)', borderBottom: '1px solid rgba(56,189,248,.08)',
        display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
      }}>
        <span style={{ fontSize: 9, color: '#14b8a6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
          AP:
        </span>
        {Array.from({ length: AP_TOTAL }).map((_, i) => {
          const spent = i >= apLeft;
          return (
            <div key={i} style={{
              width: 22, height: 22, borderRadius: '50%',
              background: spent ? 'rgba(71,85,105,.25)' : 'linear-gradient(135deg, #14b8a6, #0d9488)',
              border: spent ? '1px solid rgba(71,85,105,.3)' : 'none',
              boxShadow: spent ? 'none' : '0 0 8px rgba(20,184,166,.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, transition: 'all .25s',
            }}>
              {spent ? '' : '⚡'}
            </div>
          );
        })}
        <span style={{ fontSize: 9.5, fontFamily: 'monospace', color: '#14b8a6', fontWeight: 700 }}>
          {apLeft}/{AP_TOTAL}
        </span>
        {selectedCard && (
          <div style={{
            fontSize: 9, color: '#fbbf24', background: 'rgba(251,191,36,.1)',
            border: '1px solid rgba(251,191,36,.2)', borderRadius: 8, padding: '2px 8px',
          }}>
            {selectedCard.emoji}
          </div>
        )}
        <button
          onClick={onToggleGuide}
          style={{
            marginLeft: 'auto', background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.3)',
            color: '#14b8a6', borderRadius: 8, padding: '2px 6px', fontSize: 9,
            fontWeight: 'bold', cursor: 'pointer',
          }}
        >
          ❓ MANUAL
        </button>
      </div>

      {/* Obstacle slots */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sprint.obstacleIds.map(oid => {
          const ob = getObstacle(oid);
          if (!ob) return null;
          const assigned = assignments[oid] || [];
          const totalStr = assigned.reduce((s, c) => s + effectiveStrength(c, ob), 0);
          const required = ob.difficulty * 2;
          const willClear = totalStr >= required;

          return (
            <div
              key={oid}
              onClick={() => onObstacleClick(oid)}
              style={{
                background: ob.bg, border: `2px solid ${selectedCard ? ob.color : ob.color + '55'}`,
                borderRadius: 13, padding: '11px 13px',
                boxShadow: willClear && assigned.length > 0 ? '0 0 14px rgba(74,222,128,.2)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
                <span style={{ fontSize: 26 }}>{ob.emoji}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#e0f2fe' }}>{ob.name}</div>
                  <div style={{ fontSize: 8.5, color: '#64748b' }}>{ob.gridRef} · Req STR {required}</div>
                </div>
                {willClear && assigned.length > 0
                  ? <span style={{ marginLeft: 'auto', fontSize: 11, color: '#4ade80' }}>✓ CLEAR</span>
                  : assigned.length > 0
                    ? <span style={{ marginLeft: 'auto', fontSize: 9, color: '#f43f5e' }}>NEED +{required - totalStr}</span>
                    : null
                }
              </div>
              <div style={{ height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: `${Math.min(100, (totalStr / required) * 100)}%`,
                  background: willClear && assigned.length > 0 ? '#4ade80' : '#f43f5e',
                  transition: 'width .3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {assigned.length === 0
                  ? <span style={{ fontSize: 9, color: '#334155', fontStyle: 'italic' }}>
                      {selectedCard ? '⬅ Tap untuk assign' : 'Belum ada kartu'}
                    </span>
                  : assigned.map((c, ci) => (
                      <span key={ci} style={{
                        fontSize: 9, background: c.bg, border: `1px solid ${c.border}`,
                        borderRadius: 6, padding: '2px 7px', color: '#e0f2fe',
                      }}>
                        {c.emoji} {c.name}
                      </span>
                    ))
                }
              </div>
            </div>
          );
        })}

        {/* Resolve button (mobile) */}
        <button
          onClick={onResolve}
          disabled={resolving}
          style={{
            fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 14,
            color: resolving ? '#475569' : '#020c1b',
            background: resolving ? 'rgba(71,85,105,.3)' : 'linear-gradient(90deg, #14b8a6, #0d9488)',
            border: 'none', padding: '13px 20px', borderRadius: 40,
            cursor: resolving ? 'not-allowed' : 'pointer',
            boxShadow: resolving ? 'none' : '0 0 20px rgba(20,184,166,.35)',
            width: '100%', marginTop: 4,
          }}
        >
          {resolving ? '⏳ Resolving…' : '⚡ Resolve Sprint'}
        </button>
      </div>

      {/* Team card selector (bottom tray) */}
      <div style={{
        flexShrink: 0, padding: '8px 10px',
        background: 'rgba(6,14,28,.9)', borderTop: '1px solid rgba(56,189,248,.08)',
        display: 'flex', gap: 7, overflowX: 'auto',
      }}>
        {TEAM_CARDS.map(card => {
          const isSelected = selectedCardId === card.id;
          const isUsed     = assignedCardIds.has(card.id);
          return (
            <div
              key={card.id}
              onClick={() => !isUsed && onSelectCard(card)}
              style={{
                flexShrink: 0, width: 60, padding: '8px 6px', textAlign: 'center',
                background: card.bg, border: `2px solid ${isSelected ? card.color : isUsed ? 'rgba(71,85,105,.3)' : card.border}`,
                borderRadius: 10, cursor: isUsed ? 'not-allowed' : 'pointer',
                opacity: isUsed ? 0.4 : 1,
                boxShadow: isSelected ? `0 0 12px ${card.color}55` : 'none',
                transition: 'all .2s',
              }}
            >
              <div style={{ fontSize: 20 }}>{card.emoji}</div>
              <div style={{ fontSize: 7.5, color: card.color, fontWeight: 800, marginTop: 2 }}>{card.name}</div>
              <div style={{ fontSize: 7, color: '#475569' }}>{card.apCost}AP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
