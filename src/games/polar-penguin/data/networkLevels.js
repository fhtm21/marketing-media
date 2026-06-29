/**
 * Definisi 3 level untuk modul Network Architect.
 * Setiap level mengajarkan konsep topologi jaringan yang berbeda.
 *
 * Tipe sel:
 * - 'server'   : Titik awal semua kabel (Server Igloo)
 * - 'client'   : Titik tujuan yang harus dihubungkan
 * - 'cracked'  : Tidak bisa dilewati
 * - 'water'    : Bisa dilewati, tapi cost 2x cable budget
 * - 'packet'   : Data packet yang harus dikumpulkan (Level 1)
 * - 'firewall' : Harus dilalui sebelum connect client (Level 2)
 * - 'splitter' : Titik cabang jalur kabel (Level 3)
 * - 'empty'    : Sel kosong biasa
 *
 * @typedef {{
 *   id: number,
 *   title: string,
 *   concept: string,
 *   objective: string,
 *   budget: number,
 *   gridSize: number,
 *   server: {r:number, c:number},
 *   clients: Array<{r:number, c:number, id:string}>,
 *   cracked: Array<{r:number, c:number}>,
 *   deepWater: Array<{r:number, c:number}>,
 *   packets: Array<{r:number, c:number}>,
 *   firewall: {r:number, c:number}|null,
 *   splitter: {r:number, c:number}|null,
 *   scoreXP: number,
 *   completionHint: string
 * }} NetworkLevel
 *
 * @type {NetworkLevel[]}
 */
export const NETWORK_LEVELS = [
  {
    id: 1,
    title: 'Topologi Bintang — Deployment Awal',
    concept: 'Star Topology',
    objective:
      'Bentangkan serat optik dari Igloo Server ke semua Client Igloo. Lewati paket data ⭐ terlebih dahulu sebelum menghubungkan klien — data header harus diamankan dulu!',
    budget: 18,
    gridSize: 6,
    server: { r: 3, c: 3 },
    clients: [
      { r: 0, c: 0, id: 'A' },
      { r: 0, c: 5, id: 'B' },
      { r: 5, c: 4, id: 'C' },
    ],
    cracked: [{ r: 1, c: 2 }, { r: 4, c: 1 }],
    deepWater: [],
    packets: [
      { r: 1, c: 4 },
      { r: 4, c: 2 },
    ],
    firewall: null,
    splitter: null,
    scoreXP: 33,
    completionHint: 'Konsep: Pada topologi bintang, semua perangkat terhubung langsung ke satu switch/server pusat.',
  },
  {
    id: 2,
    title: 'Loop Keamanan Firewall Kriptografi',
    concept: 'Firewall & Network Redundancy',
    objective:
      'Hubungkan klien dengan aman! Jalur kabel HARUS melewati node Firewall 🔴 terlebih dahulu. Pastikan juga ada jalur redundan — sistem akan diuji saat Glacier Shift memutus satu koneksi!',
    budget: 22,
    gridSize: 6,
    server: { r: 3, c: 3 },
    clients: [
      { r: 1, c: 1, id: 'A' },
      { r: 1, c: 4, id: 'B' },
      { r: 4, c: 4, id: 'C' },
    ],
    cracked: [{ r: 0, c: 2 }, { r: 5, c: 1 }],
    deepWater: [],
    packets: [],
    firewall: { r: 2, c: 2 },
    splitter: null,
    scoreXP: 34,
    completionHint: 'Konsep: Redundansi jaringan memastikan sistem tetap aktif walaupun satu jalur terputus.',
  },
  {
    id: 3,
    title: 'Grid Splitter yang Dioptimalkan',
    concept: 'Network Splitter & Routing Optimization',
    objective:
      'Gunakan Splitter 💜 sebagai titik cabang kabel! Hindari saluran Deep Water yang memakan 2x budget. Rencanakan rute paling efisien untuk tetap dalam anggaran.',
    budget: 14,
    gridSize: 6,
    server: { r: 2, c: 1 },
    clients: [
      { r: 0, c: 2, id: 'A' },
      { r: 2, c: 5, id: 'B' },
      { r: 5, c: 2, id: 'C' },
    ],
    cracked: [{ r: 1, c: 0 }, { r: 4, c: 4 }],
    deepWater: [
      { r: 3, c: 2 },
      { r: 3, c: 3 },
      { r: 4, c: 3 },
      { r: 3, c: 4 },
    ],
    packets: [{ r: 1, c: 3 }],
    firewall: null,
    splitter: { r: 2, c: 3 },
    scoreXP: 33,
    completionHint: 'Konsep: Splitter memungkinkan satu jalur utama bercabang ke beberapa endpoint sekaligus.',
  },
];
