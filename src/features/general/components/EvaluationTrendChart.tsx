import { AlertCircle } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import {
	CartesianGrid,
	Legend,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useKioskData } from "@/features/general/api/useKioskData";
import type { FiveREvaluation } from "@/types/api";

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"Mei",
	"Jun",
	"Jul",
	"Ags",
	"Sep",
	"Okt",
	"Nov",
	"Des",
];

export const EvaluationTrendChart: React.FC = () => {
	const { data, isLoading, isError } = useKioskData();

	const chartData = useMemo(() => {
		if (!data?.five_r_evaluations) return [];

		const evaluations = data.five_r_evaluations;
		const yearGroup = new Map<number, any>();

		// Group by month
		evaluations.forEach((evalData: FiveREvaluation) => {
			if (!yearGroup.has(evalData.month)) {
				yearGroup.set(evalData.month, {
					month: MONTHS[evalData.month - 1],
					self_assessment: null,
					asesor: null,
				});
			}

			const monthData = yearGroup.get(evalData.month);
			if (evalData.type === "self_assessment") {
				monthData.self_assessment = evalData.total_score;
			} else {
				monthData.asesor = evalData.total_score;
			}
		});

		// Sort by month (1-12)
		const sorted = Array.from(yearGroup.keys())
			.sort((a, b) => a - b)
			.map((key) => yearGroup.get(key));

		return sorted;
	}, [data?.five_r_evaluations]);

	if (isLoading) {
		return (
			<div className="h-full bg-slate-900 border border-slate-800 shadow-2xl rounded-xl flex flex-col overflow-hidden">
				<div className="p-6 pb-2">
					<h3 className="text-xl text-slate-100 font-bold uppercase tracking-wider flex items-center gap-2">
						Trend Assessment & Assessment by Asesor
					</h3>
				</div>
				<div className="p-6 flex-1 relative min-h-[120px]">
					<div className="absolute inset-0 p-6">
						<Skeleton className="w-full h-full bg-slate-800 rounded-xl" />
					</div>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<Alert variant="destructive" className="bg-red-900/50 border-red-800">
				<AlertCircle className="h-4 w-4 text-red-400" />
				<AlertTitle className="text-red-400">Error</AlertTitle>
				<AlertDescription className="text-red-300">
					Gagal memuat data trend evaluasi.
				</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="h-full bg-slate-900 border border-slate-800 shadow-2xl rounded-xl flex flex-col overflow-hidden">
			<div className="p-4 sm:p-5 border-b border-slate-800/50 bg-slate-900/50">
				<h3 className="text-sm sm:text-base text-slate-100 font-bold uppercase tracking-wider flex items-center gap-2">
					Trend Assessment & Assessment by Asesor
				</h3>
			</div>
			<div className="flex-1 p-2 sm:p-4 min-h-[250px]">
				{chartData.length === 0 ? (
					<div className="w-full h-full flex items-center justify-center">
						<p className="text-slate-400">Belum ada data evaluasi</p>
					</div>
				) : (
					<div className="w-full h-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart
								data={chartData}
								margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#334155"
									opacity={0.5}
								/>
								<XAxis
									dataKey="month"
									stroke="#94a3b8"
									tick={{ fill: "#94a3b8", fontSize: 12 }}
								/>
								<YAxis
									domain={[0, 5]}
									stroke="#94a3b8"
									tick={{ fill: "#94a3b8", fontSize: 12 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#0f172a",
										borderColor: "#1e293b",
										color: "#f8fafc",
										borderRadius: "8px",
									}}
									itemStyle={{ color: "#f8fafc" }}
								/>
								<Legend wrapperStyle={{ paddingTop: "20px" }} />
								<Line
									type="monotone"
									name="Self Assessment"
									dataKey="self_assessment"
									stroke="#38bdf8"
									strokeWidth={3}
									dot={{ r: 4, fill: "#38bdf8", strokeWidth: 2 }}
									activeDot={{ r: 6 }}
								/>
								<Line
									type="monotone"
									name="Asesor"
									dataKey="asesor"
									stroke="#fbbf24"
									strokeWidth={3}
									dot={{ r: 4, fill: "#fbbf24", strokeWidth: 2 }}
									activeDot={{ r: 6 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>
		</div>
	);
};
