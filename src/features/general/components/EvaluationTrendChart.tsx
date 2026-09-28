import { AlertCircle } from "lucide-react";
import type React from "react";
import { useMemo } from "react";
import {
	CartesianGrid,
	LabelList,
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
		const yearGroup = new Map<
			number,
			{ month: string; self_assessment: number | null; asesor: number | null }
		>();

		evaluations.forEach((evalData: FiveREvaluation) => {
			if (!yearGroup.has(evalData.month)) {
				yearGroup.set(evalData.month, {
					month: MONTHS[evalData.month - 1],
					self_assessment: null,
					asesor: null,
				});
			}

			const monthData = yearGroup.get(evalData.month);
			if (monthData) {
				if (evalData.type === "self_assessment") {
					monthData.self_assessment = evalData.total_score;
				} else {
					monthData.asesor = evalData.total_score;
				}
			}
		});

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
		<div className="h-full bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] border border-[#3b82f6]/40 shadow-[0_8px_30px_rgb(37,99,235,0.2)] rounded-xl flex flex-col overflow-hidden relative group z-10">
			{/* Decorative Glowing Orbs */}
			<div className="absolute -bottom-24 -left-12 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-40 group-hover:opacity-60 group-hover:scale-125 transition-all duration-700 -z-10 pointer-events-none" />
			<div className="absolute top-0 right-0 w-64 h-64 bg-cyan-300 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-700 -z-10 pointer-events-none" />

			<div className="p-4 sm:p-5 border-b border-white/20 bg-white/10 backdrop-blur-md">
				<h3 className="text-sm sm:text-base text-white/90 font-bold uppercase tracking-wider flex items-center gap-2 drop-shadow-sm">
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
									stroke="#ffffff"
									opacity={0.15}
								/>
								<XAxis
									dataKey="month"
									stroke="#ffffff"
									opacity={0.7}
									tick={{ fill: "#ffffff", fontSize: 12, opacity: 0.8 }}
								/>
								<YAxis
									domain={[0, 5]}
									stroke="#ffffff"
									opacity={0.7}
									tick={{ fill: "#ffffff", fontSize: 12, opacity: 0.8 }}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#0A2F66",
										borderColor: "rgba(255,255,255,0.2)",
										color: "#ffffff",
										borderRadius: "8px",
										boxShadow:
											"0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.2)",
									}}
									itemStyle={{ color: "#ffffff", fontWeight: "bold" }}
								/>
								<Legend wrapperStyle={{ paddingTop: "20px", opacity: 0.9 }} />
								<Line
									type="monotone"
									name="Self Assessment"
									dataKey="self_assessment"
									stroke="#ffffff"
									strokeWidth={3}
									dot={{ r: 4, fill: "#ffffff", strokeWidth: 2 }}
									activeDot={{ r: 6 }}
								>
									<LabelList
										dataKey="self_assessment"
										position="top"
										fill="#ffffff"
										fontSize={10}
										fontWeight="bold"
									/>
								</Line>
								<Line
									type="monotone"
									name="Asesor"
									dataKey="asesor"
									stroke="#6ee7b7"
									strokeWidth={3}
									dot={{ r: 4, fill: "#6ee7b7", strokeWidth: 2 }}
									activeDot={{ r: 6 }}
								>
									<LabelList
										dataKey="asesor"
										position="bottom"
										fill="#6ee7b7"
										fontSize={10}
										fontWeight="bold"
									/>
								</Line>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>
		</div>
	);
};
