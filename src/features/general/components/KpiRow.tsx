import { AlertTriangle, Lightbulb } from "lucide-react";
import { KpiCard } from "@/components/shared/KpiCard";
import type { KioskDashboardResponse } from "@/types/api";

interface KpiRowProps {
	data?: KioskDashboardResponse;
	isLoading: boolean;
}

export function KpiRow({ data, isLoading }: KpiRowProps) {
	const openCount = data?.open_abnormality_count ?? 0;
	const inProgressCount = data?.abnormality_in_progress ?? 0;
	const resolvedToday = data?.abnormality_resolved_today ?? 0;

	const kaizen = data?.kaizen_implemented_count ?? 0;

	const activeAbnormalities = openCount + inProgressCount;
	const formattedActiveCount = activeAbnormalities.toString().padStart(2, "0");

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 h-full">
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
				title="Ide Kaizen Diimplementasikan"
				value={kaizen}
				icon={Lightbulb}
				colorTheme="warning"
				isLoading={isLoading}
				tagText="Tahun Ini"
				tagColor="amber"
			/>
		</div>
	);
}
