import { AlertTriangle, CheckCircle2, ShieldCheck, Lightbulb } from 'lucide-react';
import { KpiCard } from '@/components/shared/KpiCard';
import type { KioskDashboardResponse } from '@/types/api';

interface KpiRowProps {
  data?: KioskDashboardResponse;
  isLoading: boolean;
}

export function KpiRow({ data, isLoading }: KpiRowProps) {
  
  const openCount = data?.open_abnormality_count ?? 0;
  const inProgressCount = data?.abnormality_in_progress ?? 0;
  const resolvedToday = data?.abnormality_resolved_today ?? 0;
  
  const compliance = data?.compliance_percentage ?? 0;
  
  const kaizen = data?.kaizen_implemented_count ?? 0;
  
  const activeAbnormalities = openCount + inProgressCount;
  const formattedActiveCount = activeAbnormalities.toString().padStart(2, '0');
  
  const resolutionRate = data?.resolution_rate ?? 0;
  const resolutionGrade = data?.resolution_grade ?? '-';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      
      
      <KpiCard
        title="Temuan Abnormality Aktif"
        value={formattedActiveCount}
        valueClassName="text-red-500"
        icon={AlertTriangle}
        colorTheme="danger"
        isLoading={isLoading}
        tagText="Tunda Tindakan"
        tagColor="red"
        bottomLeftText={`${openCount} Terbuka • ${inProgressCount} Diproses`}
        bottomRightText={`${resolvedToday} Selesai Hari Ini`}
        bottomRightColor="text-emerald-500"
      />
      
      
      <KpiCard
        title="Tingkat Kepatuhan 5R"
        value={`${compliance}%`}
        icon={CheckCircle2}
        colorTheme="success"
        isLoading={isLoading}
        tagText="Bulan Ini"
        tagColor="emerald"
        showProgressBar={true}
        progressValue={compliance}
        bottomLeftText="Batas Minimum: 90.0%"
        bottomRightText={compliance >= 90 ? "Target Tercapai" : "Di Bawah Target"}
        bottomRightColor={compliance >= 90 ? "text-emerald-500" : "text-red-500"}
      />
      
      
      <KpiCard
        title="Tingkat Penyelesaian Masalah"
        value={`${resolutionRate}%`}
        icon={ShieldCheck}
        colorTheme="primary"
        isLoading={isLoading}
        tagText={`Grade ${resolutionGrade}`}
        tagColor="blue"
        bottomLeftText="Berdasarkan Total Abnormality"
        bottomRightText="Bulan Ini"
        bottomRightColor="text-slate-500"
      />
      
      
      <KpiCard
        title="Ide Kaizen Diimplementasikan"
        value={kaizen}
        icon={Lightbulb}
        colorTheme="warning"
        isLoading={isLoading}
        tagText="Bulan Ini"
        tagColor="amber"
      />
      
    </div>
  );
}

