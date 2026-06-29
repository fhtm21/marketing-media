import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SORTER_ITEM_TYPES, SORTER_TABLES } from '../../data/sorterItems.js';
import { SOUNDS } from '../../engine/synthPlay.js';

/** Berapa lama (ms) grace time setelah item di-deselect sebelum miss */
const DESELECT_GRACE_MS = 2800;
/** Berapa lama (ms) failsafe miss saat item sedang di-drag */
const DRAG_FAILSAFE_MS  = 9000;

/**
 * SorterCanvas — Game engine untuk Data Stream Sorter.
 * Mengelola: spawning item, CSS fall animation, drag-drop, click-select,
 * keyboard shortcuts, miss detection via per-item timers, dan drop zones.
 *
 * @param {{
 *   level: import('../../data/sorterItems.js').SorterLevel,
 *   isPlaying: boolean,
 *   isDesktop: boolean,
 *   onItemSorted:    (isCorrect: boolean) => void,
 *   onItemMissed:    () => void,
 *   onLevelComplete: (correct: number, total: number) => void,
 * }} props
 */
export default function SorterCanvas({
  level, isPlaying, isDesktop,
  onItemSorted, onItemMissed, onLevelComplete,
}) {
  const TABLE_H = isDesktop ? 110 : 92;

  // ── State ──────────────────────────────────────────────────────────────────
  const [items,        setItems]        = useState([]);   // falling items
  const [grabbedItem,  setGrabbedItem]  = useState(null); // dragged item
  const [selectedId,   setSelectedId]   = useState(null); // click-selected id
  const [tableFeedback, setTableFeedback] = useState({}); // tableId → 'correct'|'wrong'|null

  // ── Refs ───────────────────────────────────────────────────────────────────
  const spawnCountRef    = useRef(0);
  const processedRef     = useRef(0);
  const correctRef       = useRef(0);
  const pendingMissRef   = useRef(0); // queued miss callbacks
  const missTimersRef    = useRef({}); // itemId → timeoutId
  const canvasRef        = useRef(null);
  const spawnTimerRef    = useRef(null);

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => () => {
    clearInterval(spawnTimerRef.current);
    Object.values(missTimersRef.current).forEach(clearTimeout);
  }, []);

  // ── Process pending misses AFTER each render ──────────────────────────────
  // (Avoids calling side-effects inside state updaters)
  useEffect(() => {
    if (pendingMissRef.current <= 0) return;
    const count = pendingMissRef.current;
    pendingMissRef.current = 0;
    for (let i = 0; i < count; i++) {
      SOUNDS.itemMiss();
      onItemMissed();
    }
  });

  // ── Check level completion ────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;
    if (
      spawnCountRef.current >= level.totalItems &&
      processedRef.current  >= level.totalItems &&
      items.length === 0 &&
      !grabbedItem
    ) {
      onLevelComplete(correctRef.current, level.totalItems);
    }
  }, [items, grabbedItem, isPlaying, level, onLevelComplete]);

  // ── Helpers: schedule / cancel miss timer ─────────────────────────────────
  const scheduleMiss = useCallback((itemId, delayMs) => {
    clearTimeout(missTimersRef.current[itemId]);
    missTimersRef.current[itemId] = setTimeout(() => {
      delete missTimersRef.current[itemId];
      // Remove from falling items (if still there)
      setItems(prev => {
        if (!prev.find(i => i.id === itemId)) return prev;
        pendingMissRef.current++;
        processedRef.current++;
        return prev.filter(i => i.id !== itemId);
      });
      // Remove from grabbed (if it's the grabbed one)
      setGrabbedItem(prev => {
        if (prev?.id !== itemId) return prev;
        pendingMissRef.current++;
        processedRef.current++;
        return null;
      });
      setSelectedId(prev => prev === itemId ? null : prev);
    }, delayMs);
  }, []);

  const cancelMiss = useCallback((itemId) => {
    clearTimeout(missTimersRef.current[itemId]);
    delete missTimersRef.current[itemId];
  }, []);

  // ── Item spawning ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isPlaying) return;

    // Reset all game state
    spawnCountRef.current = 0;
    processedRef.current  = 0;
    correctRef.current    = 0;
    pendingMissRef.current = 0;
    Object.values(missTimersRef.current).forEach(clearTimeout);
    missTimersRef.current = {};
    setItems([]);
    setGrabbedItem(null);
    setSelectedId(null);
    setTableFeedback({});

    const doSpawn = () => {
      if (spawnCountRef.current >= level.totalItems) {
        clearInterval(spawnTimerRef.current);
        return;
      }
      const type = SORTER_ITEM_TYPES[Math.floor(Math.random() * SORTER_ITEM_TYPES.length)];
      const id   = `ds_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const xPct = 8 + Math.random() * 72; // 8%–80% canvas width

      const item = {
        id, xPct,
        typeId:      type.id,
        emoji:       type.emoji,
        shortLabel:  type.shortLabel,
        color:       type.color,
        bg:          type.bg,
        border:      type.border,
        correctTable: type.correctTable,
        fallMs:      level.fallDurationMs,
        spawnedAt:   Date.now(),
        mockRecords: type.mockRecords,
      };

      setItems(prev => [...prev, item]);
      spawnCountRef.current++;

      // Miss fires when item reaches table zone top (82% of animation)
      scheduleMiss(id, Math.round(level.fallDurationMs * 0.82));
    };

    doSpawn(); // spawn first item immediately
    spawnTimerRef.current = setInterval(doSpawn, level.spawnIntervalMs);
    return () => clearInterval(spawnTimerRef.current);
  }, [isPlaying, level]); // eslint-disable-line


  // ── Sort an item into a table ─────────────────────────────────────────────
  const sortItem = useCallback((item, tableId) => {
    cancelMiss(item.id);

    const isCorrect = item.correctTable === tableId;

    // Flash table feedback
    setTableFeedback(prev => ({ ...prev, [tableId]: isCorrect ? 'correct' : 'wrong' }));
    setTimeout(() => setTableFeedback(prev => ({ ...prev, [tableId]: null })), 580);

    setItems(prev => prev.filter(i => i.id !== item.id));
    setGrabbedItem(null);
    setSelectedId(null);

    processedRef.current++;
    if (isCorrect) { correctRef.current++; SOUNDS.dropCorrect(); }
    else SOUNDS.dropWrong();

    onItemSorted(isCorrect);
  }, [cancelMiss, onItemSorted]);

  // ── Keyboard handler (1/2/3 for table sort) ───────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const idx = ['1','2','3'].indexOf(e.key);
      if (idx === -1) return;
      const table = SORTER_TABLES[idx];
      if (!table) return;

      if (selectedId) {
        const it = items.find(i => i.id === selectedId);
        if (it) sortItem(it, table.id);
      } else if (grabbedItem) {
        sortItem(grabbedItem, table.id);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedId, grabbedItem, items, sortItem]);

  // ── Click item: toggle select (pause/resume animation) ───────────────────
  const handleItemClick = useCallback((e, item) => {
    e.stopPropagation();

    if (selectedId === item.id) {
      // Deselect: restart with grace time
      setSelectedId(null);
      scheduleMiss(item.id, DESELECT_GRACE_MS);
      return;
    }
    // Deselect previous
    if (selectedId) {
      const prev = items.find(i => i.id === selectedId);
      if (prev) scheduleMiss(prev.id, DESELECT_GRACE_MS);
    }
    // Select: cancel miss timer (animation pauses in CSS)
    cancelMiss(item.id);
    setSelectedId(item.id);
    SOUNDS.cable(1);
  }, [selectedId, items, scheduleMiss, cancelMiss]);

  // ── Pointer down on item: start drag ─────────────────────────────────────
  const handleItemPointerDown = useCallback((e, item) => {
    if (e.button !== 0 && e.pointerType !== 'touch') return;
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    // Deselect any other selected item
    if (selectedId && selectedId !== item.id) {
      const prev = items.find(i => i.id === selectedId);
      if (prev) scheduleMiss(prev.id, DESELECT_GRACE_MS);
      setSelectedId(null);
    }
    cancelMiss(item.id);

    // Pull item out of falling state → grabbed state
    setItems(prev => prev.filter(i => i.id !== item.id));
    setSelectedId(null);

    const rect = e.currentTarget.getBoundingClientRect();
    setGrabbedItem({
      ...item,
      dragX:       e.clientX,
      dragY:       e.clientY,
      grabOffsetX: e.clientX - (rect.left + rect.width  / 2),
      grabOffsetY: e.clientY - (rect.top  + rect.height / 2),
    });

    scheduleMiss(item.id, DRAG_FAILSAFE_MS);
  }, [selectedId, items, cancelMiss, scheduleMiss]);

  // ── Canvas pointer move: update grabbed position ──────────────────────────
  const handlePointerMove = useCallback((e) => {
    if (!grabbedItem) return;
    setGrabbedItem(prev => prev ? { ...prev, dragX: e.clientX, dragY: e.clientY } : null);
  }, [grabbedItem]);

  // ── Canvas pointer up: drop detection ────────────────────────────────────
  const handlePointerUp = useCallback((e) => {
    if (!grabbedItem) return;

    // Detect if dropped over a table
    let droppedTableId = null;
    const tableEls = canvasRef.current?.querySelectorAll('[data-table-id]') ?? [];
    for (const el of tableEls) {
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right &&
          e.clientY >= r.top  && e.clientY <= r.bottom) {
        droppedTableId = el.getAttribute('data-table-id');
        break;
      }
    }

    if (droppedTableId) {
      sortItem(grabbedItem, droppedTableId);
    } else {
      // Drop on empty area → return item to falling (restarts from top)
      cancelMiss(grabbedItem.id);
      const returned = {
        ...grabbedItem,
        xPct:      grabbedItem.xPct,
        spawnedAt: Date.now(),
        fallMs:    grabbedItem.fallMs,
      };
      delete returned.dragX; delete returned.dragY;
      delete returned.grabOffsetX; delete returned.grabOffsetY;
      setItems(prev => [...prev, returned]);
      setGrabbedItem(null);
      scheduleMiss(returned.id, Math.round(returned.fallMs * 0.82));
    }
  }, [grabbedItem, sortItem, cancelMiss, scheduleMiss]);

  // ── Canvas click: deselect if clicking empty area ─────────────────────────
  const handleCanvasClick = useCallback(() => {
    if (!selectedId) return;
    const it = items.find(i => i.id === selectedId);
    if (it) scheduleMiss(it.id, DESELECT_GRACE_MS);
    setSelectedId(null);
  }, [selectedId, items, scheduleMiss]);

  // ── Table click: sort selected item ──────────────────────────────────────
  const handleTableClick = useCallback((e, tableId) => {
    e.stopPropagation();
    if (!selectedId) return;
    const it = items.find(i => i.id === selectedId);
    if (it) sortItem(it, tableId);
  }, [selectedId, items, sortItem]);

  const CARD_W = isDesktop ? 124 : 96;

  return (
    <div
      ref={canvasRef}
      style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        touchAction: 'none', userSelect: 'none',
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handleCanvasClick}
    >
      {/* ── Injected CSS ─────────────────────────────────────────────────── */}
      <style>{`
        @keyframes DSC_fall {
          from { top: -90px; opacity: 0; }
          7%   { opacity: 1; }
          to   { top: calc(100% - ${TABLE_H}px); opacity: 0.9; }
        }
        @keyframes DSC_select_glow {
          0%,100% { box-shadow: 0 0 0 2px rgba(251,191,36,.75), 0 6px 18px rgba(0,0,0,.4); }
          50%     { box-shadow: 0 0 0 3px rgba(251,191,36,1), 0 0 22px rgba(251,191,36,.4), 0 6px 18px rgba(0,0,0,.4); }
        }
        @keyframes DSC_grabbed {
          0%,100% { transform: scale(1.06) rotate(-3.5deg); }
          50%     { transform: scale(1.09) rotate(-1.5deg); }
        }
        @keyframes DSC_tb_ok  { 0%,100%{transform:scale(1)} 40%{transform:scale(1.05)} }
        @keyframes DSC_tb_bad { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 70%{transform:translateX(7px)} }

        .DSC_item {
          position: absolute;
          transform: translateX(-50%);
          cursor: grab;
          touch-action: none;
          animation: DSC_fall var(--fall-ms) linear both;
        }
        .DSC_item:active { cursor: grabbing; }
        .DSC_item.DSC_sel {
          animation-play-state: paused !important;
          z-index: 22 !important;
        }
        .DSC_item.DSC_sel .DSC_card {
          animation: DSC_select_glow 1.1s ease-in-out infinite;
        }
        .DSC_card {
          border-radius: 13px;
          padding: 8px 9px;
          text-align: center;
          pointer-events: none;
          min-width: ${CARD_W}px;
          box-shadow: 0 6px 18px rgba(0,0,0,.45);
        }
        .DSC_table {
          transition: box-shadow .18s, background .15s, border-color .15s;
          cursor: pointer;
        }
        .DSC_table:hover { filter: brightness(1.13); }
        .DSC_table.DSC_tb-ok  { animation: DSC_tb_ok  0.45s ease; }
        .DSC_table.DSC_tb-bad { animation: DSC_tb_bad 0.4s ease; }
      `}</style>

      {/* ── Falling items ─────────────────────────────────────────────────── */}
      {items.map(item => (
        <div
          key={item.id}
          className={`DSC_item${selectedId === item.id ? ' DSC_sel' : ''}`}
          style={{
            left: `${item.xPct}%`,
            '--fall-ms': `${item.fallMs}ms`,
            zIndex: selectedId === item.id ? 22 : 10,
          }}
          onClick={(e) => handleItemClick(e, item)}
          onPointerDown={(e) => handleItemPointerDown(e, item)}
        >
          <div
            className="DSC_card"
            style={{
              background: item.bg,
              border: `1.5px solid ${item.border}`,
              backdropFilter: 'blur(4px)',
              padding: isDesktop ? '7px 9px' : '5px 7px',
              borderRadius: 10,
              minWidth: CARD_W,
              boxShadow: `0 6px 20px rgba(0,0,0,0.5), inset 0 0 10px ${item.color}1e`,
            }}
          >
            {/* Card Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 4, paddingBottom: 3, borderBottom: `1px dashed ${item.color}3a`,
            }}>
              <span style={{ fontSize: isDesktop ? 13 : 11 }}>{item.emoji}</span>
              <span style={{
                fontSize: isDesktop ? 8 : 7, fontWeight: 900, color: item.color,
                fontFamily: 'monospace', letterSpacing: 0.5,
              }}>
                {item.shortLabel.toUpperCase()}
              </span>
            </div>
            {/* Record Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              {(item.mockRecords || []).map((rec, rIdx) => (
                <div key={rIdx} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: 'monospace', fontSize: isDesktop ? 8 : 7,
                  lineHeight: 1.1,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{rec.key}:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{rec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* ── Grabbed item (follows pointer) ────────────────────────────────── */}
      {grabbedItem && (
        <div style={{
          position: 'fixed',
          left: grabbedItem.dragX - CARD_W / 2 - 4,
          top:  grabbedItem.dragY - 52,
          zIndex: 1000,
          pointerEvents: 'none',
          filter: 'drop-shadow(0 12px 26px rgba(0,0,0,.7))',
          animation: 'DSC_grabbed 0.65s ease-in-out infinite',
        }}>
          <div style={{
            background: grabbedItem.bg,
            border: `2px solid ${grabbedItem.color}`,
            borderRadius: 10,
            padding: isDesktop ? '7px 9px' : '5px 7px',
            boxShadow: `0 0 26px ${grabbedItem.color}55, inset 0 0 10px ${grabbedItem.color}1e`,
            minWidth: CARD_W,
            backdropFilter: 'blur(6px)',
          }}>
            {/* Card Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 4, paddingBottom: 3, borderBottom: `1px dashed ${grabbedItem.color}3a`,
            }}>
              <span style={{ fontSize: isDesktop ? 13 : 11 }}>{grabbedItem.emoji}</span>
              <span style={{
                fontSize: isDesktop ? 8 : 7, fontWeight: 900, color: grabbedItem.color,
                fontFamily: 'monospace', letterSpacing: 0.5,
              }}>
                {grabbedItem.shortLabel.toUpperCase()}
              </span>
            </div>
            {/* Record Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              {(grabbedItem.mockRecords || []).map((rec, rIdx) => (
                <div key={rIdx} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontFamily: 'monospace', fontSize: isDesktop ? 8 : 7,
                  lineHeight: 1.1,
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{rec.key}:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{rec.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Keyboard shortcut hint (selected item, desktop) ──────────────── */}
      {selectedId && isDesktop && (
        <div style={{
          position: 'absolute', bottom: TABLE_H + 14, left: '50%',
          transform: 'translateX(-50%)', zIndex: 25, pointerEvents: 'none',
          background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.28)',
          borderRadius: 20, padding: '5px 16px',
          fontSize: 10.5, color: '#fbbf24', fontFamily: "'Nunito', sans-serif",
          fontWeight: 700, whiteSpace: 'nowrap',
        }}>
          ⌨️&nbsp;
          {SORTER_TABLES.map((t, i) => (
            <span key={t.id}>
              <kbd style={{
                background: `${t.color}22`, border: `1px solid ${t.color}55`,
                borderRadius: 4, padding: '1px 6px', fontSize: 11, color: t.color,
                fontFamily: 'monospace', fontWeight: 700,
              }}>{i + 1}</kbd>
              {i < SORTER_TABLES.length - 1 && ' '}
            </span>
          ))}
          {' '}atau klik tabel
        </div>
      )}

      {/* ── Database table drop zones ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: TABLE_H,
        display: 'flex', gap: isDesktop ? 6 : 4,
        padding: `0 ${isDesktop ? 6 : 3}px`,
        zIndex: 15,
      }}>
        {SORTER_TABLES.map((table, idx) => {
          const fb        = tableFeedback[table.id];
          const hasTarget = !!selectedId || !!grabbedItem;
          return (
            <div
              key={table.id}
              data-table-id={table.id}
              className={`DSC_table${fb === 'correct' ? ' DSC_tb-ok' : fb === 'wrong' ? ' DSC_tb-bad' : ''}`}
              onClick={(e) => handleTableClick(e, table.id)}
              style={{
                flex: 1,
                background: fb === 'correct'
                  ? 'rgba(74,222,128,.28)'
                  : fb === 'wrong'
                    ? 'rgba(244,63,94,.22)'
                    : table.bg,
                border: `2px solid ${
                  fb === 'correct' ? '#4ade80'
                    : fb === 'wrong' ? '#f43f5e'
                      : table.color
                }`,
                borderRadius: isDesktop ? 14 : 10,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 2,
                boxShadow: fb === 'correct'
                  ? '0 0 30px rgba(74,222,128,.55)'
                  : hasTarget
                    ? `0 0 14px ${table.color}44, inset 0 0 12px ${table.color}18`
                    : 'none',
              }}
            >
              <div style={{ fontSize: isDesktop ? 26 : 20 }}>{table.icon}</div>
              <div style={{
                fontSize: isDesktop ? 9.5 : 7.5, fontWeight: 800,
                color: table.color, textTransform: 'uppercase', letterSpacing: 0.8,
                fontFamily: "'Nunito', sans-serif", textAlign: 'center',
                lineHeight: 1.2, padding: '0 3px',
              }}>
                {table.shortLabel}
              </div>
              {isDesktop && (
                <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,.28)', fontFamily: 'monospace', marginTop: 1 }}>
                  [{idx + 1}]
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
