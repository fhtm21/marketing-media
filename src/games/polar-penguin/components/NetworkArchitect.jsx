import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NETWORK_LEVELS } from '../data/networkLevels.js';
import { NETWORK_PHASES } from '../engine/phases.js';
import { SOUNDS } from '../engine/synthPlay.js';
import InsightModal from './InsightModal.jsx';

const NETWORK_INSIGHT = `Jaringan komputer modern menggunakan prinsip redundansi untuk memastikan ketersediaan layanan 24/7. Di BINUS @Bekasi Business IT, kamu akan mempelajari cara merancang infrastruktur IT yang tangguh — dari topologi jaringan hingga sistem cloud yang fault-tolerant.`;

const CELL_COLORS = {
  server: { bg: '#0ea5e9', border: '#38bdf8', emoji: '🖥️' },
  client: { bg: '#7c3aed', border: '#a78bfa', emoji: '🏠' },
  cracked: { bg: '#1c1917', border: '#292524', emoji: '💀' },
  water: { bg: '#0c4a6e', border: '#0369a1', emoji: '🌊' },
  packet: { bg: '#ca8a04', border: '#fbbf24', emoji: '⭐' },
  firewall: { bg: '#b91c1c', border: '#f87171', emoji: '🔴' },
  splitter: { bg: '#6d28d9', border: '#a78bfa', emoji: '💜' },
  empty: { bg: 'rgba(15,23,42,.6)', border: 'rgba(30,41,59,.8)', emoji: '' },
};

/**
 * NetworkArchitect — Module 2: Igloo Network Architect.
 * Grid puzzle 6x6 dengan mekanik drag-to-draw cable routing.
 *
 * @param {{ onExit:()=>void, onComplete:(score:number)=>void }} props
 */
