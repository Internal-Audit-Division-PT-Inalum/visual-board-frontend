import { useKioskData } from "@/features/general/api/useKioskData";
import { AbnormalityFeed } from "@/features/general/components/AbnormalityFeed";
import { AchievementBoard } from "@/features/general/components/AchievementBoard";
import { EvaluationTrendChart } from "@/features/general/components/EvaluationTrendChart";
import { GeneralDocumentViewer } from "@/features/general/components/GeneralDocumentViewer";
import { KpiRow } from "@/features/general/components/KpiRow";
import { TrendMatrix } from "@/features/general/components/TrendMatrix";

export default function General() {
	const { data, isLoading, isError, refetch } = useKioskData();

	return (
		<div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 w-full font-sans relative">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
				<div className="lg:col-span-2 h-full">
					<KpiRow data={data} isLoading={isLoading} />
				</div>
				<div className="lg:col-span-1 min-h-[300px] flex">
					<div className="flex-1 w-full">
						<EvaluationTrendChart />
					</div>
				</div>
			</div>

			<GeneralDocumentViewer />

			<AchievementBoard />

			<TrendMatrix />

			<AbnormalityFeed
				items={data?.abnormalities}
				isLoading={isLoading}
				isError={isError}
				onRetry={refetch}
			/>
		</div>
	);
}
