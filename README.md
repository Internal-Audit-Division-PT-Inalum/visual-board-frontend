<div align="center">

<img src="https://vitejs.dev/logo.svg" width="80" alt="Vite Logo" />
&nbsp;&nbsp;
<img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="80" alt="React Logo" />

# visual-board-frontend

**Aplikasi Layar Publik & Kiosk — Visual Board 5R PT INALUM**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154?logo=reactquery&logoColor=white)](https://tanstack.com/query)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

*Portal tatap muka layar sentuh (Kiosk) untuk mengawal kedisiplinan 5R di pabrik PT INALUM — menyajikan dasbor tren, pengumuman mading, dan interaksi presensi berbasis QR dalam satu kanvas Single Page Application (SPA) yang elegan.*

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Application Routes](#application-routes)
- [Feature Modules](#feature-modules)
- [UI Component System](#ui-component-system)
- [Data Fetching](#data-fetching)
- [Code Quality](#code-quality)
- [Build & Deployment](#build--deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Security](#security)

---

## Overview

`visual-board-frontend` adalah aplikasi layar publik (*Kiosk SPA*) untuk inisiatif **Visual Board 5R** PT INALUM. Dibangun dengan React 19 dan Vite 7, aplikasi ini bertugas menarik data dari `visual-board-inventory-backend` secara asinkron tanpa henti (*24/7*) untuk menampilkan metrik operasional secara *real-time*.

Aplikasi ini diatur menggunakan arsitektur **Feature-Sliced Design (FSD)** — setiap wilayah fungsional (seperti *mading*, *presensi*, atau *matriks 5R*) beroperasi sebagai modul tertutup dengan lapisan API, komponen, dan deklarasi tipenya masing-masing.

---

## Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│                      Layar Kiosk (SPA)                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   React Router v7                        │    │
│  │   AppShell (AppHeader + Outlet + BottomTicker)           │    │
│  │                                                          │    │
│  │  /general   /mading   /organisasi   /jadwal   /mobile    │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────┐    │
│  │              Feature Modules (FSD Domain)                │    │
│  │                                                          │    │
│  │  bulletin · general · organization · workstation         │    │
│  │                                                          │    │
│  │  Setiap modul memiliki:                                  │    │
│  │    api/         ← fetch axios + TanStack hooks           │    │
│  │    components/  ← React components spesifik domain       │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │                                      │
│  ┌────────────────────────▼────────────────────────────────┐    │
│  │                  Shared Infrastructure                   │    │
│  │  src/components/ui  — shadcn/ui primitive components     │    │
│  │  src/lib/api.ts     — Interceptor Axios & Vite Proxy     │    │
│  │  src/types/api.ts   — TypeScript interfaces (Strict)     │    │
│  └────────────────────────┬────────────────────────────────┘    │
│                           │ HTTP (JSON REST API)                 │
└───────────────────────────┼──────────────────────────────────────┘
                            │
            ┌───────────────▼───────────────────┐
            │    Backend REST API (Laravel)     │
            │    /api/visual-board/...          │
            └───────────────────────────────────┘
```

---

## Features

### 📈 Dasbor Utama 5R (General)
- **Matriks Kelengkapan Piket** — Ceklis *check-sheet* area secara silang (*cross-checking*).
- **Leaderboard Kaizen & K3** — Visualisasi skor ide perbaikan (Kaizen) dan Hari Bebas Kecelakaan.
- **Abnormality Feed** — Lini masa kerusakan/temuan dari lantai pabrik yang masuk secara *real-time*.

### 📰 Mading Digital (Bulletin)
- **Smart Bulletin Board** — Layar interaktif yang menayangkan pengumuman resmi.
- **Universal Document Viewer** — Menggunakan `<iframe src="...">` terisolasi berbekal Vite Proxy. Tahan banting terhadap blokir CORS maupun ekstensi pengunduh (seperti IDM) yang kerap mengacaukan *render* file PDF.

### 👥 Struktur Organisasi (Organization)
- **Statistik Absensi Aktual** — Daftar perbandingan jumlah karyawan yang hadir, sakit, atau cuti.
- **Penampil Hierarki & Peta** — Menampilkan bagan struktur departemen resmi yang diambil langsung dari backend (sekarang menyatu melalui *General Documents*).

### 📍 Stasiun Kerja (Workstation)
- **Peta Lokasi Penugasan** — Melihat secara spesifik karyawan mana yang bertanggung jawab merawat area/zona tertentu pada hari itu.

### 📱 Presensi Gawai (Mobile Attendance)
- **QR Scanner Endpoint** — Halaman khusus (`/mobile`) yang dirancang beroperasi terpisah sebagai tempat mendaratnya kamera *smartphone* saat karyawan memindai kode QR untuk mencatatkan diri.

---

## Tech Stack

| Category | Library | Version |
|---|---|---|
| UI Framework | React | ^19.x |
| Language | TypeScript | ^5.x |
| Build Tool | Vite + `@vitejs/plugin-react` | ^7.x |
| Routing | React Router DOM | ^7.x |
| Server State | TanStack Query (React Query) | ^5.x |
| HTTP Client | Axios | ^1.x |
| Styling | Tailwind CSS v4 | ^4.x |
| Component Library | shadcn/ui | — |
| Linting & Format | Biome | ^1.x |

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 20.x LTS |
| npm | 10.x |

*Pastikan peladen `visual-board-inventory-backend` (Laravel) Anda sudah menyala di `localhost:8000` sebelum menjalankan Kiosk ini.*

---

## Getting Started

### 1. Kloning Repositori

```bash
git clone https://github.com/Internal-Audit-Division-PT-Inalum/visual-board-frontend.git
cd visual-board-frontend
```

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Konfigurasi Lingkungan

Gandakan file `.env`:
```bash
cp .env.example .env
```

**Perhatian tentang Vite Proxy:** 
Aplikasi ini diatur menggunakan `server.proxy` di dalam `vite.config.ts`. Ini berarti panggilan ke `/api` atau `/storage` secara otomatis akan diteruskan ke peladen *backend* Anda di port `8000`. Ini adalah trik vital yang menyelesaikan kendala CORS saat memuat PDF mading!

### 4. Jalankan Development Server

```bash
npm run dev
```

Layar Kiosk akan terbuka seketika (secara bawaan di `http://localhost:5173`).

---

## Application Routes

| Path | Page Component | Feature Module | Deskripsi |
|---|---|---|---|
| `/` | `General` | `general` | Tampilan matriks 5R dan telemetri |
| `/mading` | `DepartmentHub` | `bulletin` | Pusat pengumuman dan pembaca PDF interaktif |
| `/organisasi` | `Organization` | `organization` | Absensi dan struktur organisasi |
| `/jadwal` | `Schedule5R` | `general` | Matriks kalender per zona |
| `/mobile` | `MobileAttendance` | *(Standalone)* | QR Code endpoint untuk ponsel karyawan |

---

## UI Component System

Proyek ini telah memusnahkan komponen-komponen statis kuno (*legacy*) dan bermigrasi menggunakan standar modern **shadcn/ui**. Segala elemen UI *primitives* berada di `src/components/ui/`.

Beberapa komponen esensial meliputi:
- `Badge`, `Button`, `Card`, `Skeleton`, `Dialog`.

### Komponen Universal (*Shared*)
**`DocumentViewerModal.tsx`:** Permata utama pada versi ini. Sebuah modal tingkat tinggi yang mampu merender berkas gambar maharesolusi atau membaca .PDF tanpa bentrok dengan pemblokir peramban, menyingkirkan kebergantungan kita pada `react-pdf`.

---

## Data Fetching

Dilarang keras melakukan *fetching* secara "telanjang" di dalam `useEffect`. 
Semua panggilan data harus didefinisikan sebagai *Custom Hooks* dari TanStack Query di dalam direktori `api/` dari masing-masing fitur.

Contoh yang benar:
```typescript
// Di dalam src/features/general/api/useKioskData.ts
export function useKioskData() {
  return useQuery({
    queryKey: ['kiosk-data'],
    queryFn: async () => {
      const response = await api.get('/visual-board/kiosk');
      return response.data;
    },
    refetchInterval: 300000, // Kiosk Auto-Refresh tiap 5 menit
  });
}
```

---

## Code Quality (Biome Linter)

Proyek ini menggunakan **Biome** untuk analisis statis (*linting*) yang secepat kilat.
Sebelum melakukan *Push* ke GitHub, sangat diwajibkan untuk menjalankan pemformatan otomatis:

```bash
npm run format
```

Biome akan menata ulang jarak baris, menghapus variabel yang menggantung, dan menyingkirkan *import* usang yang membuat bundel React memberat.

---

## Build & Deployment

Ketika akan di-instal di *mini-PC* atau *Raspberry Pi* yang tertanam pada TV Pabrik:

1. **Jalankan Proses Build**
   ```bash
   npm run build
   ```
2. **Uji Coba Statis**
   ```bash
   npm run preview
   ```
3. **Deployment (Nginx / Apache)**
   Tarik isi direktori `/dist` ke dalam peladen web statis Kiosk. Jangan lupa tambahkan konfigurasi '*fallback*' (*try_files*) agar semua *refresh* rute dikembalikan ke `index.html`.

---

## Project Structure

```text
visual-board-frontend/
├── public/                      # Statis logo & aset
├── src/
│   ├── components/
│   │   ├── layout/              # Cangkang Aplikasi Utama (AppShell)
│   │   ├── shared/              # DocumentViewerModal
│   │   └── ui/                  # Komponen shadcn murni
│   ├── features/                # Modul Domain-Driven (FSD)
│   │   ├── bulletin/            # (Mading & QR)
│   │   ├── general/             # (Matriks, Kaizen, Abnormality)
│   │   ├── organization/        # (Kehadiran & Struktur Bagan)
│   │   └── workstation/         # (Penugasan Area Kerja)
│   ├── hooks/                   # Custom Hooks Global (seperti useClock)
│   ├── lib/                     # Utilitas murni & Konfigurasi Axios
│   ├── pages/                   # Orkestrasi gabungan komponen per rute
│   └── types/
│       └── api.ts               # Tipisasi (Typings) mutlak untuk JSON peladen
├── biome.json                   # Aturan ketat Linter
├── package.json
└── vite.config.ts               # Penggerak utama proxy (anti-CORS)
```

---

<div align="center">
Sistem Kiosk ini dirancang tangguh (Anti-Memory Leak) untuk menyala terus menerus di area ekstrem. 📺 PT INALUM Internal Audit.
</div>
