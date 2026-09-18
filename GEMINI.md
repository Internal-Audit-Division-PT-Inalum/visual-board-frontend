# Visual Board Frontend — Agent Constitution

Ini adalah **GEMINI.md** (Konstitusi Agent) untuk repositori `visual-board-frontend`.
Baca file ini **SEBELUM** menyentuh baris kode apapun. Untuk perintah operasional
(setup, struktur folder, definition of done), lihat `AGENTS.md`.

---

## 1. Konteks Proyek

Frontend React untuk **Visual Board 5R Digital** — bagian dari sistem internal manufaktur
PT Inalum, Divisi IIA (Internal Audit). Aplikasi ini berfungsi sebagai **TV Kiosk
*read-only*** yang menyala 24/7 di area pabrik, menampilkan data secara *real-time*
dari Backend Laravel melalui Public Kiosk API.

**Ini bukan SPA untuk pengguna umum.** Tidak ada halaman login, tidak ada form
pengisian data di sini. Seluruh operasi tulis (input ceklis, laporan abnormality,
manajemen jadwal) dilakukan melalui panel Filament Admin yang ada di Backend.

### Konsumen Utama Aplikasi Ini
- **Divisi IIA** — staf yang memonitor kondisi pabrik dari layar TV besar.
- **Pekerja Lapangan** — melihat status zona, jadwal, dan pengumuman.
- **Shift Supervisor** — memantau kehadiran dan eskalasi *abnormality* secara *real-time*.

---

## 2. Arsitektur Tampilan — Non-Negotiable

### Strategi Mobile-First & Responsiveness Penuh (Universal Access)
Walaupun target utama adalah TV Kiosk, aplikasi ini **WAJIB responsif 100%** di semua ukuran layar (TV, Desktop, Tablet, dan Mobile/Smartphone) mengikuti standar aksesibilitas *Enterprise-Grade* modern.
- **Mobile-First Tailwind:** Tulis class CSS untuk layar terkecil (*mobile*) terlebih dahulu (sebagai default), lalu gunakan *breakpoint* (`md:`, `lg:`, `xl:`, `2xl:`) untuk memperbesar/menyesuaikan tata letak pada layar besar (TV).
- **Penanganan Grid:** Layout kartu dan metrik wajib *collapse* menjadi `grid-cols-1` pada *mobile*, dan meluas menjadi multi-kolom di layar besar.
- **Penanganan Tabel Padat Data:** Tabel lebar (seperti *Abnormality Feed* atau *Schedule Matrix*) JANGAN DIPAKSA mengecil atau *wrap* berantakan di *mobile*. Gunakan bungkus `overflow-x-auto` agar bisa di-*scroll* horizontal, dan gunakan `sticky left-0` pada kolom identitas (misal: kolom Zona) agar tidak hilang saat di-*scroll*.
- **Elemen Navigasi:** Header dan deretan Tab Navigasi tidak boleh patah (*break line*) ke bawah. Gunakan `overflow-x-auto scrollbar-hide whitespace-nowrap` agar rapi dan bisa diusap (*swipe*) pada perangkat sentuh.

### App Shell Architecture
Aplikasi ini menggunakan pola **App Shell**:
- **Bingkai Tetap (Persistent Shell):** Header atas (Logo INALUM, Navigasi Tab,
  Jam Digital *real-time*) dan Ticker bawah (*running text* Live Telemetry) selalu
  tampil tanpa berkedip saat pengguna berpindah tab.
- **Area Konten Dinamis:** Konten di antara Header dan Ticker di-*render* ulang sesuai
  dengan tab yang aktif melalui React `useState`.

### Struktur 4-Tab Navigasi (Tidak boleh ditambah/dikurangi tanpa persetujuan)

