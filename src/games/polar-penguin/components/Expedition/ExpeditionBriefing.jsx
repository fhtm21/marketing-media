import React from 'react';
import { TEAM_CARDS, getObstacle } from '../../data/expeditionData.js';

/**
 * ExpeditionBriefing — Layar briefing sebelum setiap sprint dimulai.
 * Menampilkan: obstacle yang akan dihadapi, jumlah AP tersedia,
 * konsep Agile sprint ini, dan tombol Start.
 *
 * @param {{
 *   sprint: import('../../data/expeditionData.js').SprintConfig,
 *   sprintNumber: number,
 *   totalSprints: number,
 *   currentHP: number,
 *   maxHP: number,
 *   onStart: () => void,
 *   onExit: () => void,
 *   isDesktop: boolean,
 * }} props
 */
export default function ExpeditionBriefing({
  sprint, sprintNumber, totalSprints, currentHP, maxHP,
  onStart, onExit, isDesktop,
}) {
  const hpPct = Math.max(0, (currentHP / maxHP) * 100);
  const hpColor = hpPct > 50 ? '#4ade80' : hpPct > 25 ? '#fbbf24' : '#f43f5e';

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isDesktop ? '32px 40px' : '20px 16px', overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: isDesktop ? 700 : 420,
        animation: 'EX_rise 0.45s ease both',
      }}>
        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-block', fontSize: 8, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: 3,
            color: '#14b8a6', background: 'rgba(20,184,166,.1)',
            border: '1px solid rgba(20,184,166,.25)', borderRadius: 20, padding: '3px 14px',
            marginBottom: 12,
          }}>
            🏔️ Sprint {sprintNumber} of {totalSprints}
          </div>
          <h2 style={{
            fontFamily: "'Orbitron', sans-serif", fontSize: isDesktop ? 22 : 18,
            fontWeight: 900, color: '#e0f2fe', margin: '0 0 6px', lineHeight: 1.2,
          }}>
            {sprint.title}
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
            {sprint.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: 14, marginBottom: 18,
        }}>
          {/* ── Obstacles Panel ── */}
          <div style={{
            background: 'rgba(6,14,28,.8)', border: '1px solid rgba(244,63,94,.2)',
            borderRadius: 16, padding: '16px 18px',
          }}>
            <p style={{
              fontSize: 7.5, color: '#f43f5e', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 12px',
            }}>
              ⚠️ Incoming Obstacles ({sprint.obstacleIds.length})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sprint.obstacleIds.map(id => {
                const ob = getObstacle(id);
                if (!ob) return null;
                const diffLabel = ob.difficulty === 1 ? 'Easy' : ob.difficulty === 2 ? 'Medium' : 'Hard';
                const diffColor = ob.difficulty === 1 ? '#4ade80' : ob.difficulty === 2 ? '#fbbf24' : '#f43f5e';
                return (
                  <div key={id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: ob.bg, border: `1px solid ${ob.color}33`,
                    borderRadius: 10, padding: '8px 12px',
                  }}>
                    <span style={{ fontSize: 24, flexShrink: 0 }}>{ob.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', marginBottom: 2,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#e0f2fe' }}>
                          {ob.name}
                        </span>
                        <span style={{
                          fontSize: 7.5, fontWeight: 800, color: diffColor,
                          background: `${diffColor}18`, borderRadius: 10, padding: '1px 7px',
                          textTransform: 'uppercase', letterSpacing: 1,
                        }}>
                          {diffLabel}
                        </span>
                      </div>
                      <p style={{ fontSize: 9.5, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                        {ob.description}
                      </p>
                      <div style={{
                        fontSize: 8, color: '#f43f5e', fontWeight: 700, marginTop: 4,
                        fontFamily: 'monospace',
                      }}>
                        💔 -{ob.damage} HP if unresolved · {ob.gridRef}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Sprint Info Panel ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* AP Info */}
            <div style={{
              background: 'rgba(6,14,28,.8)', border: '1px solid rgba(20,184,166,.2)',
              borderRadius: 16, padding: '16px 18px',
            }}>
              <p style={{
                fontSize: 7.5, color: '#14b8a6', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 10px',
              }}>
                ⚡ Action Points
              </p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {Array.from({ length: sprint.actionPoints }).map((_, i) => (
                  <div key={i} style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    boxShadow: '0 0 12px rgba(20,184,166,.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}>⚡</div>
                ))}
              </div>
              <p style={{ fontSize: 9.5, color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                Assign kartu tim ke obstacle. Leader butuh 2 AP, yang lain 1 AP.
              </p>
            </div>

            {/* HP Status */}
            <div style={{
              background: 'rgba(6,14,28,.8)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 16, padding: '14px 18px',
            }}>
              <p style={{
                fontSize: 7.5, color: hpColor, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 8px',
              }}>
                ❤️ Sprint Health
              </p>
              <div style={{ marginBottom: 6 }}>
                <div style={{ height: 8, background: 'rgba(255,255,255,.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${hpPct}%`,
                    background: `linear-gradient(90deg, ${hpColor}, ${hpColor}aa)`,
                    borderRadius: 4, transition: 'width .4s ease',
                    boxShadow: `0 0 8px ${hpColor}55`,
                  }} />
                </div>
              </div>
              <div style={{ fontSize: 11, fontFamily: 'monospace', color: hpColor, fontWeight: 800 }}>
                {currentHP} / {maxHP} HP
              </div>
            </div>

            {/* Agile Concept */}
            <div style={{
              background: 'rgba(6,14,28,.8)', border: '1px solid rgba(139,92,246,.2)',
              borderRadius: 16, padding: '14px 18px',
            }}>
              <p style={{
                fontSize: 7.5, color: '#8b5cf6', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: 2.5, margin: '0 0 6px',
              }}>
                📘 Konsep: {sprint.concept}
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                {TEAM_CARDS.map(card => (
                  <div key={card.id} title={card.description} style={{
                    fontSize: 18, cursor: 'default',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.3))',
                  }}>
                    {card.emoji}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 9, color: '#64748b', margin: '6px 0 0', lineHeight: 1.5 }}>
                Pilih kombinasi kartu yang tepat untuk tiap obstacle.
                {isDesktop && ' Gunakan tombol 1–5 untuk select kartu.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onStart}
            style={{
              flex: 1, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16,
              color: '#020c1b', background: 'linear-gradient(90deg, #14b8a6, #0d9488)',
              border: 'none', padding: '15px 32px', borderRadius: 40, cursor: 'pointer',
              boxShadow: '0 0 24px rgba(20,184,166,.4), 0 8px 20px rgba(0,0,0,.3)',
              transition: 'transform .18s, filter .18s',
              animation: 'EX_pulse 2.2s ease-in-out infinite',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            🚀 Mulai Sprint {sprintNumber}
          </button>
          <button
            onClick={onExit}
            style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12,
              color: '#475569', background: 'transparent',
              border: '1px solid rgba(71,85,105,.3)', padding: '15px 20px',
              borderRadius: 40, cursor: 'pointer', transition: 'opacity .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            ← Hub
          </button>
        </div>
      </div>
    </div>
  );
}
