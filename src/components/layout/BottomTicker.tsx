import { useKioskData } from '@/features/general/api/useKioskData';
import { Activity, ServerCrash, CheckCircle2, AlertTriangle, Wifi, WifiOff, Clock } from 'lucide-react';

export function BottomTicker() {
  const { data, isLoading, isError } = useKioskData();

  const openAbnormalities = data?.abnormalities?.filter((a) => a.status === 'open') || [];

  return (
    <div className="bg-[#111318] border-t border-slate-800/80 text-slate-300 h-10 lg:h-12 flex items-center shrink-0 relative overflow-hidden font-sans">
      
      
      <div className="flex items-center bg-[#111318] z-10 h-full pl-4 pr-6 shrink-0 relative">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 ${isError ? 'bg-red-900/80 text-red-100' : 'bg-[#D12B2B] text-white'} px-3 py-1 rounded-sm shadow-sm transition-colors`}>
            <div className={`w-2 h-2 rounded-full bg-white ${isError ? '' : 'animate-pulse'}`}></div>
            <span className="font-bold text-[10px] sm:text-xs tracking-widest uppercase">LIVE FEED</span>
          </div>
          <span className="hidden sm:inline-block font-semibold text-[10px] sm:text-xs tracking-widest text-slate-400 uppercase">
            Sistem Informasi Visual Board
          </span>
        </div>
        
        
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#111318] to-transparent pointer-events-none"></div>
      </div>
      
      
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="flex gap-16 whitespace-nowrap animate-marquee items-center pr-16 text-[11px] sm:text-xs">
          {isLoading ? (
             <span className="flex items-center gap-2 text-slate-500">
                <Activity className="w-4 h-4 animate-spin" />
                CONNECTING TO ANDON TELEMETRY...
             </span>
          ) : isError ? (
             <span className="flex items-center gap-2 text-red-400/90 font-medium uppercase tracking-wider">
                <ServerCrash className="w-4 h-4" />
                CONNECTION LOST — DISPLAYING CACHED DATA. RETRYING...
             </span>
          ) : openAbnormalities.length === 0 ? (
             <span className="flex items-center gap-2 text-emerald-400/90 font-medium uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                ALL ZONES OPERATING NORMALLY. NO OPEN ABNORMALITIES.
             </span>
          ) : (
            openAbnormalities.map((item) => (
              <span key={item.id} className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-amber-500 font-bold uppercase tracking-widest">TEMUAN 5R:</span>
                <span className="text-slate-200 font-medium">{item.zone_name} — {item.description}</span>
                <span className="text-slate-700 mx-8">•</span>
              </span>
            ))
          )}
        </div>
      </div>

      
      <div className="hidden lg:flex items-center bg-[#111318] z-10 h-full pl-6 pr-4 shrink-0 relative gap-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#111318] to-transparent pointer-events-none -translate-x-full"></div>
        
        <div className="flex items-center gap-2">
          {isError ? (
            <span className="flex items-center gap-1.5 text-red-500">
              <WifiOff className="w-3.5 h-3.5" /> OFFLINE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-500">
              <Wifi className="w-3.5 h-3.5" /> ONLINE
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-slate-400" title="Data akan disinkronisasi setiap 10-30 detik">
          <Clock className="w-3.5 h-3.5" /> SYNC: AUTO
        </div>
      </div>

    </div>
  );
}


