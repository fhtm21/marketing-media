/**
 * expeditionData.js — Data konten untuk Module 5: Expedition Sprint.
 * Berisi definisi kartu tim, obstacle, dan konfigurasi sprint.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Team Cards — 5 anggota tim dengan keahlian berbeda
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   emoji: string,
 *   role: string,
 *   strength: number,       // Kekuatan dasar (1–3)
 *   apCost: number,         // Biaya Action Points (1 atau 2)
 *   speciality: string,     // Tipe obstacle yang di-bonus
 *   specialityBonus: number,// Bonus strength jika matching obstacle type
 *   color: string,
 *   bg: string,
 *   border: string,
 *   description: string,
 * }} TeamCard
 */

/** @type {TeamCard[]} */
export const TEAM_CARDS = [
  {
    id: 'scout',
    name: 'Scout',
    emoji: '🗺️',
    role: 'Pathfinder',
    strength: 2,
    apCost: 1,
    speciality: 'navigation',
    specialityBonus: 2,
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.4)',
    description: 'Ahli navigasi terrain. Efektif di obstacle lokasi & cuaca.',
  },
  {
    id: 'engineer',
    name: 'Engineer',
    emoji: '🔧',
    role: 'Tech Specialist',
    strength: 2,
    apCost: 1,
    speciality: 'equipment',
    specialityBonus: 2,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.4)',
    description: 'Pakar perbaikan peralatan. Andalan saat sled rusak atau GPS gagal.',
  },
  {
    id: 'medic',
    name: 'Medic',
    emoji: '🩺',
    role: 'Field Doctor',
    strength: 2,
    apCost: 1,
    speciality: 'medical',
    specialityBonus: 2,
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.4)',
    description: 'Spesialis medis lapangan. Wajib untuk cedera & morale rendah.',
  },
  {
    id: 'analyst',
    name: 'Analyst',
    emoji: '📊',
    role: 'Data Strategist',
    strength: 2,
    apCost: 1,
    speciality: 'data',
    specialityBonus: 2,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.4)',
    description: 'Ahli data & logistik. Sangat efektif terhadap korupsi data & kekurangan supply.',
  },
  {
    id: 'leader',
    name: 'Leader',
    emoji: '🦅',
    role: 'Sprint Master',
    strength: 3,
    apCost: 2,
    speciality: 'any',
    specialityBonus: 1,
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    border: 'rgba(14,165,233,0.4)',
    description: 'Sprint Master yang kuat di semua bidang. Biaya 2 AP tapi mengatasi apapun.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Obstacles — 8 jenis bahaya dengan tipe dan tingkat kesulitan berbeda
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   emoji: string,
 *   type: string,         // 'navigation'|'equipment'|'medical'|'data'|'logistics'
 *   difficulty: number,   // 1=Easy, 2=Medium, 3=Hard
 *   damage: number,       // HP damage jika tidak diatasi
 *   description: string,
 *   gridRef: string,      // Referensi grid lokasi (flavor)
 *   color: string,
 *   bg: string,
 * }} Obstacle
 */

