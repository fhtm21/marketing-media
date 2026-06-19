import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { NETWORK_LEVELS } from '../data/networkLevels.js';
import { NETWORK_PHASES } from '../engine/phases.js';
import { SOUNDS } from '../engine/synthPlay.js';
import InsightModal from './InsightModal.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────

const NETWORK_INSIGHT = `Jaringan komputer modern menggunakan prinsip redundansi untuk memastikan ketersediaan layanan 24/7. Di BINUS @Bekasi Business IT, kamu akan mempelajari cara merancang infrastruktur IT yang tangguh — dari topologi jaringan hingga sistem cloud yang fault-tolerant.`;

const CELL_META = {
  server:   { bg: '#0c3b5e', border: '#0ea5e9', glow: '#38bdf8', emoji: '🖥️', label: 'Server',    desc: 'Cable origin point' },
  client:   { bg: '#2e1065', border: '#7c3aed', glow: '#a78bfa', emoji: '🏠', label: 'Client',    desc: 'Connection target' },
  cracked:  { bg: '#1c1917', border: '#44403c', glow: null,      emoji: '💀', label: 'Broken Ice', desc: 'Cannot cross' },
  water:    { bg: '#082f49', border: '#075985', glow: null,      emoji: '🌊', label: 'Deep Water', desc: '2× cable cost' },
  packet:   { bg: '#422006', border: '#d97706', glow: '#fbbf24', emoji: '⭐', label: 'Packet',    desc: 'Must collect first' },
  firewall: { bg: '#450a0a', border: '#dc2626', glow: '#f87171', emoji: '🔥', label: 'Firewall',  desc: 'Route through it' },
  splitter: { bg: '#2e1065', border: '#7c3aed', glow: '#c4b5fd', emoji: '⊕', label: 'Splitter',  desc: 'Branch cables from here' },
  empty:    { bg: 'rgba(15,23,42,0.7)', border: 'rgba(30,41,59,0.6)', glow: null, emoji: '', label: 'Empty', desc: '1 cable unit' },
};

// ─── Pure helpers (defined outside component for stability) ──────────────────

const getCellCost = (r, c, level) =>
  level.deepWater.some(dw => dw.r === r && dw.c === c) ? 2 : 1;

const getPathCost = (path, level) => {
  let cost = 0;
  for (let i = 1; i < path.length; i++) cost += getCellCost(path[i].r, path[i].c, level);
  return cost;
};

const getCommittedCost = (paths, level) =>
  paths.reduce((acc, p) => acc + getPathCost(p, level), 0);

/** BFS reachability from server through committed cable paths */
const bfsReachable = (serverR, serverC, targetR, targetC, paths) => {
  const visited = new Set([`${serverR},${serverC}`]);
  const queue = [[serverR, serverC]];
  while (queue.length > 0) {
    const [cr, cc] = queue.shift();
    if (cr === targetR && cc === targetC) return true;
    for (const path of paths) {
      for (let i = 0; i < path.length; i++) {
        if (path[i].r === cr && path[i].c === cc) {
          const neighbors = [];
          if (i > 0) neighbors.push(path[i - 1]);
          if (i < path.length - 1) neighbors.push(path[i + 1]);
          for (const n of neighbors) {
            const key = `${n.r},${n.c}`;
            if (!visited.has(key)) { visited.add(key); queue.push([n.r, n.c]); }
          }
        }
      }
    }
  }
  return false;
};

const allClientsOnline = (level, paths, needFirewall, firewallUnlocked) => {
  if (needFirewall && !firewallUnlocked) return false;
  return level.clients.every(cl =>
    bfsReachable(level.server.r, level.server.c, cl.r, cl.c, paths)
  );
};

// ─── SVG Cable Overlay ────────────────────────────────────────────────────────

