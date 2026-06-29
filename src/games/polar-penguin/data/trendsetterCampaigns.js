/**
 * Definisi 3 kampanye pemasaran untuk modul Polar Trendsetter.
 * Setiap kampanye mengajarkan konsep segmentasi audiens dan keselarasan pesan.
 *
 * Tipe Kartu (isCorrect):
 * - true  : Relevan dengan audiens target. Harus dipublish (Swipe Kanan / Publish).
 * - false : Tidak relevan, spam, atau berlawanan dengan audiens. Harus dibuang (Swipe Kiri / Discard).
 *
 * Pilihan Hashtag:
 * - hashtagOptions: 4 opsi hashtag yang ditampilkan kepada pemain untuk dipilih (pilih 2).
 * - correctHashtags: 2 hashtag yang paling tepat untuk mendongkrak reach jika konten diterbitkan.
 *
 * @typedef {{
 *   id: string,
 *   category: string,
 *   content: string,
 *   visual: string,
 *   hashtagOptions: string[],
 *   correctHashtags: string[],
 *   isCorrect: boolean,
 *   explanation: string
 * }} TrendsetterCard
 *
 * @typedef {{
 *   id: number,
 *   title: string,
 *   concept: string,
 *   objective: string,
 *   targetAudience: string,
 *   likes: string[],
 *   dislikes: string[],
 *   scoreXP: number,
 *   adChannels: Array<{ id: string, name: string, desc: string, targetMatch: boolean }>,
 *   deck: TrendsetterCard[]
 * }} TrendsetterCampaign
 *
 * @type {TrendsetterCampaign[]}
 */
