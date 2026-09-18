import { useState } from 'react';
import { useKioskData } from '@/features/general/api/useKioskData';
import { ChevronLeft, ChevronRight, Loader2, TrendingUp } from 'lucide-react';
import type { TrendMonthData } from '@/types/api';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

function CellGroup({ data }: { data: TrendMonthData }) {
  if (data.temuan === null) {
    return (
      <td className="border border-slate-200 p-0" colSpan={1}>
        <div className="grid grid-cols-3 divide-x divide-slate-200 h-full">
          {[0, 1, 2].map(i => (
            <div key={i} className="px-1.5 py-2 text-center text-slate-300 text-[10px]">—</div>
          ))}
        </div>
      </td>
    );
  }
  return (
    <td className="border border-slate-200 p-0">
      <div className="grid grid-cols-3 divide-x divide-slate-200 h-full">
        <div className="px-1.5 py-2 text-center font-bold text-red-600 text-xs bg-red-50">
          {data.temuan ?? '—'}
        </div>
        <div className="px-1.5 py-2 text-center font-bold text-emerald-600 text-xs bg-emerald-50">
          {data.tindak_lanjut ?? '—'}
        </div>
        <div className="px-1.5 py-2 text-center font-bold text-amber-600 text-xs bg-amber-50">
          {data.belum_selesai ?? '—'}
        </div>
      </div>
    </td>
  );
}

export function TrendMatrix() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const { data, isLoading, error } = useKioskData(undefined, year);

  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 font-sans">
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base tracking-tight">Trend Abnormality 5R</h3>
            <p className="text-slate-500 text-xs mt-0.5">Rekap per zona X=Temuan O=Selesai Δ=Belum Selesai</p>
          </div>
        </div>

        
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
          <button
            onClick={() => setYear(y => y - 1)}
            className="p-0.5 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-black text-slate-800 text-sm w-12 text-center">{year}</span>
          <button
            onClick={() => setYear(y => y + 1)}
            disabled={year >= currentYear}
            className="p-0.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-40 text-red-500 text-sm">
          Gagal memuat data trend.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[900px]">
            <thead>
              
              <tr>
                <th className="border border-slate-200 bg-slate-800 text-white text-center px-3 py-2 rounded-tl-lg font-bold text-[11px] sticky left-0 z-10 w-20">
                  ZONA
                </th>
                {MONTH_LABELS.map((m, i) => (
                  <th
                    key={i}
                    colSpan={1}
                    className="border border-slate-200 bg-slate-700 text-white text-center px-1 py-2 font-bold text-[10px] tracking-widest uppercase"
                  >
                    {m}
                  </th>
                ))}
              </tr>
              
              <tr className="bg-slate-50">
                <th className="border border-slate-200 bg-slate-100 sticky left-0 z-10"></th>
                {MONTH_LABELS.map((_, i) => (
                  <td key={i} className="border border-slate-200 p-0">
                    <div className="grid grid-cols-3 divide-x divide-slate-200 text-[9px] font-black text-center">
                      <span className="py-1 text-red-500">X</span>
                      <span className="py-1 text-emerald-600">O</span>
                      <span className="py-1 text-amber-500">Δ</span>
                    </div>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.trend_matrix?.map((row, ri) => (
                <tr
                  key={row.zone_label}
                  className={`${row.zone_label === 'Total'
                    ? 'bg-slate-800 text-white font-black'
                    : ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  } hover:bg-blue-50/30 transition-colors`}
                >
                  <td
                    className={`border border-slate-200 px-3 py-2.5 font-black text-xs sticky left-0 z-10 ${
                      row.zone_label === 'Total' ? 'bg-slate-800 text-white' : 'bg-inherit text-slate-700'
                    }`}
                  >
                    {row.zone_label}
                  </td>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                    <CellGroup key={m} data={row.months[m] ?? { temuan: null, tindak_lanjut: null, belum_selesai: null }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-[10px] font-bold">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300"></span><span className="text-slate-500">X = Jumlah Temuan</span></span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300"></span><span className="text-slate-500">O = Sudah Ditindaklanjuti</span></span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300"></span><span className="text-slate-500">Δ = Belum Selesai</span></span>
      </div>
    </div>
  );
}

