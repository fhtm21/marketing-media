import React from 'react';
import { getCardIllustration } from './CardIllustrations.jsx';

/**
 * CardDeck - Komponen tumpukan kartu bermain, tag selector, dan komentar netizen.
 *
 * @param {{
 *   campaignPhase: 'playing' | 'feedback',
 *   cardIdx: number,
 *   card: any,
 *   health: number,
 *   dragOffset: { x: number, y: number },
 *   isDragging: boolean,
 *   selectedTags: string[],
 *   mockComments: any[],
 *   isCorrectFeedback: boolean,
 *   feedbackText: string,
 *   lastAction: string,
 *   handlePointerDown: (e: React.PointerEvent) => void,
 *   handlePointerMove: (e: React.PointerEvent) => void,
 *   handlePointerUp: (e: React.PointerEvent) => void,
 *   handleTagToggle: (tag: string) => void,
 *   handleSwipe: (action: 'publish' | 'discard') => void,
 *   nextCard: () => void
 * }} props
 */
export default function CardDeck({
  campaignPhase,
  cardIdx,
  card,
  health,
  dragOffset,
  isDragging,
  selectedTags,
  mockComments,
  isCorrectFeedback,
  feedbackText,
  lastAction,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  handleTagToggle,
  handleSwipe,
  nextCard
}) {
  return (
    <div style={{
      width: '100%', maxWidth: 380,
      display: 'flex', flexDirection: 'column', gap: 12,
      height: '100%', justifyContent: 'space-between',
    }}>
      {/* Top stats bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(12,26,46,0.6)', border: '1px solid rgba(56,189,248,0.12)',
        padding: '6px 14px', borderRadius: 14, flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>
          Konten: <strong style={{ color: '#e0f2fe' }}>{cardIdx + 1}/5</strong>
        </span>

        {/* Health */}
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

      {/* Card Zone */}
      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
        position: 'relative', margin: '8px 0',
      }}>
        <div
          className="TS_card"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            width: '100%',
            background: '#0c1a2e',
            border: campaignPhase === 'feedback'
              ? isCorrectFeedback
                ? '1.5px solid rgba(16,185,129,0.5)'
                : '1.5px solid rgba(239,68,68,0.5)'
              : '1.5px solid rgba(56,189,248,0.25)',
            borderRadius: 20,
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            cursor: campaignPhase === 'playing' && selectedTags.length === 2
              ? isDragging ? 'grabbing' : 'grab'
              : 'default',
            transform: campaignPhase === 'playing'
              ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.08}deg)`
              : 'none',
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            zIndex: 20,
          }}
        >
          {/* Swipe Overlay Badges */}
          {campaignPhase === 'playing' && dragOffset.x > 30 && (
            <div style={{
              position: 'absolute', top: 16, left: 16,
              border: '3px solid #10b981', color: '#10b981',
              borderRadius: 8, padding: '4px 10px', fontSize: 15, fontWeight: 900,
              transform: 'rotate(-12deg)', background: 'rgba(12,26,46,0.95)',
              textTransform: 'uppercase', zIndex: 30, letterSpacing: 1,
            }}>
              PUBLISH ✅
            </div>
          )}
          {campaignPhase === 'playing' && dragOffset.x < -30 && (
            <div style={{
              position: 'absolute', top: 16, right: 16,
              border: '3px solid #ef4444', color: '#ef4444',
              borderRadius: 8, padding: '4px 10px', fontSize: 15, fontWeight: 900,
              transform: 'rotate(12deg)', background: 'rgba(12,26,46,0.95)',
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
            <span style={{ fontSize: 9.5, color: '#475569', fontWeight: 700, fontFamily: 'monospace' }}>
              FEED POST
            </span>
          </div>

          {/* Inline SVG Card Illustration */}
          <div style={{
            background: 'rgba(2,12,27,0.4)',
            border: '1px solid rgba(56,189,248,0.12)',
            borderRadius: 14,
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 110,
            overflow: 'hidden'
          }}>
            {getCardIllustration(card.id)}
          </div>

          {/* Card Post Content */}
          <div>
            <p style={{
              fontSize: 13, fontWeight: 700, color: '#cbd5e1',
              lineHeight: 1.5, margin: 0,
            }}>
              "{card.content}"
            </p>
          </div>

          {/* Hashtag Selector Grid */}
          {campaignPhase === 'playing' ? (
            <div style={{
              background: 'rgba(2,12,27,0.3)',
              border: '1px solid rgba(56,189,248,0.12)',
              borderRadius: 12,
              padding: '8px 10px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 8.5, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                <span>🏷️ Pasang Hashtag (Pilih 2)</span>
                <span style={{ color: selectedTags.length === 2 ? '#10b981' : '#fbbf24' }}>
                  Terpilih: {selectedTags.length}/2
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {card.hashtagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className="TS_btn TS_tag_pill"
                      style={{
                        padding: '6px 8px',
                        fontSize: 9.5,
                        fontWeight: 800,
                        textAlign: 'left',
                        borderRadius: 8,
                        border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(56,189,248,0.12)' : 'rgba(2,12,27,0.4)',
                        color: isSelected ? '#38bdf8' : '#94a3b8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {isSelected ? '✓ ' : '# '}
                      {tag.replace('#', '')}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Selected tags output in feedback phase */
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedTags.map((tag) => {
                const isCorrectTag = card.correctHashtags.includes(tag);
                return (
                  <span
                    key={tag}
                    style={{
                      fontSize: 9, fontWeight: 800,
                      background: isCorrectTag ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      border: isCorrectTag ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(239,68,68,0.25)',
                      color: isCorrectTag ? '#10b981' : '#ef4444',
                      borderRadius: 10, padding: '3px 8px',
                    }}
                  >
                    {tag} {isCorrectTag ? '✓' : '✗'}
                  </span>
                );
              })}
              {selectedTags.length === 0 && (
                <span style={{ fontSize: 9, color: '#64748b', fontStyle: 'italic' }}>Tidak ada tag dipasang (Postingan Dibuang)</span>
              )}
            </div>
          )}

          {/* ── MOCK COMMENTS FEED ── */}
          {campaignPhase === 'feedback' && (
            <div style={{
              marginTop: 6,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              textAlign: 'left',
            }}>
              <div style={{
                fontSize: 8.5, color: '#64748b', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2
              }}>
                <span>💬 Umpan Balik Audien</span>
              </div>

              {/* Comment Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 115, overflowY: 'auto' }}>
                {mockComments.map((cmt, idx) => (
                  <div
                    key={idx}
                    className="TS_comment_item"
                    style={{
                      display: 'flex', gap: 8, background: 'rgba(2,12,27,0.3)',
                      padding: '6px 8px', borderRadius: 8,
                      borderLeft: `2.5px solid ${cmt.isPositive ? '#10b981' : '#ef4444'}`,
                      animationDelay: `${idx * 0.15}s`
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: cmt.isPositive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, flexShrink: 0
                    }}>
                      🐧
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: '#94a3b8' }}>{cmt.name}</span>
                      <span style={{ fontSize: 10, color: '#cbd5e1', fontWeight: 600 }}>{cmt.comment}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Small Evaluation Text */}
              <div style={{
                background: 'rgba(56,189,248,0.06)',
                border: '1px solid rgba(56,189,248,0.12)',
                borderRadius: 8, padding: '8px 10px', fontSize: 10,
                color: '#cbd5e1', lineHeight: 1.5, marginTop: 4,
                fontWeight: 600
              }}>
                💡 <strong>Evaluasi:</strong> {feedbackText}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom buttons / Action controllers */}
      <div style={{ flexShrink: 0, paddingBottom: 6 }}>
        {campaignPhase === 'playing' ? (
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              className="TS_btn"
              onClick={() => handleSwipe('discard')}
              style={{
                flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12.5,
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
              disabled={selectedTags.length < 2}
              style={{
                flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12.5,
                color: selectedTags.length < 2 ? '#475569' : '#020c1b',
                background: selectedTags.length < 2
                  ? 'rgba(255,255,255,0.04)'
                  : 'linear-gradient(90deg, #10b981, #34d399)',
                border: selectedTags.length < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderRadius: 14, padding: '12px',
                minHeight: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, textTransform: 'uppercase', letterSpacing: 0.5,
                boxShadow: selectedTags.length < 2 ? 'none' : '0 4px 12px rgba(16,185,129,0.25)',
                cursor: selectedTags.length < 2 ? 'not-allowed' : 'pointer'
              }}
            >
              {selectedTags.length < 2 ? 'Pilih 2 Tag' : '✅ Publish'}
            </button>
          </div>
        ) : (
          <button
            className="TS_btn"
            onClick={nextCard}
            style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
              color: '#020c1b',
              background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
              borderRadius: 14, padding: '12px', width: '100%',
              minHeight: 46, textTransform: 'uppercase', letterSpacing: 1,
              boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
            }}
          >
            Lanjut ke Post Berikutnya ➡️
          </button>
        )}
      </div>
    </div>
  );
}
