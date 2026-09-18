import { useKioskData } from '@/features/general/api/useKioskData';
import { KpiRow } from '@/features/general/components/KpiRow';
import { AbnormalityFeed } from '@/features/general/components/AbnormalityFeed';
import { KaizenLeaderboard } from '@/features/general/components/KaizenLeaderboard';
import { TrendMatrix } from '@/features/general/components/TrendMatrix';
import { GeneralDocumentViewer } from '@/features/general/components/GeneralDocumentViewer';

import { RefreshCw } from 'lucide-react';

export default function General() {
  const { data, isLoading, isError, refetch } = useKioskData();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1920px] mx-auto font-sans">

      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-[#0A2F66] font-bold text-xs tracking-widest mb-1 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A2F66]"></span>
            VISUAL BOARD DIVISI IIA
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ringkasan Kinerja Eksekutif
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold tracking-wide">
          <div className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Rotasi Otomatis: <span className="text-slate-700">AKTIF (300d)</span>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-[#E6F0FD] text-[#0A2F66] px-4 py-2 rounded-full border border-[#B3D4FF] hover:bg-[#CCE0FF] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sinkronisasi
          </button>
        </div>
      </div>

      
      <KpiRow data={data} isLoading={isLoading} />

      
      <GeneralDocumentViewer />

      
      <TrendMatrix />

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        <div className="lg:col-span-2 min-h-[500px] flex flex-col">
          <AbnormalityFeed
            items={data?.abnormalities}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </div>

        
        <div className="min-h-[400px] flex flex-col">
          <KaizenLeaderboard
            champions={data?.kaizen_champions}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      </div>

    </div>
  );
}