| Tab | Slug | Data Utama yang Ditampilkan |
|---|---|---|
| 1 | `GENERAL` | KPI Cards, Abnormality Live Feed, 5R Weekly Trend Chart, Kaizen Champions Leaderboard |
| 2 | `SCHEDULE_5R` | Monthly 5R Schedule Matrix (Zona × Hari 1-31) |
| 3 | `ORGANIZATION` | Today's Attendance, Unavailable Today, Department Leaders |
| 4 | `DEPARTMENT_HUB` | Digital Bulletin Board (Mading) — Pengumuman, Safety, Health |

---

## 3. Arsitektur Kode: Feature-Sliced Design (FSD) — Non-Negotiable

Ini adalah aturan arsitektur paling fundamental dalam proyek ini. Setiap baris kode
baru wajib ditempatkan pada lapisan yang tepat sesuai pola ini.

### Hierarki 3 Lapisan (Dari Paling Tahu ke Paling Tidak Tahu)

```
App.tsx          → LAPISAN 1: Orkestrator Global
                   Hanya tahu: tab aktif, Query Provider, App Shell.
                   Tidak boleh ada: logika bisnis, JSX komponen domain.

pages/*.tsx      → LAPISAN 2: Orkestrator Halaman (Tab)
                   Hanya tahu: query hooks apa yang dipanggil, komponen apa yang disusun.
                   Tidak boleh ada: JSX rendering langsung, logika bisnis, styling detail.

features/{domain}/
  components/    → LAPISAN 3: Implementator Visual
                   Hanya tahu: data yang diterimanya via props.
                   Tidak boleh ada: pemanggilan useQuery langsung (kecuali self-contained section).
```

### Aturan Wajib per Lapisan

**`App.tsx` (Lapisan 1)**
- Hanya berisi: `QueryClientProvider`, `Toaster`, state `activeTab`, `AppHeader`, `BottomTicker`, dan switch konten tab.
- Batas baris: **maksimal 60 baris**.

**`pages/*.tsx` (Lapisan 2)**
- File Page adalah **orkestrator murni**. Tugasnya adalah memanggil hooks data dan menyusun komponen — bukan merender JSX detail.
- Batas baris: **maksimal 80 baris**.
- Dilarang menulis JSX yang mengandung styling detail (class panjang, kondisi render, dll.) langsung di file Page.

```tsx
// ✅ POLA WAJIB — pages/General.tsx
export default function General() {
  const { data, isLoading, isError, refetch } = useKioskData();
  return (
    <div className="p-6 space-y-6">
      <KpiRow data={data} isLoading={isLoading} />
      <div className="grid grid-cols-3 gap-6">
        <AbnormalityFeed
          items={data?.abnormalities}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
        <div className="space-y-6">
          <WeeklyTrendChart points={data?.weekly_trend} isLoading={isLoading} />
          <KaizenLeaderboard champions={data?.kaizen_champions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

// ❌ DILARANG — menulis implementasi langsung di Page
export default function General() {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          {/* 200 baris JSX langsung di sini — HARAM */}
        </div>
      </div>
    </div>
  );
}
```

**`features/{domain}/components/*.tsx` (Lapisan 3)**
- Komponen menerima data via **props yang di-type secara eksplisit**.
- Setiap komponen harus menangani 3 state: `isLoading`, `isError`, dan data tersedia.
- Batas baris: **maksimal 150 baris per file**. Jika lebih, pecah menjadi sub-komponen.
- Komponen yang panjangnya >150 baris adalah sinyal bahwa ada lebih dari satu tanggung jawab di dalamnya.

---

## 4. Struktur Folder: Feature-Sliced Design

Setiap domain data memiliki "rumah" sendiri di dalam `features/`. Ini mencegah
*spaghetti import* dan memastikan bahwa komponen, hooks, dan tipe data untuk satu
domain bisnis selalu berada berdekatan (ko-lokasi).

