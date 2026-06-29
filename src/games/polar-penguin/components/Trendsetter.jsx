import React, { useState, useEffect, useRef } from 'react';
import { TRENDSETTER_CAMPAIGNS } from '../data/trendsetterCampaigns.js';
import { SOUNDS } from '../engine/synthPlay.js';
import InsightModal from './InsightModal.jsx';

// Import Modular Components
import AdBudgeting from './Trendsetter/AdBudgeting.jsx';
import CardDeck from './Trendsetter/CardDeck.jsx';
import AnalyticsDashboard from './Trendsetter/AnalyticsDashboard.jsx';
import CampaignSummary from './Trendsetter/CampaignSummary.jsx';

const TRENDSETTER_INSIGHT = `Kampanye pemasaran digital modern membutuhkan pemahaman mendalam tentang segmentasi pasar, psikologi audiens, dan penyelarasan nada pesan. Di BINUS @Bekasi Business IT, kamu akan mempelajari analisis perilaku konsumen, manajemen kampanye digital, dan visualisasi data untuk merancang strategi bisnis berbasis data yang efektif.`;

/**
 * Generator komentar simulasi berdasarkan level (segmen audiens) dan ketepatan keputusan.
 * Diimpor dinamis atau diintegrasikan di level controller.
 */
function generateMockComments(levelId, isCorrect, correctTagsCount) {
  if (levelId === 1) {
    // Gen-Z & Eco-Conscious Chicks
    if (isCorrect) {
      if (correctTagsCount === 2) {
        return [
          { name: '@giga_chix', comment: 'Hype abis! 🔥 Tag-nya pas banget, langsung share!', isPositive: true },
          { name: '@slay_penguin', comment: 'Ini baru asik! Mengedukasi tanpa ngebosenin 🌨️', isPositive: true }
        ];
      } else {
        return [
          { name: '@giga_chix', comment: 'Postingan oke, tapi hashtag-nya agak asing deh.. 🤔', isPositive: true },
          { name: '@chill_bro99', comment: 'Bagus isinya, walau tag-nya agak random gaes.', isPositive: true }
        ];
      }
    } else {
      return [
        { name: '@cringe_detect', comment: 'Boomeerrrr post 💀 Siapa sih yang nulis ini?', isPositive: false },
        { name: '@savagely_ice', comment: 'Cringe bgt sumpah, langsung unfollow ah.', isPositive: false }
      ];
    }
  } else if (levelId === 2) {
    // B2B & Business Penguins
    if (isCorrect) {
      if (correctTagsCount === 2) {
        return [
          { name: '@cargo_chief_id', comment: 'Analisis ROI masuk akal. Efisiensi logistik terjamin.', isPositive: true },
          { name: '@investor_cold', comment: 'Sistem monitoring real-time sangat meminimalisir spoilage risk.', isPositive: true }
        ];
      } else {
        return [
          { name: '@cargo_chief_id', comment: 'Isinya bermanfaat, namun penandaan (hashtags) kurang spesifik.', isPositive: true },
          { name: '@b2b_analyst', comment: 'Konsep logistik bagus. Pengarsipan tag bisa ditingkatkan.', isPositive: true }
        ];
      }
    } else {
      return [
        { name: '@audit_iceberg', comment: 'Mana datanya? Postingan tidak kredibel sama sekali.', isPositive: false },
        { name: '@capital_penguin', comment: 'Gimmick belaka, tidak ada metrik nilai keuntungan yang konkret.', isPositive: false }
      ];
    }
  } else {
    // Eco-Tourists
    if (isCorrect) {
      if (correctTagsCount === 2) {
        return [
          { name: '@ecotour_lover', comment: 'Sangat menghargai kebijakan zero emission dome ini. Indah! 🌌', isPositive: true },
          { name: '@wanderer_ice', comment: 'Pembatasan kuota adalah bukti komitmen pelestarian nyata.', isPositive: true }
        ];
      } else {
        return [
          { name: '@ecotour_lover', comment: 'Lokasinya tampak indah dan ramah lingkungan.', isPositive: true },
          { name: '@green_living', comment: 'Konsep menarik, tapi kemasan promosinya kurang minimalis.', isPositive: true }
        ];
      }
    } else {
      return [
        { name: '@antisled_noisy', comment: 'Sangat bising! Kebisingan ini merusak habitat singa laut liar!', isPositive: false },
        { name: '@zero_mass_travel', comment: 'Diskon murahan promosi wisata massal merusak alam.', isPositive: false }
      ];
    }
  }
}