export const TRENDSETTER_CAMPAIGNS = [
  {
    id: 1,
    title: 'Lestarikan Gletser Arktik',
    concept: 'Gen-Z & Eco-Conscious Marketing',
    targetAudience: 'Anak-anak Penguin Muda (Chicks)',
    objective: 'Bangun kesadaran tentang mencairnya es di kalangan penguin muda menggunakan format konten yang seru dan interaktif.',
    likes: [
      'Humor & Meme segar',
      'Bahasa santai ("gaes", "kuy", "hype")',
      'Tantangan sosial (challenges)',
      'Visual ekspresif dan penuh warna'
    ],
    dislikes: [
      'Laporan bisnis formal teks panjang',
      'Tabel data statistik tanpa visual',
      'Rekomendasi industri yang merusak alam'
    ],
    scoreXP: 33,
    adChannels: [
      { id: 'influencer', name: 'TikTuk Influencer Outreach', desc: 'Sponsorship video kreatif dengan pembuat konten muda.', targetMatch: true },
      { id: 'search', name: 'Search Engine Sponsored Ads', desc: 'Iklan teks berbayar di hasil pencarian kata kunci formal.', targetMatch: false },
      { id: 'blog', name: 'Premium Travel Blogs', desc: 'Penempatan banner artikel di portal wisata alam mewah.', targetMatch: false }
    ],
    deck: [
      {
        id: 'c1_1',
        category: 'Meme Lingkungan',
        content: 'Meme: *Aku ketika melihat suhu kutub naik 1 derajat* 😱 (insert muka penguin panik). Kuy matikan lampu yang ga dipakai biar rumah kita ga mencair!',
        visual: '🖼️ Ilustrasi kartun penguin panik memeluk es batu raksasa.',
        hashtagOptions: ['#GlacierGlowUp', '#SaveTheIce', '#CoalProfit', '#FastMoney'],
        correctHashtags: ['#GlacierGlowUp', '#SaveTheIce'],
        isCorrect: true,
        explanation: 'Format meme dengan humor visual sangat efektif menarik perhatian penguin muda.'
      },
      {
        id: 'c1_2',
        category: 'Laporan Korporat',
        content: 'Laporan Konsolidasi Tahunan Dampak Makro-Ekonomi Pencairan Lapisan Es Terhadap Produk Domestik Bruto (PDB) Sektor Perikanan Arktik Tahun Anggaran 2026.',
        visual: '📊 Tabel angka monokrom yang rumit dan panjang.',
        hashtagOptions: ['#MacroEconomics', '#AnnualReport', '#ChillVibes', '#EcoDance'],
        correctHashtags: ['#MacroEconomics', '#AnnualReport'],
        isCorrect: false,
        explanation: 'Laporan formal yang panjang dan rumit tidak disukai oleh audiens muda.'
      },
      {
        id: 'c1_3',
        category: 'Tantangan Interaktif',
        content: 'Tantangan Dance TikTuk #GletserChallenge! Post video kamu meluncur di es, dan setiap 100 view akan dikonversi menjadi donasi 1 ikan untuk konservasi.',
        visual: '🎥 Video pendek penguin menari seru dengan musik latar upbeat.',
        hashtagOptions: ['#GletserChallenge', '#EcoDance', '#BITData', '#MacroEconomics'],
        correctHashtags: ['#GletserChallenge', '#EcoDance'],
        isCorrect: true,
        explanation: 'Post tantangan sosial mengajak partisipasi aktif audiens muda.'
      },
      {
        id: 'c1_4',
        category: 'Konten Industri',
        content: 'Kesempatan Emas! Membuka investasi baru untuk pabrik pendingin bertenaga batu bara di tengah tudung es. Cepat untung, lupakan lingkungan!',
        visual: '🏭 Gambar pabrik cerobong asap hitam di atas es putih.',
        hashtagOptions: ['#CoalProfit', '#FastMoney', '#SaveTheIce', '#GlacierGlowUp'],
        correctHashtags: ['#CoalProfit', '#FastMoney'],
        isCorrect: false,
        explanation: 'Konten yang merusak lingkungan berlawanan dengan nilai eco-conscious audiens muda.'
      },
      {
        id: 'c1_5',
        category: 'Edukasi Santai',
        content: 'Gletser mencair itu nyata gaes! Rumah kita makin sempit. Kurangi naik kereta sled bermotor, kuy jalan kaki biar sehat dan es tetap kokoh! 🐧❄️',
        visual: '📸 Foto estetik gletser berkilau di bawah sinar matahari dengan kutipan sederhana.',
        hashtagOptions: ['#ChillVibesOnly', '#EcoLifestyle', '#AnnualReport', '#CoalProfit'],
        correctHashtags: ['#ChillVibesOnly', '#EcoLifestyle'],
        isCorrect: true,
        explanation: 'Pesan edukasi dengan nada santai ("gaes", "kuy") sangat cocok bagi penguin muda.'
      }
    ]
  },
  {
    id: 2,
    title: 'IoT Smart Fishing Finder',
    concept: 'B2B Marketing & Data-Driven ROI',
    targetAudience: 'Penguin Pebisnis & Investor Kapal',
    objective: 'Promosikan teknologi pelacak ikan berbasis IoT agar para pengusaha kapal bersedia membeli alat ini.',
    likes: [
      'Data kuantitatif & statistik ROI',
      'Peningkatan efisiensi operasional',
      'Infografis dashboard terstruktur',
      'Nada bicara profesional & berbobot'
    ],
    dislikes: [
      'Bahasa gaul alay / tidak profesional',
      'Meme konyol yang tidak relevan',
      'Saran berbau spekulasi tanpa bukti data'
    ],
    scoreXP: 34,
    adChannels: [
      { id: 'influencer', name: 'TikTuk Influencer Outreach', desc: 'Sponsorship video kreatif dengan pembuat konten muda.', targetMatch: false },
      { id: 'search', name: 'Search Engine Sponsored Ads', desc: 'Iklan teks berbayar di hasil pencarian kata kunci formal.', targetMatch: true },
      { id: 'blog', name: 'Premium Travel Blogs', desc: 'Penempatan banner artikel di portal wisata alam mewah.', targetMatch: false }
    ],
    deck: [
      {
        id: 'c2_1',
        category: 'Kasus Bisnis (B2B)',
        content: 'Smart Fish Finder IoT terbukti menaikkan hasil tangkapan hingga 45% dan memotong konsumsi bahan bakar kapal sebesar 20% lewat rute pelayaran optimal.',
        visual: '📈 Grafik garis menunjukkan kenaikan profit pasca adopsi teknologi.',
        hashtagOptions: ['#SmartLogistics', '#FleetEfficiency', '#Woles', '#CaptainCry'],
        correctHashtags: ['#SmartLogistics', '#FleetEfficiency'],
        isCorrect: true,
        explanation: 'Data efisiensi operasional dan ROI sangat menarik bagi pemilik bisnis kapal.'
      },
      {
        id: 'c2_2',
        category: 'Postingan Informal',
        content: 'Bro n Sis pemilik kapal, tangkapan ikan lagi sepi nih? Kuy lah merapat instal alat kita biar ga gabut di laut! Dijamin gokil abis! 🎣⚓',
        visual: '🤪 GIF penguin berjoget dengan kacamata hitam.',
        hashtagOptions: ['#Woles', '#MancingGokil', '#SmartLogistics', '#FleetEfficiency'],
        correctHashtags: ['#Woles', '#MancingGokil'],
        isCorrect: false,
        explanation: 'Bahasa tidak profesional menurunkan kredibilitas produk teknologi B2B.'
      },
      {
        id: 'c2_3',
        category: 'Analisis Intelijen Pasar',
        content: 'Riset Pasar: Permintaan ikan ekspor meningkat 12% YoY. Kapal yang mengadopsi integrasi IoT dan dashboard data real-time memimpin margin pasar.',
        visual: '📊 Diagram batang menunjukkan pangsa pasar kapal berteknologi vs tradisional.',
        hashtagOptions: ['#MarketIntelligence', '#SupplyChainData', '#CaptainCry', '#MancingGokil'],
        correctHashtags: ['#MarketIntelligence', '#SupplyChainData'],
        isCorrect: true,
        explanation: 'Analisis berbasis riset pasar membuktikan nilai strategis produk.'
      },
      {
        id: 'c2_4',
        category: 'Meme Konyol',
        content: 'Meme: Ketika bos kapal melihat tagihan solar kapal membengkak. *Plis beli alat kita ya biar ga sedih lagi hehe.*',
        visual: '🖼️ Meme kucing menangis yang diberi topi kapten kapal.',
        hashtagOptions: ['#FuelCrisis', '#CaptainCry', '#MarketIntelligence', '#SupplyChainData'],
        correctHashtags: ['#FuelCrisis', '#CaptainCry'],
        isCorrect: false,
        explanation: 'Meme konyol tanpa data tidak disukai oleh investor profesional.'
      },
      {
        id: 'c2_5',
        category: 'Pameran Produk IoT',
        content: 'Demo Dashboard: Integrasikan sensor suhu lemari es kapal secara real-time ke cloud untuk mencegah pembusukan ikan tangkapan (zero spoilage).',
        visual: '📱 Mockup dashboard aplikasi dengan metrik suhu dan alarm peringatan.',
        hashtagOptions: ['#BusinessIntelligence', '#RealTimeMonitoring', '#Woles', '#FuelCrisis'],
        correctHashtags: ['#BusinessIntelligence', '#RealTimeMonitoring'],
        isCorrect: true,
        explanation: 'Menunjukkan fungsionalitas sistem monitoring data secara konkret.'
      }
    ]
  },
  {
    id: 3,
    title: 'Eco-Glamping Premium Arktik',
    concept: 'Premium Niche & Lifestyle Marketing',
    targetAudience: 'Wisatawan Ramah Lingkungan Kelas Atas',
    objective: 'Promosikan paket liburan kemah mewah ramah lingkungan kepada turis beranggaran besar.',
    likes: [
      'Estetika minimalis dan eksklusif',
      'Keindahan dan keheningan alam murni',
      'Komitmen penuh pelestarian habitat',
      'Kenyamanan premium & lokalitas organik'
    ],
    dislikes: [
      'Promosi wisata massal yang bising',
      'Diskon murah-meriah berteriak',
      'Spekulasi komersial lahan liar kutub',
      'Gaya bahasa heboh berlebihan'
    ],
    scoreXP: 33,
    adChannels: [
      { id: 'influencer', name: 'TikTuk Influencer Outreach', desc: 'Sponsorship video kreatif dengan pembuat konten muda.', targetMatch: false },
      { id: 'search', name: 'Search Engine Sponsored Ads', desc: 'Iklan teks berbayar di hasil pencarian kata kunci formal.', targetMatch: false },
      { id: 'blog', name: 'Premium Travel Blogs', desc: 'Penempatan banner artikel di portal wisata alam mewah.', targetMatch: true }
    ],
    deck: [
      {
        id: 'c3_1',
        category: 'Gaya Hidup Premium',
        content: 'Rasakan kedamaian mutlak di bawah kilau Aurora Borealis dari dalam dome kaca terisolasi kami. Kehangatan eksklusif dengan emisi karbon nol.',
        visual: '🌌 Foto estetis dome kaca berkilau di bawah langit aurora hijau menyala.',
        hashtagOptions: ['#LuxuryEcoTravel', '#ArcticAurora', '#CheapTour', '#RetailKutub'],
        correctHashtags: ['#LuxuryEcoTravel', '#ArcticAurora'],
        isCorrect: true,
        explanation: 'Menawarkan perpaduan estetika, keheningan alam murni, dan kemewahan nol emisi.'
      },
      {
        id: 'c3_2',
        category: 'Tur Massal Bising',
        content: 'PROMO GILA! Tur Ekstrim Naik Kereta Salju Sled! Teriak sekencang mungkin melintasi habitat penguin liar! Diskon 70% hanya hari ini!',
        visual: '📢 Banner merah mencolok bertuliskan "DISKON GILA" penuh tanda seru.',
        hashtagOptions: ['#SleddingExtreme', '#CheapTour', '#LuxuryEcoTravel', '#ArcticAurora'],
        correctHashtags: ['#SleddingExtreme', '#CheapTour'],
        isCorrect: false,
        explanation: 'Wisata massal bising dan promo murahan tidak disukai oleh turis kelas atas.'
      },
      {
        id: 'c3_3',
        category: 'Eksplorasi Terbatas',
        content: 'Perjalanan edukasi gletser purba dipandu oleh ahli glasiologi lokal. Jumlah peserta dibatasi ketat demi melindungi integritas ekologi setempat.',
        visual: '🚶 Foto jarak jauh sekelompok kecil penjelajah berjalan rapi di atas salju murni.',
        hashtagOptions: ['#ResponsibleTourism', '#GlacierExpedition', '#RetailKutub', '#SleddingExtreme'],
        correctHashtags: ['#ResponsibleTourism', '#GlacierExpedition'],
        isCorrect: true,
        explanation: 'Eksklusivitas dan perlindungan ekologi adalah nilai jual utama eco-tourism premium.'
      },
      {
        id: 'c3_4',
        category: 'Komersialisasi Agresif',
        content: 'Investasi Kavling Es Komersial! Beli Lahan strategis dekat sarang singa laut untuk dibangun pusat perbelanjaan kutub pertama! Dijamin cuan besar!',
        visual: '🏢 Render 3D mal bertingkat di atas es mencair dengan singa laut terusir.',
        hashtagOptions: ['#RealEstateArctic', '#RetailKutub', '#ResponsibleTourism', '#GlacierExpedition'],
        correctHashtags: ['#RealEstateArctic', '#RetailKutub'],
        isCorrect: false,
        explanation: 'Komersialisasi agresif yang mengancam alam sangat ditolak oleh wisatawan lingkungan.'
      },
      {
        id: 'c3_5',
        category: 'Eco-Luxury Fasilitas',
        content: 'Menyajikan kenyamanan maksimal di tengah alam liar. Pemanas ruangan bertenaga surya arktik dan hidangan laut organik bersertifikat lokal.',
        visual: '🍳 Foto sarapan hangat tertata rapi di samping jendela menghadap gurun es.',
        hashtagOptions: ['#EcoLuxury', '#SustainableLiving', '#RealEstateArctic', '#CheapTour'],
        correctHashtags: ['#EcoLuxury', '#SustainableLiving'],
        isCorrect: true,
        explanation: 'Fasilitas premium bertenaga bersih dan hidangan lokal organik sesuai dengan gaya hidup mereka.'
      }
    ]
  }
];