```
src/
├── features/                    # Domain bisnis — inti dari FSD
│   ├── general/                 # Domain Tab GENERAL
│   │   ├── api/
│   │   │   ├── getKioskData.ts  # Fungsi fetcher murni (hanya axios call, bisa ditest tanpa React)
│   │   │   └── useKioskData.ts  # React Hook yang membungkus useQuery
│   │   └── components/
│   │       ├── KpiRow.tsx           # Baris 4 kartu KPI
│   │       ├── AbnormalityFeed.tsx  # Tabel live feed abnormality
│   │       ├── WeeklyTrendChart.tsx # Grafik tren mingguan
│   │       └── KaizenLeaderboard.tsx # Podium juara Kaizen
│   │
│   ├── schedule/                # Domain Tab SCHEDULE 5R
│   │   ├── api/
│   │   │   └── useScheduleMatrix.ts # (Bisa diambil dari useKioskData, atau query terpisah)
│   │   ├── lib/
│   │   │   └── parseDayStatus.ts   # Fungsi pure untuk parsing JSONB days_data
│   │   └── components/
│   │       ├── ScheduleMatrix.tsx   # Komponen tabel matriks utama
│   │       └── StatusIcon.tsx       # Ikon per status sel (✓ △ ☒ ○)
│   │
│   ├── organization/            # Domain Tab ORGANIZATION
│   │   ├── api/
│   │   │   ├── getAttendance.ts
│   │   │   └── useAttendance.ts
│   │   └── components/
│   │       ├── AttendancePanel.tsx     # Panel kiri: metrik hadir/sakit/cuti
│   │       ├── UnavailableList.tsx     # Daftar pegawai tidak masuk
│   │       └── DepartmentLeaderGrid.tsx # Grid kartu pemimpin departemen
│   │
│   └── hub/                     # Domain Tab DEPARTMENT HUB
│       ├── api/
│       │   ├── getBulletins.ts
│       │   └── useBulletins.ts
│       └── components/
│           ├── BulletinGrid.tsx    # Grid buletin (layout masonry/bento)
│           └── BulletinCard.tsx    # Satu kartu buletin
│
├── components/                  # Komponen benar-benar GLOBAL (dipakai ≥2 domain)
│   ├── ui/                      # Shadcn UI (JANGAN EDIT MANUAL)
│   ├── layout/
│   │   ├── AppHeader.tsx        # Header global + Tab navigasi
│   │   └── BottomTicker.tsx     # Ticker bawah live telemetry
│   └── shared/
│       ├── StatusBadge.tsx      # Badge warna status (open/in_progress/resolved)
│       ├── KpiCard.tsx          # Template kartu KPI tunggal
│       └── AvatarPill.tsx       # Komponen avatar inisial nama
│
├── pages/                       # Satu file = satu Tab (Orkestrator Murni)
│   ├── General.tsx
│   ├── Schedule5R.tsx
│   ├── Organization.tsx
│   └── DepartmentHub.tsx
│
├── hooks/                       # Hooks global yang tidak terikat domain tertentu
│   └── useClock.ts              # Jam digital real-time
│
├── lib/
│   ├── api.ts                   # Axios instance terpusat (SATU-SATUNYA tempat axios.create())
│   └── utils.ts                 # Fungsi utilitas (cn(), formatDate(), formatTime())
│
└── types/
    └── api.ts                   # Semua interface/type untuk data dari Backend API
```

### Aturan Ko-Lokasi (Paling Penting)

> **Jika sebuah komponen, hook, atau tipe data HANYA dipakai oleh satu domain,
> ia harus berada di dalam folder `features/{domain}/` domain tersebut.
> Pindahkan ke `components/shared/` atau `types/api.ts` HANYA jika dibutuhkan oleh
> lebih dari satu domain.**

### Pemisahan Dua Lapis untuk Data Fetching

Setiap domain data **wajib** memisahkan fungsi fetcher dan React hook ke dalam dua file berbeda:

