import React, { useState } from 'react';
import { ROOT_PHASES } from './engine/phases.js';
import { MODULES_CONFIG } from './data/modules.js';
import { calcTotalScore } from './engine/scoring.js';

import PolarIntro from './components/PolarIntro.jsx';
import PolarHub from './components/PolarHub.jsx';
import MarketTycoon from './components/MarketTycoon.jsx';
import NetworkArchitect from './components/NetworkArchitect.jsx';
import Trendsetter from './components/Trendsetter.jsx';
import DataSorter from './components/DataSorter.jsx';
import Expedition from './components/Expedition.jsx';
import ComingSoon from './components/ComingSoon.jsx';

const POLAR_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Orbitron:wght@700;900&family=Fredoka:wght@500;600;700&display=swap');`;

/**
 * PolarPenguinGame — Root component untuk keseluruhan game Polar Penguin.
 * Bertanggung jawab atas routing antar modul dan state akkumulasi.
 *
 * Prop contract (dari GameHub):
 * @param {{ onBack: () => void }} props
 */
export default function PolarPenguinGame({ onBack }) {
  const [phase, setPhase] = useState(ROOT_PHASES.INTRO);
  const [playMode, setPlayMode] = useState('journey');

  /**
   * completedModules: Record<string, { score: number, concept: string, completedAt: string }>
   * Score disimpan sebagai "best score" — tidak akumulasi jika replay.
   */
  const [completedModules, setCompletedModules] = useState({});

  const totalScore = calcTotalScore(completedModules);

  /**
   * Dipanggil oleh setiap modul saat onComplete.
   * Simpan best score, lalu kembali ke hub.
   */
  const completeModule = (moduleId, scoreEarned, conceptName) => {
    setCompletedModules(prev => {
      const prevScore = prev[moduleId]?.score || 0;
      return {
        ...prev,
        [moduleId]: {
          score: Math.max(prevScore, scoreEarned),
          concept: conceptName,
          completedAt: new Date().toLocaleDateString('id-ID'),
        },
      };
    });
    setPhase(ROOT_PHASES.HUB);
  };

  const resetGame = () => {
    setCompletedModules({});
    setPhase(ROOT_PHASES.HUB);
  };

  /** Resolve module id → concept name */
  const getConceptName = (moduleId) =>
    MODULES_CONFIG.find(m => m.id === moduleId)?.concept || '';

  /** Handler dari PolarHub saat user memilih modul */
  const handleSelectModule = (moduleId) => {
    const mod = MODULES_CONFIG.find(m => m.id === moduleId);
    if (!mod?.active) {
      // Coming soon modules — tampilkan placeholder
      setPhase(moduleId);
    } else {
      setPhase(moduleId);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(160deg, #020c1b 0%, #071525 50%, #020c1b 100%)',
      color: '#fff', display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <style>{POLAR_FONTS}</style>

      {/* Ambient snowflake particles */}
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          style={{
            position: 'fixed',
            left: `${(i * 137.508) % 100}%`,
            top: `${(i * 97.312) % 100}%`,
            width: i % 5 === 0 ? 2.5 : 1.5,
            height: i % 5 === 0 ? 2.5 : 1.5,
            borderRadius: '50%',
            background: '#bae6fd',
            opacity: 0.06 + (i % 6) * 0.025,
            animation: `PP_ambient ${3 + (i % 5)}s ease-in-out ${(i % 4) * 0.6}s infinite`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      <style>{`
        @keyframes PP_ambient { 0%,100%{opacity:.06;transform:scale(1)} 50%{opacity:.18;transform:scale(1.5)} }
      `}</style>

      {/* Content layer (above particles) */}
      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* ── INTRO ── */}
        {phase === ROOT_PHASES.INTRO && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: '24px 18px 48px' }}>
            <PolarIntro
              onStart={() => setPhase(ROOT_PHASES.HUB)}
              onBack={onBack}
            />
          </div>
        )}

        {/* ── HUB ── */}
        {phase === ROOT_PHASES.HUB && (
          <PolarHub
            completedModules={completedModules}
            totalScore={totalScore}
            playMode={playMode}
            setPlayMode={setPlayMode}
            onSelectModule={handleSelectModule}
            onReset={resetGame}
            onBack={onBack}
          />
        )}

        {/* ── MODULE 1: MARKET TYCOON ── */}
        {phase === ROOT_PHASES.MARKET && (
          <MarketTycoon
            onExit={() => setPhase(ROOT_PHASES.HUB)}
            onComplete={(score) => completeModule('market', score, getConceptName('market'))}
          />
        )}

        {/* ── MODULE 2: NETWORK ARCHITECT ── */}
        {phase === ROOT_PHASES.NETWORK && (
          <NetworkArchitect
            onExit={() => setPhase(ROOT_PHASES.HUB)}
            onComplete={(score) => completeModule('network', score, getConceptName('network'))}
          />
        )}

        {/* ── MODULE 3: POLAR TRENDSETTER ── */}
        {phase === ROOT_PHASES.TRENDSETTER && (
          <Trendsetter
            onExit={() => setPhase(ROOT_PHASES.HUB)}
            onComplete={(score) => completeModule('trendsetter', score, getConceptName('trendsetter'))}
          />
        )}

        {/* ── MODULE 4: DATA STREAM SORTER ── */}
        {phase === ROOT_PHASES.SORTER && (
          <DataSorter
            onExit={() => setPhase(ROOT_PHASES.HUB)}
            onComplete={(score) => completeModule('sorter', score, getConceptName('sorter'))}
          />
        )}

        {/* ── MODULE 5: EXPEDITION SPRINT ── */}
        {phase === ROOT_PHASES.EXPEDITION && (
          <Expedition
            onExit={() => setPhase(ROOT_PHASES.HUB)}
            onComplete={(score) => completeModule('expedition', score, getConceptName('expedition'))}
          />
        )}
      </div>
    </div>
  );
}
