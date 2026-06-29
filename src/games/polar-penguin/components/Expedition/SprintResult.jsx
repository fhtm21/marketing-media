import React from 'react';
import { effectiveStrength } from '../../data/expeditionData.js';

/**
 * SprintResult — Layar hasil setelah resolusi sprint selesai.
 * Menampilkan per-obstacle: cleared/failed, strength vs required,
 * total damage taken, XP earned, dan tombol ke sprint berikutnya.
 *
 * @param {{
 *   sprint: import('../../data/expeditionData.js').SprintConfig,
 *   results: Array<{
 *     obstacle: import('../../data/expeditionData.js').Obstacle,
 *     assignedCards: import('../../data/expeditionData.js').TeamCard[],
 *     cleared: boolean,
 *     totalStrength: number,
 *     required: number,
 *     damageTaken: number,
 *   }>,
 *   totalDamage: number,
 *   bonusXP: number,
 *   sprintXP: number,
 *   currentHP: number,
 *   maxHP: number,
 *   isLastSprint: boolean,
 *   isGameOver: boolean,
 *   isDesktop: boolean,
 *   onNext: () => void,
 *   onRestart: () => void,
 *   onExit: () => void,
 * }} props
 */
export default function SprintResult({
  sprint, results, totalDamage, bonusXP, sprintXP,
  currentHP, maxHP, isLastSprint, isGameOver,
  isDesktop, onNext, onRestart, onExit,
}) {
  const clearedCount = results.filter(r => r.cleared).length;
  const totalCount   = results.length;
  const allClear     = clearedCount === totalCount;
  const hpPct        = Math.max(0, (currentHP / maxHP) * 100);
  const hpColor      = hpPct > 50 ? '#4ade80' : hpPct > 25 ? '#fbbf24' : '#f43f5e';

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: isDesktop ? '28px 40px' : '18px 16px', overflowY: 'auto',
    }}>
      <div style={{
        width: '100%', maxWidth: 560,
        animation: 'EX_rise 0.4s ease both',
      }}>
        {/* ── Result Header ── */}
        <div style={{
          textAlign: 'center', marginBottom: 20,
          background: isGameOver
            ? 'linear-gradient(160deg, #1a0c0c, #120808)'
            : allClear
              ? 'linear-gradient(160deg, #061c18, #071525)'
              : 'linear-gradient(160deg, #1a1208, #071525)',
          border: `1px solid ${isGameOver ? 'rgba(244,63,94,.3)' : allClear ? 'rgba(74,222,128,.3)' : 'rgba(251,191,36,.25)'}`,
          borderRadius: 18, padding: '20px 24px',
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>
            {isGameOver ? '💥' : allClear ? '🏆' : '⚠️'}
          </div>
          <p style={{
            fontSize: 9, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', margin: '0 0 4px',
            color: isGameOver ? '#f43f5e' : allClear ? '#4ade80' : '#fbbf24',
          }}>
            {isGameOver
              ? 'Sprint Failed — Game Over!'
              : allClear
                ? `Sprint ${sprint.sprintId} — All Clear! 🎯`
                : `Sprint ${sprint.sprintId} — Partial Success`}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 10 }}>
            {[
              { label: 'Cleared', value: `${clearedCount}/${totalCount}`, color: '#4ade80' },
              { label: 'Damage', value: `-${totalDamage} HP`, color: '#f43f5e' },
              { label: 'XP Earned', value: `+${sprintXP}`, color: '#fbbf24' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 10, padding: '7px 12px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 7.5, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color, marginTop: 2, fontFamily: 'monospace' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Per-Obstacle Breakdown ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {results.map((r, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: r.cleared ? 'rgba(74,222,128,.07)' : 'rgba(244,63,94,.07)',
              border: `1px solid ${r.cleared ? 'rgba(74,222,128,.2)' : 'rgba(244,63,94,.18)'}`,
              borderRadius: 12, padding: '10px 14px',
            }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{r.obstacle.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#e0f2fe' }}>{r.obstacle.name}</span>
                  <span style={{
                    fontSize: 8, fontWeight: 800, padding: '2px 8px', borderRadius: 10,
                    textTransform: 'uppercase', letterSpacing: 1,
                    color: r.cleared ? '#4ade80' : '#f43f5e',
                    background: r.cleared ? 'rgba(74,222,128,.15)' : 'rgba(244,63,94,.15)',
                  }}>
                    {r.cleared ? '✓ Cleared' : '✗ Failed'}
                  </span>
                </div>
                {/* Strength bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 3,
                      width: `${Math.min(100, (r.totalStrength / (r.required || 1)) * 100)}%`,
                      background: r.cleared ? '#4ade80' : '#f43f5e',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#64748b', flexShrink: 0 }}>
                    STR {r.totalStrength}/{r.required}
                  </span>
                </div>
                {/* Assigned cards */}
                {r.assignedCards.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                    {r.assignedCards.map((card, ci) => {
                      const eff = effectiveStrength(card, r.obstacle);
                      const isBonus = eff > card.strength;
                      return (
                        <span key={ci} style={{
                          fontSize: 9, fontFamily: 'monospace',
                          color: isBonus ? '#fbbf24' : '#94a3b8',
                          background: isBonus ? 'rgba(251,191,36,.1)' : 'rgba(148,163,184,.08)',
                          border: `1px solid ${isBonus ? 'rgba(251,191,36,.2)' : 'rgba(148,163,184,.12)'}`,
                          borderRadius: 6, padding: '1px 6px',
                        }}>
                          {card.emoji} {card.name} {isBonus ? `⭐+${eff}` : `+${eff}`}
                        </span>
                      );
                    })}
                  </div>
                )}
                {r.assignedCards.length === 0 && (
                  <span style={{ fontSize: 9, color: '#475569', fontStyle: 'italic' }}>
                    Tidak ada kartu yang di-assign
                  </span>
                )}
                {!r.cleared && (
                  <div style={{ fontSize: 8.5, color: '#f43f5e', fontWeight: 700, marginTop: 3, fontFamily: 'monospace' }}>
                    💔 -{r.damageTaken} HP taken
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── HP Remaining ── */}
        <div style={{
          background: 'rgba(6,14,28,.7)', border: '1px solid rgba(255,255,255,.07)',
          borderRadius: 12, padding: '12px 16px', marginBottom: 16,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
          }}>
            <span style={{ fontSize: 9, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Remaining HP
            </span>
            <span style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 800, color: hpColor }}>
              {Math.max(0, currentHP)} / {maxHP}
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,.06)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 3,
              width: `${hpPct}%`,
              background: `linear-gradient(90deg, ${hpColor}, ${hpColor}aa)`,
              transition: 'width .5s ease',
            }} />
          </div>
        </div>

        {/* ── Action buttons ── */}
        {isGameOver ? (
          <div style={{ display: 'flex', gap: 10, flexDirection: isDesktop ? 'row' : 'column' }}>
            <button
              onClick={onRestart}
              style={{
                flex: 1, fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 15,
                color: '#020c1b', background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                border: 'none', padding: '14px 20px', borderRadius: 40, cursor: 'pointer',
                boxShadow: '0 0 20px rgba(14,165,233,.35)',
                animation: 'EX_pulse_b 2s ease-in-out infinite',
              }}
            >
              🔄 Coba Lagi dari Sprint 1
            </button>
            <button
              onClick={onExit}
              style={{
                flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 12,
                color: '#64748b', background: 'transparent',
                border: '1px solid rgba(100,116,139,.2)', padding: '14px 20px',
                borderRadius: 40, cursor: 'pointer',
              }}
            >
              ← Kembali ke Hub
            </button>
          </div>
        ) : (
          <button
            onClick={onNext}
            style={{
              width: '100%', fontFamily: "'Fredoka', sans-serif", fontWeight: 700, fontSize: 16,
              color: '#020c1b',
              background: isLastSprint
                ? 'linear-gradient(90deg, #fbbf24, #f59e0b)'
                : 'linear-gradient(90deg, #14b8a6, #0d9488)',
              border: 'none', padding: '15px 32px', borderRadius: 40, cursor: 'pointer',
              boxShadow: isLastSprint
                ? '0 0 24px rgba(251,191,36,.4)'
                : '0 0 24px rgba(20,184,166,.4)',
              animation: 'EX_pulse 2.2s ease-in-out infinite',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            {isLastSprint ? '🎓 Lihat Insight & Selesaikan Ekspedisi' : `⚡ Lanjut Sprint ${sprint.sprintId + 1}`}
          </button>
        )}
      </div>
    </div>
  );
}