```typescript
// features/general/api/getKioskData.ts
// Fungsi fetcher MURNI — bisa diuji tanpa React, tanpa render
import { api } from '@/lib/api';
import type { KioskDashboardResponse } from '@/types/api';

export async function getKioskData(): Promise<KioskDashboardResponse> {
  const { data } = await api.get('/visual-board/kiosk');
  return data.data; // Membuka envelope ApiSuccessResponse
}
```

```typescript
// features/general/api/useKioskData.ts
// React Hook — hanya tahu cara memanggil getKioskData dan konfigurasi React Query
import { useQuery } from '@tanstack/react-query';
import { getKioskData } from './getKioskData';

export function useKioskData() {
  return useQuery({
    queryKey: ['kiosk-dashboard'],
    queryFn: getKioskData,
    refetchInterval: 15_000,
    staleTime: 10_000,
  });
}
```

---

## 5. Identitas Visual & Palet Warna — Wajib Dipatuhi

Seluruh komponen UI **wajib** mengacu pada palet warna korporat PT INALUM berikut.
Dilarang menggunakan warna acak atau warna default Shadcn/Tailwind yang belum
dipetakan ke token di bawah ini.

### Palet Utama (Diterapkan via variabel CSS di `src/index.css`)

| Peran | Kode HEX | Penggunaan |
|---|---|---|
| **Primary (Corporate Blue)** | `#0054A6` | Header, Tombol aktif, Tab aktif, ikon utama |
| **Primary Hover** | `#004080` | Hover state tombol biru |
| **Success / Done (Eco Green)** | `#009B4D` | Status OK, Hadir, Check (✓), Resolved |
| **Warning / In Progress (Amber)** | `#F59E0B` | Status In Progress, On Leave, simbol (△) |
| **Danger / Abnormal (National Red)** | `#ED1C24` | Status OPEN/Abnormal, Sakit, simbol (☒) |
| **Background** | `#F8F9FA` | Latar belakang halaman utama |
| **Card Surface** | `#FFFFFF` | Latar belakang kartu/panel |
| **Text Primary** | `#1A1A1A` | Judul, angka penting |
| **Text Secondary** | `#6B7280` | Sub-teks, deskripsi, label |
| **Teks di atas warna** | `#FFFFFF` | Teks di atas tombol biru/merah/hijau |

### Proporsi 60-30-10 (Wajib Dipertahankan)
- **60%** — Warna Netral (latar belakang `#F8F9FA`, kartu `#FFFFFF`)
- **30%** — Identitas Korporat (Biru `#0054A6` untuk header, navigasi, elemen struktural)
- **10%** — Aksen (Hijau, Kuning, Merah hanya untuk indikator status)

---

## 6. Pemetaan API Backend (Sumber Data per Tab)

> **Penting:** Backend menggunakan prefix `/api/v1/`. Endpoint Kiosk bersifat **publik**
> (tidak butuh token). Visual Board Frontend ini **hanya mengonsumsi endpoint publik** — tidak ada mutasi data.

| Tab | Endpoint Backend | Keterangan |
|---|---|---|
| GENERAL | `/api/v1/visual-board/kiosk` | Agregat KPI, abnormalities, champions, schedule matrix |
| SCHEDULE 5R | `/api/v1/visual-board/kiosk` | Matriks `days_data` JSONB per zona per bulan |
| ORGANIZATION | `/api/v1/hr/kiosk/attendance-summary` | Jumlah Hadir/Sakit/Cuti + daftar tidak masuk |
| DEPARTMENT HUB | `/api/v1/portal/kiosk/bulletins` | Daftar bulletin/pengumuman aktif |

### Kontrak Data JSONB `days_data` (Hanya Baca — Jangan Dimodifikasi Frontend)

Key adalah tanggal (`"1"` sampai `"31"`), Value adalah salah satu dari:

| Value | Ikon | Warna |
|---|---|---|
| `rencana` | ○ (lingkaran kosong) | Abu-abu netral |
| `ok_tanpa_5r` | ✓ (ceklis) | Hijau `#009B4D` |
| `ok_dengan_5r` | △ (segitiga) | Kuning `#F59E0B` |
| `abnormal` | ☒ (silang kotak) | Merah `#ED1C24` |

### Interval *Auto-Refresh* yang Ditetapkan

| Query Key | `refetchInterval` | Alasan |
|---|---|---|
| `['kiosk-dashboard']` | `15_000` ms | Standar TV Kiosk |
| `['attendance-summary']` | `60_000` ms | Data kehadiran berubah lambat |
| `['bulletins']` | `300_000` ms | Pengumuman sangat jarang berubah |

---

## 7. Konvensi Kode Wajib

### Peraturan TypeScript
- **Dilarang** menggunakan `any`. Selalu definisikan `interface` atau `type`.
- Tipe data global (dipakai lintas domain) → `src/types/api.ts`.
- Tipe data lokal (hanya dipakai satu domain) → `src/features/{domain}/types.ts`.
- Prop komponen harus di-type secara eksplisit — tidak boleh inline `{ children: any }`.

### Peraturan Komponen
- Setiap komponen yang menerima data API harus menangani **3 state wajib**: `isLoading`, `isError`, dan data tersedia.
- State `isLoading` → tampilkan `<Skeleton />` dari Shadcn (bukan teks "Loading...").
- State `isError` → tampilkan pesan informatif + tombol "Coba Lagi" yang memanggil `onRetry`.
- Dilarang membiarkan area konten kosong dalam kondisi apapun.

```tsx
// ✅ Pola komponen yang benar
interface AbnormalityFeedProps {
  items: Abnormality[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function AbnormalityFeed({ items, isLoading, isError, onRetry }: AbnormalityFeedProps) {
  if (isLoading) return <AbnormalityFeedSkeleton />;
  if (isError) return <ErrorState message="Gagal memuat data" onRetry={onRetry} />;
  return <table>...</table>;
}
```

### Peraturan Import
- Selalu gunakan path alias `@/` — dilarang import relatif panjang (`../../components/...`).
- Import tipe menggunakan `import type { Foo }` bukan `import { Foo }` untuk tipe-only import.

---

## 8. Batasan & Larangan Keras

- **Jangan** menambahkan form input atau tombol POST/PUT/DELETE. Ini aplikasi *read-only*.
- **Jangan** menambahkan halaman Login. Otentikasi ada di panel Filament Backend.
- **Jangan** menggunakan warna selain yang didefinisikan di §5 tanpa persetujuan.
- **Jangan** menambahkan dependensi NPM baru tanpa konfirmasi ke user.
- **Jangan** mengedit file di `src/components/ui/` secara manual (file Shadcn CLI).
- **Jangan** menggunakan `useEffect` + `fetch` untuk data API — wajib pakai `useQuery`.
- **Jangan** menggunakan `console.log()` di kode produksi.
- **Jangan** menulis logika bisnis atau JSX detail di `pages/*.tsx` — itu ranah `features/`.
- **Jangan** menaruh komponen domain-spesifik di `components/shared/` — gunakan `features/{domain}/components/`.

---

## 9. Kapan Harus Berhenti dan Bertanya ke User

- Sebelum menambahkan tab navigasi baru di luar 4 tab yang sudah ditetapkan (§2).
- Sebelum mengubah palet warna di luar yang sudah didefinisikan di §5.
- Sebelum menambahkan dependensi NPM baru (package.json berubah).
- Ketika data yang dikembalikan API tidak cocok dengan `interface` di `src/types/api.ts`
  — laporkan selisihnya, jangan diam-diam ubah kontrak tipe.
- Ketika ada kebutuhan yang tampak memerlukan fitur tulis data (form input).
- Ketika sebuah komponen mendekati 150 baris — diskusikan cara pemecahannya dulu.
