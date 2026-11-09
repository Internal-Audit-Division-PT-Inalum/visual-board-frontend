<div align="center">

<img src="https://vitejs.dev/logo.svg" width="70" alt="Vite Logo" />
&nbsp;&nbsp;
<img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="70" alt="React Logo" />

# visual-board-frontend

**Aplikasi Layar Publik & Kiosk — Visual Board 5R & Telemetri Divisi Internal Audit PT INALUM**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Biome](https://img.shields.io/badge/Linter-Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev/)
[![Vitest](https://img.shields.io/badge/Testing-Vitest-FCC72B?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*Portal antarmuka layar sentuh (*Smart Kiosk*) dan display TV pabrik 24/7 untuk mengawal kedisiplinan 5R, pengumuman mading digital, matriks organisasi, status katalog inventaris publik, serta endpoint presensi gawai berbasis kode QR terintegrasi.*

</div>

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Arsitektur Sistem & FSD](#arsitektur-sistem--fsd)
- [Fitur Utama](#fitur-utama)
  - [1. Smart TV Kiosk Engine (Auto-Play & Playlist)](#1-smart-tv-kiosk-engine-auto-play--playlist)
  - [2. Dasbor Utama 5R (General)](#2-dasbor-utama-5r-general)
  - [3. Matriks Kalender Piket (Schedule 5R)](#3-matriks-kalender-piket-schedule-5r)
  - [4. Struktur Organisasi & Presensi (Organization)](#4-struktur-organisasi--presensi-organization)
  - [5. Mading Digital & Universal PDF Viewer (Department Hub)](#5-mading-digital--universal-pdf-viewer-department-hub)
  - [6. Katalog Inventaris Publik (Inventory Display)](#6-katalog-inventaris-publik-inventory-display)
  - [7. Evaluasi & Panduan 5R (Self Assessment)](#7-evaluasi--panduan-5r-self-assessment)
  - [8. Presensi Gawai Karyawan (Mobile Attendance QR Endpoint)](#8-presensi-gawai-karyawan-mobile-attendance-qr-endpoint)
- [Teknologi & Dependensi](#teknologi--dependensi)
- [Persyaratan Sistem](#persyaratan-sistem)
- [Panduan Instalasi & Menjalankan](#panduan-instalasi--menjalankan)
- [Konfigurasi Lingkungan (.env & Vite Proxy)](#konfigurasi-lingkungan-env--vite-proxy)
- [Struktur Rute & Parameter URL](#struktur-rute--parameter-url)
- [Modul Fitur (Feature-Sliced Design)](#modul-fitur-feature-sliced-design)
- [Sistem Komponen UI & shadcn/ui](#sistem-komponen-ui--shadcnui)
- [Manajemen State & Data Fetching (TanStack Query)](#manajemen-state--data-fetching-tanstack-query)
- [Kualitas Kode, Linting & Pengujian](#kualitas-kode-linting--pengujian)
- [Build & Deployment TV Kiosk Produksi](#build--deployment-tv-kiosk-produksi)
- [Struktur Repositori](#struktur-repositori)
- [Keamanan & Anti-Memory Leak](#keamanan--anti-memory-leak)

---

## Gambaran Umum

`visual-board-frontend` adalah aplikasi antarmuka Single Page Application (SPA) berbasis web modern yang didesain khusus untuk berjalan secara tangguh (*resilient*) di layar TV pabrik dan mesin anjungan (*Kiosk*) 24 jam sehari, 7 hari seminggu tanpa henti.

Aplikasi ini menyajikan visualisasi data terpadu untuk Divisi Internal Audit PT INALUM:
1. **Pemantauan Disiplin 5R**: Visualisasi skor kebersihan zona, matriks piket harian, dan lini masa abnormalitas lantai kerja.
2. **Keterbukaan Informasi**: Mading digital resolusi tinggi dengan kemampuan *preview* dokumen PDF resmi tanpa konflik ekstensi peramban.
3. **Telemetri Personel & Aset**: Status absensi aktual, peta penugasan zona, dan visibilitas katalog inventaris publik secara *real-time*.
4. **Presensi Mandiri**: Integrasi kode QR dinamis yang menghubungkan ponsel cerdas karyawan ke modul presensi berbasis web mobile.

Aplikasi ini dibangun menggunakan arsitektur **Feature-Sliced Design (FSD)** yang memisahkan perhatian (*separation of concerns*) berdasarkan wilayah bisnis, menghasilkan basis kode yang modular, mudah diuji, dan skalabel.

---

## Arsitektur Sistem & FSD

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      Layar Kiosk / TV Display (SPA)                     │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                     React Router DOM v7                        │    │
│  │                                                               │    │
│  │  [ / ] → <AppShell /> (Kiosk Shell + Auto-Play Engine)        │    │
│  │          ├── Header (Jam Real-time, Navigasi Tab, Tombol QR) │    │
│  │          ├── Scroll Container (Sine Easing Smooth Scroller)   │    │
│  │          │   ├── ?tab=general           → <General />          │    │
│  │          │   ├── ?tab=schedule_5r       → <Schedule5R />      │    │
│  │          │   ├── ?tab=organization      → <Organization />    │    │
│  │          │   ├── ?tab=department_hub    → <DepartmentHub />   │    │
│  │          │   ├── ?tab=inventory         → <Inventory />       │    │
│  │          │   └── ?tab=self_assessment   → <Assessment />      │    │
│  │          └── Footer (Running Ticker & Copyright Status)       │    │
│  │                                                               │    │
│  │  [ /presensi ] → <MobileAttendance /> (Standalone PWA Landing)│    │
│  └──────────────────────────────┬────────────────────────────────┘    │
│                                 │                                      │
│  ┌──────────────────────────────▼────────────────────────────────┐    │
│  │                 Feature Modules (FSD Domain)                  │    │
│  │                                                               │    │
│  │  bulletin · general · inventory · organization · workstation  │    │
│  │                                                               │    │
│  │  Struktur baku per modul:                                     │    │
│  │    api/         ← TanStack Query hooks + Axios fetcher        │    │
│  │    components/  ← Komponen visual spesifik domain bisnis      │    │
│  └──────────────────────────────┬────────────────────────────────┘    │
│                                 │                                      │
│  ┌──────────────────────────────▼────────────────────────────────┐    │
│  │                    Shared Infrastructure                      │    │
│  │  src/components/ui/     ← shadcn/ui primitives (Radix/Base-UI)│    │
│  │  src/components/shared/ ← DocumentViewerModal (Anti-IDM PDF)  │    │
│  │  src/hooks/             ← useKioskAutoPlay, useClock          │    │
│  │  src/lib/api.ts         ← Axios client instance + interceptor │    │
│  │  src/types/api.ts       ← TypeScript strictly-typed interfaces│    │
│  └──────────────────────────────┬────────────────────────────────┘    │
│                                 │ HTTP JSON REST API                   │
└─────────────────────────────────┼──────────────────────────────────────┘
                                  │
                  ┌───────────────▼──────────────────┐
                  │    Backend REST API (Laravel)    │
                  │    /api/visual-board/...         │
                  │    /api/v1/inventory/...         │
                  └──────────────────────────────────┘
```

---

## Fitur Utama

### 1. Smart TV Kiosk Engine (Auto-Play & Playlist)
- **Rotasi Adegan Otomatis (*Scene Playlist*)**: Mengorkestrasi pergantian tab dan sub-tab secara terjadwal dengan durasi optimal untuk tayangan TV publik:
  - `general`: 20 detik
  - `schedule_5r`: 20 detik
  - `organization` (Struktur): 15 detik
  - `organization` (Peta Area): 15 detik
  - `organization` (Absensi): 15 detik
  - `department_hub` (Index Mading): 15 detik
  - `department_hub` (Kategori Umum, K3, Event, Policy, COG/SOR): masing-masing 10 detik
  - `inventory`: 20 detik
  - `self_assessment`: 15 detik
- **Sine Easing Smooth Auto-Scroll**: Menggulirkan konten halaman vertikal secara halus dari atas ke bawah sebelum berpindah adegan berikutnya.
- **Screen WakeLock API**: Mengunci layar peramban agar TV tidak mati (*sleep/standby*) secara otomatis.
- **Idle Detection & Touch Interruption**: Jika staf menyentuh layar, menggeser kursor, atau menekan tombol, mode putar otomatis seketika dihentikan sementara (*PAUSED*). Setelah 15 detik tidak ada aktivitas (*idle*), playlist otomatis melanjutkan rotasi (*RESUMED*).
- **Aktivasi URL Flag**: Cukup tambahkan parameter `?kiosk=true` pada URL untuk mengaktifkan seluruh orkestrasi otomatis.

### 2. Dasbor Utama 5R (General)
- **Blue Glassmorphism UI**: Tampilan kelas industri berlatar gradasi lembut, kartu kaca (*glass card*), dan tipografi *Plus Jakarta Sans* yang ergonomis.
- **Ringkasan KPI Disiplin**: Menampilkan hari kerja aktif, skor rata-rata 5R, dan peringatan abnormalitas aktif.
- **Leaderboard Kaizen & K3**: Visualisasi kontribusi ide perbaikan (Kaizen) per karyawan serta pelacak Hari Bebas Kecelakaan (*Zero Accident Tracker*).
- **Abnormality Feed**: Lini masa real-time status temuan ketidaksesuaian 5R yang membutuhkan tindakan korektif.

### 3. Matriks Kalender Piket (Schedule 5R)
- **Grid Kalender Interaktif**: Memetakan jadwal kebersihan 5R per hari dalam bulan berjalan.
- **Ceklis Kriteria 5R**: Pemantauan kepatuhan *Ringkas, Rapi, Resik, Rawat, Rajin* per zona kerja.

### 4. Struktur Organisasi & Presensi (Organization)
- **Hierarki Organisasi Internal**: Visualisasi bagan departemen, manajer, tim audit, dan staf pendukung.
- **Peta Lokasi Area Kerja**: Peta denah interaktif yang memetakan stasiun kerja dan penanggung jawabnya.
- **Statistik Kehadiran Harian**: Rekapitulasi jumlah staf yang hadir (*present*), dinas luar (*business trip*), izin, maupun sakit.

### 5. Mading Digital & Universal PDF Viewer (Department Hub)
- **Pusat Pengumuman & Kebijakan**: Saluran komunikasi digital untuk kebijakan internal, panduan K3 (*Safety*), kegiatan korporat, dan standarisasi operasional (COG/SOR).
- **Universal Document Viewer Modal**: Solusi penampil berkas PDF dan gambar beresolusi tinggi menggunakan kontainer terisolasi berbekal Vite Proxy. Terbukti kebal terhadap blokir CORS dan gangguan ekstensi *download manager* (seperti IDM) yang kerap merusak rendering dokumen PDF pada peramban.

### 6. Katalog Inventaris Publik (Inventory Display)
- **Visibilitas Logistik Transparan**: Tab khusus (`?tab=inventory`) yang menampilkan katalog aset dan barang habis pakai di ruang audit.
- **Monitoring Lokasi & Status**: Menampilkan stok tersedia, batas minimum stok (*low-stock badge*), dan status peminjaman aset tanpa memerlukan otentikasi login pada TV Kiosk.

### 7. Evaluasi & Panduan 5R (Self Assessment)
- **Dokumen Panduan Standar**: Daftar materi penilaian mandiri 5R, kriteria audit lingkungan kerja, dan berkas acuan inspeksi.
- **Akses Cepat Unduh & Baca**: Membuka langsung berkas panduan ke dalam *Document Viewer Modal*.

### 8. Presensi Gawai Karyawan (Mobile Attendance QR Endpoint)
- **Floating QR Code**: Kode QR dinamis yang dapat diklik atau dipindai langsung dari header Kiosk.
- **Halaman Presensi Mandiri (`/presensi`)**: Halaman responsif yang dirancang untuk layar gawai (*smartphone*) karyawan untuk mencatatkan kehadiran secara cepat dan higienis.

---

## Teknologi & Dependensi

| Kategori | Paket / Pustaka | Versi | Peran & Kegunaan |
|---|---|---|---|
| **UI Framework** | React | `^19.2.0` | Library utama perender komponen berbasis Virtual DOM |
| **Bahasa** | TypeScript | `~5.9.3` | Pengetikan statis ketat (*type safety*) |
| **Build Tool & Bundler** | Vite + `@vitejs/plugin-react` | `^7.x` / `^5.1.1` | Peladen pengembang HMR instan & bundler rollup |
| **Routing** | React Router DOM | `^7.18.4` | Manajemen rute dan sinkronisasi parameter URL |
| **Manajemen Server State**| TanStack Query | `^5.102.8` | Pengambilan data, *caching*, dan *auto-refresh* |
| **Klien HTTP** | Axios | `^1.20.0` | Komunikasi REST API dengan backend Laravel |
| **Styling & Desain** | Tailwind CSS v4 | `^4.1.18` | Desain utilitas modern berbasis CSS Variables |
| **Komponen UI Primitives**| shadcn/ui + `@base-ui/react` | `^4.21.0` | Komponen aksesibel tanpa dependensi gaya kaku |
| **Tipografi** | Plus Jakarta Sans & Geist | `^5.3.0` | Huruf standar industri dan keterbacaan tinggi |
| **Ikonografi** | Lucide React | `^1.46.0` | Koleksi ikon SVG modern berbobot ringan |
| **QR Code Engine** | qrcode.react | `^4.2.0` | Pembangkit kode QR SVG untuk presensi mobile |
| **Notifikasi Toast** | Sonner | `^2.0.8` | Sistem umpan balik interaksi toast mengambang |
| **Linter & Formatter** | Biome | `2.5.14` | Pemeriksa sintaks dan pemformat kode secepat kilat |
| **Unit & Component Test** | Vitest + Testing Library | `^5.0.5` | Mesin uji unit dan integrasi layout komponen |

---

## Persyaratan Sistem

Pastikan lingkungan komputer pengembang atau perangkat TV Kiosk Anda memenuhi syarat berikut:

| Perangkat Lunak | Versi Minimal yang Disarankan |
|---|---|
| **Node.js** | `>= 20.x LTS` (Disarankan Node 22) |
| **npm** | `>= 10.x` |
| **Backend API** | `visual-board-inventory-backend` menyala di port `8000` |
| **Peramban Target** | Google Chrome / Chromium `>= 120` (Mendukung Screen WakeLock) |

---

## Panduan Instalasi & Menjalankan

### 1. Kloning Repositori
```bash
git clone https://github.com/Internal-Audit-Division-PT-Inalum/visual-board-frontend.git
cd visual-board-frontend
```

### 2. Instalasi Paket Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan
Buat berkas `.env` dari salinan contoh:
```bash
cp .env.example .env
```

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Aplikasi dapat diakses melalui:
- Mode Layar Normal: `http://localhost:5173/`
- Mode TV Kiosk Otomatis: `http://localhost:5173/?kiosk=true`
- Endpoint Presensi Gawai: `http://localhost:5173/presensi`

---

## Konfigurasi Lingkungan (.env & Vite Proxy)

Secara bawaan berkas `.env` mengatur konfigurasi alamat API:
```env
VITE_API_BASE_URL=/api
```

### Mekanisme Vite Reverse Proxy
Untuk meniadakan kendala **CORS (*Cross-Origin Resource Sharing*)** serta mengamankan pemuatan dokumen mading dari gangguan pengunduh berkas (*IDM / Chrome download interrupter*), Vite dikonfigurasi sebagai *reverse proxy* di [`vite.config.ts`](file:///c:/Users/LENOVO/Projek/Internal%20Audit%20PT%20Inalum/Visual%20Board%20and%20Inventory%20System/Visual%20Board%20Frontend/vite.config.ts):

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
    '/storage': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```
*Dengan pengaturan ini, permintaan `/api/...` dan `/storage/...` dari peramban akan diteruskan secara transparan ke backend Laravel di port `8000`.*

---

## Struktur Rute & Parameter URL

Aplikasi ini menggunakan perpaduan rute utama dan *search parameters* mendalam agar posisi tab tetap terjaga saat terjadi penyegaran (*refresh*) halaman:

| Rute URL | Parameter Tab (`?tab=`) | Komponen Halaman | Modul FSD | Deskripsi Fungsional |
|---|---|---|---|---|
| `/` | `general` *(default)* | `<General />` | `features/general` | Dasbor utama metrik 5R, Kaizen, dan abnormality |
| `/` | `schedule_5r` | `<Schedule5R />` | `features/general` | Matriks kalender jadwal piket 5R per zona |
| `/` | `organization` | `<Organization />` | `features/organization` | Struktur hierarki departemen, peta area, & absensi |
| `/` | `department_hub` | `<DepartmentHub />` | `features/bulletin` | Pusat mading digital, SOP, policy, & viewer PDF |
| `/` | `inventory` | `<Inventory />` | `features/inventory` | Katalog aset publik & ketersediaan inventaris |
| `/` | `self_assessment` | `<Assessment />` | `features/general` | Materi evaluasi mandiri & dokumen kepatuhan 5R |
| `/presensi` | — | `<MobileAttendance />`| *(Standalone)* | Endpoint presensi mandiri gawai via scan QR |

---

## Modul Fitur (Feature-Sliced Design)

Setiap direktori di bawah `src/features/` berfungsi mandiri dengan batas tanggung jawab domain yang jelas:

```text
src/features/
├── bulletin/
│   ├── api/          # useBulletins, useBulletinCategories, useCreateBulletin
│   └── components/   # BulletinCard, BulletinGrid, CategoryFilter
├── general/
│   ├── api/          # useKioskData, useZoneDetails, useAbnormalities
│   └── components/   # MetricsSummary, KaizenLeaderboard, ScheduleMatrix
├── inventory/
│   ├── api/          # useKioskInventory (Endpoint publik /v1/inventory/kiosk)
│   └── components/   # InventoryBoard, ItemCard, LocationSection
├── organization/
│   ├── api/          # useAttendanceSummary, useEmployees, useOrganizationDocs
│   └── components/   # DivisionEmployees, AttendanceList, AreaMapViewer
└── workstation/
    ├── api/          # useWorkstationByEmployee, useZoneAssignment
    └── components/   # WorkstationBadge, ZoneCard
```

---

## Sistem Komponen UI & shadcn/ui

Elemen antarmuka generik dibangun menggunakan pustaka standar industri **shadcn/ui** yang tersimpan di `src/components/ui/`:
- `badge.tsx`: Label status (Hadir, Aman, Low Stock, Warning).
- `button.tsx`: Tombol interaktif dengan varian standar, outline, dan ghost.
- `card.tsx`: Kontainer kartu dengan efek bayangan dan border modern.
- `dialog.tsx`: Jendela modal berbasis Radix/Base-UI primitive.
- `skeleton.tsx`: Efek pemuatan berkedip (*shimmer loading*) untuk pengalaman pengguna yang halus.

### Komponen Universal Kustom
- **`DocumentViewerModal.tsx`**: Modal terisolasi yang mampu menampilkan berkas PDF dan citra beresolusi tinggi langsung di dalam kanvas layar Kiosk tanpa memicu unduhan lokal di peramban.

---

## Manajemen State & Data Fetching (TanStack Query)

Seluruh panggilan jaringan dikelola oleh TanStack Query v5 dengan konfigurasi optimal untuk layar Kiosk:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Menghindari fetch berlebih saat window switch
      retry: 2,                    // Mentoleransi fluktuasi jaringan mikro
      staleTime: 10_000,           // Data segar selama 10 detik
    },
  },
});
```

Pembaruan otomatis data Kiosk dilakukan di latar belakang secara berkala (misal: `refetchInterval: 300_000` atau setiap 5 menit) untuk menjamin informasi di TV selalu mutakhir tanpa perlu memuat ulang seluruh peramban.

---

## Kualitas Kode, Linting & Pengujian

Aplikasi ini menerapkan standar kualitas kode yang ketat sebelum kode dapat digabungkan (*merge*):

| Perintah | Deskripsi |
|---|---|
| `npm run lint` | Menjalankan linter Biome untuk mendeteksi potensi masalah sintaks dan aksesibilitas |
| `npm run format` | Memformat kode secara otomatis sesuai standar konvensi Biome |
| `npm run check` | Menjalankan diagnosa Biome sekaligus menerapkan pemformatan kode secara langsung |
| `npx tsc -b` | Memverifikasi seluruh tipe data TypeScript (*Strict Type Checking*) tanpa emisi berkas |
| `npm run test` | Menjalankan seluruh pengujian unit dan layout komponen menggunakan Vitest |
| `npm run test:watch` | Menjalankan pengujian Vitest secara interaktif dalam mode pemantau (*watch mode*) |
| `npm run ci` | Skrip lengkap integrasi berkelanjutan: `biome check && tsc -b && vitest run && vite build` |

---

## Build & Deployment TV Kiosk Produksi

### 1. Kompilasi Aset Produksi
```bash
npm run build
```
Hasil kompilasi bundel teroptimasi akan berada di dalam direktori `dist/`.

### 2. Uji Coba Pratinjau Lokal
```bash
npm run preview
```

### 3. Penerapan di Web Server (Nginx)
Contoh blok konfigurasi Nginx untuk menyajikan Visual Board Kiosk:
```nginx
server {
    listen 80;
    server_name visual-board.internal.inalum.id;

    root /var/www/visual-board-frontend/dist;
    index index.html;

    # Single Page Application Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API Request ke Peladen Backend Laravel
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy Media Storage Dokumen & Mading
    location /storage/ {
        proxy_pass http://127.0.0.1:8000/storage/;
        proxy_set_header Host $host;
    }
}
```

### 4. Otomatisasi Startup Mini-PC / Raspberry Pi (Chromium Kiosk Mode)
Jalankan perintah ini pada berkas autostart OS Kiosk (misal `.bashrc` atau skrip display manager):
```bash
chromium-browser \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --check-for-update-interval=31536000 \
  "http://visual-board.internal.inalum.id/?kiosk=true"
```

---

## Struktur Repositori

```text
visual-board-frontend/
├── public/                      # Aset statis favicon dan gambar publik
├── src/
│   ├── components/
│   │   ├── layout/              # Cangkang aplikasi (AppShell, AppHeader, Footer)
│   │   ├── shared/              # Komponen bersama (DocumentViewerModal)
│   │   └── ui/                  # Komponen primitif shadcn/ui
│   ├── features/                # Modul domain Feature-Sliced Design (FSD)
│   │   ├── bulletin/            # Mading digital & kategori pengumuman
│   │   ├── general/             # Dasbor 5R, Kaizen, abnormality, & matriks
│   │   ├── inventory/           # Tampilan katalog inventaris publik & status stok
│   │   ├── organization/        # Struktur organisasi, absensi, & denah area
│   │   └── workstation/         # Penugasan stasiun kerja per karyawan
│   ├── hooks/                   # Custom React hooks (useKioskAutoPlay, useClock)
│   ├── lib/                     # Klien Axios & fungsi utilitas helper
│   ├── pages/                   # Komponen halaman per rute utama
│   │   ├── Assessment.tsx       # Evaluasi mandiri kepatuhan 5R
│   │   ├── DepartmentHub.tsx    # Halaman mading dan dokumen kebijakan
│   │   ├── General.tsx          # Halaman beranda telemetri 5R
│   │   ├── Inventory.tsx        # Halaman display inventaris ruangan
│   │   ├── MobileAttendance.tsx # Endpoint presensi mandiri gawai (QR landing)
│   │   ├── Organization.tsx     # Halaman hierarki dan absensi karyawan
│   │   └── Schedule5R.tsx       # Halaman matriks kalender piket 5R
│   └── types/
│       └── api.ts               # Deklarasi tipe antarmuka TypeScript untuk JSON API
├── biome.json                   # Konfigurasi linter & formatter Biome
├── package.json                 # Skrip build dan daftar dependensi pustaka
├── tsconfig.json                # Pengaturan kompilator TypeScript
├── vite.config.ts               # Konfigurasi bundler Vite dan reverse proxy
└── vitest.config.ts             # Konfigurasi lingkungan pengujian Vitest
```

---

## Keamanan & Anti-Memory Leak

1. **Pembersihan Event Listener & Timer**: `useKioskAutoPlay` dan `useClock` selalu menyertakan fungsi *cleanup* pada `useEffect` guna mencegah kebocoran memori (*memory leak*) saat aplikasi menyala tanpa henti selama berbulan-bulan.
2. **Isolasi Iframe Dokumen**: Penampil dokumen PDF menggunakan atribut isolasi aman yang membatasi hak akses skrip berbahaya dari berkas eksternal.
3. **Penyembunyian Navigasi Internal**: Kiosk berjalan tanpa mengekspos formulir manipulasi data — seluruh interaksi pada layar publik bersifat *read-only*, sedangkan aksi pencatatan presensi dialihkan secara aman ke gawai masing-masing karyawan lewat enkripsi HTTPS.

---

<div align="center">
  <sub>Dibangun dan dirawat dengan dedikasi tinggi untuk Divisi Internal Audit PT INALUM.</sub><br />
  <sub>Dirancang tangguh, responsif, dan elegan untuk operasional pabrik 24/7.</sub>
</div>
