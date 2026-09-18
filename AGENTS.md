# AGENTS.md — Visual Board Frontend

Panduan operasional untuk agent coding (Antigravity/Gemini, Claude Code, atau tool
AGENTS.md-compatible lain) yang bekerja di repo ini. Untuk prinsip arsitektur, palet
warna, batasan keras, dan pemetaan API, baca `GEMINI.md` terlebih dahulu — file ini
fokus ke **"bagaimana caranya"**, bukan **"kenapa"**.

---

## Panduan Dasar

Selalu patuhi pedoman yang tertulis di dalam `GEMINI.md` dan file ini sebelum mengeksekusi
perubahan apapun. Jangan pernah melakukan eksekusi (membuat/mengubah file kode, menjalankan
command) tanpa instruksi atau persetujuan eksplisit dari user.

---

## Setup Environment (First Time)

```sh
# 1. Instal seluruh dependensi
npm install

# 2. Salin file environment dan isi BASE_URL Backend
cp .env.example .env

# 3. Jalankan development server
npm run dev
```

File `.env` yang dibutuhkan:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## Command Harian

```sh
npm run dev       # Jalankan dev server (http://localhost:5173)
npm run build     # Build production bundle
npm run lint      # Jalankan ESLint — wajib bersih sebelum commit
```

### Menambah Komponen Shadcn UI (Gunakan CLI, Bukan Manual)
```sh
# Format: npx shadcn@latest add {nama-komponen}
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add skeleton
```
> **Perhatian:** Jangan edit file di `src/components/ui/` secara manual. Selalu gunakan
> perintah di atas agar Shadcn bisa melakukan upgrade komponen dengan aman di masa mendatang.

---

## Stack & Dependensi Kunci

| Kategori | Package | Versi | Fungsi |
|---|---|---|---|
| Framework | `react` | 19.x | UI Library |
| Build Tool | `vite` | 7.x | Dev server & bundler |
| Bahasa | `typescript` | 5.9.x | Type safety |
| Styling | `tailwindcss` | 4.x | Utility CSS |
| Komponen UI | `shadcn/ui` (base-nova style) | latest | Komponen siap pakai |
| Icon | `lucide-react` | latest | Ikon konsisten |
| HTTP Client | `axios` | 1.x | Komunikasi ke Backend API |
| Server State | `@tanstack/react-query` | 5.x | Fetching, caching, auto-refresh |
| Form | `react-hook-form` | 7.x | Manajemen form (untuk filter jika ada) |
| Validasi | `zod` | 3.x | Skema validasi data |
| Notifikasi | `sonner` | 2.x | Toast notifikasi (error state) |
| Font | `@fontsource/plus-jakarta-sans` | 5.x | Font korporat |

---

## Peta Direktori: Feature-Sliced Design (Taruh file baru di tempat yang tepat)

> **Aturan utama:** Jika sebuah file hanya dipakai oleh satu domain/tab,
> ia harus berada di dalam `features/{domain}/`. Pindahkan ke `components/shared/`
> atau `types/api.ts` HANYA jika dibutuhkan oleh lebih dari satu domain.