/**
 * Trendsetter — Module 3: Polar Trendsetter.
 * Game pencocokan kampanye media sosial gaya swipe kartu (Tinder-style) modular.
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

  // Paid Ads Budgeting State ($500 limit)
  const [adBudget, setAdBudget] = useState({ influencer: 0, search: 0, blog: 0 });

  // Hashtag Selector State (exactly 2 selected to Publish)
  const [selectedTags, setSelectedTags] = useState([]);

  // Split-Screen Layout Responsive State
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 800);
  const [showMobileDashboard, setShowMobileDashboard] = useState(false);

  // Metric histories for charts
  const [reachHistory, setReachHistory] = useState([0]);
  const [sentiment, setSentiment] = useState({ pos: 0, neu: 100, neg: 0 });

  // Swipe gesture state
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Feedback phase state
  const [lastAction, setLastAction] = useState(null); // 'publish' | 'discard'
  const [isCorrectFeedback, setIsCorrectFeedback] = useState(false);
  const [correctTagsCount, setCorrectTagsCount] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [mockComments, setMockComments] = useState([]);

  const campaign = TRENDSETTER_CAMPAIGNS[levelIdx];
  const card = campaign?.deck[cardIdx];

  // Monitor screen size
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate allocated budget total
  const totalAllocated = adBudget.influencer + adBudget.search + adBudget.blog;
  const remainingBudget = 500 - totalAllocated;

  const handleBudgetChange = (channelId, delta) => {
    const current = adBudget[channelId] || 0;
    const next = current + delta;
    if (next >= 0 && (delta < 0 || totalAllocated + delta <= 500)) {
      setAdBudget(prev => ({ ...prev, [channelId]: next }));
      SOUNDS.cable(1);
    } else {
      SOUNDS.wrong();
    }
  };

  // Reset level state and initialize reach with ad budgeting traffic bonus
  const startPlaying = () => {
    const matchingChannel = campaign.adChannels.find(c => c.targetMatch);
    const correctAllocation = adBudget[matchingChannel?.id] || 0;

    setCardIdx(0);
    setHealth(3);
    setXpEarned(0);
    setSelectedTags([]);
    
    // Initial reach includes the paid ads correct traffic allocation
    setReachHistory([correctAllocation]);
    setSentiment({ pos: 0, neu: 100, neg: 0 });
    setCampaignPhase('playing');
    SOUNDS.correct();
  };

  // Pointer event handlers
  const handlePointerDown = (e) => {
    if (campaignPhase !== 'playing') return;
    if (selectedTags.length < 2) return; // Must select 2 hashtags before dragging to publish

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
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleTagToggle = (tag) => {
    if (campaignPhase !== 'playing') return;
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
      SOUNDS.cableUndo();
    } else {
      if (selectedTags.length < 2) {
        setSelectedTags(prev => [...prev, tag]);
        SOUNDS.cable(5);
      } else {
        SOUNDS.wrong();
      }
    }
  };

  // Handle swipe decision
  const handleSwipe = (action) => {
    setDragOffset({ x: 0, y: 0 });
    const isPublish = action === 'publish';
    const isCorrectChoice = card.isCorrect === isPublish;

    setLastAction(action);
    setIsCorrectFeedback(isCorrectChoice);
    
    // Evaluate correctness of selected hashtags
    let matchedTags = 0;
    if (isPublish) {
      matchedTags = selectedTags.filter(tag => card.correctHashtags.includes(tag)).length;
    }
    setCorrectTagsCount(matchedTags);

    // Dynamic explanation modifier based on tags
    let evaluationText = card.explanation;
    if (isPublish && isCorrectChoice) {
      if (matchedTags === 2) {
        evaluationText += ' Tag yang dipilih juga sangat tepat dan memaksimalkan traffic kampanye!';
      } else if (matchedTags === 1) {
        evaluationText += ' Namun, salah satu tag kurang optimal, membatasi reach yang didapat.';
      } else {
        evaluationText += ' Namun, tag yang dipasang tidak relevan sehingga tidak memicu reaksi viral.';
      }
    }
    setFeedbackText(evaluationText);

    // Generate simulated user comments
    const comments = generateMockComments(campaign.id, isCorrectChoice, matchedTags);
    setMockComments(comments);

    // Calculate score (XP / reach) and update history
    let scoreAdded = 0;
    if (isCorrectChoice) {
      SOUNDS.coin();
      if (isPublish) {
        scoreAdded = matchedTags === 2 ? 200 : matchedTags === 1 ? 100 : 50;
      } else {
        scoreAdded = 100;
      }
      setXpEarned((prev) => prev + (isPublish ? (matchedTags === 2 ? 20 : matchedTags === 1 ? 10 : 5) : 10));
    } else {
      SOUNDS.wrong();
      scoreAdded = 0;
      setHealth((prev) => prev - 1);
    }

    const currentReach = reachHistory[reachHistory.length - 1];
    const newReach = Math.min(1500, currentReach + scoreAdded);
    setReachHistory((prev) => [...prev, newReach]);

    setSentiment((prev) => {
      let { pos, neu, neg } = prev;
      if (isPublish) {
        if (isCorrectChoice) {
          const sentimentBonus = matchedTags === 2 ? 30 : matchedTags === 1 ? 15 : 5;
          pos = Math.min(100, pos + sentimentBonus);
          neu = Math.max(0, neu - sentimentBonus);
        } else {
          neg = Math.min(100, neg + 30);
          neu = Math.max(0, neu - 30);
        }
      } else {
        if (isCorrectChoice) {
          pos = Math.min(100, pos + 10);
          neu = Math.max(0, neu - 10);
        } else {
          neg = Math.min(100, neg + 20);
          neu = Math.max(0, neu - 20);
        }
      }
      const total = pos + neu + neg;
      return {
        pos: Math.round((pos / total) * 100),
        neu: Math.round((neu / total) * 100),
        neg: Math.round((neg / total) * 100),
      };
    });

    setCampaignPhase('feedback');
  };

  // Progress to next card or end level
  const nextCard = () => {
    const nextIdx = cardIdx + 1;
    const isOutOfHealth = health <= 0;
    const isEndOfDeck = nextIdx >= campaign.deck.length;

    if (isOutOfHealth || isEndOfDeck) {
      setCampaignPhase('summary');
    } else {
      setSelectedTags([]);
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
      setLevelIdx((prev) => prev + 1);
      setAdBudget({ influencer: 0, search: 0, blog: 0 });
      setCampaignPhase('briefing');
      SOUNDS.levelUp();
    } else if (!isSuccess) {
      setAdBudget({ influencer: 0, search: 0, blog: 0 });
      setCampaignPhase('briefing');
    } else {
      setShowInsight(true);
      SOUNDS.levelUp();
    }
  };

  // 1. IMPROVEMENT: Fix Header Back Button behavior (Cancel selection campaign instead of exit)
  const handleHeaderBack = () => {
    if (campaignPhase === 'briefing') {
      onExit(); // exit game module to hub
    } else {
      // Cancel playing/feedback/summary and return to briefing
      setAdBudget({ influencer: 0, search: 0, blog: 0 });
      setSelectedTags([]);
      setCardIdx(0);
      setCampaignPhase('briefing');
      SOUNDS.cableUndo();
    }
  };

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #020c1b 0%, #071525 50%, #020c1b 100%)',
      overflow: 'hidden',
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
          box-shadow: 0 10px 30px rgba(0,0,0,0.55);
          position: relative;
        }
        .TS_tag_pill {
          transition: all 0.2s ease;
          cursor: pointer;
        }
        @keyframes TS_slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .TS_comment_item {
          animation: TS_slideIn 0.3s ease both;
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
            onClick={handleHeaderBack} // Using improved handler
            style={{
              fontFamily: "'Nunito', sans-serif", fontSize: 12, fontWeight: 700,
              color: 'rgba(56,189,248,.7)', background: 'transparent', border: 'none',
              cursor: 'pointer', padding: '4px 0',
            }}
          >
            {campaignPhase === 'briefing' ? '← Keluar' : '← Batal'}
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
          {!isDesktop && ['playing', 'feedback'].includes(campaignPhase) && (
            <button
              onClick={() => setShowMobileDashboard(!showMobileDashboard)}
              style={{
                fontFamily: "'Nunito', sans-serif", fontSize: 11, fontWeight: 800,
                color: '#38bdf8', background: 'rgba(56,189,248,0.1)',
                border: '1px solid rgba(56,189,248,0.25)', borderRadius: 12,
                padding: '4px 10px', cursor: 'pointer',
              }}
            >
              {showMobileDashboard ? 'Tutup Data 📉' : 'Lihat Data 📈'}
            </button>
          )}

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

      {/* ── Split Layout Container ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: isDesktop ? '430px 1fr' : '1fr',
        overflow: 'hidden',
      }}>

        {/* ── LEFT COLUMN (Game Interface) ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px 20px',
          overflowY: 'auto',
          borderRight: isDesktop ? '1px solid rgba(56,189,248,0.15)' : 'none',
        }}>

          {/* ── PHASE 1: BRIEFING & PAID ADS BUDGETING ── */}
          {campaignPhase === 'briefing' && (
            <AdBudgeting
              campaign={campaign}
              levelIdx={levelIdx}
              adBudget={adBudget}
              handleBudgetChange={handleBudgetChange}
              startPlaying={startPlaying}
            />
          )}

          {/* ── PHASE 2: PLAYING & PHASE 3: FEEDBACK ── */}
          {['playing', 'feedback'].includes(campaignPhase) && (
            <CardDeck
              campaignPhase={campaignPhase}
              cardIdx={cardIdx}
              card={card}
              health={health}
              dragOffset={dragOffset}
              isDragging={isDraggingRef.current}
              selectedTags={selectedTags}
              mockComments={mockComments}
              isCorrectFeedback={isCorrectFeedback}
              feedbackText={feedbackText}
              lastAction={lastAction}
              handlePointerDown={handlePointerDown}
              handlePointerMove={handlePointerMove}
              handlePointerUp={handlePointerUp}
              handleTagToggle={handleTagToggle}
              handleSwipe={handleSwipe}
              nextCard={nextCard}
            />
          )}

          {/* ── PHASE 4: CAMPAIGN SUMMARY ── */}
          {campaignPhase === 'summary' && (
            <CampaignSummary
              health={health}
              campaign={campaign}
              reachHistory={reachHistory}
              xpEarned={xpEarned}
              levelIdx={levelIdx}
              handleLevelFinished={handleLevelFinished}
            />
          )}
        </div>

        {/* ── RIGHT COLUMN (Dashboard - Desktop Only) ── */}
        {isDesktop && (
          <div style={{
            padding: '24px 20px',
            overflowY: 'auto',
            background: 'rgba(2,12,27,0.3)',
          }}>
            <AnalyticsDashboard
              campaign={campaign}
              reachHistory={reachHistory}
              sentiment={sentiment}
              isMobile={false}
              adBudget={adBudget}
            />
          </div>
        )}

        {/* ── MOBILE DASHBOARD OVERLAY ── */}
        {!isDesktop && showMobileDashboard && (
          <div style={{
            position: 'absolute', inset: '52px 0 0 0',
            background: 'rgba(2,12,27,0.96)', backdropFilter: 'blur(8px)',
            zIndex: 40, padding: '20px', overflowY: 'auto',
            animation: 'TS_slideIn 0.3s ease both',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AnalyticsDashboard
                campaign={campaign}
                reachHistory={reachHistory}
                sentiment={sentiment}
                isMobile={true}
                adBudget={adBudget}
              />
              <button
                className="TS_btn"
                onClick={() => setShowMobileDashboard(false)}
                style={{
                  fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12,
                  color: '#e0f2fe', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
                  padding: '12px', width: '100%', textTransform: 'uppercase', letterSpacing: 1,
                  marginTop: 10,
                }}
              >
                Tutup Monitor
              </button>
            </div>
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
