/**
 * Scoring utility untuk Polar Penguin Game.
 * Setiap modul memiliki score tersendiri yang diakumulasi di root state.
 *
 * @typedef {{ raw: number, max: number, attempts: number, accuracy: number }} ScoreState
 */

/**
 * Inisialisasi score state kosong.
 * @returns {ScoreState}
 */
export function initScore() {
  return { raw: 0, max: 0, attempts: 0, accuracy: 0 };
}

/**
 * Hitung final score Market Tycoon berdasarkan cash tersisa.
 * Cash awal $100, target $150. Score adalah cash tersisa, min 50 XP.
 *
 * @param {number} finalCash
 * @returns {number} XP score
 */
export function calcMarketScore(finalCash) {
  return Math.max(50, Math.round(finalCash));
}

/**
 * Hitung accumulated score dari semua modul yang sudah selesai.
 *
 * @param {Record<string, { score: number }>} completedModules
 * @returns {number}
 */
export function calcTotalScore(completedModules) {
  return Object.values(completedModules).reduce((sum, m) => sum + (m.score || 0), 0);
}

/**
 * Tentukan apakah market target tercapai ($150).
 * @param {number} finalCash
 * @returns {boolean}
 */
export function isMarketTargetBeaten(finalCash) {
  return finalCash >= 150;
}
