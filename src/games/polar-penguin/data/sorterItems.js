/**
 * Data untuk modul Data Stream Sorter (Module 4).
 * Mengajarkan konsep Database Management & Data Categorization.
 *
 * @typedef {{ id: string, label: string, shortLabel: string, icon: string, color: string, glowColor: string, bg: string, border: string, hint: string }} SorterTable
 * @typedef {{ id: string, emoji: string, label: string, shortLabel: string, correctTable: string, color: string, bg: string, border: string }} SorterItemType
 * @typedef {{ id: number, title: string, concept: string, objective: string, totalItems: number, fallDurationMs: number, spawnIntervalMs: number, scoreXP: number, insightText: string }} SorterLevel
 */

/** @type {SorterTable[]} */
export const SORTER_TABLES = [
  {
    id: 'transactions',
    label: 'Tabel Transaksi',
    shortLabel: 'TRANSAKSI',
    icon: '💰',
    color: '#0ea5e9',
    glowColor: 'rgba(14,165,233,0.45)',
    bg: 'rgba(12,59,94,0.65)',
    border: 'rgba(14,165,233,0.4)',
    hint: 'Data jual-beli & pembayaran',
  },
  {
    id: 'metadata',
    label: 'Tabel Metadata',
    shortLabel: 'METADATA',
    icon: '📋',
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.45)',
    bg: 'rgba(46,16,101,0.65)',
    border: 'rgba(139,92,246,0.4)',
    hint: 'Atribut & konfigurasi sistem',
  },
  {
    id: 'errors',
    label: 'Tabel Error Log',
    shortLabel: 'ERROR LOG',
    icon: '⚠️',
    color: '#f43f5e',
    glowColor: 'rgba(244,63,94,0.45)',
    bg: 'rgba(69,10,10,0.65)',
    border: 'rgba(244,63,94,0.4)',
    hint: 'Error & anomali sistem',
  },
];

/** @type {SorterItemType[]} */
export const SORTER_ITEM_TYPES = [
  {
    id: 'fish',
    emoji: '🐟',
    label: 'Fish Transaction',
    shortLabel: 'Transaksi',
    correctTable: 'transactions',
    color: '#0ea5e9',
    bg: 'rgba(14,165,233,0.12)',
    border: 'rgba(14,165,233,0.45)',
    mockRecords: [
      { key: 'TX_ID', val: '#TR-9481' },
      { key: 'amount', val: '$149.50' },
      { key: 'qty', val: '30 fish' },
      { key: 'status', val: 'SUCCESS' }
    ]
  },
  {
    id: 'snowflake',
    emoji: '❄️',
    label: 'Snow Metadata',
    shortLabel: 'Metadata',
    correctTable: 'metadata',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.45)',
    mockRecords: [
      { key: 'schema', val: 'sys_v2' },
      { key: 'charset', val: 'UTF-8' },
      { key: 'engine', val: 'InnoDB' },
      { key: 'indexed', val: 'TRUE' }
    ]
  },
  {
    id: 'crab',
    emoji: '🦀',
    label: 'Crab Error Log',
    shortLabel: 'Error Log',
    correctTable: 'errors',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.12)',
    border: 'rgba(244,63,94,0.45)',
    mockRecords: [
      { key: 'ERR_CODE', val: '503_GW' },
      { key: 'severity', val: 'FATAL' },
      { key: 'ping_ms', val: '9999+' },
      { key: 'trace', val: 'NullPtr' }
    ]
  },
];

const SORTER_INSIGHT = `Manajemen database profesional membutuhkan klasifikasi data yang tepat. Setiap rekaman memiliki kategori — transaksi, metadata, dan error log — yang disimpan di tabel berbeda untuk efisiensi query. Di BINUS @Bekasi Business IT, kamu akan mempelajari normalisasi database, SQL query optimization, dan pipeline data untuk sistem bisnis skala enterprise.`;

/** @type {SorterLevel[]} */
export const SORTER_LEVELS = [
  {
    id: 1,
    title: 'Data Ingest 101',
    concept: 'Data Classification',
    objective: 'Sortir 12 paket data ke tabel yang tepat sebelum menyentuh lantai. Perhatikan ikon datanya dengan cermat!',
    totalItems: 12,
    fallDurationMs: 5500,
    spawnIntervalMs: 1900,
    scoreXP: 40,
    insightText: SORTER_INSIGHT,
  },
  {
    id: 2,
    title: 'Relational Surge',
    concept: 'Database Normalization',
    objective: 'Pipeline data makin deras! Sortir 18 paket lebih cepat. Fokus dan jangan sampai ada yang lolos!',
    totalItems: 18,
    fallDurationMs: 4000,
    spawnIntervalMs: 1400,
    scoreXP: 40,
    insightText: SORTER_INSIGHT,
  },
  {
    id: 3,
    title: 'High-Volume Pipeline',
    concept: 'Data Pipeline Management',
    objective: 'Volume tinggi, kecepatan maksimum! Sortir 25 paket data dengan presisi dan kecepatan penuh.',
    totalItems: 25,
    fallDurationMs: 2800,
    spawnIntervalMs: 1100,
    scoreXP: 40,
    insightText: SORTER_INSIGHT,
  },
];
