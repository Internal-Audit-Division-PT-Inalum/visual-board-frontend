import type { DayStatus, ScheduleZoneRow } from "@/types/api";

interface CheckSheetMatrixProps {
	zoneName: string;
	data: ScheduleZoneRow[];
}

export function CheckSheetMatrix({ zoneName, data }: CheckSheetMatrixProps) {
	const currentDay = new Date().getDate().toString();

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

	const groupedByItem = data.reduce(
		(acc, row) => {
			if (!acc[row.item_group]) acc[row.item_group] = [];
			acc[row.item_group].push(row);
			return acc;
		},
		{} as Record<string, ScheduleZoneRow[]>,
	);

	const itemGroups = Object.keys(groupedByItem);

	return (
		<div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden font-sans flex flex-col h-full">
			<div className="bg-[#E2E8F0] px-4 py-3 border-b border-slate-300">
				<h4 className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-wider uppercase text-center">
					CHECK SHEET AKTIFITAS 5R ZONA{" "}
					{zoneName.replace(/[^0-9]/g, "") || zoneName}
				</h4>
			</div>

			<div className="overflow-x-auto flex-1">
				<table className="w-full text-xs text-left border-collapse min-w-[500px]">
					<thead className="bg-[#F1F5F9] text-slate-800 font-extrabold text-[11px] uppercase tracking-wider">
						<tr>
							<th className="px-3 py-2.5 border border-slate-300 w-1/5 text-center bg-[#E2E8F0]">
								Item 5R
							</th>
							<th
								colSpan={2}
								className="px-3 py-2.5 border border-slate-300 text-center bg-[#E2E8F0]"
							>
								Standar
							</th>
							<th className="px-3 py-2.5 border border-slate-300 w-16 text-center bg-[#E2E8F0]">
								HASIL
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200 bg-white">
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
											className="px-3 py-2 border border-slate-300 font-extrabold text-slate-800 text-center bg-white whitespace-nowrap align-middle"
										>
											{row.item_group}
										</td>
									)}

									<td className="px-2 py-1.5 border border-slate-300 font-bold text-slate-600 text-center w-12 bg-[#F8FAFC]">
										{row.criteria_code}
									</td>

									<td className="px-3 py-1.5 border border-slate-300 text-slate-700 font-medium">
										{row.criteria_description}
									</td>

									<td className="px-1 py-1 text-center border border-slate-300 align-middle">
										<div className="flex items-center justify-center min-h-[24px]">
											{renderSymbol(row.days[currentDay])}
										</div>
									</td>
								</tr>
							));
						})}
					</tbody>
				</table>
			</div>

			<div className="bg-white border-t border-slate-300 px-3 py-2 flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-1 text-[10px] font-bold text-slate-600">
				<div className="flex items-center gap-1.5">
					{renderSymbol("rencana")} <span>= Rencana</span>
				</div>
				<div className="flex items-center gap-1.5">
					{renderSymbol("ok_tanpa_5r")} <span>= OK, Tanpa melakukan 5R</span>
				</div>
				<div className="flex items-center gap-1.5">
					{renderSymbol("ok_dengan_5r")} <span>= OK, Dengan melakukan 5R</span>
				</div>
				<div className="flex items-center gap-1.5">
					{renderSymbol("abnormal")} <span>= Ada temuan abnormality</span>
				</div>
			</div>
		</div>
	);
}
