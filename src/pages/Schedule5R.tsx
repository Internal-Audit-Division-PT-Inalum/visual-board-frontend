import { useState } from 'react';
import { useKioskData } from '@/features/general/api/useKioskData';
import { ScheduleMatrix } from '@/features/general/components/ScheduleMatrix';
import { CheckSheetMatrix } from '@/features/general/components/CheckSheetMatrix';
import { ZoneStandardImage } from '@/features/general/components/ZoneStandardImage';
import { RefreshCw, Filter } from 'lucide-react';

export default function Schedule5R() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  
  const { data, isLoading, refetch, isFetching } = useKioskData(selectedMonth, selectedYear);

  
  const uniqueZoneNames = Array.from(new Set(data?.schedule_matrix?.map(row => row.zone_name) || []));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-10 max-w-[1920px] mx-auto font-sans">
      
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-[#0A2F66] font-bold text-xs tracking-widest mb-1 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A2F66]"></span>
            DIVISI IIA • MANAJEMEN MATRIKS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Standard & Check Sheet 5R
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold tracking-wide">
          
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-slate-200 shadow-sm text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent outline-none border-none cursor-pointer pr-1"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                const date = new Date(2000, m - 1, 1);
                return <option key={m} value={m}>{date.toLocaleString('id-ID', { month: 'long' })}</option>
              })}
            </select>
            <span className="text-slate-300">|</span>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent outline-none border-none cursor-pointer"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-[#E6F0FD] text-[#0A2F66] px-4 py-2 rounded-full border border-[#B3D4FF] hover:bg-[#CCE0FF] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Sinkronisasi Aktif
          </button>
        </div>
      </div>

      
      <div className="w-full space-y-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
            <span className="animate-pulse">Memuat Data Zona...</span>
          </div>
        ) : uniqueZoneNames.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-slate-500 font-medium bg-white rounded-2xl border border-slate-200">
            Tidak ada jadwal 5R aktif untuk bulan ini.
          </div>
        ) : (
          uniqueZoneNames.map(zoneName => {
            const zoneData = data?.schedule_matrix?.filter(row => row.zone_name === zoneName) || [];
            const zoneDetail = data?.zones?.find(z => z.name === zoneName) || { id: '', name: zoneName, standard_image_url: null, pic_utama: null, pic_pengganti: null };

            return (
              <div key={zoneName} className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 inline-block">
                      {zoneName}
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">PIC Utama:</span>
                      <span className="font-semibold text-slate-800 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-100">{zoneDetail.pic_utama || 'Belum Ditentukan'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-500">PIC Pengganti:</span>
                      <span className="font-semibold text-slate-800 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-100">{zoneDetail.pic_pengganti || 'Belum Ditentukan'}</span>
                    </div>
                  </div>
                  <div className="hidden sm:block flex-1 h-px bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                  
                  <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 h-full">
                      <ZoneStandardImage zone={zoneDetail} />
                    </div>
                    <div className="lg:col-span-7 h-full">
                      <CheckSheetMatrix zoneName={zoneName} data={zoneData} />
                    </div>
                  </div>

                  
                  <div className="xl:col-span-12 mt-2">
                    <ScheduleMatrix data={zoneData} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

