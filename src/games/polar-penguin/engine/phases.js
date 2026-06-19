/**
 * State machine constants untuk semua fase game Polar Penguin.
 * Gunakan konstanta ini — jangan hardcode string di komponen.
 */

/** Fase root level (PolarPenguinGame index) */
export const ROOT_PHASES = {
  INTRO: 'intro',
  HUB: 'hub',
  MARKET: 'market',
  NETWORK: 'network',
  TRENDSETTER: 'trendsetter',
  SORTER: 'sorter',
  EXPEDITION: 'expedition',
};

/** Fase internal Market Tycoon */
export const MARKET_PHASES = {
  PLANNING: 'planning',
  SIMULATING: 'simulating',
  REPORT: 'report',
  GAMEOVER: 'gameover',
};

/** Fase internal Network Architect */
export const NETWORK_PHASES = {
  BRIEFING: 'briefing',
  PLAYING: 'playing',
  SHIFT: 'shift',       // Event Glacier Shift pada Level 2
  COMPLETED: 'completed',
  FAILED: 'failed',
};

/**
 * Transition helper — kembalikan fase berikutnya berdasarkan action.
 * Ini memastikan transisi dilakukan di luar komponen (di engine layer).
 *
 * @param {string} currentPhase
 * @param {string} action
 * @returns {string} next phase
 */
export function marketTransition(currentPhase, action) {
  const map = {
    planning: { START_SIM: 'simulating' },
    simulating: { SIM_DONE: 'report' },
    report: { NEXT_DAY: 'planning', GAME_END: 'gameover' },
    gameover: { RESTART: 'planning' },
  };
  return map[currentPhase]?.[action] ?? currentPhase;
}

export function networkTransition(currentPhase, action) {
  const map = {
    briefing: { START: 'playing' },
    playing: { SUBMIT: 'shift', COMPLETE: 'completed', FAIL: 'failed', SHIFT_DONE: 'completed' },
    shift: { SHIFT_PASS: 'completed', SHIFT_FAIL: 'failed' },
    completed: { NEXT_LEVEL: 'briefing', FINISH: 'gameover' },
    failed: { RETRY: 'briefing' },
  };
  return map[currentPhase]?.[action] ?? currentPhase;
}
