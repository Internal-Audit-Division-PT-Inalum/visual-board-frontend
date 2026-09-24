import { Briefcase, Building2, CircleAlert, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkstationByEmployee } from "../api/useWorkstationByEmployee";

interface EmployeeWorkstationModalProps {
	employeeId: string | null;
	isOpen: boolean;
	onClose: () => void;
}

export function EmployeeWorkstationModal({
	employeeId,
	isOpen,
	onClose,
}: EmployeeWorkstationModalProps) {
	const {
		data: workstation,
		isLoading,
		isError,
	} = useWorkstationByEmployee(employeeId);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="w-[95vw] sm:max-w-2xl xl:max-w-7xl bg-slate-900 border-slate-700 text-slate-100 p-0 overflow-hidden shadow-2xl max-h-[95vh] flex flex-col">
				<div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
					<DialogHeader className="mb-4">
						<DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
							<Building2 className="w-6 h-6 text-blue-400" />
							Standar 5R Meja Kerja
						</DialogTitle>
					</DialogHeader>

					{isLoading ? (
						<div className="flex flex-col md:flex-row gap-6">
							<div className="w-full md:w-1/3 flex flex-col gap-4">
								<Skeleton className="h-32 sm:h-40 w-full bg-slate-800 rounded-xl" />
								<Skeleton className="h-48 sm:h-64 w-full bg-slate-800 rounded-xl" />
							</div>
							<Skeleton className="h-64 sm:h-96 w-full md:w-2/3 bg-slate-800 rounded-xl" />
						</div>
					) : isError || !workstation ? (
						<div className="py-8 sm:py-12">
							<Alert
								variant="destructive"
								className="bg-red-500/10 border-red-500/30 text-red-400 mx-auto max-w-lg"
							>
								<CircleAlert className="h-5 w-5" />
								<AlertTitle>Tidak Ada Data Meja</AlertTitle>
								<AlertDescription>
									Karyawan ini belum ditugaskan pada meja atau area kerja mana
									pun di dalam sistem.
								</AlertDescription>
							</Alert>
						</div>
					) : (
						<div className="flex flex-col xl:flex-row gap-6 h-full">
							<div className="w-full xl:w-1/4 flex flex-col gap-4">
								<div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
									<h3 className="font-semibold text-slate-300 mb-4 flex items-center gap-2">
										<Briefcase className="w-4 h-4 text-emerald-400" />
										Penanggung Jawab (PIC)
									</h3>
									<div className="flex items-center gap-3">
										<div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-slate-300 overflow-hidden shrink-0">
											{workstation.employee?.avatar_url ? (
												<img
													src={workstation.employee.avatar_url}
													alt={workstation.employee.name}
													className="w-full h-full object-cover"
												/>
											) : (
												workstation.employee?.name?.charAt(0) || "?"
											)}
										</div>
										<div>
											<p
												className="font-medium text-white line-clamp-1"
												title={workstation.employee?.name}
											>
												{workstation.employee?.name}
											</p>
											<p className="text-sm text-slate-400 font-mono">
												{workstation.employee?.namecode}
											</p>
										</div>
									</div>

									<div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center gap-2 text-sm text-slate-300">
										<MapPin className="w-4 h-4 text-rose-400 shrink-0" />
										<span
											className="font-medium text-white line-clamp-1"
											title={workstation.zone?.name || "Belum di-set"}
										>
											Lokasi: {workstation.zone?.name || "Belum di-set"}
										</span>
									</div>
								</div>

								<div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 flex-1 flex flex-col max-h-[40vh] xl:max-h-full">
									<div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex-shrink-0">
										<h3 className="font-semibold text-slate-300">
											Daftar ATK Standar
										</h3>
									</div>
									<div className="overflow-y-auto flex-1 min-h-[150px] xl:min-h-[200px] custom-scrollbar">
										<table className="w-full text-sm text-left">
											<thead className="bg-slate-900/50 sticky top-0 z-10 border-b border-slate-700/50">
												<tr>
													<th className="text-slate-400 font-semibold h-8 px-4 py-2">
														Item
													</th>
													<th className="text-slate-400 font-semibold h-8 px-4 py-2 text-right w-20">
														Std Qty
													</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-slate-700/50">
												{!workstation.items ||
												workstation.items.length === 0 ? (
													<tr className="hover:bg-slate-800/50 transition-colors">
														<td
															colSpan={2}
															className="text-center text-slate-500 py-6"
														>
															Tidak ada item standar yang diwajibkan.
														</td>
													</tr>
												) : (
													workstation.items.map((item) => (
														<tr
															key={item.id}
															className="hover:bg-slate-800/50 transition-colors"
														>
															<td className="font-medium px-4 py-3">
																<span className="line-clamp-2 text-slate-300">
																	{item.name}
																</span>
																<span className="block text-[10px] text-slate-500 mt-1 font-mono">
																	{item.sku}
																</span>
															</td>
															<td className="text-right px-4 py-3 align-top">
																<Badge
																	variant="outline"
																	className="bg-slate-900 border-slate-600 text-slate-300"
																>
																	{item.standard_quantity}
																</Badge>
															</td>
														</tr>
													))
												)}
											</tbody>
										</table>
									</div>
								</div>
							</div>

							<div className="w-full xl:w-2/4 bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col xl:min-h-[450px]">
								<div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
									<h3 className="font-semibold text-slate-300 flex items-center gap-2">
										Visual Standar Meja
									</h3>
									<Badge
										className={
											workstation.is_active
												? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
												: "bg-amber-500/20 text-amber-400 border-amber-500/50"
										}
									>
										{workstation.is_active
											? "Status: Aktif"
											: "Status: Non-Aktif"}
									</Badge>
								</div>
								<div className="flex-1 bg-black/60 flex flex-col items-center justify-center p-4 sm:p-6 relative group min-h-[250px] xl:min-h-0">
									{workstation.standard_image_url ? (
										<div className="relative w-full h-full flex items-center justify-center">
											<img
												src={workstation.standard_image_url}
												alt={`Standar meja ${workstation.name}`}
												className="max-h-[300px] sm:max-h-[400px] xl:max-h-full max-w-full object-contain rounded-lg border border-slate-700 shadow-2xl"
											/>
										</div>
									) : (
										<div className="text-center text-slate-500 flex flex-col items-center justify-center">
											<CircleAlert className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-20" />
											<p className="text-base sm:text-lg font-medium text-slate-400">
												Foto Standar Belum Tersedia
											</p>
											<p className="text-xs sm:text-sm mt-2 max-w-xs px-4">
												Auditor belum mengunggah foto standar 5R untuk meja ini.
											</p>
										</div>
									)}
								</div>
								<div className="bg-slate-800 px-4 py-3 border-t border-slate-700 text-xs sm:text-sm text-slate-400 text-center">
									Kode Meja:{" "}
									<span className="font-mono text-slate-300">
										{workstation.name}
									</span>
								</div>
							</div>

							<div className="w-full xl:w-[35%] bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col xl:min-h-[450px]">
								<div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
									<h3 className="font-semibold text-slate-300 flex items-center gap-2">
										Standar Kondisi yang Diinginkan
									</h3>
								</div>
								<div className="overflow-y-auto flex-1 custom-scrollbar">
									{!workstation.master_criterias ||
									workstation.master_criterias.length === 0 ? (
										<div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
											<p className="text-sm">
												Belum ada standar kriteria aktif.
											</p>
										</div>
									) : (
										<table className="w-full text-sm text-left">
											<thead className="bg-slate-900/50 sticky top-0 text-slate-400 font-semibold border-b border-slate-700">
												<tr>
													<th className="py-3 px-4 w-[30%]">Item Aktivitas</th>
													<th className="py-3 px-4">Standar Kondisi</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-slate-700/50">
												{workstation.master_criterias.map((criteria: any) => (
													<tr
														key={criteria.id}
														className="hover:bg-slate-800/50 transition-colors"
													>
														<td className="py-3 px-4 font-medium text-slate-300 align-top">
															{criteria.criteria_code}
														</td>
														<td className="py-3 px-4 text-slate-400 leading-relaxed">
															{criteria.standard_criteria}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
