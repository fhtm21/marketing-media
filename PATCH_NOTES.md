# Patch Notes - Release Release v2.0.0 🚀

**Tanggal Rilis**: 29 Juni 2026  
**Status**: Stable Production Ready  
**Target Platform**: Desktop & Mobile Safari/Chrome (Responsive Zone)

---

## 📈 Rangkuman Rilis v2.0.0
Pembaruan skala besar ini menandai **selesainya seluruh modul inti (5 Modul)** di simulasi **Polar IT Portal**, perbaikan total tata letak visual **GameHub** bertema cyberpunk, serta perancangan ulang sistem navigasi **PolarHub** berdasarkan prinsip-prinsip kegunaan UI/UX.

---

## 🛠️ Daftar Perubahan & Fitur Baru

### 1. 🗄️ Modul 4: Data Stream Sorter (Database Management)
*   **Gameplay Baru**: Antarmuka jatuh dinamis di mana paket data (*data transaction, metadata, error log*) mengalir dari atas layar, dan pemain harus mengurutkannya ke tabel penyimpanan relasional sebelum membanjiri sistem.
*   **Desain Cyber Grid**: Latar belakang bermotif laser neon biru dengan dekorasi ikon yang mewakili tiap tipe paket data secara taktis.

### 2. 🧭 Modul 5: Expedition Sprint (Agile Management)
*   **Turn-Based Strategy**: Mengatur penugasan kartu peran tim ekspedisi (Scout, Engineer, Medic, Analyst, Leader) ke obstacle yang muncul secara acak (blizzard, GPS error, low morale, dll) menggunakan Action Points (AP).
*   **Perfect Clear Bonus**: Tambahan **`+15 XP`** apabila pemain berhasil menyelesaikan seluruh obstacle dalam satu fase sprint tanpa terkena damage sama sekali.
*   **Interactive Manual**: Panduan bantuan taktis (`❓ MANUAL`) di dalam game yang dapat diakses langsung oleh pemain kapan pun melalui pintasan keyboard (`Esc`, `Enter`, `1-5`) atau klik modal.

### 3. 📂 Cyberpunk GameHub & Student Dossier
*   **Cyberpunk Makeover**: Penataan ulang elemen navigasi dengan layout modern dan warna neon berpendar (*slanted layout*).
*   **Dossier Siswa**: Penambahan kartu profil **`COGNITIVE DOSSIER`** mahasiswa pada kolom kanan atas bertuliskan spesifikasi credentials `VOYAGER // USER_081` program studi `DBI & Business IT Candidate`.

### 4. 🐧 PolarHub UI/UX Usability Remake
*   **Unified Tap Target**: Menggabungkan tombol timeline lingkaran kiri dan kartu kanan menjadi satu **tombol kartu utuh terpadu (*Unified Card*)** untuk memperluas area interaksi sentuh (*comfort UI/UX zones*).
*   **Guided Journey Target**: Banner instruksi dinamis di bagian atas timeline yang memberi petunjuk eksplisit modul apa yang harus diselesaikan selanjutnya, dilengkapi tombol pintas jalan akses langsung stasiun.
*   **Comfort Font Resizing**: Menaikkan ukuran seluruh teks kritis agar mudah dibaca oleh siswa SMA/K (judul stasiun naik ke **16px**, teks deskripsi konsep naik ke **13px**, judul target panduan naik ke **11px**).

---

## 🐛 Perbaikan Bug & Optimasi
*   **Bugfix Penghitungan Survival**: Memperbaiki pencatatan `sprintsDone` yang bertambah salah saat HP pinguin mencapai 0. Sistem kini memvalidasi status kelangsungan hidup (HP > 0) secara ketat untuk pencatatan XP dan sertifikat kelulusan.
*   **Optimasi ESLint**: Memperbaiki format *comment line exclusion* untuk hooks dependensi agar program dapat dikompilasi secara bersih.
*   **Performa Ringan**: Ukuran bundel build produksi terkompresi gzip berada di kisaran **143.72 kB**, siap dimuat cepat di jaringan internet seluler menengah.
