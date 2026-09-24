import type { UnavailableEmployee } from "@/types/api";

interface UnavailableListProps {
	employees: UnavailableEmployee[];
}

export function UnavailableList({ employees }: UnavailableListProps) {
	if (employees.length === 0) {
		return (
			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 text-center text-slate-500 font-medium font-sans">
				Semua karyawan Divisi IIA hadir hari ini. Luar biasa!
			</div>
		);
	}

	const getLeaveTypeLabel = (type: string) => {
		switch (type) {
			case "sick_leave":
				return {
					label: "Sakit",
					color: "text-rose-600 bg-rose-50 border-rose-200",
				};
			case "annual_leave":
				return {
					label: "Cuti",
					color: "text-amber-600 bg-amber-50 border-amber-200",
				};
			case "business_trip":
				return {
					label: "Perjalanan Dinas",
					color: "text-blue-600 bg-blue-50 border-blue-200",
				};
			case "special_leave":
				return {
					label: "Cuti Khusus",
					color: "text-purple-600 bg-purple-50 border-purple-200",
				};
			default:
				return {
					label: "Absen",
					color: "text-slate-600 bg-slate-50 border-slate-200",
				};
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 font-sans overflow-hidden h-full flex flex-col">
			<div className="p-5 border-b border-slate-100 bg-[#F8FAFC]">
				<h3 className="font-extrabold text-slate-800 text-base uppercase tracking-wide">
					Daftar Ketidakhadiran
				</h3>
				<p className="text-slate-500 text-xs font-semibold mt-1">
					Status karyawan yang tidak tersedia hari ini
				</p>
			</div>

			<div className="divide-y divide-slate-100 overflow-y-auto flex-1">
				{employees.map((emp, index) => {
					const badge = getLeaveTypeLabel(emp.leave_type);

					return (
						<div
							key={emp.user_id || index}
							className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 font-bold uppercase shadow-inner">
									{emp.name.substring(0, 2)}
								</div>
								<div>
									<p className="font-bold text-slate-800 text-sm">{emp.name}</p>
									<p className="text-xs text-slate-500 font-medium">
										{emp.position}
									</p>
								</div>
							</div>
							<span
								className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${badge.color}`}
							>
								{badge.label}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
