import {
	AlertCircle,
	CheckCircle2,
	ClipboardList,
	Clock,
	RefreshCcw,
} from "lucide-react";
import type { Abnormality } from "@/types/api";

interface AbnormalityFeedProps {
	items?: Abnormality[];
	isLoading: boolean;
	isError: boolean;
	onRetry: () => void;
}

const STATUS_CONFIG = {
	open: {
		label: "Terbuka",
		cls: "bg-red-100 text-red-700 border-red-200",
		icon: AlertCircle,
	},
	in_progress: {
		label: "Proses",
		cls: "bg-amber-100 text-amber-700 border-amber-200",
		icon: Clock,
	},
	resolved: {
		label: "Selesai",
		cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
		icon: CheckCircle2,
	},
};

function ProgressBar({ value }: { value: number }) {
	const color =
		value === 100
			? "bg-emerald-500"
			: value >= 50
				? "bg-amber-400"
				: "bg-red-400";
	return (
		<div className="flex items-center gap-2 mt-1">
			<div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full transition-all ${color}`}
					style={{ width: `${value}%` }}
				/>
			</div>
			<span className="text-[9px] font-black text-slate-500">{value}%</span>
		</div>
	);
}

export function AbnormalityFeed({
	items,
	isLoading,
	isError,
	onRetry,
}: AbnormalityFeedProps) {
	const activeCount = items?.filter((i) => i.status !== "resolved").length ?? 0;

	return (
		<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full overflow-hidden font-sans">
			<div className="p-5 sm:p-6 pb-4 flex justify-between items-start shrink-0">
				<div className="flex gap-4">
					<div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
						<ClipboardList className="w-6 h-6" />
					</div>
					<div>
						<h3 className="font-extrabold text-slate-800 text-lg tracking-tight mb-0.5">
							Laporan & Progress Temuan Abnormality
						</h3>
						<p className="text-slate-500 text-xs">
							Penanggulangan 5R — Divisi IIA
						</p>
					</div>
				</div>
				<div className="flex items-center gap-3">
					{isError ? (
						<button
							onClick={onRetry}
							className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
						>
							<RefreshCcw className="w-3.5 h-3.5" /> RETRY
						</button>
					) : (
						<div className="bg-red-50 text-red-600 border border-red-100 px-4 py-1.5 rounded-full text-xs font-bold">
							{activeCount} Insiden Aktif
						</div>
					)}
				</div>
			</div>

			<div className="flex-1 overflow-auto px-5 sm:px-6 pb-4">
				{isLoading ? (
					<div className="space-y-3">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className="h-16 bg-slate-100 rounded-xl animate-pulse"
							/>
						))}
					</div>
				) : !items || items.length === 0 ? (
					<div className="flex items-center justify-center h-full p-8 text-sm text-slate-400">
						Tidak ada data temuan saat ini.
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left border-collapse text-xs min-w-[1100px]">
							<thead className="text-[10px] uppercase font-black text-slate-400 tracking-widest sticky top-0 bg-white z-10">
								<tr>
									<th className="px-3 py-3 border-b-2 border-slate-100 w-8 text-center">
										#
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100">
										Tgl Temuan
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100">
										Penemu / Grup
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100">
										Zona
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100 w-1/4">
										Kondisi Abnormal
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100 w-1/5">
										Penanggulangan
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100">
										Tgl Rencana
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100">
										Tgl Aktual
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100 text-center">
										Kaizen
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100 text-center">
										Progres
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100 text-center">
										TTD Staff
									</th>
									<th className="px-3 py-3 border-b-2 border-slate-100 text-center">
										TTD MS
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-50">
								{items.map((item, idx) => {
									const statusCfg = STATUS_CONFIG[item.status];
									const StatusIcon = statusCfg.icon;
									return (
										<tr
											key={item.id}
											className="hover:bg-slate-50/50 transition-colors"
										>
											<td className="px-3 py-3 text-center font-black text-slate-300">
												{idx + 1}
											</td>
											<td className="px-3 py-3 whitespace-nowrap">
												<div className="font-bold text-slate-700">
													{item.date_found
														? new Date(item.date_found).toLocaleDateString(
																"id-ID",
																{
																	day: "2-digit",
																	month: "short",
																	year: "2-digit",
																},
															)
														: "—"}
												</div>
											</td>
											<td className="px-3 py-3">
												<div className="font-bold text-slate-800">
													{item.finder_name ?? "—"}
												</div>
												{item.group_name && (
													<div className="text-[10px] text-slate-400">
														{item.group_name}
													</div>
												)}
											</td>
											<td className="px-3 py-3">
												<span className="bg-blue-50 text-[#0A2F66] border border-blue-100 px-2 py-0.5 rounded-md font-bold text-[10px]">
													{item.zone_name}
												</span>
											</td>
											<td className="px-3 py-3">
												<p className="text-slate-700 line-clamp-2 leading-relaxed">
													{item.description}
												</p>
											</td>
											<td className="px-3 py-3">
												<p className="text-slate-600 line-clamp-2 text-[11px]">
													{item.countermeasure_plan ?? "—"}
												</p>
												{item.countermeasure_actual && (
													<p className="text-emerald-600 line-clamp-1 text-[10px] mt-0.5 italic">
														{item.countermeasure_actual}
													</p>
												)}
											</td>
											<td className="px-3 py-3 whitespace-nowrap text-slate-500">
												{item.planned_date
													? new Date(item.planned_date).toLocaleDateString(
															"id-ID",
															{ day: "2-digit", month: "short" },
														)
													: "—"}
											</td>
											<td className="px-3 py-3 whitespace-nowrap text-slate-500">
												{item.actual_date
													? new Date(item.actual_date).toLocaleDateString(
															"id-ID",
															{ day: "2-digit", month: "short" },
														)
													: "—"}
											</td>
											<td className="px-3 py-3 text-center">
												{item.is_kaizen ? (
													<span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-black">
														Ada
													</span>
												) : (
													<span className="text-slate-300 text-[10px]">—</span>
												)}
											</td>
											<td className="px-3 py-3 min-w-[100px]">
												<div
													className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusCfg.cls}`}
												>
													<StatusIcon className="w-3 h-3" />
													{statusCfg.label}
												</div>
												<ProgressBar value={item.progress_percentage} />
											</td>
											<td className="px-3 py-3 text-center">
												{item.signed_by_staff ? (
													<div className="text-[10px] font-bold text-emerald-600">
														✓ {item.signed_by_staff}
													</div>
												) : (
													<span className="text-slate-300">—</span>
												)}
											</td>
											<td className="px-3 py-3 text-center">
												{item.signed_by_ms ? (
													<div className="text-[10px] font-bold text-blue-600">
														✓ {item.signed_by_ms}
													</div>
												) : (
													<span className="text-slate-300">—</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-medium">
				<div className="flex items-center gap-3 text-slate-500">
					<span className="flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-red-400"></span>Terbuka
					</span>
					<span className="flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-amber-400"></span>Proses
					</span>
					<span className="flex items-center gap-1">
						<span className="w-2 h-2 rounded-full bg-emerald-400"></span>Selesai
					</span>
				</div>
				<span className="text-[#0A2F66] font-bold uppercase tracking-widest">
					TTD = Tanda Tangan
				</span>
			</div>
		</div>
	);
}