export default function NetworkArchitect({ onExit, onComplete }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState(NETWORK_PHASES.BRIEFING);
  const [grid, setGrid] = useState([]);
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [budget, setBudget] = useState(0);
  const [collectedPackets, setCollectedPackets] = useState(0);
  const [firewallUnlocked, setFirewallUnlocked] = useState(false);
  const [shiftMessage, setShiftMessage] = useState('');
  const [showInsight, setShowInsight] = useState(false);
  const [totalXP, setTotalXP] = useState(0);

  const gridRef = useRef(null);
  const stateRef = useRef({});
  const activePathRef = useRef([]);
  const activeBudgetRef = useRef(0);

  const level = NETWORK_LEVELS[levelIdx];

  // Keep stateRef in sync (avoids event listener closure staleness)
  stateRef.current = { phase, paths, budget, level, grid, isDrawing, firewallUnlocked, collectedPackets };

  // Build the 6x6 grid from level config
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
        else if (cfg.firewall && cfg.firewall.r === r && cfg.firewall.c === c) type = 'firewall';
        else if (cfg.splitter && cfg.splitter.r === r && cfg.splitter.c === c) type = 'splitter';
        row.push({ r, c, type, collected: false });
      }
      g.push(row);
    }
    return g;
  }, []);

  useEffect(() => {
    const cfg = NETWORK_LEVELS[levelIdx];
    setGrid(buildGrid(cfg));
    setPaths([]);
    setCurrentPath([]);
    setBudget(cfg.budget);
    setCollectedPackets(0);
    setFirewallUnlocked(false);
    activePathRef.current = [];
    activeBudgetRef.current = cfg.budget;
    setPhase(NETWORK_PHASES.BRIEFING);
  }, [levelIdx, buildGrid]);

  // BFS to check if a cell is reachable from server via committed paths
  const isCellOnline = useCallback((r, c, pathsToCheck) => {
    const { level } = stateRef.current;
    if (level.server.r === r && level.server.c === c) return true;
    const visited = new Set([`${level.server.r},${level.server.c}`]);
    const queue = [[level.server.r, level.server.c]];
    while (queue.length > 0) {
      const [cr, cc] = queue.shift();
      if (cr === r && cc === c) return true;
      (pathsToCheck || []).forEach(path => {
        path.forEach((cell, i) => {
          if (cell.r === cr && cell.c === cc) {
            [i > 0 ? path[i - 1] : null, i < path.length - 1 ? path[i + 1] : null]
              .filter(Boolean)
              .forEach(n => {
                const key = `${n.r},${n.c}`;
                if (!visited.has(key)) { visited.add(key); queue.push([n.r, n.c]); }
              });
          }
        });
      });
    }
    return false;
  }, []);

  const getPathCost = (path) => {
    let cost = 0;
    for (let i = 1; i < path.length; i++) {
      cost += level.deepWater.some(dw => dw.r === path[i].r && dw.c === path[i].c) ? 2 : 1;
    }
    return cost;
  };

  const getCommittedCost = (ps) => ps.reduce((acc, p) => acc + getPathCost(p), 0);

  const countOnlineClients = (pathsToCheck) => {
    let count = 0;
    level.clients.forEach(cl => {
      const hasFirewallAccess = levelIdx !== 1 || stateRef.current.firewallUnlocked;
      if (isCellOnline(cl.r, cl.c, pathsToCheck) && hasFirewallAccess) count++;
    });
    return count;
  };

  // ── Drawing event handlers ──
  const handleStartDraw = useCallback((r, c) => {
    const { phase, level, paths } = stateRef.current;
    if (phase !== NETWORK_PHASES.PLAYING) return;
    const online = isCellOnline(r, c, paths);
    const isServer = level.server.r === r && level.server.c === c;
    const isSplitterOnline = level.splitter && level.splitter.r === r && level.splitter.c === c && online;
    if (!isServer && !online && !isSplitterOnline) { SOUNDS.wrong(); return; }
    const base = level.budget - getCommittedCost(paths);
    setIsDrawing(true);
    activePathRef.current = [{ r, c }];
    activeBudgetRef.current = base;
    setBudget(base);
    setCurrentPath([{ r, c }]);
    SOUNDS.cable(1);
  }, [isCellOnline]);

  const handleCellHover = useCallback((r, c) => {
    const { isDrawing, level, paths, grid } = stateRef.current;
    if (!isDrawing || activePathRef.current.length === 0) return;
    if (level.cracked.some(cr => cr.r === r && cr.c === c)) return;
    const last = activePathRef.current[activePathRef.current.length - 1];
    if (last.r === r && last.c === c) return;

    // Backtrack / undo
    const existIdx = activePathRef.current.findIndex(cell => cell.r === r && cell.c === c);
    if (existIdx !== -1 && existIdx < activePathRef.current.length - 1) {
      activePathRef.current = activePathRef.current.slice(0, existIdx + 1);
      const base = level.budget - getCommittedCost(paths);
      activeBudgetRef.current = base - getPathCost(activePathRef.current);
      setBudget(activeBudgetRef.current);
      setCurrentPath([...activePathRef.current]);
      SOUNDS.cableUndo();
      return;
    }

    const rowDiff = Math.abs(last.r - r);
    const colDiff = Math.abs(last.c - c);
    if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) return;

    const isDeepWater = level.deepWater.some(dw => dw.r === r && dw.c === c);
    const cost = isDeepWater ? 2 : 1;
    if (activeBudgetRef.current - cost < 0) {
      SOUNDS.budgetOver();
      setIsDrawing(false);
      setCurrentPath([]);
      activePathRef.current = [];
      const restoredBudget = level.budget - getCommittedCost(paths);
      setBudget(restoredBudget);
      return;
    }

    activeBudgetRef.current -= cost;
    activePathRef.current = [...activePathRef.current, { r, c }];
    setBudget(activeBudgetRef.current);
    setCurrentPath([...activePathRef.current]);
    SOUNDS.cable(activePathRef.current.length);

    // Packet collection
    if (level.packets.some(p => p.r === r && p.c === c) && !grid[r][c].collected) {
      setGrid(prev => {
        const ng = prev.map(row => row.map(cell => ({ ...cell })));
        ng[r][c].collected = true;
        return ng;
      });
      setCollectedPackets(prev => prev + 1);
      SOUNDS.packetCollect();
    }
    // Firewall activation
    if (level.firewall && level.firewall.r === r && level.firewall.c === c) {
      setFirewallUnlocked(true);
      SOUNDS.firewallUnlock();
    }

    // Auto-commit: reached a client or splitter
    const reachedClient = level.clients.find(cl => cl.r === r && cl.c === c);
    const reachedSplitter = level.splitter && level.splitter.r === r && level.splitter.c === c;
    if (reachedClient || reachedSplitter) {
      setPaths(prev => [...prev, [...activePathRef.current]]);
      setCurrentPath([]);
      setIsDrawing(false);
      activePathRef.current = [];
      SOUNDS.clientConnect();
    }
  }, []);

  const handleEndDraw = useCallback(() => {
    const { isDrawing, level, paths } = stateRef.current;
    if (isDrawing) {
      const restored = level.budget - getCommittedCost(paths);
      setBudget(restored);
    }
    setIsDrawing(false);
    setCurrentPath([]);
    activePathRef.current = [];
  }, []);

  // Touch/mouse coordinate mapper
  const processMoveAtCoords = useCallback((clientX, clientY) => {
    if (!stateRef.current.isDrawing || !gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const col = Math.floor((clientX - rect.left) / (rect.width / 6));
    const row = Math.floor((clientY - rect.top) / (rect.height / 6));
    if (row >= 0 && row < 6 && col >= 0 && col < 6) handleCellHover(row, col);
  }, [handleCellHover]);

  // Bind global drag events
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const getCoordsFromEl = (el) => {
      const cell = el?.closest('[data-r]');
      if (!cell) return null;
      return { r: +cell.dataset.r, c: +cell.dataset.c };
    };

    const onTouchStart = (e) => {
      const t = e.touches[0];
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const coords = getCoordsFromEl(el);
      if (coords) handleStartDraw(coords.r, coords.c);
    };
    const onTouchMove = (e) => {
      if (stateRef.current.isDrawing && e.cancelable) e.preventDefault();
      processMoveAtCoords(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEndDraw();
    const onMouseDown = (e) => {
      const coords = getCoordsFromEl(document.elementFromPoint(e.clientX, e.clientY));
      if (coords) handleStartDraw(coords.r, coords.c);
    };
    const onMouseMove = (e) => processMoveAtCoords(e.clientX, e.clientY);
    const onMouseUp = () => handleEndDraw();

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [handleStartDraw, handleCellHover, handleEndDraw, processMoveAtCoords]);

  // Evaluate submission
  const evaluateLevel = () => {
    const { paths, level, firewallUnlocked, collectedPackets } = stateRef.current;

    // Level 1: all packets must be collected
    if (levelIdx === 0 && collectedPackets < level.packets.length) {
      SOUNDS.wrong();
      return;
    }

    // Level 2: Glacier Shift test
    if (levelIdx === 1) {
      setPhase(NETWORK_PHASES.SHIFT);
      setShiftMessage('⚠️ Glacier Shift mengguncang jaringan! Sel (3,2) terputus...');
      SOUNDS.wrong();

      setTimeout(() => {
        const breakR = 3, breakC = 2;
        const severed = paths
          .map(p => p.filter(cell => !(cell.r === breakR && cell.c === breakC)))
          .filter(p => p.length > 1);

        const stillOnline = level.clients.every(cl => {
          return isCellOnline(cl.r, cl.c, severed) && firewallUnlocked;
        });

        if (stillOnline) {
          setShiftMessage('✅ Jaringan redundan berhasil bertahan! Loop aktif!');
          SOUNDS.levelUp();
          setTimeout(() => setPhase(NETWORK_PHASES.COMPLETED), 1200);
        } else {
          setShiftMessage('❌ Beberapa klien offline! Jaringan tidak cukup redundan.');
          SOUNDS.wrong();
          setTimeout(() => setPhase(NETWORK_PHASES.FAILED), 1200);
        }
      }, 2200);
      return;
    }

    // Level 1 & 3: check all clients online
    const onlineCount = countOnlineClients(paths);
    if (onlineCount === level.clients.length) {
      SOUNDS.levelUp();
      setPhase(NETWORK_PHASES.COMPLETED);
    } else {
      SOUNDS.wrong();
      setPhase(NETWORK_PHASES.FAILED);
    }
  };

  const handleNextLevel = () => {
    if (levelIdx < NETWORK_LEVELS.length - 1) {
      setLevelIdx(i => i + 1);
    } else {
      const earned = NETWORK_LEVELS.reduce((sum, l) => sum + l.scoreXP, 0);
      setTotalXP(earned);
      setShowInsight(true);
    }
  };

  const clearNetwork = () => {
    setPaths([]);
    setCurrentPath([]);
    setBudget(level.budget);
    activePathRef.current = [];
    activeBudgetRef.current = level.budget;
    setCollectedPackets(0);
    setFirewallUnlocked(false);
    setGrid(buildGrid(level));
  };

  // Check which cells are part of any path
  const cellInPath = (r, c, pathList) =>
    pathList.some(p => p.some(cell => cell.r === r && cell.c === c));
  const cellInCurrentPath = (r, c) =>
    currentPath.some(cell => cell.r === r && cell.c === c);

  const onlineClients = countOnlineClients(paths);

  return (
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
      background: '#020c1b', fontFamily: "'Nunito', sans-serif", color: '#fff',
      position: 'relative', overflowY: 'auto',
    }}>
      <style>{`
        @keyframes NA_fade   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes NA_pulse  { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes NA_shake  { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes NA_glow   { 0%,100%{box-shadow:0 0 8px rgba(56,189,248,.3)} 50%{box-shadow:0 0 22px rgba(56,189,248,.7)} }
        .NA_btn { transition:transform .18s, filter .18s; border:none; cursor:pointer; }
        .NA_btn:hover { filter:brightness(1.12); transform:translateY(-1px); }
        .NA_btn:active { transform:scale(.96); }
        .NA_btn:disabled { opacity:.4; cursor:not-allowed; transform:none; filter:none; }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 16px', borderBottom: '1px solid rgba(56,189,248,.12)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🌐</span>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1 }}>
              Network Architect
            </span>
            <span style={{ fontSize: 9, color: '#475569', fontWeight: 700, display: 'block' }}>
              Level {levelIdx + 1} / {NETWORK_LEVELS.length}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Budget indicator */}
          <div style={{
            background: 'rgba(2,12,27,.8)', border: `1px solid ${budget <= 3 ? 'rgba(239,68,68,.4)' : 'rgba(56,189,248,.2)'}`,
            padding: '4px 10px', borderRadius: 20,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 9, color: '#64748b', fontWeight: 700 }}>Kabel:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: budget <= 3 ? '#ef4444' : '#38bdf8', fontSize: 13 }}>{budget}</span>
          </div>
          <button className="NA_btn" onClick={onExit} style={{
            fontFamily: "'Nunito', sans-serif", padding: '5px 10px',
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 8, fontSize: 10, color: '#94a3b8', fontWeight: 700,
          }}>✕</button>
        </div>
      </div>

      {/* ── BRIEFING ── */}
      {phase === NETWORK_PHASES.BRIEFING && (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, animation: 'NA_fade .4s ease both' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🌐</div>
            <span style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, display: 'block', marginBottom: 4 }}>
              Level {levelIdx + 1}
            </span>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#e0f2fe', margin: '0 0 4px' }}>{level.title}</h3>
            <p style={{ fontSize: 10, color: '#38bdf8', fontWeight: 700, margin: 0 }}>{level.concept}</p>
          </div>

          <div style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 12, padding: '12px 14px' }}>
            <p style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 6px' }}>🎯 Misi</p>
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{level.objective}</p>
          </div>

          {/* Legend */}
          <div style={{ background: 'rgba(7,21,37,.6)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 12, padding: '12px 14px' }}>
            <p style={{ fontSize: 9, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 10px' }}>Legenda Peta</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[
                { key: 'server', label: '🖥️ Server Igloo', desc: 'Titik awal kabel' },
                { key: 'client', label: '🏠 Client Igloo', desc: 'Tujuan koneksi' },
                { key: 'cracked', label: '💀 Es Retak', desc: 'Tidak bisa dilewati' },
                { key: 'water', label: '🌊 Deep Water', desc: 'Cost 2x kabel' },
                ...(level.packets.length ? [{ key: 'packet', label: '⭐ Data Packet', desc: 'Wajib dikumpulkan' }] : []),
                ...(level.firewall ? [{ key: 'firewall', label: '🔴 Firewall', desc: 'Harus dilalui dulu' }] : []),
                ...(level.splitter ? [{ key: 'splitter', label: '💜 Splitter', desc: 'Titik cabang jalur' }] : []),
              ].map(({ key, label, desc }) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: CELL_COLORS[key].bg,
                    border: `1px solid ${CELL_COLORS[key].border}`,
                    flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                  }}>
                    {CELL_COLORS[key].emoji}
                  </div>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', margin: 0 }}>{label}</p>
                    <p style={{ fontSize: 8, color: '#475569', margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(7,21,37,.5)', border: '1px solid rgba(56,189,248,.1)', borderRadius: 10, padding: '8px 14px', display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <span style={{ color: '#64748b' }}>Budget Kabel:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#38bdf8' }}>{level.budget} unit</span>
          </div>

          <button className="NA_btn" onClick={() => setPhase(NETWORK_PHASES.PLAYING)} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: '#020c1b',
            background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
            padding: '14px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1,
          }}>
            Mulai Deployment Jaringan →
          </button>
        </div>
      )}

      {/* ── PLAYING ── */}
      {phase === NETWORK_PHASES.PLAYING && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 12px', gap: 10 }}>
          {/* Status bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700 }}>
            <span style={{ color: '#64748b' }}>Klien online: <span style={{ color: onlineClients === level.clients.length ? '#4ade80' : '#fbbf24', fontFamily: 'monospace' }}>{onlineClients}/{level.clients.length}</span></span>
            {level.packets.length > 0 && (
              <span style={{ color: '#64748b' }}>Paket: <span style={{ color: collectedPackets === level.packets.length ? '#4ade80' : '#fbbf24', fontFamily: 'monospace' }}>{collectedPackets}/{level.packets.length} ⭐</span></span>
            )}
            {level.firewall && (
              <span style={{ color: firewallUnlocked ? '#4ade80' : '#94a3b8' }}>{firewallUnlocked ? '🔓 FW' : '🔒 FW'}</span>
            )}
          </div>

          {/* Grid */}
          <div
            ref={gridRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridTemplateRows: 'repeat(6, 1fr)',
              gap: 3,
              flex: 1,
              minHeight: 260,
              userSelect: 'none',
              touchAction: 'none',
            }}
          >
            {grid.map((row) =>
              row.map((cell) => {
                const inCommitted = cellInPath(cell.r, cell.c, paths);
                const inActive = cellInCurrentPath(cell.r, cell.c);
                const colors = CELL_COLORS[cell.collected ? 'empty' : cell.type];

                return (
                  <div
                    key={`${cell.r}-${cell.c}`}
                    data-r={cell.r}
                    data-c={cell.c}
                    style={{
                      borderRadius: 6,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, fontFamily: 'sans-serif',
                      background: inActive
                        ? 'rgba(56,189,248,.4)'
                        : inCommitted
                          ? 'rgba(56,189,248,.25)'
                          : colors.bg,
                      border: `2px solid ${inActive ? '#38bdf8' : inCommitted ? 'rgba(56,189,248,.6)' : colors.border}`,
                      boxShadow: inActive ? '0 0 10px rgba(56,189,248,.5)' : 'none',
                      transition: 'background .1s, border .1s, box-shadow .1s',
                      cursor: cell.type === 'cracked' ? 'not-allowed' : 'crosshair',
                      position: 'relative',
                    }}
                  >
                    {cell.collected ? '' : colors.emoji}
                    {/* Cable dot overlay */}
                    {(inCommitted || inActive) && (
                      <div style={{
                        position: 'absolute', width: 6, height: 6, borderRadius: '50%',
                        background: '#38bdf8', boxShadow: '0 0 6px #38bdf8',
                      }} />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="NA_btn" onClick={clearNetwork} style={{
              flex: 1, fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 10,
              color: '#94a3b8', background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '8px',
            }}>
              Reset Kabel
            </button>
            <button
              className="NA_btn"
              onClick={evaluateLevel}
              style={{
                flex: 2, fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12,
                color: '#020c1b', background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
                borderRadius: 8, padding: '8px', textTransform: 'uppercase', letterSpacing: 1,
              }}
            >
              Uji Konektivitas →
            </button>
          </div>

          <p style={{ fontSize: 9, color: '#334155', textAlign: 'center', margin: 0 }}>
            Drag dari Server/node aktif untuk membentangkan kabel. Klik "Uji Konektivitas" setelah selesai.
          </p>
        </div>
      )}

      {/* ── SHIFT (Glacier Shift) ── */}
      {phase === NETWORK_PHASES.SHIFT && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 52, animation: 'NA_shake .6s ease-in-out' }}>🧊</div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fbbf24', margin: 0 }}>GLACIER SHIFT!</h3>
          <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.65, maxWidth: 280 }}>{shiftMessage}</p>
          <div style={{ width: 36, height: 36, border: '3px solid #38bdf8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'NA_pulse .8s linear infinite' }} />
        </div>
      )}

      {/* ── COMPLETED ── */}
      {phase === NETWORK_PHASES.COMPLETED && (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 14, animation: 'NA_fade .5s ease both' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>✅</div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#4ade80', margin: '0 0 4px' }}>Level {levelIdx + 1} Selesai!</h3>
            <p style={{ fontSize: 10, color: '#64748b', margin: 0 }}>{level.title}</p>
          </div>
          <div style={{ background: 'rgba(16,185,129,.08)', border: '1px solid rgba(16,185,129,.2)', borderRadius: 12, padding: '12px 16px', textAlign: 'center' }}>
            <p style={{ fontSize: 9, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 4px' }}>XP Diperoleh</p>
            <p style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 800, color: '#4ade80', margin: 0 }}>+{level.scoreXP} XP</p>
          </div>
          <div style={{ background: 'rgba(14,165,233,.06)', border: '1px solid rgba(56,189,248,.15)', borderRadius: 12, padding: '12px 14px' }}>
            <p style={{ fontSize: 9, color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase', margin: '0 0 6px' }}>💡 Konsep IT</p>
            <p style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{level.completionHint}</p>
          </div>
          <button className="NA_btn" onClick={handleNextLevel} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 13, color: '#020c1b',
            background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
            padding: '14px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: 1,
          }}>
            {levelIdx < NETWORK_LEVELS.length - 1 ? `Level ${levelIdx + 2} →` : 'Selesaikan Misi 🎓'}
          </button>
          <button className="NA_btn" onClick={clearNetwork} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#64748b',
            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
            padding: '10px', borderRadius: 10,
          }}>
            Ulangi Level
          </button>
        </div>
      )}

      {/* ── FAILED ── */}
      {phase === NETWORK_PHASES.FAILED && (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14, textAlign: 'center', animation: 'NA_fade .4s ease both' }}>
          <div style={{ fontSize: 48 }}>❌</div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#f87171', margin: '0 0 4px' }}>Koneksi Gagal!</h3>
          {levelIdx === 1
            ? <p style={{ fontSize: 11, color: '#94a3b8', maxWidth: 280 }}>Jaringanmu tidak cukup redundan — saat Glacier Shift terjadi, ada klien yang kehilangan koneksi. Buat loop backup!</p>
            : <p style={{ fontSize: 11, color: '#94a3b8', maxWidth: 280 }}>Belum semua Client Igloo terhubung ke server{level.packets.length ? ', atau Data Packet belum dikumpulkan' : ''}. Coba lagi!</p>
          }
          <button className="NA_btn" onClick={() => setPhase(NETWORK_PHASES.PLAYING)} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 12, color: '#020c1b',
            background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)',
            padding: '12px 28px', borderRadius: 10, textTransform: 'uppercase',
          }}>
            Coba Lagi
          </button>
          <button className="NA_btn" onClick={() => setLevelIdx(levelIdx)} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: 11, color: '#64748b',
            background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
            padding: '10px 24px', borderRadius: 10,
          }}>
            Reset & Mulai Ulang
          </button>
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
