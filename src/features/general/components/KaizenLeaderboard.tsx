import { AlertCircle, Trophy } from "lucide-react";
import type { KaizenChampion } from "@/types/api";

interface KaizenLeaderboardProps {
	champions?: KaizenChampion[];
	isLoading: boolean;
	isError: boolean;
}

export function KaizenLeaderboard({
	champions,
	isLoading,
	isError,
}: KaizenLeaderboardProps) {
	const sorted = [...(champions || [])].sort((a, b) => a.rank - b.rank);
	const podiumOrder = [sorted[1] || null, sorted[0] || null, sorted[2] || null];

	return (
		<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col h-full overflow-hidden font-sans">
			<div className="p-5 sm:p-6 pb-4 flex justify-between items-start shrink-0">
				<div className="flex gap-3">
					<div className="w-10 h-10 rounded-xl bg-[#FFF7E6] text-[#F59E0B] flex items-center justify-center shrink-0 border border-[#FFE0A3]">
						<Trophy className="w-5 h-5" />
					</div>
					<div>
						<h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight mb-0.5">
							Leaderboard Divisi IIA
						</h3>
						<p className="text-slate-500 text-[10px] sm:text-xs">
							Penghargaan Kinerja Terbaik
						</p>
					</div>
				</div>
				<div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
					PANGGUNG PENGHARGAAN
				</div>
			</div>

			<div className="flex-1 px-4 sm:px-6 relative flex flex-col justify-end pt-12 pb-6">
				{isLoading ? (
					<div className="absolute inset-0 p-5 flex items-end justify-center gap-4">
						<div className="w-24 h-24 bg-slate-100 rounded-t-xl animate-pulse"></div>
						<div className="w-28 h-36 bg-slate-100 rounded-t-xl animate-pulse"></div>
						<div className="w-24 h-20 bg-slate-100 rounded-t-xl animate-pulse"></div>
					</div>
				) : isError ? (
					<div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
						<AlertCircle className="w-6 h-6 text-red-400 mb-2" />
						<p className="text-xs font-semibold">Gagal memuat leaderboard</p>
					</div>
				) : !champions || champions.length === 0 ? (
					<div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400">
						Belum ada juara bulan ini.
					</div>
				) : (
					<div className="flex justify-center items-end h-full gap-2 sm:gap-4 max-w-md mx-auto w-full">
						<div className="flex-1 flex flex-col items-center group">
							{podiumOrder[0] && (
								<>
									<div className="relative mb-2">
										<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-4 border-slate-200 shadow-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl uppercase">
											{podiumOrder[0].name.slice(0, 2)}
										</div>
										<div className="absolute -bottom-2 -right-2 w-6 h-6 bg-slate-400 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
											#2
										</div>
									</div>
									<div className="text-center mb-2">
										<div className="font-extrabold text-slate-800 text-xs sm:text-sm truncate w-24">
											{podiumOrder[0].name}
										</div>
										<div className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate w-24">
											{podiumOrder[0].department}
										</div>
										<div className="font-bold text-[#0A2F66] text-sm mt-1">
											{podiumOrder[0].score} pts
										</div>
									</div>
									<div className="w-full bg-[#F1F5F9] border-t-2 border-slate-300 rounded-t-xl h-24 sm:h-28 flex flex-col items-center justify-end pb-4 shadow-inner relative overflow-hidden group-hover:h-28 transition-all">
										<div className="font-black text-slate-400 text-xs tracking-widest uppercase">
											PERAK
										</div>
										<div className="text-[9px] text-slate-500 font-medium mt-1">
											{podiumOrder[0].kaizen_count} Kaizen
										</div>
									</div>
								</>
							)}
						</div>

						<div className="flex-1 flex flex-col items-center group -mt-8 z-10">
							{podiumOrder[1] && (
								<>
									<div className="relative mb-2">
										<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md z-20">
											👑
										</div>
										<div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-[#FBBF24] shadow-xl bg-amber-100 flex items-center justify-center text-amber-500 font-bold text-2xl uppercase relative z-10">
											{podiumOrder[1].name.slice(0, 2)}
										</div>
										<div className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#F59E0B] text-white rounded-full flex items-center justify-center textxs font-black border-2 border-white shadow-md z-20">
											#1
										</div>
									</div>
									<div className="text-center mb-2">
										<div className="font-black text-slate-900 text-sm sm:text-base truncate w-28">
											{podiumOrder[1].name}
										</div>
										<div className="text-[10px] sm:text-xs text-slate-500 font-medium truncate w-28">
											{podiumOrder[1].department}
										</div>
										<div className="font-black text-emerald-600 text-base mt-1">
											{podiumOrder[1].score} pts
										</div>
									</div>
									<div className="w-full bg-gradient-to-b from-[#0A2F66] to-[#041530] border-t-4 border-[#FBBF24] rounded-t-2xl h-36 sm:h-44 flex flex-col items-center justify-end pb-5 shadow-2xl relative overflow-hidden group-hover:h-44 transition-all">
										<div className="bg-[#F59E0B] text-white px-3 py-0.5 rounded-sm text-[9px] font-black tracking-widest uppercase mb-2 shadow-sm border border-amber-300">
											LENCANA BINTANG
										</div>
										<div className="font-black text-[#FBBF24] text-xs sm:text-sm tracking-widest uppercase text-center leading-tight">
											JUARA
											<br />
											EMAS
										</div>
										<div className="text-[10px] text-blue-200 font-medium mt-1.5">
											{podiumOrder[1].kaizen_count} Kaizen
										</div>
									</div>
								</>
							)}
						</div>

						<div className="flex-1 flex flex-col items-center group">
							{podiumOrder[2] && (
								<>
									<div className="relative mb-2">
										<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-4 border-[#D97706] shadow-lg bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xl uppercase">
											{podiumOrder[2].name.slice(0, 2)}
										</div>
										<div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#D97706] text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-sm">
											#3
										</div>
									</div>
									<div className="text-center mb-2">
										<div className="font-extrabold text-slate-800 text-xs sm:text-sm truncate w-24">
											{podiumOrder[2].name}
										</div>
										<div className="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate w-24">
											{podiumOrder[2].department}
										</div>
										<div className="font-bold text-[#0A2F66] text-sm mt-1">
											{podiumOrder[2].score} pts
										</div>
									</div>
									<div className="w-full bg-[#FFF7E6] border-t-2 border-[#D97706] rounded-t-xl h-20 sm:h-24 flex flex-col items-center justify-end pb-4 shadow-inner relative overflow-hidden group-hover:h-24 transition-all">
										<div className="font-black text-[#D97706] text-xs tracking-widest uppercase">
											PERUNGGU
										</div>
										<div className="text-[9px] text-orange-700/60 font-medium mt-1">
											{podiumOrder[2].kaizen_count} Kaizen
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
