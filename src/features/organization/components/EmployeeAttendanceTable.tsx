import { Check } from "lucide-react";
import type { DivisionEmployee } from "@/types/api";

interface EmployeeAttendanceTableProps {
	employees: DivisionEmployee[];
}

export function EmployeeAttendanceTable({
	employees,
}: EmployeeAttendanceTableProps) {
	// Urutkan pegawai berdasarkan hierarki
	const sortedEmployees = [...employees].sort(
		(a, b) => (a.hierarchy_level || 99) - (b.hierarchy_level || 99),
	);

	return (
		<div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden font-sans">
			<div className="bg-[#0A2F66] p-4 flex items-center justify-between relative overflow-hidden">
				<div className="absolute right-0 top-0 w-64 h-full bg-blue-500/20 transform skew-x-12 translate-x-16"></div>
				<h3 className="text-white font-black tracking-wide relative z-10 uppercase text-sm">
					INFORMASI KEHADIRAN PEGAWAI
				</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse min-w-max">
					<thead>
						<tr className="bg-slate-50 border-b border-slate-200">
							<th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase text-center w-12 border-r border-slate-200">
								NO
							</th>
							<th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase border-r border-slate-200">
								NAMA
							</th>
							<th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase border-r border-slate-200">
								JABATAN
							</th>
							<th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase text-center w-24 border-r border-slate-200">
								HADIR
							</th>
							<th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase text-center w-36 border-r border-slate-200">
								PERJALANAN DINAS
							</th>
							<th className="py-3 px-4 font-bold text-slate-600 text-xs uppercase text-center w-24">
								CUTI
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-100">
						{sortedEmployees.map((emp, index) => (
							<tr
								key={emp.user_id}
								className="hover:bg-slate-50/50 transition-colors"
							>
								<td className="py-3 px-4 text-sm font-semibold text-slate-500 text-center border-r border-slate-200">
									{index + 1}
								</td>
								<td className="py-3 px-4 text-sm font-bold text-slate-800 border-r border-slate-200">
									{emp.name}
								</td>
								<td className="py-3 px-4 text-sm text-slate-600 font-medium border-r border-slate-200">
									{emp.role_label}
								</td>
								<td className="py-3 px-4 text-center border-r border-slate-200">
									{emp.today_status === "present" && (
										<Check className="w-6 h-6 text-emerald-500 mx-auto stroke-[3]" />
									)}
								</td>
								<td className="py-3 px-4 text-center border-r border-slate-200">
									{emp.today_status === "business_trip" && (
										<Check className="w-6 h-6 text-sky-500 mx-auto stroke-[3]" />
									)}
								</td>
								<td className="py-3 px-4 text-center">
									{emp.today_status === "leave" && (
										<Check className="w-6 h-6 text-amber-500 mx-auto stroke-[3]" />
									)}
								</td>
							</tr>
						))}
						{sortedEmployees.length === 0 && (
							<tr>
								<td
									colSpan={6}
									className="py-8 text-center text-slate-400 text-sm"
								>
									Belum ada data pegawai.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
