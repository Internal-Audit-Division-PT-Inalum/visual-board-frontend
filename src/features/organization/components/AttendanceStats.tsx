import { CheckCircle, FileText, Plane, Users } from "lucide-react";

interface AttendanceStatsProps {
	total: number;
	present: number;
	leave: number;
	business_trip: number;
}

export function AttendanceStats({
	total,
	present,
	leave,
	business_trip,
}: AttendanceStatsProps) {
	const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 sm:gap-6 font-sans">
			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 flex items-center gap-4 relative overflow-hidden group">
				<div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full transition-transform group-hover:scale-150 duration-500 z-0"></div>
				<div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 relative z-10 shrink-0 shadow-sm border border-emerald-200">
					<CheckCircle className="w-6 h-6" />
				</div>
				<div className="relative z-10 flex-1">
					<p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
						Kehadiran (Hadir)
					</p>
					<div className="flex items-baseline gap-2">
						<h4 className="text-3xl font-black text-slate-800">{present}</h4>
						<span className="text-sm font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
							{percentage}%
						</span>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 flex items-center gap-4 relative overflow-hidden group">
				<div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full transition-transform group-hover:scale-150 duration-500 z-0"></div>
				<div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 relative z-10 shrink-0 shadow-sm border border-amber-200">
					<FileText className="w-6 h-6" />
				</div>
				<div className="relative z-10">
					<p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
						Cuti
					</p>
					<h4 className="text-3xl font-black text-slate-800">{leave}</h4>
				</div>
			</div>

			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-5 flex items-center gap-4 relative overflow-hidden group">
				<div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-50 rounded-full transition-transform group-hover:scale-150 duration-500 z-0"></div>
				<div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 relative z-10 shrink-0 shadow-sm border border-sky-200">
					<Plane className="w-6 h-6" />
				</div>
				<div className="relative z-10">
					<p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
						Perjalanan Dinas
					</p>
					<h4 className="text-3xl font-black text-slate-800">
						{business_trip}
					</h4>
				</div>
			</div>

			<div className="bg-[#0A2F66] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-5 flex items-center gap-4 relative overflow-hidden">
				<div className="absolute right-0 top-0 w-32 h-full bg-blue-500/20 transform skew-x-12 translate-x-16"></div>
				<div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-blue-200 relative z-10 shrink-0 border border-white/20">
					<Users className="w-6 h-6" />
				</div>
				<div className="relative z-10">
					<p className="text-blue-200 font-bold text-xs uppercase tracking-wider mb-1">
						Total Karyawan
					</p>
					<h4 className="text-3xl font-black text-white">{total}</h4>
				</div>
			</div>
		</div>
	);
}
