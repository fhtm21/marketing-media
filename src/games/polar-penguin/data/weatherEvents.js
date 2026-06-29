/**
 * Data 5 hari simulasi Market Tycoon.
 * Setiap event memiliki parameter ekonomi yang mengajarkan demand forecasting.
 *
 * @typedef {{
 *   day: number,
 *   name: string,
 *   desc: string,
 *   type: 'normal'|'storm'|'sun'|'aurora'|'fissure',
 *   wholesaleCost: number,
 *   maxWholesaleStock: number,
 *   idealRetailPrice: number,
 *   maxDemand: number,
 *   baseDemandFactor: number,
 *   icon: string
 * }} WeatherEvent
 *
 * @type {WeatherEvent[]}
 */
export const WEATHER_EVENTS = [
  {
    day: 1,
    name: 'Kondisi Arktik Normal',
    desc: 'Permintaan stabil. Para penguin lapar tapi sensitif harga. Stok seimbang adalah pilihan terbaik.',
    type: 'normal',
    wholesaleCost: 5,
    maxWholesaleStock: 30,
    idealRetailPrice: 10,
    maxDemand: 10,
    baseDemandFactor: 1.0,
    icon: 'normal',
  },
  {
    day: 2,
    name: 'Blizzard Siberia',
    desc: 'Akses lautan membeku total. Biaya pasokan naik, tapi penguin yang terjebak sangat butuh ikan segar!',
    type: 'storm',
    wholesaleCost: 9,
    maxWholesaleStock: 15,
    idealRetailPrice: 18,
    maxDemand: 14,
    baseDemandFactor: 1.5,
    icon: 'storm',
  },
  {
    day: 3,
    name: 'Arus Hangat Masuk',
    desc: 'Arus laut hangat membawa banyak ikan kod. Harga grosir anjlok, tapi stok yang tidak terjual langsung busuk!',
    type: 'sun',
    wholesaleCost: 2,
    maxWholesaleStock: 40,
    idealRetailPrice: 6,
    maxDemand: 20,
    baseDemandFactor: 1.9,
    icon: 'sun',
  },
  {
    day: 4,
    name: 'Festival Aurora Borealis',
    desc: 'Penguin wisatawan berdatangan ke tudung es. Mereka berduit dan mau bayar harga premium!',
    type: 'aurora',
    wholesaleCost: 6,
    maxWholesaleStock: 25,
    idealRetailPrice: 15,
    maxDemand: 13,
    baseDemandFactor: 1.3,
    icon: 'aurora',
  },
  {
    day: 5,
    name: 'Keterlambatan Logistik Es Retak',
    desc: 'Rekahan membuka jalur pengiriman, menunda pasokan. Stok sangat terbatas. Maksimalkan margin!',
    type: 'fissure',
    wholesaleCost: 7,
    maxWholesaleStock: 10,
    idealRetailPrice: 14,
    maxDemand: 9,
    baseDemandFactor: 1.1,
    icon: 'storm',
  },
];
