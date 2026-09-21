import { AlertCircle, Building2, Loader2, Map, Users } from "lucide-react";
import { useState } from "react";
import { useAttendanceSummary } from "../features/organization/api/useAttendanceSummary";
import { AttendanceStats } from "../features/organization/components/AttendanceStats";
import { DivisionEmployees } from "../features/organization/components/DivisionEmployees";
import { DocumentViewer } from "../features/organization/components/DocumentViewer";
import { UnavailableList } from "../features/organization/components/UnavailableList";
import { EmployeeWorkstationModal } from "../features/workstation/components/EmployeeWorkstationModal";

export default function Organization() {
	const { data, isLoading, isError } = useAttendanceSummary();
	const [activeTab, setActiveTab] = useState<
		"structure" | "map_area" | "attendance"
	>("structure");
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
		null,
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[500px]">
				<Loader2 className="w-10 h-10 animate-spin text-blue-500" />
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="flex items-center justify-center min-h-[500px]">
				<div className="text-center p-8 bg-red-50 rounded-2xl border border-red-100 max-w-md">
					<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
					<h3 className="text-red-800 font-bold mb-1">Gagal Memuat Data</h3>
					<p className="text-red-600 text-sm">
						Tidak dapat terhubung ke server HR. Silakan periksa koneksi atau
						hubungi Administrator.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-[1920px] mx-auto p-4 sm:p-6 lg:p-8 font-sans space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 mb-8 border-b border-slate-200">
				<div>
					<div className="flex items-center gap-2 text-[#0A2F66] font-bold text-xs tracking-widest mb-1 uppercase">
						<span className="w-1.5 h-1.5 rounded-full bg-[#0A2F66]"></span>
						DIVISI IIA • MANAJEMEN SDM
					</div>
					<h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
						Organisasi & Presensi
					</h2>
				</div>

				<div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
					<button
						onClick={() => setActiveTab("structure")}
						className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
							activeTab === "structure"
								? "bg-white text-blue-700 shadow-sm"
								: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
						}`}
					>
						<Building2 className="w-4 h-4" />
						Bagan Struktur
					</button>
					<button
						onClick={() => setActiveTab("map_area")}
						className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
							activeTab === "map_area"
								? "bg-white text-blue-700 shadow-sm"
								: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
						}`}
					>
						<Map className="w-4 h-4" />
						Map Area 5R
					</button>
					<button
						onClick={() => setActiveTab("attendance")}
						className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
							activeTab === "attendance"
								? "bg-white text-blue-700 shadow-sm"
								: "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
						}`}
					>
						<Users className="w-4 h-4" />
						Data Presensi
					</button>
				</div>
			</div>

			<div className="w-full">
				{activeTab === "structure" && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						<DocumentViewer category="structure" />
					</div>
				)}

				{activeTab === "map_area" && (
					<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
						<DocumentViewer category="map_area" />
					</div>
				)}

				{activeTab === "attendance" && (
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div className="lg:col-span-8 h-full min-h-[500px] flex flex-col gap-6">
							<DivisionEmployees
								employees={data.division_employees}
								onEmployeeClick={(id) => setSelectedEmployeeId(id)}
							/>
						</div>

						<div className="lg:col-span-4 flex flex-col gap-6">
							<AttendanceStats
								total={data.total_employees}
								present={data.present_count}
								sick={data.sick_count}
								leave={data.on_leave_count}
							/>
							<div className="flex-1 min-h-[400px]">
								<UnavailableList employees={data.unavailable_today} />
							</div>
						</div>
					</div>
				)}
			</div>

			<EmployeeWorkstationModal
				employeeId={selectedEmployeeId}
				isOpen={!!selectedEmployeeId}
				onClose={() => setSelectedEmployeeId(null)}
			/>
		</div>
	);
}
