/**
 * synthPlay — Web Audio API synthesizer untuk feedback suara.
 * Fail-soft: jika browser memblokir AudioContext, tidak ada error yang dilempar.
 *
 * @param {number} frequency - Frekuensi nada dalam Hz (misal: 440 = A4)
 * @param {number} duration  - Durasi dalam detik
 * @param {'sine'|'square'|'sawtooth'|'triangle'} [type='sine'] - Bentuk gelombang
 */
export function synthPlay(frequency, duration, type = 'sine') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Fail-soft: browser mungkin memblokir AudioContext sebelum user interaction
  }
}

/** Preset suara untuk feedback positif (benar/sukses) */
export const SOUNDS = {
  correct: () => synthPlay(659.25, 0.25, 'sine'),
  wrong: () => synthPlay(180, 0.3, 'sawtooth'),
  coin: () => synthPlay(523.25, 0.15, 'triangle'),
  levelUp: () => synthPlay(880, 0.4, 'sine'),
  cable: (length) => synthPlay(400 + length * 25, 0.06, 'sine'),
  cableUndo: () => synthPlay(280, 0.06, 'triangle'),
  packetCollect: () => synthPlay(880, 0.3, 'sine'),
  firewallUnlock: () => synthPlay(783.99, 0.35, 'triangle'),
  clientConnect: () => synthPlay(659.25, 0.25, 'sine'),
  splitterHit: () => synthPlay(587.33, 0.2, 'sine'),
  budgetOver: () => synthPlay(120, 0.25, 'sawtooth'),
  modeSwitch: (isJourney) => synthPlay(isJourney ? 440 : 520, 0.1, 'sine'),
  // Data Stream Sorter
  dropCorrect: () => synthPlay(880, 0.18, 'sine'),
  dropWrong:   () => synthPlay(150, 0.2, 'sawtooth'),
  itemMiss:    () => synthPlay(200, 0.28, 'sawtooth'),
  // Expedition Sprint
  cardSelect:       () => synthPlay(523.25, 0.08, 'triangle'),
  cardAssign:       () => synthPlay(659.25, 0.12, 'sine'),
  obstacleCleared:  () => synthPlay(783.99, 0.3, 'sine'),
  obstacleFailed:   () => synthPlay(130, 0.35, 'sawtooth'),
  sprintComplete:   () => { synthPlay(659.25, 0.12, 'sine'); setTimeout(() => synthPlay(783.99, 0.18, 'sine'), 150); setTimeout(() => synthPlay(1046.5, 0.3, 'sine'), 300); },
};
