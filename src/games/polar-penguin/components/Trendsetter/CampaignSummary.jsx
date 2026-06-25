import React from 'react';
import { SuccessStatusAnimation, FailureStatusAnimation } from './AnimatedStatus.jsx';

/**
 * CampaignSummary - Komponen layar hasil akhir kampanye (Success / Fail)
 * Memuat metrik performa kampanye dan visualisasi animasi status.
 *
 * @param {{
 *   health: number,
 *   campaign: any,
 *   reachHistory: number[],
 *   xpEarned: number,
 *   levelIdx: number,
 *   handleLevelFinished: () => void
 * }} props
 */
export default function CampaignSummary({
  health,
  campaign,
  reachHistory,
  xpEarned,
  levelIdx,
  handleLevelFinished
}) {
  const isSuccess = health > 0;
  const lastReach = reachHistory[reachHistory.length - 1] || 0;

  return (
    <div style={{
      width: '100%', maxWidth: 360,
      background: 'rgba(12,26,46,0.9)',
      border: `1px solid ${isSuccess ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
      borderRadius: 20, padding: '24px 20px',
      textAlign: 'center',
      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
      animation: 'TS_summaryIn 0.5s ease both',
    }}>
      <style>{`
        @keyframes TS_summaryIn { from{opacity:0;transform:scale(0.9) translateY(15px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>

      {/* Animated Illustration Header */}
      {isSuccess ? <SuccessStatusAnimation /> : <FailureStatusAnimation />}

      <h3 style={{
        fontSize: 20, fontWeight: 800,
        color: isSuccess ? '#10b981' : '#ef4444',
        margin: '12px 0 4px', textTransform: 'uppercase', letterSpacing: 0.5,
      }}>
        {isSuccess ? 'Kampanye Sukses!' : 'Kampanye Gagal!'}
      </h3>
      <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
        {isSuccess
          ? `Strategi pemasaran konten Anda berhasil beresonansi dengan ${campaign.targetAudience}.`
          : `Masukan konten buruk merusak kepercayaan ${campaign.targetAudience}. Perbaiki strateginya!`
        }
      </p>

      {/* Performance metrics list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {/* Reach Metric */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(2,12,27,0.4)', padding: '10px 14px', borderRadius: 10,
        }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Total Reach:</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: isSuccess ? '#38bdf8' : '#cbd5e1' }}>
            {lastReach} / 1500
          </span>
        </div>

        {/* Accuracy Metric */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(2,12,27,0.4)', padding: '10px 14px', borderRadius: 10,
        }}>
          <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Akurasi Keputusan:</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: xpEarned >= 80 ? '#10b981' : '#fbbf24' }}>
            {Math.round((xpEarned / 100) * 100)}%
          </span>
        </div>

        {/* XP reward */}
        {isSuccess && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
            padding: '10px 14px', borderRadius: 10,
          }}>
            <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 800 }}>XP Diperoleh:</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#fbbf24' }}>
              +{campaign.scoreXP} XP
            </span>
          </div>
        )}
      </div>

      <button
        className="TS_btn"
        onClick={handleLevelFinished}
        style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
          color: isSuccess ? '#020c1b' : '#e0f2fe',
          background: isSuccess
            ? 'linear-gradient(90deg, #10b981, #34d399)'
            : 'rgba(255,255,255,0.06)',
          border: isSuccess ? 'none' : '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, padding: '13px', width: '100%',
          textTransform: 'uppercase', letterSpacing: 1,
          boxShadow: isSuccess ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
        }}
      >
        {isSuccess
          ? levelIdx < 2 // 3 levels total (0, 1, 2)
            ? 'Lanjut Kampanye Berikutnya ➡️'
            : 'Selesaikan & Dapatkan Insight 🏁'
          : 'Ulangi Kampanye 🔄'
        }
      </button>
    </div>
  );
}
