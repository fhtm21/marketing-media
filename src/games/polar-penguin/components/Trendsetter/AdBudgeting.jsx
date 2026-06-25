import React from 'react';

/**
 * AdBudgeting - Komponen layar Briefing dan alokasi budget Paid Ads ($500).
 *
 * @param {{
 *   campaign: any,
 *   levelIdx: number,
 *   adBudget: { influencer: number, search: number, blog: number },
 *   handleBudgetChange: (channelId: string, delta: number) => void,
 *   startPlaying: () => void
 * }} props
 */
export default function AdBudgeting({ campaign, levelIdx, adBudget, handleBudgetChange, startPlaying }) {
  const totalAllocated = adBudget.influencer + adBudget.search + adBudget.blog;
  const remainingBudget = 500 - totalAllocated;

  return (
    <div style={{
      width: '100%', maxWidth: 390,
      background: 'rgba(12,26,46,0.85)',
      border: '1px solid rgba(56,189,248,0.2)',
      borderRadius: 20, padding: '20px',
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      animation: 'TS_briefingIn 0.4s ease both',
    }}>
      <style>{`
        @keyframes TS_briefingIn { from{opacity:0;transform:scale(0.95) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      {/* Header Briefing */}
      <div style={{ textAlign: 'center' }}>
        <span style={{
          fontSize: 8, fontWeight: 800, color: '#38bdf8',
          background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
          borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: 1.5,
        }}>
          Kampanye {levelIdx + 1} dari 3
        </span>
        <h2 style={{
          fontSize: 20, fontWeight: 800, color: '#e0f2fe',
          margin: '8px 0 2px', textTransform: 'uppercase', letterSpacing: 0.5,
        }}>{campaign.title}</h2>
        <p style={{ fontSize: 10, color: '#38bdf8', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
          Konsep: {campaign.concept}
        </p>
      </div>

      <div>
        <h4 style={{ fontSize: 9, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 4px', fontWeight: 800 }}>
          🎯 Target Audien: <span style={{ color: '#e0f2fe' }}>{campaign.targetAudience}</span>
        </h4>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
          {campaign.objective}
        </p>
      </div>

      {/* Likes vs Dislikes */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{
          flex: 1, background: 'rgba(16,185,129,0.04)',
          border: '1px solid rgba(16,185,129,0.15)',
          borderRadius: 10, padding: '8px',
        }}>
          <span style={{ fontSize: 8.5, color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            👍 Suka
          </span>
          <ul style={{ margin: '4px 0 0', paddingLeft: 10, fontSize: 9.5, color: '#cbd5e1', lineHeight: 1.5 }}>
            {campaign.likes.slice(0, 3).map((like, i) => <li key={i}>{like}</li>)}
          </ul>
        </div>

        <div style={{
          flex: 1, background: 'rgba(239,68,68,0.04)',
          border: '1px solid rgba(239,68,68,0.15)',
          borderRadius: 10, padding: '8px',
        }}>
          <span style={{ fontSize: 8.5, color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            👎 Benci
          </span>
          <ul style={{ margin: '4px 0 0', paddingLeft: 10, fontSize: 9.5, color: '#cbd5e1', lineHeight: 1.5 }}>
            {campaign.dislikes.slice(0, 3).map((dis, i) => <li key={i}>{dis}</li>)}
          </ul>
        </div>
      </div>

      {/* Paid Ads budgeting block */}
      <div style={{
        background: 'rgba(56,189,248,0.06)',
        border: '1px solid rgba(56,189,248,0.2)',
        borderRadius: 14,
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
            💵 Alokasi Anggaran Iklan
          </span>
          <span style={{ fontSize: 11, fontWeight: 900, color: remainingBudget === 0 ? '#10b981' : '#fbbf24', fontFamily: 'monospace' }}>
            Sisa: ${remainingBudget}
          </span>
        </div>
        <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 2px', lineHeight: 1.4 }}>
          Alokasikan **$500** ke saluran iklan yang sesuai dengan audiens target untuk mendapatkan traffic awal!
        </p>

        {/* Counters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {campaign.adChannels.map((channel) => (
            <div
              key={channel.id}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(2,12,27,0.3)', padding: '6px 10px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.04)'
              }}
            >
              <div style={{ flex: 1, paddingRight: 8 }}>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: '#e0f2fe', display: 'block' }}>{channel.name}</span>
                <span style={{ fontSize: 9, color: '#64748b' }}>{channel.desc}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  className="TS_btn"
                  onClick={() => handleBudgetChange(channel.id, -100)}
                  disabled={adBudget[channel.id] <= 0}
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: adBudget[channel.id] <= 0 ? 'rgba(255,255,255,0.03)' : 'rgba(239,68,68,0.15)',
                    border: `1px solid ${adBudget[channel.id] <= 0 ? 'rgba(255,255,255,0.08)' : 'rgba(239,68,68,0.3)'}`,
                    color: adBudget[channel.id] <= 0 ? '#475569' : '#ef4444',
                    cursor: adBudget[channel.id] <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
                  }}
                >-</button>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'monospace', minWidth: 34, textAlign: 'center' }}>
                  ${adBudget[channel.id]}
                </span>
                <button
                  className="TS_btn"
                  onClick={() => handleBudgetChange(channel.id, 100)}
                  disabled={remainingBudget <= 0}
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: remainingBudget <= 0 ? 'rgba(255,255,255,0.03)' : 'rgba(16,185,129,0.15)',
                    border: `1px solid ${remainingBudget <= 0 ? 'rgba(255,255,255,0.08)' : 'rgba(16,185,129,0.3)'}`,
                    color: remainingBudget <= 0 ? '#475569' : '#10b981',
                    cursor: remainingBudget <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900
                  }}
                >+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="TS_btn"
        onClick={startPlaying}
        disabled={remainingBudget > 0}
        style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
          color: remainingBudget > 0 ? '#475569' : '#020c1b',
          background: remainingBudget > 0
            ? 'rgba(255,255,255,0.04)'
            : 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
          border: remainingBudget > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
          padding: '12px', borderRadius: 12, width: '100%',
          textTransform: 'uppercase', letterSpacing: 1,
          boxShadow: remainingBudget > 0 ? 'none' : '0 4px 14px rgba(14,165,233,0.3)',
          cursor: remainingBudget > 0 ? 'not-allowed' : 'pointer'
        }}
      >
        {remainingBudget > 0 ? `Alokasikan Sisa $${remainingBudget} Dulu` : 'Mulai Kampanye 📈'}
      </button>
    </div>
  );
}
