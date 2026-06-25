import React, { useState, useEffect, useRef } from 'react';
import { TRENDSETTER_CAMPAIGNS } from '../data/trendsetterCampaigns.js';
import { SOUNDS } from '../engine/synthPlay.js';
import InsightModal from './InsightModal.jsx';

const TRENDSETTER_INSIGHT = `Kampanye pemasaran digital modern membutuhkan pemahaman mendalam tentang segmentasi pasar, psikologi audiens, dan penyelarasan nada pesan. Di BINUS @Bekasi Business IT, kamu akan mempelajari analisis perilaku konsumen, manajemen kampanye digital, dan visualisasi data untuk merancang strategi bisnis berbasis data yang efektif.`;

/**
 * Trendsetter — Module 3: Polar Trendsetter.
 * Game pencocokan kampanye media sosial gaya swipe kartu (Tinder-style).
 * Mengajarkan segmentasi audiens dan penyelarasan pesan pemasaran digital.
 *
 * @param {{ onExit: () => void, onComplete: (score: number) => void }} props
 */
export default function Trendsetter({ onExit, onComplete }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [campaignPhase, setCampaignPhase] = useState('briefing'); // 'briefing' | 'playing' | 'feedback' | 'summary'
  const [cardIdx, setCardIdx] = useState(0);
  const [health, setHealth] = useState(3);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [showInsight, setShowInsight] = useState(false);

  // Swipe gesture state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Feedback phase state
  const [lastAction, setLastAction] = useState(null); // 'publish' | 'discard'
  const [isCorrectFeedback, setIsCorrectFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const campaign = TRENDSETTER_CAMPAIGNS[levelIdx];
  const card = campaign?.deck[cardIdx];

  // Reset level state
  const startPlaying = () => {
    setCardIdx(0);
    setHealth(3);
    setXpEarned(0);
    setCampaignPhase('playing');
    SOUNDS.correct();
  };

  // Pointer event handlers
  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDraggingRef.current = false;

    const threshold = 120; // swipe threshold in pixels
    if (dragOffset.x > threshold) {
      handleSwipe('publish');
    } else if (dragOffset.x < -threshold) {
      handleSwipe('discard');
    } else {
      // Spring back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Handle swipe decision
  const handleSwipe = (action) => {
    setDragOffset({ x: 0, y: 0 });
    const isPublish = action === 'publish';
    const isCorrectChoice = card.isCorrect === isPublish;

    setLastAction(action);
    setIsCorrectFeedback(isCorrectChoice);
    setFeedbackText(card.explanation);

    if (isCorrectChoice) {
      SOUNDS.coin();
      setXpEarned((prev) => prev + 20); // 20 XP per correct card
    } else {
      SOUNDS.wrong();
      setHealth((prev) => prev - 1);
    }

    setCampaignPhase('feedback');
  };

  // Progress to next card or end level
  const nextCard = () => {
    const nextIdx = cardIdx + 1;
    const isOutOfHealth = health <= 0;
    const isEndOfDeck = nextIdx >= campaign.deck.length;

    if (isOutOfHealth) {
      setCampaignPhase('summary');
    } else if (isEndOfDeck) {
      setCampaignPhase('summary');
    } else {
      setCardIdx(nextIdx);
      setCampaignPhase('playing');
    }
  };

  // Complete level or exit game
  const handleLevelFinished = () => {
    const isSuccess = health > 0;
    let nextXP = totalXP;

    if (isSuccess) {
      nextXP += campaign.scoreXP;
      setTotalXP(nextXP);
    }

    if (isSuccess && levelIdx < TRENDSETTER_CAMPAIGNS.length - 1) {
      // Go to next campaign level
      setLevelIdx((prev) => prev + 1);
      setCampaignPhase('briefing');
      SOUNDS.levelUp();
    } else if (!isSuccess) {
      // Retry level
      setCampaignPhase('briefing');
    } else {
      // Finish all levels - show academic insight
      setShowInsight(true);
      SOUNDS.levelUp();
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
        .TS_btn { transition: all .2s; border:none; cursor:pointer; }
        .TS_btn:hover { filter: brightness(1.1); transform: translateY(-2px); }
        .TS_btn:active { transform: scale(0.97); }
        .TS_card {
          touch-action: none;
          user-select: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          position: relative;
        }
        @keyframes TS_pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(56,189,248,0.2); }
          50% { box-shadow: 0 0 25px rgba(56,189,248,0.5); }
        }
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
            onClick={onExit}
            style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
              color: 'rgba(56,189,248,.7)', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: '4px 0',
            }}
          >
            ← Keluar
          </button>
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,.1)' }} />
          <div>
            <p style={{ fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, margin: 0, opacity: .8 }}>
              Modul 3: Polar Trendsetter
            </p>
            <p style={{ fontSize: 7.5, color: '#475569', fontWeight: 700, margin: 0, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              Digital Marketing
            </p>
          </div>
        </div>

        {/* Level & XP info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            background: 'rgba(2,12,27,.8)', border: '1px solid rgba(56,189,248,.2)',
            padding: '4px 10px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ fontSize: 8, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Total XP:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#fbbf24', fontSize: 13 }}>{totalXP}</span>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '20px 16px', overflow: 'hidden',
      }}>

        {/* ── PHASE 1: BRIEFING ── */}
        {campaignPhase === 'briefing' && (
          <div style={{
            width: '100%', maxWidth: 420,
            background: 'rgba(12,26,46,0.85)',
            border: '1px solid rgba(56,189,248,0.2)',
            borderRadius: 20, padding: '24px 20px',
            display: 'flex', flexDirection: 'column', gap: 16,
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                fontSize: 8, fontWeight: 800, color: '#38bdf8',
                background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.25)',
                borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: 1.5,
              }}>
                Kampanye {levelIdx + 1} dari 3
              </span>
              <h2 style={{
                fontSize: 22, fontWeight: 800, color: '#e0f2fe',
                margin: '12px 0 4px', textTransform: 'uppercase', letterSpacing: 0.5,
              }}>{campaign.title}</h2>
              <p style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
                Konsep: {campaign.concept}
              </p>
            </div>

            <div style={{ height: 1, background: 'rgba(56,189,248,0.15)' }} />

            <div>
              <h4 style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1.5, margin: '0 0 6px', fontWeight: 800 }}>
                🎯 Target Audien
              </h4>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#e0f2fe', margin: 0 }}>
                {campaign.targetAudience}
              </p>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0', lineHeight: 1.5 }}>
                {campaign.objective}
              </p>
            </div>

            {/* Likes vs Dislikes */}
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <div style={{
                flex: 1, background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 12, padding: '10px 12px',
              }}>
                <span style={{ fontSize: 9, color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                  👍 Suka
                </span>
                <ul style={{ margin: '6px 0 0', paddingLeft: 12, fontSize: 10.5, color: '#cbd5e1', lineHeight: 1.6 }}>
                  {campaign.likes.map((like, i) => <li key={i}>{like}</li>)}
                </ul>
              </div>

              <div style={{
                flex: 1, background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 12, padding: '10px 12px',
              }}>
                <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                  👎 Tidak Suka
                </span>
                <ul style={{ margin: '6px 0 0', paddingLeft: 12, fontSize: 10.5, color: '#cbd5e1', lineHeight: 1.6 }}>
                  {campaign.dislikes.map((dis, i) => <li key={i}>{dis}</li>)}
                </ul>
              </div>
            </div>

            <button
              className="TS_btn"
              onClick={startPlaying}
              style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
                color: '#020c1b',
                background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                padding: '13px', borderRadius: 12, width: '100%',
                textTransform: 'uppercase', letterSpacing: 1, marginTop: 6,
                boxShadow: '0 4px 14px rgba(14,165,233,0.3)',
              }}
            >
              Mulai Kampanye 📈
            </button>
          </div>
        )}

        {/* ── PHASE 2: PLAYING ── */}
        {campaignPhase === 'playing' && (
          <div style={{
            width: '100%', maxWidth: 360,
            display: 'flex', flexDirection: 'column', gap: 16,
            height: '100%', justifyContent: 'space-between',
          }}>
            {/* Top stats bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(12,26,46,0.6)', border: '1px solid rgba(56,189,248,0.12)',
              padding: '8px 14px', borderRadius: 14, flexShrink: 0,
            }}>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>
                Konten: <strong style={{ color: '#e0f2fe' }}>{cardIdx + 1}/5</strong>
              </span>

              {/* Health (Ice cubes) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginRight: 4 }}>Reputasi:</span>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: 14,
                      opacity: i < health ? 1 : 0.22,
                      filter: i < health ? 'none' : 'grayscale(100%)',
                      transition: 'opacity 0.2s',
                    }}
                  >
                    🧊
                  </span>
                ))}
              </div>
            </div>

            {/* Draggable Card Zone */}
            <div style={{
              flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
              position: 'relative', margin: '20px 0',
            }}>
              {/* Card Container */}
              <div
                className="TS_card"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  width: '100%',
                  background: '#0c1a2e',
                  border: '1px solid rgba(56,189,248,0.25)',
                  borderRadius: 20,
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  cursor: isDraggingRef.current ? 'grabbing' : 'grab',
                  transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.08}deg)`,
                  transition: isDraggingRef.current ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  zIndex: 20,
                }}
              >
                {/* Swipe Overlay Badges */}
                {dragOffset.x > 30 && (
                  <div style={{
                    position: 'absolute', top: 20, left: 20,
                    border: '3px solid #10b981', color: '#10b981',
                    borderRadius: 8, padding: '4px 10px', fontSize: 16, fontWeight: 900,
                    transform: 'rotate(-12deg)', background: 'rgba(12,26,46,0.9)',
                    textTransform: 'uppercase', zIndex: 30, letterSpacing: 1,
                  }}>
                    PUBLISH ✅
                  </div>
                )}
                {dragOffset.x < -30 && (
                  <div style={{
                    position: 'absolute', top: 20, right: 20,
                    border: '3px solid #ef4444', color: '#ef4444',
                    borderRadius: 8, padding: '4px 10px', fontSize: 16, fontWeight: 900,
                    transform: 'rotate(12deg)', background: 'rgba(12,26,46,0.9)',
                    textTransform: 'uppercase', zIndex: 30, letterSpacing: 1,
                  }}>
                    DISCARD ❌
                  </div>
                )}

                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 8.5, color: '#38bdf8', fontWeight: 800,
                    background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)',
                    borderRadius: 20, padding: '2px 8px', textTransform: 'uppercase', letterSpacing: 1,
                  }}>
                    {card.category}
                  </span>
                  <span style={{ fontSize: 10, color: '#475569', fontWeight: 700, fontFamily: 'monospace' }}>
                    FEED POST
                  </span>
                </div>

                {/* Card Visual Description */}
                <div style={{
                  background: 'rgba(2,12,27,0.5)',
                  border: '1px solid rgba(56,189,248,0.12)',
                  borderRadius: 14,
                  padding: '24px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: 12,
                  color: '#94a3b8',
                  minHeight: 100,
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}>
                  {card.visual}
                </div>

                {/* Card Post Content */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <p style={{
                    fontSize: 14.5, fontWeight: 700, color: '#cbd5e1',
                    lineHeight: 1.6, margin: 0,
                  }}>
                    "{card.content}"
                  </p>
                </div>

                {/* Card Hashtags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {card.hashtags.map((tag, i) => (
                    <span key={i} style={{
                      fontSize: 10, fontWeight: 700, color: '#38bdf8',
                      background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)',
                      borderRadius: 10, padding: '4px 8px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Manual controls buttons for accessibility */}
            <div style={{
              display: 'flex', gap: 16, flexShrink: 0,
              paddingBottom: 10,
            }}>
              <button
                className="TS_btn"
                onClick={() => handleSwipe('discard')}
                style={{
                  flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
                  color: '#cbd5e1', border: '1px solid rgba(239,68,68,0.3)',
                  background: 'rgba(239,68,68,0.06)', borderRadius: 14, padding: '12px',
                  minHeight: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, textTransform: 'uppercase', letterSpacing: 0.5,
                }}
              >
                ❌ Discard
              </button>

              <button
                className="TS_btn"
                onClick={() => handleSwipe('publish')}
                style={{
                  flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
                  color: '#020c1b',
                  background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 14, padding: '12px',
                  minHeight: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 6, textTransform: 'uppercase', letterSpacing: 0.5,
                  boxShadow: '0 4px 12px rgba(16,185,129,0.25)',
                }}
              >
                ✅ Publish
              </button>
            </div>
          </div>
        )}

        {/* ── PHASE 3: FEEDBACK INTERSTITIAL ── */}
        {campaignPhase === 'feedback' && (
          <div style={{
            width: '100%', maxWidth: 360,
            background: '#0c1a2e',
            border: `1px solid ${isCorrectFeedback ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 20, padding: '28px 20px',
            display: 'flex', flexDirection: 'column', gap: 16,
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}>
            <div>
              <div style={{ fontSize: 44, marginBottom: 8 }}>
                {isCorrectFeedback ? '✅' : '❌'}
              </div>
              <h3 style={{
                fontSize: 18, fontWeight: 800,
                color: isCorrectFeedback ? '#10b981' : '#ef4444',
                margin: 0, textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {isCorrectFeedback ? 'Keputusan Tepat!' : 'Keputusan Kurang Tepat'}
              </h3>
              <p style={{
                fontSize: 11, color: '#64748b', fontWeight: 800,
                textTransform: 'uppercase', margin: '4px 0 0', letterSpacing: 1,
              }}>
                Tindakan: {lastAction === 'publish' ? 'Menerbitkan Konten' : 'Membuang Konten'}
              </p>
            </div>

            <div style={{
              background: 'rgba(2,12,27,0.4)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '14px',
              fontSize: 12, color: '#cbd5e1', lineHeight: 1.6,
              fontWeight: 600,
            }}>
              <span style={{
                display: 'block', fontSize: 8.5, color: '#38bdf8',
                fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4,
              }}>
                Evaluasi Logika
              </span>
              "{feedbackText}"
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14,
            }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
                Campaign Reach:
              </span>
              <span style={{
                fontSize: 15, fontWeight: 800,
                color: isCorrectFeedback ? '#10b981' : '#64748b',
              }}>
                {isCorrectFeedback ? '+200 Reach' : '0 Reach'}
              </span>
            </div>

            <button
              className="TS_btn"
              onClick={nextCard}
              style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
                color: '#e0f2fe', background: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.25)',
                borderRadius: 12, padding: '12px', width: '100%',
                textTransform: 'uppercase', letterSpacing: 1,
              }}
            >
              Lanjut ➡️
            </button>
          </div>
        )}

        {/* ── PHASE 4: CAMPAIGN SUMMARY ── */}
        {campaignPhase === 'summary' && (
          <div style={{
            width: '100%', maxWidth: 360,
            background: 'rgba(12,26,46,0.9)',
            border: `1px solid ${health > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 20, padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {health > 0 ? '🏆' : '💀'}
            </div>

            <h3 style={{
              fontSize: 20, fontWeight: 800,
              color: health > 0 ? '#10b981' : '#ef4444',
              margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              {health > 0 ? 'Kampanye Sukses!' : 'Kampanye Gagal!'}
            </h3>
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
              {health > 0
                ? `Strategi pemasaran konten Anda berhasil beresonansi dengan ${campaign.targetAudience}.`
                : `Masukan konten buruk merusak kepercayaan ${campaign.targetAudience}. Perbaiki strateginya!`
              }
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {/* Reach Metric */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(2,12,27,0.4)', padding: '10px 14px', borderRadius: 10,
              }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Total Reach:</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: health > 0 ? '#38bdf8' : '#cbd5e1' }}>
                  {xpEarned * 10} / 1000
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
              {health > 0 && (
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
                color: health > 0 ? '#020c1b' : '#e0f2fe',
                background: health > 0
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'rgba(255,255,255,0.06)',
                border: health > 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12, padding: '13px', width: '100%',
                textTransform: 'uppercase', letterSpacing: 1,
                boxShadow: health > 0 ? '0 4px 12px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              {health > 0
                ? levelIdx < TRENDSETTER_CAMPAIGNS.length - 1
                  ? 'Lanjut Kampanye Berikutnya ➡️'
                  : 'Selesaikan & Dapatkan Insight 🏁'
                : 'Ulangi Kampanye 🔄'
              }
            </button>
          </div>
        )}
      </div>

      {/* ── Academic Insight Modal ── */}
      <InsightModal
        isOpen={showInsight}
        moduleTitle="Polar Trendsetter"
        concept="Digital Marketing & User Behavior"
        insightText={TRENDSETTER_INSIGHT}
        scoreXP={totalXP}
        onContinue={() => onComplete(totalXP)}
      />
    </div>
  );
}
