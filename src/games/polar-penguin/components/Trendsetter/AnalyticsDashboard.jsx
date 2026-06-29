import React from 'react';

/**
 * LiveAnalyticsDashboard - Komponen visualisasi performa kampanye
 * Menampilkan target profil audiens, ROI iklan berbayar, kurva reach SVG, dan analisis sentimen.
 *
 * @param {{
 *   campaign: any,
 *   reachHistory: number[],
 *   sentiment: { pos: number, neu: number, neg: number },
 *   isMobile: boolean,
 *   adBudget: { influencer: number, search: number, blog: number }
 * }} props
 */
export default function LiveAnalyticsDashboard({ campaign, reachHistory, sentiment, isMobile, adBudget }) {
  const lastReach = reachHistory[reachHistory.length - 1] || 0;

  // Calculate Paid Ads Conversion (ROI) based on budget allocation
  const matchingChannel = campaign.adChannels.find(c => c.targetMatch);
  const correctAllocation = adBudget[matchingChannel?.id] || 0;
  const adConversionRate = (correctAllocation / 500) * 100;

  // Render SVG Line Chart for Reach Growth
  const chartW = 280;
  const chartH = 80;
  const points = reachHistory.map((val, i) => {
    const x = (i / 5) * (chartW - 20) + 10;
    const y = chartH - 10 - (val / 1500) * (chartH - 20); // max scale 1500 to account for ad budget bonuses
    return { x, y, val };
  });

  const pathD = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    : '';

  return (
    <div style={{
      background: 'rgba(12,26,46,0.85)',
      border: '1px solid rgba(56,189,248,0.25)',
      borderRadius: 20,
      padding: '20px',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      height: isMobile ? 'auto' : '100%',
      justifyContent: 'flex-start',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      animation: 'TS_fadeIn 0.5s ease both',
    }}>
      <style>{`
        @keyframes TS_fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes TS_pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.2; }
        }
      `}</style>

      {/* Header Dashboard */}
      <div style={{ borderBottom: '1px solid rgba(56,189,248,0.15)', paddingBottom: 10 }}>
        <div style={{ display: 'flex', justifyItems: 'center', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>📈</span>
          <h3 style={{
            fontSize: 12, fontWeight: 900, textTransform: 'uppercase',
            letterSpacing: 2, color: '#38bdf8', margin: 0,
            fontFamily: "'Orbitron', sans-serif"
          }}>
            Campaign Analytics Live
          </h3>
        </div>
        <p style={{ fontSize: 9, color: '#64748b', margin: '4px 0 0', fontWeight: 700, textTransform: 'uppercase' }}>
          Data Real-Time Feed Monitor
        </p>
      </div>

      {/* Target Audience Reference */}
      <div style={{
        background: 'rgba(2,12,27,0.4)',
        border: '1px solid rgba(56,189,248,0.12)',
        borderRadius: 12,
        padding: '12px',
      }}>
        <div style={{ fontSize: 8.5, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
          Target Profil: {campaign.targetAudience}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
          <div>
            <span style={{ fontSize: 8, color: '#10b981', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Likes:</span>
            <span style={{ fontSize: 10.5, color: '#cbd5e1', fontWeight: 600 }}>{campaign.likes.slice(0, 2).join(', ')}...</span>
          </div>
          <div>
            <span style={{ fontSize: 8, color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', display: 'block' }}>Dislikes:</span>
            <span style={{ fontSize: 10.5, color: '#cbd5e1', fontWeight: 600 }}>{campaign.dislikes.slice(0, 2).join(', ')}...</span>
          </div>
        </div>
      </div>

      {/* Paid Ads Performance Indicator */}
      <div style={{
        background: 'rgba(56,189,248,0.04)',
        border: '1px solid rgba(56,189,248,0.15)',
        borderRadius: 12,
        padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
          <span>💵 Paid Ads Traffic conversion</span>
          <span style={{ color: '#38bdf8' }}>{adConversionRate}% ROI</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${adConversionRate}%`,
            background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
            transition: 'width 0.4s ease'
          }} />
        </div>
        <span style={{ fontSize: 8.5, color: '#94a3b8', display: 'block', marginTop: 4 }}>
          Bonus Traffic Awal: <strong style={{ color: '#fff' }}>+{correctAllocation} Reach</strong>
        </span>
      </div>

      {/* Score / Reach Metric */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
        <div>
          <span style={{ fontSize: 9, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Total Reach (Est.)
          </span>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', fontFamily: 'monospace', marginTop: 2 }}>
            {lastReach} <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>pengunjung</span>
          </div>
        </div>
        <div style={{
          background: 'rgba(56,189,248,0.08)',
          border: '1px solid rgba(56,189,248,0.2)',
          borderRadius: 10,
          padding: '4px 10px',
          textAlign: 'right',
        }}>
          <span style={{ fontSize: 8, color: '#38bdf8', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>Target</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>800+</span>
        </div>
      </div>

      {/* Reach Growth Chart (SVG) */}
      <div style={{
        background: 'rgba(2,12,27,0.5)',
        border: '1px solid rgba(56,189,248,0.08)',
        borderRadius: 12,
        padding: '10px 8px',
      }}>
        <div style={{ fontSize: 8.5, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          📈 Reach Growth Curve
        </div>
        <div style={{ position: 'relative', width: '100%', height: chartH }}>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
            {/* Zero reference line */}
            <line x1="10" y1={chartH - 10} x2={chartW - 10} y2={chartH - 10} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <line x1="10" y1="10" x2={chartW - 10} y2="10" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Growth Line */}
            {points.length > 1 && (
              <path
                d={pathD}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ transition: 'd 0.3s ease' }}
              />
            )}

            {/* Growth Area */}
            {points.length > 1 && (
              <path
                d={`${pathD} L ${points[points.length - 1].x} ${chartH - 10} L ${points[0].x} ${chartH - 10} Z`}
                fill="url(#reachGlow)"
                style={{ transition: 'd 0.3s ease' }}
              />
            )}

            <defs>
              <linearGradient id="reachGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Connection Dots */}
            {points.map((p, i) => {
              const isActive = i === points.length - 1;
              return (
                <g key={i}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 5.5 : 3.5}
                    fill={isActive ? '#e0f2fe' : '#38bdf8'}
                    stroke={isActive ? '#0ea5e9' : 'none'}
                    strokeWidth="1.5"
                    style={{ transition: 'cx 0.3s ease, cy 0.3s ease' }}
                  />
                  {isActive && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="9"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1"
                      opacity="0.6"
                      style={{ animation: 'TS_pulse 2s infinite' }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sentiment Analysis (Bar Chart) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          <span>💬 Sentiment Analysis</span>
          <span style={{ color: '#10b981' }}>Positif: {sentiment.pos}%</span>
        </div>

        {/* Stacked Progress Bar */}
        <div style={{
          display: 'flex',
          height: 14,
          borderRadius: 20,
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.04)'
        }}>
          <div style={{
            width: `${sentiment.pos}%`,
            background: 'linear-gradient(90deg, #10b981, #34d399)',
            transition: 'width 0.4s ease',
          }} />
          <div style={{
            width: `${sentiment.neu}%`,
            background: '#475569',
            transition: 'width 0.4s ease',
          }} />
          <div style={{
            width: `${sentiment.neg}%`,
            background: 'linear-gradient(90deg, #ef4444, #f87171)',
            transition: 'width 0.4s ease',
          }} />
        </div>

        {/* Legends */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 8.5, fontWeight: 700, color: '#475569', fontFamily: 'monospace' }}>
          <span style={{ color: '#10b981' }}>● Pos ( {sentiment.pos}% )</span>
          <span style={{ color: '#94a3b8' }}>● Neu ( {sentiment.neu}% )</span>
          <span style={{ color: '#ef4444' }}>● Neg ( {sentiment.neg}% )</span>
        </div>
      </div>
    </div>
  );
}
