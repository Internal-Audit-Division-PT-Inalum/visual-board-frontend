<div align="center">
  <h1>🖥️ Visual Board System - Frontend (Kiosk)</h1>
  <p><strong>Antarmuka Publik & Kiosk Layar Pabrik (PT INALUM)</strong></p>
  <p>Dibangun menggunakan React 19, TypeScript, dan arsitektur Feature-Sliced Design (FSD) sederhana.</p>

  [![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg)](https://vitejs.dev)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg)](https://typescriptlang.org)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC.svg)](https://tailwindcss.com)
</div>

---

## 📖 Deskripsi Proyek
Repositori ini adalah *source code* untuk aplikasi **Visual Board (Frontend)**. Sistem ini dirancang secara khusus untuk beroperasi sebagai *Kiosk Application* (aplikasi layar penuh yang selalu menyala) di berbagai stasiun kerja atau lorong area pabrik PT INALUM. 

Aplikasi ini terus menerus (secara asinkron) menarik data dari *Backend API* untuk menyajikan:
1. **Dasbor Metrik 5R:** Menampilkan matriks kelengkapan jadwal, skor audit *abnormality*, dan kinerja telemetri (OEE / *Safety Streak*).
2. **Mading Digital (Bulletin):** Menjalankan *slider* otomatis berisi pengumuman, pedoman perusahaan, atau poster digital (termasuk fitur pembaca PDF bawaan).
3. **Papan Absensi Karyawan:** Menampilkan statistik kehadiran dan foto karyawan per departemen secara aktual (*real-time*).

## 🏗️ Arsitektur & Teknologi
Untuk memastikan performa Kiosk tidak bocor (*memory leak*) setelah menyala berhari-hari dan kode mudah dipelihara, proyek ini menerapkan pendekatan **Feature-based Folder Structure**.

**Teknologi Utama:**
*   **Engine & Build Tool:** React 19 & Vite 7 (Sangat cepat saat HMR).
*   **Bahasa Pemrograman:** TypeScript (Keamanan *type-hinting* ketat menggunakan antarmuka khusus di `src/types`).
*   **Styling & UI Kit:** Tailwind CSS v4 & shadcn/ui (Komponen UI fungsional untuk aksesibilitas dan modularitas).
*   **Data Fetching & Caching:** TanStack React Query v5 (Secara otomatis menyegarkan data di layar Kiosk tanpa perlu *reload* halaman manual).
*   **Routing:** React Router v7.

### Bedah Struktur Direktori
Kami sangat menghindari pola komponen datar (*flat hierarchy*) yang menumpuk. Seluruh logika dipecah berdasarkan area bisnis (*features*):

*   **`src/features/general/`** - Komponen, *hooks*, dan API yang mengurus dasbor matriks 5R, *trend charts* (Recharts), dan antrean temuan audit.
*   **`src/features/bulletin/`** - Mengelola logika pengambilan poster pengumuman, *carousel*, integrasi QR Code, dan tampilan pusat informasi mading.
*   **`src/features/organization/`** - Modul untuk merender statistik absensi, status ketersediaan karyawan, serta hierarki bagan departemen.
*   **`src/features/workstation/`** - Modul isolasi khusus untuk memantau detail penugasan area kerja (*Workstation*) tiap karyawan.
*   **`src/components/`** - Hanya berisi komponen visual murni yang bisa dipakai ulang (tombol, label status, bingkai tata letak Kiosk utama).
*   **`src/pages/`** - Bertindak sebagai kanvas utama. Tugasnya hanya menyatukan modul-modul dari folder `features` dan meneruskannya ke Router.
*   **`src/lib/`** - Pengaturan klien Axios (*interceptors* sentral) dan utilitas *class-merger* bawaan komponen shadcn.

---

## 🚀 Kebutuhan Sistem
Siapkan mesin pengembangan Anda dengan memastikan alat-alat berikut terpasang:
*   Node.js (versi 20.x ke atas direkomendasikan)
*   NPM (versi 10.x ke atas)

---

## ⚙️ Panduan Menjalankan Aplikasi di Lokal
Langkah demi langkah untuk menyalakan mode pengembangan (*development*):

1. **Kloning Repositori**
   ```bash
   git clone https://github.com/Internal-Audit-Division-PT-Inalum/visual-board-frontend.git
   cd visual-board-frontend
   ```

2. **Tarik Dependensi (NPM)**
   ```bash
   npm install
   ```

3. **Atur Variabel Lingkungan**
   Anda perlu mengarahkan *URL Endpoint* ke *Backend Laravel* yang sedang berjalan. Buat kopian dari *file template* lingkungan yang tersedia.
   ```bash
   cp .env.example .env
   ```
   *Buka file `.env` dan pastikan konfigurasi jaringan `VITE_API_BASE_URL` mengarah ke alamat jaringan lokal server backend Anda. (Catatan: CORS untuk penyimpanan lokal `/storage` sudah otomatis ditangani melalui Vite Proxy).*

4. **Jalankan *Development Server***
   ```bash
   npm run dev
   ```
   Aplikasi akan otomatis menyala di peramban Anda (secara bawaan di `http://localhost:5173`).

---

## 🛠️ Panduan Membangun (Build) untuk *Production*
Jika aplikasi ini hendak dipasang permanen di mesin Kiosk Pabrik (seperti mini PC atau Raspberry Pi), Anda harus membundelnya menjadi sekumpulan file statis agar berjalan maksimal tanpa beban mesin *Node.js*.

1. **Jalankan Proses *Build***
   ```bash
   npm run build
   ```
   *Perintah ini akan melakukan validasi tipe (TypeScript) secara menyeluruh, lalu menekan (*minify*) seluruh aset ke dalam folder `/dist`.*

2. **Uji Coba Hasil *Build***
   ```bash
   npm run preview
   ```

3. **Distribusi / Deployment**
   Letakkan isi keseluruhan direktori `/dist` ke dalam mesin *web server* andalan Anda (Nginx, Apache, atau langsung dijalankan via ekstensi *Live Server* / Caddy di PC Kiosk). 
   
   **PENTING:** Pastikan *web server* diatur untuk membelokkan (*fallback/redirect*) semua rute URL (misalnya jika me-refresh halaman `/schedule`) kembali ke `index.html`. Hal ini wajib dilakukan karena aplikasi dirancang sebagai *Single Page Application* (SPA).

---

## 🧪 Aturan Penulisan Kode Internal (*Code Standards*)
Bagi anggota tim pengembang atau kontributor, harap patuhi tiga prinsip utama ini:
1. **Gunakan Linter Bawaan (Biome):** Proyek ini sepenuhnya mengandalkan Biome untuk pengecekan kualitas (*linting*) dan pemformatan kode (*formatting*). Pastikan Editor Anda dikonfigurasi untuk menjalankan Biome saat menyimpan berkas (atau jalankan `npm run format`).
2. **Dilarang *Fetch* Data Secara Terbuka:** Dilarang keras memanggil `axios.get()` telanjang di dalam `useEffect`. Gunakan dan definisikan `useQuery` (React Query) di dalam folder `features/.../api/` lalu impor *hook* tersebut di komponen.
2. **Ketat dengan Tipe Data API:** Semua struktur JSON yang kembali dari API mutlak harus memiliki *Interface* TypeScript yang terdefinisi rapi di dalam `src/types/api.ts`.
3. **Jaga Komponen Tetap Ramping:** Pecah elemen UI yang kompleks menjadi berkas-berkas terpisah di dalam direktori `components` fiturnya masing-masing. Jangan membiarkan satu *file* mencapai lebih dari 300 baris kode.
