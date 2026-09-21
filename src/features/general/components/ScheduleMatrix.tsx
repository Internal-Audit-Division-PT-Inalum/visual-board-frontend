import type { DayStatus, ScheduleZoneRow } from "@/types/api";

interface ScheduleMatrixProps {
	data: ScheduleZoneRow[];
}

export function ScheduleMatrix({ data }: ScheduleMatrixProps) {
	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	const renderSymbol = (status?: DayStatus) => {
		switch (status) {
			case "rencana":
				return (
					<span className="text-slate-400 font-bold text-lg leading-none">
						○
					</span>
				);
			case "ok_tanpa_5r":
				return (
					<span className="text-emerald-500 font-extrabold text-lg leading-none">
						◎
					</span>
				);
			case "ok_dengan_5r":
				return (
					<span className="text-amber-500 font-extrabold text-lg leading-none">
						△
					</span>
				);
			case "abnormal":
				return (
					<span className="text-red-500 font-extrabold text-lg leading-none">
						☒
					</span>
				);
			default:
				return null;
		}
	};

	const groupedByZone = data.reduce(
		(acc, row) => {
			if (!acc[row.zone_name]) acc[row.zone_name] = [];
			acc[row.zone_name].push(row);
			return acc;
		},
		{} as Record<string, ScheduleZoneRow[]>,
	);

	const zoneNames = Object.keys(groupedByZone);

	if (zoneNames.length === 0) {
		return (
			<div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 text-center text-slate-500 font-medium">
				Tidak ada jadwal 5R untuk bulan ini.
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-8 font-sans">
			{zoneNames.map((zoneName) => {
				const zoneData = groupedByZone[zoneName];

				const groupedByItem = zoneData.reduce(
					(acc, row) => {
						if (!acc[row.item_group]) acc[row.item_group] = [];
						acc[row.item_group].push(row);
						return acc;
					},
					{} as Record<string, ScheduleZoneRow[]>,
				);

				const itemGroups = Object.keys(groupedByItem);

				return (
					<div
						key={zoneName}
						className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden"
					>
						<div className="bg-[#0A2F66] text-white p-4 sm:p-5 flex justify-between items-center relative overflow-hidden">
							<div className="absolute top-0 right-0 w-64 h-full bg-blue-500/20 transform skew-x-12 translate-x-10" />
							<div className="relative z-10 flex items-center gap-3">
								<div className="w-2 h-8 bg-red-500 rounded-sm" />
								<div>
									<h3 className="font-extrabold text-lg sm:text-xl tracking-wide uppercase">
										SCHEDULE AKTIFITAS 5R ({zoneName.toUpperCase()})
									</h3>
									<p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mt-0.5">
										MANUFACTURING EXCELLENCE COMMAND CENTER
									</p>
								</div>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left border-collapse">
								<thead className="bg-[#F1F5F9] text-slate-700 font-extrabold text-[11px] uppercase tracking-wider">
									<tr>
										<th className="px-4 py-3 border border-slate-300 min-w-[120px] text-center bg-[#E2E8F0]">
											Item 5R
										</th>
										<th className="px-4 py-3 border border-slate-300 min-w-[300px] text-center bg-[#E2E8F0]">
											Standar
										</th>
										<th
											colSpan={31}
											className="px-4 py-1 border border-slate-300 text-center bg-[#E2E8F0]"
										>
											Tanggal
										</th>
									</tr>
									<tr>
										<th className="border border-slate-300 bg-[#E2E8F0] p-0"></th>
										<th className="border border-slate-300 bg-[#E2E8F0] p-0"></th>
										{days.map((day) => (
											<th
												key={day}
												className="px-1 py-2 border border-slate-300 text-center w-8 min-w-[32px] bg-slate-50"
											>
												{day}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200">
									{itemGroups.map((itemGroup) => {
										const groupRows = groupedByItem[itemGroup];

										return groupRows.map((row, index) => (
											<tr
												key={`${row.zone_id}-${row.criteria_code}-${index}`}
												className="hover:bg-blue-50/30 transition-colors"
											>
												{index === 0 && (
													<td
														rowSpan={groupRows.length}
														className="px-4 py-3 border border-slate-300 font-extrabold text-slate-800 text-center bg-white whitespace-nowrap shadow-[inset_-2px_0_0_#E2E8F0]"
													>
														{row.item_group}
													</td>
												)}

												<td className="px-4 py-2 border border-slate-300 text-slate-700 font-medium">
													<span className="font-bold mr-2 text-slate-900">
														{row.criteria_code}
													</span>
													{row.criteria_description}
												</td>

												{days.map((day) => (
													<td
														key={day}
														className="px-1 py-1 text-center border border-slate-200"
													>
														<div className="flex items-center justify-center h-6">
															{renderSymbol(row.days[day.toString()])}
														</div>
													</td>
												))}
											</tr>
										));
									})}
								</tbody>
							</table>
						</div>
					</div>
				);
			})}

			<div className="p-4 sm:p-5 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-wrap gap-6 sm:gap-8 text-xs sm:text-sm font-bold text-slate-700 justify-center">
				<div className="flex items-center gap-2">
					{renderSymbol("rencana")} <span className="ml-1">= Rencana</span>
				</div>
				<div className="flex items-center gap-2">
					{renderSymbol("ok_tanpa_5r")}{" "}
					<span className="ml-1">= OK, Tanpa melakukan 5R</span>
				</div>
				<div className="flex items-center gap-2">
					{renderSymbol("ok_dengan_5r")}{" "}
					<span className="ml-1">= OK, Dengan melakukan 5R</span>
				</div>
				<div className="flex items-center gap-2">
					{renderSymbol("abnormal")}{" "}
					<span className="ml-1">= Ada temuan abnormality</span>
				</div>
			</div>
		</div>
	);
}