/** @type {Obstacle[]} */
export const OBSTACLES = [
  {
    id: 'blizzard',
    name: 'Blizzard',
    emoji: '❄️',
    type: 'navigation',
    difficulty: 2,
    damage: 20,
    description: 'Badai salju membutakan pandangan. Tim butuh navigator berpengalaman.',
    gridRef: 'GRID-A3',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
  },
  {
    id: 'broken_sled',
    name: 'Broken Sled',
    emoji: '🛷',
    type: 'equipment',
    difficulty: 1,
    damage: 15,
    description: 'Sled utama rusak. Engineer perlu 30 menit untuk perbaikan darurat.',
    gridRef: 'GRID-B7',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    id: 'injured',
    name: 'Injured Penguin',
    emoji: '🤕',
    type: 'medical',
    difficulty: 2,
    damage: 25,
    description: 'Anggota tim mengalami frost-bite. Tanpa penanganan, kondisi makin buruk.',
    gridRef: 'GRID-C2',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.1)',
  },
  {
    id: 'data_corruption',
    name: 'Data Corruption',
    emoji: '💾',
    type: 'data',
    difficulty: 2,
    damage: 20,
    description: 'Data peta ekspedisi terkorupsi. Analyst perlu restore backup secara manual.',
    gridRef: 'GRID-D5',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.1)',
  },
  {
    id: 'supply_shortage',
    name: 'Supply Shortage',
    emoji: '📦',
    type: 'logistics',
    difficulty: 1,
    damage: 15,
    description: 'Persediaan makanan kurang 40%. Perlu realokasi segera.',
    gridRef: 'GRID-A6',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    id: 'gps_failure',
    name: 'GPS Failure',
    emoji: '🧭',
    type: 'equipment',
    difficulty: 2,
    damage: 20,
    description: 'Sistem GPS offline. Tim terancam tersesat di tundra.',
    gridRef: 'GRID-B4',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
  },
  {
    id: 'low_morale',
    name: 'Low Morale',
    emoji: '😞',
    type: 'medical',
    difficulty: 1,
    damage: 15,
    description: 'Kelelahan sprint menurunkan semangat tim. Butuh motivasi dari Medic atau Leader.',
    gridRef: 'GRID-C8',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.1)',
  },
  {
    id: 'terrain_collapse',
    name: 'Terrain Collapse',
    emoji: '🗻',
    type: 'navigation',
    difficulty: 3,
    damage: 35,
    description: 'Jalur runtuh tertutup longsoran es. Obstacle paling berbahaya di ekspedisi.',
    gridRef: 'GRID-E1',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sprint Configurations — 3 sprint dengan tingkat kesulitan meningkat
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {{
 *   sprintId: number,
 *   title: string,
 *   subtitle: string,
 *   obstacleIds: string[],
 *   maxHP: number,
 *   actionPoints: number,
 *   concept: string,
 *   insightText: string,
 * }} SprintConfig
 */

/** @type {SprintConfig[]} */
export const SPRINT_CONFIGS = [
  {
    sprintId: 1,
    title: 'Sprint 1: Base Camp Departure',
    subtitle: 'Hari 1 ekspedisi — terrain aman, tapi risiko awal sudah mengintai.',
    obstacleIds: ['supply_shortage', 'broken_sled'],
    maxHP: 80,
    actionPoints: 3,
    concept: 'Sprint Planning',
    insightText: 'Sprint Planning adalah fondasi Agile: tim menentukan siapa mengerjakan apa sebelum sprint dimulai. Tanpa planning yang baik, resource terbuang dan risiko tidak tertangani.',
  },
  {
    sprintId: 2,
    title: 'Sprint 2: Glacial Crossing',
    subtitle: 'Melewati glacier berbahaya — 3 obstacle sekaligus menguji kapasitas tim.',
    obstacleIds: ['blizzard', 'data_corruption', 'low_morale'],
    maxHP: 80,
    actionPoints: 3,
    concept: 'Risk Management',
    insightText: 'Risk Management dalam Agile berarti mengidentifikasi hambatan di awal dan menyiapkan mitigation plan. Tim yang tidak mengelola risiko akan kehabisan "action points" saat krisis terjadi.',
  },
  {
    sprintId: 3,
    title: 'Sprint 3: Summit Push',
    subtitle: 'Sprint terakhir paling brutal — obstacle sulit dengan HP terbatas.',
    obstacleIds: ['terrain_collapse', 'injured', 'gps_failure'],
    maxHP: 60,
    actionPoints: 3,
    concept: 'Sprint Retrospective',
    insightText: 'Sprint Retrospective mengajarkan tim belajar dari setiap iterasi. Kesalahan di Sprint 1 dan 2 seharusnya membuat tim lebih adaptif di Sprint 3 — inilah esensi continuous improvement dalam Agile.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper — dapatkan konfigurasi obstacle berdasarkan ID
// ─────────────────────────────────────────────────────────────────────────────

/** @param {string} id @returns {Obstacle|undefined} */
export const getObstacle = (id) => OBSTACLES.find(o => o.id === id);

/**
 * Hitung effective strength kartu terhadap obstacle tertentu.
 * Jika speciality cocok, tambahkan specialityBonus.
 *
 * @param {TeamCard} card
 * @param {Obstacle} obstacle
 * @returns {number}
 */
export function effectiveStrength(card, obstacle) {
  if (card.speciality === 'any') return card.strength + card.specialityBonus;
  if (card.speciality === obstacle.type) return card.strength + card.specialityBonus;
  return card.strength;
}

/**
 * Tentukan apakah assignment berhasil mengatasi obstacle.
 * Berhasil jika total effective strength semua kartu yang di-assign >= obstacle.difficulty * 2.
 *
 * @param {TeamCard[]} assignedCards
 * @param {Obstacle} obstacle
 * @returns {{ cleared: boolean, totalStrength: number, required: number }}
 */
export function resolveObstacle(assignedCards, obstacle) {
  const required = obstacle.difficulty * 2;
  const totalStrength = assignedCards.reduce((sum, card) => sum + effectiveStrength(card, obstacle), 0);
  return { cleared: totalStrength >= required, totalStrength, required };
}
