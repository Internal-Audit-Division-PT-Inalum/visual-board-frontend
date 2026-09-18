import { MonitorPlay, AlertCircle } from 'lucide-react';
import type { WeeklyTrendPoint } from '@/types/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface WeeklyTrendChartProps {
  points?: WeeklyTrendPoint[];
  resolutionSpeed?: number;
  auditPassPercentage?: number;
  auditPassGrade?: string;
  isLoading: boolean;
  isError: boolean;
}

export function WeeklyTrendChart({ points, resolutionSpeed = 0, auditPassPercentage = 0, auditPassGrade = '-', isLoading, isError }: WeeklyTrendChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full overflow-hidden font-sans">
      
      
      <div className="p-5 sm:p-6 pb-4 flex justify-between items-start shrink-0">
        <div className="flex gap-3 items-center">
          <div className="w-8 h-8 rounded-lg bg-[#E6F0FD] text-[#0A2F66] flex items-center justify-center shrink-0 border border-[#B3D4FF]">
            <MonitorPlay className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
            Kecepatan Resolusi & Kepatuhan 5R Mingguan
          </h3>
        </div>
        <div className="bg-[#E6F0FD] text-[#0A2F66] px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest">
          SEN - MIN
        </div>
      </div>
      
      <div className="flex-1 px-4 sm:px-6 relative min-h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 p-5 flex items-end gap-2 sm:gap-4">
            {[30, 70, 45, 90, 60].map((h, i) => (
              <div key={i} className="flex-1 bg-slate-100 rounded-t animate-pulse" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
             <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
             <p className="text-xs font-semibold">Gagal memuat grafik telemetri</p>
          </div>
        ) : !points || points.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400">
            Menunggu data telemetri...
          </div>
        ) : (
          <div className="w-full h-full pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={points} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompliance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlert" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2F66" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0A2F66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
                  dy={10} 
                  tickFormatter={(val: string) => {
                    const map: Record<string, string> = { 'Senin': 'MON', 'Selasa': 'TUE', 'Rabu': 'WED', 'Kamis': 'THU', 'Jumat': 'FRI', 'Sabtu': 'SAT', 'Minggu': 'SUN' };
                    return map[val] || val;
                  }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#CBD5E1' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                  itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                  labelStyle={{ fontWeight: 800, color: '#64748B', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="alert_count" 
                  name="Alert (Proxy Kecepatan)" 
                  stroke="#0A2F66" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorAlert)" 
                  activeDot={{ r: 6, fill: '#0A2F66', stroke: '#fff', strokeWidth: 2 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="compliance" 
                  name="Kepatuhan %" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCompliance)" 
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      
      <div className="px-5 sm:px-6 py-4 flex justify-between items-center bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0A2F66]"></div>
          <span className="font-medium text-slate-500">Rata-rata Resolusi:</span>
          <span className="font-extrabold text-slate-800">{resolutionSpeed} menit</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] sm:text-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span className="font-medium text-slate-500">Kelulusan Audit:</span>
          <span className="font-extrabold text-emerald-600">{auditPassPercentage}% ({auditPassGrade})</span>
        </div>
      </div>

    </div>
  );
}

