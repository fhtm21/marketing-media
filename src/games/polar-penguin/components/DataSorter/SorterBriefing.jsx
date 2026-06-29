import React from 'react';
import { SORTER_ITEM_TYPES, SORTER_TABLES } from '../../data/sorterItems.js';

/**
 * SorterBriefing — Layar briefing sebelum level Data Stream Sorter dimulai.
 * Menampilkan objective level, panduan sortir item-to-table, dan kontrol interaksi.
 *
 * @param {{
 *   level: import('../../data/sorterItems.js').SorterLevel,
 *   levelNumber: number,
 *   totalLevels: number,
 *   onStart: () => void,
 *   onExit: () => void,
 *   isDesktop: boolean,
 * }} props
 */
export default function SorterBriefing({ level, levelNumber, totalLevels, onStart, onExit, isDesktop }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflowY: 'auto', padding: isDesktop ? '24px 40px' : '16px 16px 32px',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @keyframes SB_rise  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes SB_pulse { 0%,100%{box-shadow:0 0 18px rgba(14,165,233,.3)} 50%{box-shadow:0 0 36px rgba(14,165,233,.7)} }
        .SB_start { border:none; cursor:pointer; }
        .SB_start:hover { filter:brightness(1.12); transform:translateY(-2px) !important; }
        .SB_start:active { transform:scale(.97) !important; }
        .SB_exit { border:none; cursor:pointer; background:transparent; transition:opacity .2s; }
        .SB_exit:hover { opacity:.65; }
        .SB_mapping-row { transition:background .2s,border-color .2s; }
        .SB_mapping-row:hover { background:rgba(255,255,255,.04) !important; }
        kbd.SB_key {
          display:inline-flex; align-items:center; justify-content:center;
          border-radius:5px; padding:2px 7px; font-family:monospace; font-size:13px;
          font-weight:700; border-width:1px; border-style:solid;
          line-height:1.4;
        }
      `}</style>

      <div style={{
        width: '100%', maxWidth: isDesktop ? 820 : 440,
        animation: 'SB_rise 0.4s ease both',
      }}>
        {/* Header Card */}
        <div style={{
          background: 'linear-gradient(160deg, #0c1a2e 0%, #071525 100%)',
          border: '1px solid rgba(14,165,233,0.22)',
          borderRadius: 20, padding: isDesktop ? '28px 36px' : '20px 18px',
          marginBottom: 12,
        }}>
          {/* Level badge row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2,
                color: '#0ea5e9', background: 'rgba(14,165,233,.1)',
                border: '1px solid rgba(14,165,233,.25)', borderRadius: 20, padding: '3px 10px',
              }}>
                Level {levelNumber} / {totalLevels}
              </span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                {level.concept}
              </span>
            </div>
            <button className="SB_exit" onClick={onExit} style={{ fontSize: 11, color: 'rgba(100,116,139,.65)', fontWeight: 600, padding: '4px 8px' }}>
              ← Exit
            </button>
          </div>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: isDesktop ? 32 : 26 }}>🗄️</span>
            <h2 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: isDesktop ? 24 : 18,
              fontWeight: 900, color: '#e0f2fe', margin: 0,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              {level.title}
            </h2>
          </div>

          {/* Objective */}
          <p style={{
            fontSize: 12.5, color: '#94a3b8', lineHeight: 1.65, margin: '0 0 0 42px',
          }}>
            {level.objective}
          </p>
        </div>

        {/* Item → Table Mapping */}
        <div style={{
          background: 'rgba(7,21,37,.8)',
          border: '1px solid rgba(56,189,248,.12)',
          borderRadius: 16, padding: isDesktop ? '20px 24px' : '16px 14px',
          marginBottom: 12,
        }}>
          <p style={{
            fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5,
            color: '#38bdf8', margin: '0 0 12px',
          }}>
            📊 Panduan Klasifikasi Data
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SORTER_ITEM_TYPES.map((item) => {
              const table = SORTER_TABLES.find(t => t.id === item.correctTable);
              return (
                <div
                  key={item.id}
                  className="SB_mapping-row"
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: isDesktop ? 16 : 10,
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                    borderRadius: 10, padding: isDesktop ? '10px 16px' : '8px 12px',
                  }}
                >
                  <span style={{ fontSize: isDesktop ? 32 : 26, flexShrink: 0 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: item.color, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: '#475569', fontWeight: 600 }}>{item.shortLabel}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: '#334155', fontWeight: 700 }}>→</span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: table.bg, border: `1px solid ${table.border}`,
                      borderRadius: 8, padding: '4px 10px',
                    }}>
                      <span style={{ fontSize: isDesktop ? 16 : 14 }}>{table.icon}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: table.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {table.shortLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controls hint */}
        <div style={{
          background: 'rgba(251,191,36,.05)',
          border: '1px solid rgba(251,191,36,.18)',
          borderRadius: 14, padding: isDesktop ? '16px 24px' : '12px 14px',
          marginBottom: 18,
        }}>
          <p style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2.5, color: '#fbbf24', margin: '0 0 10px' }}>
            {isDesktop ? '⌨️ Desktop Controls' : '📱 Mobile Controls'}
          </p>
          {isDesktop ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
              {[
                { key: 'Drag', desc: 'Seret item langsung ke tabel' },
                { key: 'Click item', desc: 'Pilih item → sorot kuning' },
                { key: '1 / 2 / 3', desc: 'Sortir item terpilih ke tabel' },
                { key: 'Click table', desc: 'Sortir item terpilih ke tabel tsb.' },
              ].map(({ key, desc }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#94a3b8' }}>
                  <kbd className="SB_key" style={{ color: '#fbbf24', background: 'rgba(251,191,36,.1)', borderColor: 'rgba(251,191,36,.25)', minWidth: 52 }}>{key}</kbd>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, color: '#94a3b8' }}>
              <div>👆 <strong style={{ color: '#fbbf24' }}>Tap</strong> item untuk memilih, lalu tap tabel untuk sortir</div>
              <div>✋ <strong style={{ color: '#fbbf24' }}>Drag</strong> langsung dari item ke tabel target</div>
            </div>
          )}
        </div>

        {/* Start button */}
        <button
          className="SB_start"
          onClick={onStart}
          style={{
            fontFamily: "'Fredoka', sans-serif",
            fontWeight: 700, fontSize: isDesktop ? 17 : 15,
            color: '#020c1b',
            background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
            padding: isDesktop ? '15px 44px' : '13px 32px',
            borderRadius: 40,
            boxShadow: '0 8px 28px rgba(14,165,233,.4)',
            display: 'block', width: '100%',
            transition: 'transform .2s, filter .2s',
            animation: 'SB_pulse 2.5s ease-in-out infinite',
          }}
        >
          Mulai Sortir Data 🗄️
        </button>
      </div>
    </div>
  );
}