const CableOverlay = memo(({ paths, currentPath }) => {
  const cx = c => c + 0.5;
  const cy = r => r + 0.5;

  return (
    <svg
      viewBox="0 0 6 6"
      preserveAspectRatio="none"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 10,
      }}
    >
      <defs>
        <filter id="cableGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.12" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <style>
          {`@keyframes cableDash { to { stroke-dashoffset: -1; } }`}
        </style>
      </defs>

      {/* Committed cable paths */}
      {paths.map((path, pi) => (
        <g key={pi} filter="url(#cableGlow)">
          {path.slice(1).map((cell, i) => (
            <line
              key={i}
              x1={cx(path[i].c)} y1={cy(path[i].r)}
              x2={cx(cell.c)}    y2={cy(cell.r)}
              stroke="#0ea5e9" strokeWidth={0.18} strokeLinecap="round"
              opacity={0.85}
            />
          ))}
          {path.map((cell, i) => (
            <circle key={i} cx={cx(cell.c)} cy={cy(cell.r)} r={0.14}
              fill="#38bdf8" opacity={0.9}
            />
          ))}
        </g>
      ))}

      {/* Active (drawing) path */}
      {currentPath.length > 0 && (
        <g>
          {currentPath.slice(1).map((cell, i) => (
            <line
              key={i}
              x1={cx(currentPath[i].c)} y1={cy(currentPath[i].r)}
              x2={cx(cell.c)}           y2={cy(cell.r)}
              stroke="#7dd3fc" strokeWidth={0.16} strokeLinecap="round"
              strokeDasharray="0.25 0.18"
              style={{ animation: 'cableDash 0.6s linear infinite' }}
              opacity={0.9}
            />
          ))}
          {currentPath.map((cell, i) => (
            <circle
              key={i}
              cx={cx(cell.c)} cy={cy(cell.r)}
              r={i === currentPath.length - 1 ? 0.19 : 0.13}
              fill={i === currentPath.length - 1 ? '#e0f2fe' : '#93c5fd'}
              opacity={0.95}
            />
          ))}
        </g>
      )}
    </svg>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * NetworkArchitect — Module 2: Igloo Network Architect.
 * Grid puzzle 6×6 with click-and-drag cable routing.
 *
 * FIX: Uses per-cell onMouseEnter + isDrawingRef (not state)
 * to correctly track drag without stale closures.
 *
 * @param {{ onExit: ()=>void, onComplete: (score:number)=>void }} props
 */
export default function NetworkArchitect({ onExit, onComplete }) {
  const [levelIdx, setLevelIdx]               = useState(0);
  const [phase, setPhase]                     = useState(NETWORK_PHASES.BRIEFING);
  const [grid, setGrid]                       = useState([]);
  const [paths, setPaths]                     = useState([]);
  const [currentPath, setCurrentPath]         = useState([]);
  const [budget, setBudget]                   = useState(0);
  const [collectedPackets, setCollectedPackets] = useState(0);
  const [firewallUnlocked, setFirewallUnlocked] = useState(false);
  const [shiftMessage, setShiftMessage]       = useState('');
  const [showInsight, setShowInsight]         = useState(false);
  const [totalXP, setTotalXP]                 = useState(0);
  const [showTip, setShowTip]                 = useState(true);
  const [isDesktop, setIsDesktop]             = useState(() => window.innerWidth >= 768);

  // ─── Refs — never stale in event handlers ─────────────────────────────────
  const isDrawingRef     = useRef(false);
  const activePathRef    = useRef([]);
  const activeBudgetRef  = useRef(0);
  const pathsRef         = useRef([]);   // mirror of paths state
  const gridDataRef      = useRef([]);   // mirror of grid state
  const levelIdxRef      = useRef(0);   // mirror of levelIdx
  const gridRef          = useRef(null);

  // Keep mirrors in sync
  useEffect(() => { pathsRef.current = paths; }, [paths]);
  useEffect(() => { gridDataRef.current = grid; }, [grid]);
  useEffect(() => { levelIdxRef.current = levelIdx; }, [levelIdx]);

  const level = NETWORK_LEVELS[levelIdx];

  // Responsive
  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  // ─── Build 6×6 grid ───────────────────────────────────────────────────────
  const buildGrid = useCallback((cfg) => {
    const g = [];
    for (let r = 0; r < 6; r++) {
      const row = [];
      for (let c = 0; c < 6; c++) {
        let type = 'empty';
        if (cfg.server.r === r && cfg.server.c === c) type = 'server';
        else if (cfg.clients.find(cl => cl.r === r && cl.c === c)) type = 'client';
        else if (cfg.cracked.some(cr => cr.r === r && cr.c === c)) type = 'cracked';
        else if (cfg.deepWater.some(dw => dw.r === r && dw.c === c)) type = 'water';
        else if (cfg.packets.some(p => p.r === r && p.c === c)) type = 'packet';
        else if (cfg.firewall?.r === r && cfg.firewall?.c === c) type = 'firewall';
        else if (cfg.splitter?.r === r && cfg.splitter?.c === c) type = 'splitter';
        row.push({ r, c, type, collected: false });
      }
      g.push(row);
    }
    return g;
  }, []);

  // ─── Level reset ──────────────────────────────────────────────────────────
  useEffect(() => {
    const cfg = NETWORK_LEVELS[levelIdx];
    const g = buildGrid(cfg);
    setGrid(g);       gridDataRef.current = g;
    setPaths([]);     pathsRef.current = [];
    setCurrentPath([]);
    setBudget(cfg.budget);
    activeBudgetRef.current = cfg.budget;
    setCollectedPackets(0);
    setFirewallUnlocked(false);
    isDrawingRef.current = false;
    activePathRef.current = [];
    setPhase(NETWORK_PHASES.BRIEFING);
    setShowTip(true);
  }, [levelIdx, buildGrid]);

  // ─── Drawing helpers ──────────────────────────────────────────────────────

  /** Is this cell reachable (server OR already on a committed path)? */
  const isCellStartable = (r, c) => {
    const lvl = NETWORK_LEVELS[levelIdxRef.current];
    if (lvl.server.r === r && lvl.server.c === c) return true;
    return pathsRef.current.some(p => p.some(cell => cell.r === r && cell.c === c));
  };

  /** Cancel the in-progress path without committing */
  const cancelDraw = useCallback(() => {
    isDrawingRef.current = false;
    activePathRef.current = [];
    setCurrentPath([]);
    const lvl = NETWORK_LEVELS[levelIdxRef.current];
    setBudget(lvl.budget - getCommittedCost(pathsRef.current, lvl));
  }, []);

  /** Commit the active path to the paths list */
  const commitPath = useCallback(() => {
    const pathToCommit = [...activePathRef.current];
    if (pathToCommit.length <= 1) { cancelDraw(); return; }

    const lvl = NETWORK_LEVELS[levelIdxRef.current];
    const newPaths = [...pathsRef.current, pathToCommit];
    pathsRef.current = newPaths;
    setPaths(newPaths);
    isDrawingRef.current = false;
    activePathRef.current = [];
    setCurrentPath([]);
    const remaining = lvl.budget - getCommittedCost(newPaths, lvl);
    setBudget(remaining);
    activeBudgetRef.current = remaining;
    SOUNDS.clientConnect();
  }, [cancelDraw]);

  // ─── Core draw event handlers (called directly — no stale closures) ────────

  const handleStartDraw = useCallback((r, c) => {
    const cell = gridDataRef.current[r]?.[c];
    if (!cell || cell.type === 'cracked') return;
    if (!isCellStartable(r, c)) { SOUNDS.wrong(); return; }

    setShowTip(false);
    isDrawingRef.current = true;
    activePathRef.current = [{ r, c }];
    const lvl = NETWORK_LEVELS[levelIdxRef.current];
    const base = lvl.budget - getCommittedCost(pathsRef.current, lvl);
    activeBudgetRef.current = base;
    setBudget(base);
    setCurrentPath([{ r, c }]);
    SOUNDS.cable(1);
  }, []); // no deps — reads from refs only

  const handleCellHover = useCallback((r, c) => {
    if (!isDrawingRef.current || activePathRef.current.length === 0) return;

    const last = activePathRef.current[activePathRef.current.length - 1];
    if (last.r === r && last.c === c) return;

    // Only orthogonal adjacency
    const rd = Math.abs(last.r - r), cd = Math.abs(last.c - c);
    if (!((rd === 1 && cd === 0) || (rd === 0 && cd === 1))) return;

    const cell = gridDataRef.current[r]?.[c];
    if (!cell || cell.type === 'cracked') return;

    // Backtrack if cell already in active path
    const existIdx = activePathRef.current.findIndex(c2 => c2.r === r && c2.c === c);
    if (existIdx !== -1) {
      activePathRef.current = activePathRef.current.slice(0, existIdx + 1);
      const lvl = NETWORK_LEVELS[levelIdxRef.current];
      const remaining = lvl.budget - getCommittedCost(pathsRef.current, lvl) - getPathCost(activePathRef.current, lvl);
      activeBudgetRef.current = remaining;
      setBudget(remaining);
      setCurrentPath([...activePathRef.current]);
      SOUNDS.cableUndo();
      return;
    }

    const lvl = NETWORK_LEVELS[levelIdxRef.current];
    const cost = getCellCost(r, c, lvl);
    if (activeBudgetRef.current - cost < 0) {
      SOUNDS.budgetOver();
      cancelDraw();
      return;
    }

    // Extend path
    activeBudgetRef.current -= cost;
    activePathRef.current = [...activePathRef.current, { r, c }];
    setBudget(activeBudgetRef.current);
    setCurrentPath([...activePathRef.current]);
    SOUNDS.cable(activePathRef.current.length);

    // Packet collection
    if (cell.type === 'packet' && !cell.collected) {
      setGrid(prev => {
        const ng = prev.map(row => row.map(c2 => ({ ...c2 })));
        ng[r][c].collected = true;
        gridDataRef.current = ng;
        return ng;
      });
      setCollectedPackets(prev => prev + 1);
      SOUNDS.packetCollect();
    }

    // Firewall pass-through
    if (cell.type === 'firewall') {
      setFirewallUnlocked(true);
      SOUNDS.firewallUnlock();
    }

    // Auto-commit when reaching a client
    if (lvl.clients.some(cl => cl.r === r && cl.c === c)) {
      commitPath();
      return;
    }

    // Auto-commit on splitter (if not already committed through it)
    if (lvl.splitter?.r === r && lvl.splitter?.c === c &&
        !pathsRef.current.some(p => p.some(c2 => c2.r === r && c2.c === c))) {
      commitPath();
    }
  }, [cancelDraw, commitPath]);

  // ─── Global mouseup cancels draw ──────────────────────────────────────────
  useEffect(() => {
    const onUp = () => { if (isDrawingRef.current) cancelDraw(); };
    window.addEventListener('mouseup', onUp);
    return () => window.removeEventListener('mouseup', onUp);
  }, [cancelDraw]);

  // ─── Touch events on grid container ──────────────────────────────────────
  useEffect(() => {
    const el = gridRef.current;
    if (!el || phase !== NETWORK_PHASES.PLAYING) return;

    const findCell = (clientX, clientY) => {
      const hit = document.elementFromPoint(clientX, clientY);
      const cellEl = hit?.closest('[data-na-cell]');
      if (!cellEl) return null;
      return { r: +cellEl.dataset.r, c: +cellEl.dataset.c };
    };

    const onTouchStart = (e) => {
      const t = e.touches[0];
      const cell = findCell(t.clientX, t.clientY);
      if (cell) handleStartDraw(cell.r, cell.c);
    };
    const onTouchMove = (e) => {
      if (!isDrawingRef.current) return;
      if (e.cancelable) e.preventDefault();
      const t = e.touches[0];
      const cell = findCell(t.clientX, t.clientY);
      if (cell) handleCellHover(cell.r, cell.c);
    };
    const onTouchEnd = () => { if (isDrawingRef.current) cancelDraw(); };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove',  onTouchMove,  { passive: false });
    el.addEventListener('touchend',   onTouchEnd);
    el.addEventListener('touchcancel', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove',  onTouchMove);
      el.removeEventListener('touchend',   onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [phase, handleStartDraw, handleCellHover, cancelDraw]);

  // ─── Game actions ─────────────────────────────────────────────────────────

  const clearNetwork = useCallback(() => {
    const lvl = NETWORK_LEVELS[levelIdx];
    const g = buildGrid(lvl);
    setPaths([]);     pathsRef.current = [];
    setCurrentPath([]);
    setBudget(lvl.budget); activeBudgetRef.current = lvl.budget;
    setCollectedPackets(0);
    setFirewallUnlocked(false);
    isDrawingRef.current = false; activePathRef.current = [];
    setGrid(g); gridDataRef.current = g;
  }, [levelIdx, buildGrid]);

  const evaluateLevel = useCallback(() => {
    const lvl = NETWORK_LEVELS[levelIdx];
    const ps = pathsRef.current;

    // Level 1: require all packets first
    if (levelIdx === 0 && collectedPackets < lvl.packets.length) {
      SOUNDS.wrong();
      return;
    }

    // Level 2: Glacier Shift redundancy test
    if (levelIdx === 1) {
      setPhase(NETWORK_PHASES.SHIFT);
      setShiftMessage('⚠️ GLACIER SHIFT DETECTED! A critical node has failed...');
      SOUNDS.wrong();

      setTimeout(() => {
        const breakR = 2, breakC = 2;
        const severed = ps
          .map(p => p.filter(c => !(c.r === breakR && c.c === breakC)))
          .filter(p => p.length > 1);

        const ok = allClientsOnline(lvl, severed, true, firewallUnlocked);
        if (ok) {
          setShiftMessage('✅ Redundancy confirmed! Your backup routes kept all clients online.');
          SOUNDS.levelUp();
          setTimeout(() => setPhase(NETWORK_PHASES.COMPLETED), 1500);
        } else {
          setShiftMessage('❌ Network failure! Some clients lost connection after the fault.');
          SOUNDS.wrong();
          setTimeout(() => setPhase(NETWORK_PHASES.FAILED), 1500);
        }
      }, 2800);
      return;
    }

    // Level 1 & 3: all clients reachable
    const online = allClientsOnline(lvl, ps, levelIdx === 1, firewallUnlocked);
    if (online) { SOUNDS.levelUp(); setPhase(NETWORK_PHASES.COMPLETED); }
    else         { SOUNDS.wrong();  setPhase(NETWORK_PHASES.FAILED); }
  }, [levelIdx, collectedPackets, firewallUnlocked]);

  const handleNextLevel = useCallback(() => {
    if (levelIdx < NETWORK_LEVELS.length - 1) {
      setLevelIdx(i => i + 1);
    } else {
      const earned = NETWORK_LEVELS.reduce((s, l) => s + l.scoreXP, 0);
      setTotalXP(earned);
      setShowInsight(true);
    }
  }, [levelIdx]);

  // ─── Derived / display values ─────────────────────────────────────────────
  const budgetPct = (budget / level.budget) * 100;
  const isPathOnCell = (r, c) =>
    paths.some(p => p.some(cell => cell.r === r && cell.c === c)) ||
    currentPath.some(cell => cell.r === r && cell.c === c);
  const isLastActive = (r, c) =>
    currentPath.length > 0 &&
    currentPath[currentPath.length - 1].r === r &&
    currentPath[currentPath.length - 1].c === c;

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg, #020c1b 0%, #050f1e 100%)',
      fontFamily: "'Nunito', sans-serif", color: '#fff',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes NA_fade  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes NA_shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-10px)} 40%,80%{transform:translateX(10px)} }
        @keyframes NA_spin  { to{transform:rotate(360deg)} }
        @keyframes NA_pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes NA_glow  { 0%,100%{box-shadow:0 0 10px rgba(56,189,248,.2)} 50%{box-shadow:0 0 28px rgba(56,189,248,.6)} }
        @keyframes tipBlink { 0%,100%{opacity:.7} 50%{opacity:1} }
        .NA_cell { transition: background .08s, border .08s, box-shadow .08s; }
        .NA_btn  { transition: transform .16s, filter .16s; border: none; cursor: pointer; }
        .NA_btn:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
        .NA_btn:active:not(:disabled){ transform: scale(.95); }
        .NA_btn:disabled { opacity: .4; cursor: not-allowed; }
      `}</style>

      {/* ══════════════════════ HEADER ══════════════════════ */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isDesktop ? '12px 24px' : '10px 14px',
        background: 'rgba(2,12,27,0.9)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(56,189,248,0.1)', flexShrink: 0, zIndex: 20,
        gap: 12,
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>🌐</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
              Network Architect
            </div>
            <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {level.title}
            </div>
          </div>
        </div>

        {/* Level progress */}
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
          {NETWORK_LEVELS.map((_, i) => (
            <div key={i} style={{
              height: 7, borderRadius: 7,
              width: i === levelIdx ? 22 : 8,
              background: i < levelIdx ? '#10b981' : i === levelIdx ? '#38bdf8' : 'rgba(255,255,255,.12)',
              transition: 'all .35s ease',
            }} />
          ))}
        </div>

        {/* Budget + exit */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          {phase === NETWORK_PHASES.PLAYING && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(2,12,27,0.8)',
              border: `1px solid ${budgetPct <= 25 ? 'rgba(239,68,68,.5)' : 'rgba(56,189,248,.2)'}`,
              borderRadius: 20, padding: '5px 12px',
            }}>
              <div style={{ width: 52, height: 5, background: 'rgba(255,255,255,.07)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 10, transition: 'width .2s ease',
                  width: `${budgetPct}%`,
                  background: budgetPct > 50 ? '#0ea5e9' : budgetPct > 25 ? '#f59e0b' : '#ef4444',
                }} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: budgetPct <= 25 ? '#ef4444' : '#e0f2fe' }}>
                {budget}
              </span>
              <span style={{ fontSize: 9, color: '#475569', fontWeight: 700 }}>cable</span>
            </div>
          )}
          <button className="NA_btn" onClick={onExit} style={{
            fontFamily: "'Nunito', sans-serif", padding: '6px 13px',
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 8, fontSize: 10, color: '#64748b', fontWeight: 700,
          }}>✕ Exit</button>
        </div>
      </header>

      {/* ══════════════════════ BRIEFING ══════════════════════ */}
      {phase === NETWORK_PHASES.BRIEFING && (
        <div style={{ flex: 1, overflowY: 'auto', animation: 'NA_fade .4s ease' }}>
          <div style={{
            maxWidth: 860, margin: '0 auto',
            padding: isDesktop ? '28px 32px' : '16px',
            display: 'flex', flexDirection: 'column', gap: 18,
          }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 10 }}>
                {levelIdx === 0 ? '⭐' : levelIdx === 1 ? '🔥' : '⊕'}
              </div>
              <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8 }}>
                Level {levelIdx + 1} of {NETWORK_LEVELS.length}
              </div>
              <h2 style={{ fontSize: isDesktop ? 24 : 18, fontWeight: 800, color: '#e0f2fe', margin: '0 0 10px' }}>
                {level.title}
              </h2>
              <span style={{
                fontSize: 11, color: '#38bdf8', fontWeight: 700,
                background: 'rgba(56,189,248,.1)', border: '1px solid rgba(56,189,248,.2)',
                borderRadius: 20, padding: '5px 16px', display: 'inline-block',
              }}>{level.concept}</span>
            </div>

            {/* Two-col on desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr', gap: 16 }}>
              {/* Mission */}
              <div style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>🎯 Mission</div>
                <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{level.objective}</p>
              </div>

              {/* Legend */}
              <div style={{ background: 'rgba(7,21,37,.7)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 14, padding: '16px' }}>
                <div style={{ fontSize: 9, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>📡 Node Legend</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    'server', 'client', 'cracked', 'empty',
                    ...(level.deepWater.length ? ['water'] : []),
                    ...(level.packets.length  ? ['packet'] : []),
                    ...(level.firewall        ? ['firewall'] : []),
                    ...(level.splitter        ? ['splitter'] : []),
                  ].map(key => {
                    const m = CELL_META[key];
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                          background: m.bg, border: `1.5px solid ${m.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                          boxShadow: m.glow ? `0 0 8px ${m.glow}40` : 'none',
                        }}>{m.emoji}</div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8' }}>{m.label}</div>
                          <div style={{ fontSize: 9, color: '#475569' }}>{m.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* How to play */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(14,165,233,.07), rgba(56,189,248,.03))',
              border: '1px solid rgba(56,189,248,.18)', borderRadius: 14, padding: '16px',
            }}>
              <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>🖱️ How to Play</div>
              <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : '1fr', gap: 12 }}>
                {[
                  { step: '1', icon: '👆', text: 'Click & hold on the Server node (or any connected node) to begin routing.' },
                  { step: '2', icon: '➡️', text: 'Drag through adjacent cells — the cable follows your path automatically.' },
                  { step: '3', icon: '⚡', text: 'Hit "Test Connection" when all cables are laid to evaluate your network.' },
                ].map(({ step, icon, text }) => (
                  <div key={step} style={{ display: 'flex', gap: 10, background: 'rgba(2,12,27,.4)', borderRadius: 10, padding: '10px 12px' }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, lineHeight: 1.65 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget + XP row */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: 'rgba(7,21,37,.6)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Cable Budget</div>
                  <div>
                    <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: '#38bdf8' }}>{level.budget}</span>
                    <span style={{ fontSize: 9, color: '#475569', marginLeft: 5 }}>units</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>XP Reward</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 800, color: '#fbbf24' }}>+{level.scoreXP}</div>
                </div>
              </div>
            </div>

            <button className="NA_btn" onClick={() => setPhase(NETWORK_PHASES.PLAYING)} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14, color: '#020c1b',
              background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
              padding: '16px', borderRadius: 14, textTransform: 'uppercase', letterSpacing: 1.5,
              boxShadow: '0 8px 28px rgba(14,165,233,.35)',
            }}>
              Start Network Deployment →
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════ PLAYING ══════════════════════ */}
      {phase === NETWORK_PHASES.PLAYING && (
        <div style={{
          flex: 1, display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          overflow: 'hidden', minHeight: 0,
        }}>

          {/* ── Sidebar ── */}
          <aside style={{
            width: isDesktop ? 280 : '100%',
            flexShrink: 0,
            background: 'rgba(5,15,30,0.8)',
            borderRight: isDesktop ? '1px solid rgba(56,189,248,.1)' : 'none',
            borderBottom: isDesktop ? 'none' : '1px solid rgba(56,189,248,.1)',
            display: 'flex', flexDirection: 'column', gap: 12,
            padding: isDesktop ? '18px 16px' : '10px 14px',
            overflowY: isDesktop ? 'auto' : 'visible',
          }}>
            {/* Mission summary card */}
            <div style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(56,189,248,.14)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 8, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>🎯 Active Mission</div>
              <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>
                {levelIdx === 0
                  ? `Collect all ${level.packets.length} data packets ⭐, then connect all ${level.clients.length} client igloos to the server.`
                  : levelIdx === 1
                    ? 'Route through the Firewall 🔥 first, then build a redundant ring topology to survive the Glacier Shift.'
                    : `Use the Splitter ⊕ to branch cables efficiently. Avoid unnecessary Deep Water 🌊 (costs 2× budget).`}
              </p>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Clients */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>Clients Online</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  {level.clients.map((cl, i) => {
                    const online = bfsReachable(level.server.r, level.server.c, cl.r, cl.c, paths) &&
                      (levelIdx !== 1 || firewallUnlocked);
                    return (
                      <div key={i} style={{
                        width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11,
                        background: online ? 'rgba(16,185,129,.2)' : 'rgba(255,255,255,.05)',
                        border: `1px solid ${online ? 'rgba(16,185,129,.5)' : 'rgba(255,255,255,.08)'}`,
                        color: online ? '#4ade80' : '#334155',
                      }}>
                        {online ? '✓' : (i + 1)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Packets */}
              {level.packets.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>Data Packets</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: collectedPackets === level.packets.length ? '#4ade80' : '#fbbf24', fontFamily: 'monospace' }}>
                    {collectedPackets}/{level.packets.length} ⭐
                  </span>
                </div>
              )}

              {/* Firewall */}
              {level.firewall && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>Firewall</span>
                  <span style={{
                    fontSize: 9, fontWeight: 800, padding: '2px 9px', borderRadius: 20,
                    background: firewallUnlocked ? 'rgba(16,185,129,.15)' : 'rgba(239,68,68,.1)',
                    color: firewallUnlocked ? '#10b981' : '#ef4444',
                    border: `1px solid ${firewallUnlocked ? 'rgba(16,185,129,.3)' : 'rgba(239,68,68,.2)'}`,
                  }}>
                    {firewallUnlocked ? '🔓 Cleared' : '🔒 Locked'}
                  </span>
                </div>
              )}

              {/* Budget bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 10, color: '#64748b', fontWeight: 700 }}>
                  <span>Cable Budget</span>
                  <span style={{ fontFamily: 'monospace', color: budgetPct <= 25 ? '#ef4444' : '#38bdf8' }}>{budget}/{level.budget}</span>
                </div>
                <div style={{ height: 7, background: 'rgba(255,255,255,.06)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 10, transition: 'width .15s',
                    width: `${budgetPct}%`,
                    background: budgetPct > 50 ? '#0ea5e9' : budgetPct > 25 ? '#f59e0b' : '#ef4444',
                  }} />
                </div>
              </div>
            </div>

            {/* IT Concept hint — desktop only */}
            {isDesktop && (
              <div style={{
                marginTop: 'auto',
                background: 'rgba(14,165,233,.04)', border: '1px solid rgba(56,189,248,.08)',
                borderRadius: 10, padding: '10px 12px',
              }}>
                <div style={{ fontSize: 8, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 5 }}>💡 IT Concept</div>
                <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.65, margin: 0 }}>{level.concept}: {level.completionHint?.slice(0, 120)}...</p>
              </div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button className="NA_btn" onClick={clearNetwork} style={{
                flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10,
                color: '#94a3b8', background: 'rgba(255,255,255,.04)',
                border: '1px solid rgba(255,255,255,.08)', borderRadius: 9, padding: '9px',
              }}>🗑 Reset</button>
              <button className="NA_btn" onClick={evaluateLevel} style={{
                flex: 2, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 10,
                borderRadius: 9, padding: '9px',
                color: '#020c1b',
                background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
                boxShadow: '0 4px 16px rgba(14,165,233,.3)',
              }}>⚡ Test Connection</button>
            </div>
          </aside>

          {/* ── Grid area ── */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: isDesktop ? '20px 24px' : '12px 12px',
            gap: 12, overflow: 'hidden',
          }}>

            {/* Draw tip */}
            {showTip && (
              <div style={{
                fontSize: 11, color: '#38bdf8', fontWeight: 700, padding: '7px 16px',
                background: 'rgba(56,189,248,.08)', border: '1px solid rgba(56,189,248,.18)',
                borderRadius: 20, animation: 'tipBlink 2s ease-in-out infinite',
                textAlign: 'center', flexShrink: 0,
              }}>
                🖱️ Click & drag from the <strong>Server node</strong> 🖥️ to route cables
              </div>
            )}

            {/* Grid wrapper: square aspect ratio */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: isDesktop ? 500 : 340,
              aspectRatio: '1 / 1',
              flexShrink: 0,
            }}>
              {/* SVG cable overlay */}
              <CableOverlay paths={paths} currentPath={currentPath} />

              {/* CSS Grid of cells */}
              <div
                ref={gridRef}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gridTemplateRows: 'repeat(6, 1fr)',
                  gap: isDesktop ? 4 : 3,
                  width: '100%', height: '100%',
                  userSelect: 'none', touchAction: 'none',
                }}
              >
                {grid.map(row =>
                  row.map(cell => {
                    const inPath   = isPathOnCell(cell.r, cell.c);
                    const isLast   = isLastActive(cell.r, cell.c);
                    const meta     = CELL_META[cell.collected ? 'empty' : cell.type];
                    const isServer = cell.type === 'server';

                    return (
                      <div
                        key={`${cell.r}-${cell.c}`}
                        data-na-cell="true"
                        data-r={cell.r}
                        data-c={cell.c}
                        className="NA_cell"
                        onMouseDown={(e) => { e.preventDefault(); handleStartDraw(cell.r, cell.c); }}
                        onMouseEnter={() => handleCellHover(cell.r, cell.c)}
                        style={{
                          borderRadius: isDesktop ? 8 : 6,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: isDesktop ? 18 : 15,
                          position: 'relative',
                          cursor: cell.type === 'cracked' ? 'not-allowed' : 'crosshair',
                          background: isLast
                            ? 'rgba(125,211,252,.35)'
                            : inPath
                              ? 'rgba(14,165,233,.18)'
                              : meta.bg,
                          border: `2px solid ${isLast ? '#7dd3fc' : inPath ? 'rgba(56,189,248,.55)' : meta.border}`,
                          boxShadow: isLast
                            ? '0 0 18px rgba(125,211,252,.55), inset 0 0 10px rgba(125,211,252,.2)'
                            : isServer
                              ? '0 0 14px rgba(14,165,233,.4)'
                              : meta.glow && !inPath
                                ? `0 0 8px ${meta.glow}35`
                                : 'none',
                        }}
                      >
                        {!cell.collected && meta.emoji}
                        {/* Server pulse ring */}
                        {isServer && (
                          <div style={{
                            position: 'absolute', inset: -2, borderRadius: isDesktop ? 10 : 8,
                            border: '2px solid rgba(56,189,248,.4)',
                            animation: 'NA_glow 2s ease-in-out infinite',
                            pointerEvents: 'none',
                          }} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Grid coord hint (desktop) */}
            {isDesktop && (
              <p style={{ fontSize: 9, color: '#1e3a5f', textAlign: 'center', margin: 0, flexShrink: 0 }}>
                Drag from server or connected node • Release mouse to cancel • Reaches client = auto-commit
              </p>
            )}

            {/* Mobile-only controls */}
            {!isDesktop && (
              <div style={{ display: 'flex', gap: 8, width: '100%', flexShrink: 0 }}>
                <button className="NA_btn" onClick={clearNetwork} style={{
                  flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
                  color: '#94a3b8', background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.08)', borderRadius: 9, padding: '10px',
                }}>🗑 Reset</button>
                <button className="NA_btn" onClick={evaluateLevel} style={{
                  flex: 2, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 11,
                  color: '#020c1b', background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
                  borderRadius: 9, padding: '10px',
                }}>⚡ Test Connection</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════ GLACIER SHIFT ══════════════════════ */}
      {phase === NETWORK_PHASES.SHIFT && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: 32, gap: 20, textAlign: 'center', animation: 'NA_fade .3s ease',
        }}>
          <div style={{ fontSize: 70, animation: 'NA_shake .7s ease-in-out' }}>🌊</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fbbf24', margin: 0, textTransform: 'uppercase', letterSpacing: 2 }}>
            Glacier Shift!
          </h2>
          <p style={{ fontSize: 13, color: '#94a3b8', maxWidth: 340, lineHeight: 1.75, margin: 0 }}>{shiftMessage}</p>
          <div style={{ width: 44, height: 44, border: '3px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'NA_spin .7s linear infinite' }} />
        </div>
      )}

      {/* ══════════════════════ COMPLETED ══════════════════════ */}
      {phase === NETWORK_PHASES.COMPLETED && (
        <div style={{ flex: 1, overflowY: 'auto', animation: 'NA_fade .5s ease' }}>
          <div style={{ maxWidth: 520, margin: '0 auto', padding: isDesktop ? '32px' : '16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ fontSize: 64, marginBottom: 10 }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#4ade80', margin: '0 0 6px' }}>Network Deployed!</h2>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{level.title} — complete</p>
            </div>
            <div style={{ background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.25)', borderRadius: 14, padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>XP Earned</div>
              <div style={{ fontFamily: 'monospace', fontSize: 32, fontWeight: 800, color: '#4ade80' }}>+{level.scoreXP} XP</div>
            </div>
            <div style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>💡 Concept Learned</div>
              <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.75, margin: 0 }}>{level.completionHint}</p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="NA_btn" onClick={() => { clearNetwork(); setPhase(NETWORK_PHASES.PLAYING); }} style={{
                flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11,
                color: '#64748b', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                padding: '12px', borderRadius: 10,
              }}>Replay</button>
              <button className="NA_btn" onClick={handleNextLevel} style={{
                flex: 2, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13,
                color: '#020c1b', background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
                padding: '12px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: 1,
                boxShadow: '0 6px 20px rgba(14,165,233,.35)',
              }}>
                {levelIdx < NETWORK_LEVELS.length - 1 ? `Level ${levelIdx + 2} →` : 'Complete Mission 🎓'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ FAILED ══════════════════════ */}
      {phase === NETWORK_PHASES.FAILED && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center',
          padding: 24, gap: 16, textAlign: 'center', animation: 'NA_fade .4s ease',
        }}>
          <div style={{ fontSize: 60 }}>❌</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f87171', margin: '0 0 4px' }}>Connection Failed</h2>
          <p style={{ fontSize: 12, color: '#64748b', maxWidth: 320, lineHeight: 1.75 }}>
            {levelIdx === 1
              ? 'Your network lacked redundancy — the Glacier Shift disconnected some clients. Add a secondary ring path!'
              : levelIdx === 0 && collectedPackets < level.packets.length
                ? 'All data packets ⭐ must be collected before connecting clients. Route through them first!'
                : 'Not all Client Igloos are connected. Check your cable routing — every client needs a clear path from the server!'}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="NA_btn" onClick={() => setPhase(NETWORK_PHASES.PLAYING)} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: '#020c1b',
              background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', padding: '12px 28px', borderRadius: 10,
              boxShadow: '0 4px 16px rgba(14,165,233,.3)',
            }}>Try Again</button>
            <button className="NA_btn" onClick={() => { clearNetwork(); setPhase(NETWORK_PHASES.BRIEFING); }} style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#64748b',
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              padding: '12px 20px', borderRadius: 10,
            }}>Reset Level</button>
          </div>
        </div>
      )}

      {/* Insight Modal */}
      <InsightModal
        isOpen={showInsight}
        moduleTitle="Igloo Network Architect"
        concept="System Topology & Redundancy"
        insightText={NETWORK_INSIGHT}
        scoreXP={totalXP}
        onContinue={() => { setShowInsight(false); onComplete(totalXP); }}
      />
    </div>
  );
}
