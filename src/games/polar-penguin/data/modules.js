/**
 * Konfigurasi semua modul game Polar Penguin.
 * `requires` menentukan modul mana yang harus diselesaikan dulu (Guided Journey mode).
 * Module 3–5 aktif sebagai placeholder sampai Phase 3 dibangun.
 *
 * @typedef {{ id: string, title: string, icon: string, concept: string, requires: string|null, active: boolean }} ModuleConfig
 * @type {ModuleConfig[]}
 */
export const MODULES_CONFIG = [
  {
    id: 'market',
    title: 'Market Tycoon',
    icon: '🛒',
    concept: 'E-Commerce & Analytics',
    requires: null,
    active: true,
  },
  {
    id: 'network',
    title: 'Network Architect',
    icon: '🌐',
    concept: 'System Topology & Redundancy',
    requires: 'market',
    active: true,
  },
  {
    id: 'trendsetter',
    title: 'Polar Trendsetter',
    icon: '📈',
    concept: 'Digital Marketing',
    requires: 'network',
    active: false,
  },
  {
    id: 'sorter',
    title: 'Data Stream Sorter',
    icon: '🗄️',
    concept: 'Database Management',
    requires: 'trendsetter',
    active: false,
  },
  {
    id: 'expedition',
    title: 'Expedition Sprint',
    icon: '🧭',
    concept: 'Agile Management',
    requires: 'sorter',
    active: false,
  },
];
