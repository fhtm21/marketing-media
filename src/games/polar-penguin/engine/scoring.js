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

/**
 * Hitung score Data Stream Sorter berdasarkan akurasi sortir dan nyawa tersisa.
 *
 * @param {number} correct   - jumlah item yang benar disortir
 * @param {number} total     - total item yang diproses (termasuk yang miss)
 * @param {number} livesLeft - nyawa tersisa (0–3)
 * @returns {number} XP score
 */
export function calcSorterScore(correct, total, livesLeft) {
  if (total === 0) return 0;
  const accuracy = correct / total;
  const base = Math.round(accuracy * 80);
  const lifeBonus = livesLeft * 8;
  return Math.max(5, base + lifeBonus);
}

/**
 * Hitung score Expedition Sprint.
 *
 * @param {number} sprintsCleared  - sprint yang diselesaikan tanpa full-fail (0–3)
 * @param {number} totalDamage     - total damage yang diterima (0–MaxHP)
 * @param {number} maxHP           - max HP (untuk normalisasi penalty)
 * @param {number} bonusPoints     - bonus dari clear sempurna / match speciality
 * @returns {number} XP score
 */
export function calcExpeditionScore(sprintsCleared, totalDamage, maxHP, bonusPoints) {
  const sprintBase  = sprintsCleared * 30;         // 30 XP per sprint cleared
  const damagePenalty = Math.round((totalDamage / Math.max(1, maxHP)) * 40);
  return Math.max(10, sprintBase - damagePenalty + bonusPoints);
}