```
src/
├── features/                    # Domain bisnis — inti arsitektur
│   ├── general/                 # Domain Tab GENERAL
│   │   ├── api/
│   │   │   ├── getKioskData.ts  # Fungsi fetcher murni (tanpa React)
│   │   │   └── useKioskData.ts  # React Hook membungkus useQuery
│   │   └── components/
│   │       ├── KpiRow.tsx
│   │       ├── AbnormalityFeed.tsx
│   │       ├── WeeklyTrendChart.tsx
│   │       └── KaizenLeaderboard.tsx
│   │
│   ├── schedule/                # Domain Tab SCHEDULE 5R
│   │   ├── api/
│   │   │   └── useScheduleMatrix.ts
│   │   ├── lib/
│   │   │   └── parseDayStatus.ts  # Fungsi pure parsing JSONB days_data
│   │   └── components/
│   │       ├── ScheduleMatrix.tsx
│   │       └── StatusIcon.tsx
│   │
│   ├── organization/            # Domain Tab ORGANIZATION
│   │   ├── api/
│   │   │   ├── getAttendance.ts
│   │   │   └── useAttendance.ts
│   │   └── components/
│   │       ├── AttendancePanel.tsx
│   │       ├── UnavailableList.tsx
│   │       └── DepartmentLeaderGrid.tsx
│   │
│   └── hub/                     # Domain Tab DEPARTMENT HUB
│       ├── api/
│       │   ├── getBulletins.ts
│       │   └── useBulletins.ts
│       └── components/
│           ├── BulletinGrid.tsx
│           └── BulletinCard.tsx
│
├── components/                  # Komponen GLOBAL (dipakai ≥2 domain)
│   ├── ui/                      # Shadcn UI (JANGAN EDIT MANUAL)
│   ├── layout/
│   │   ├── AppHeader.tsx        # Header + Tab navigasi
│   │   └── BottomTicker.tsx     # Ticker live telemetry
│   └── shared/
│       ├── StatusBadge.tsx      # Badge status (open/in_progress/resolved)
│       ├── KpiCard.tsx          # Template kartu KPI
│       └── AvatarPill.tsx       # Avatar inisial nama
│
├── pages/                       # Satu file = satu Tab (ORKESTRATOR MURNI)
│   ├── General.tsx              # Maks 80 baris
│   ├── Schedule5R.tsx           # Maks 80 baris
│   ├── Organization.tsx         # Maks 80 baris
│   └── DepartmentHub.tsx        # Maks 80 baris
│
├── hooks/
│   └── useClock.ts              # Jam real-time (tidak terikat domain)
│
├── lib/
│   ├── api.ts                   # SATU-SATUNYA tempat axios.create()
│   └── utils.ts                 # cn(), formatDate(), formatTime()
│
└── types/
    └── api.ts                   # Interface/type GLOBAL untuk Backend API
```

---

## Konvensi API (`src/lib/api.ts`)

Harus ada satu file konfigurasi Axios terpusat. Jangan membuat instance axios baru di luar file ini.

```typescript
// src/lib/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Accept': 'application/json' },
  timeout: 10_000,
});
```

---

## Konvensi Custom Hook (Fetching Data)

Setiap query ke Backend harus dibungkus dalam custom hook. Satu hook untuk satu
jenis data API agar komponen tetap bersih dan logika fetching bisa diuji secara terisolasi.

```typescript
// src/hooks/useKioskData.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { KioskDashboardResponse } from '@/types/api';

export function useKioskData() {
  return useQuery<KioskDashboardResponse>({
    queryKey: ['kiosk-dashboard'],
    queryFn: () => api.get('/visual-board/kiosk').then(r => r.data),
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}
```

---

## Konvensi Status Badge Warna

Komponen `StatusBadge` di `src/components/shared/StatusBadge.tsx` harus menangani
pemetaan warna status secara terpusat. Jangan hardcode warna status di dalam komponen halaman.

| Status Value (dari API) | Warna Latar | Label |
|---|---|---|
| `open` | `#ED1C24` (Brand Red) | OPEN |
| `in_progress` | `#F59E0B` (Brand Yellow) | IN PROGRESS |
| `resolved` | `#009B4D` (Brand Green) | RESOLVED |

---

## Definition of Done — Setiap Komponen/Halaman Baru

1. Komponen memiliki `interface` prop yang terdefinisi dengan benar (tidak boleh `any`).
2. Data dari API diambil menggunakan custom hook (`src/hooks/`) bukan `useEffect` manual.
3. Komponen menampilkan tampilan `isLoading` (gunakan `<Skeleton />` dari Shadcn) saat data sedang diambil.
4. Komponen menampilkan tampilan `isError` yang informatif saat API gagal merespons.
5. Seluruh warna yang dipakai mengacu pada token di `GEMINI.md §3` (Palet Warna).
6. `npm run lint` bersih (tidak ada error ESLint).
7. Tidak ada `console.log()` yang tertinggal di kode produksi.

---

## Larangan Operasional

- Jangan jalankan `npm install {package}` baru tanpa konfirmasi ke user.
- Jangan commit file `.env` ke Git.
- Jangan mengedit file di `src/components/ui/` secara manual.
- Jangan membuat form yang mengirim data ke Backend (POST/PUT/DELETE). Ini aplikasi *read-only*.
- Jangan mengubah palet warna di `src/index.css` tanpa persetujuan (lihat `GEMINI.md §3`).
- Jangan membuat halaman Login atau sistem autentikasi di proyek ini.
