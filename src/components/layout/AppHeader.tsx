import { Clock } from "lucide-react";
import { useBulletins } from "@/features/bulletin/api/useBulletins";
import { useKioskData } from "@/features/general/api/useKioskData";
import { useAttendanceSummary } from "@/features/organization/api/useAttendanceSummary";
import { useClock } from "@/hooks/useClock";

export type TabSlug =
	| "general"
	| "schedule_5r"
	| "organization"
	| "department_hub";

interface AppHeaderProps {
	activeTab: TabSlug;
	onTabChange: (tab: TabSlug) => void;
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
	const { time, date } = useClock();

	const { data: kioskData } = useKioskData();
	const { data: attendanceData } = useAttendanceSummary();
	const { data: bulletinsData } = useBulletins(12);

	const TABS: { label: string; value: TabSlug; badge?: string }[] = [
		{
			label: "GENERAL",
			value: "general",
			badge: kioskData?.abnormalities?.length
				? `${kioskData.abnormalities.length} Isu Aktif`
				: "Aman",
		},
		{
			label: "LAPORAN 5R",
			value: "schedule_5r",
			badge: `Hari ke-${new Date().getDate()}`,
		},
		{
			label: "ORGANISASI",
			value: "organization",
			badge: attendanceData
				? `${attendanceData.present_count}/${attendanceData.total_employees} Hadir`
				: "...",
		},
		{
			label: "MADING DIVISI",
			value: "department_hub",
			badge: bulletinsData ? `${bulletinsData.length} Info` : "...",
		},
	];

	return (
		<header className="bg-gradient-to-r from-[#0C3B82] via-[#0D4494] to-[#0A2F66] text-white flex flex-col pt-5 pb-5 px-8 shadow-lg z-10 shrink-0 font-sans border-b-4 border-[#0F3D8C]">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
				<div className="flex gap-4 items-center">
					<div className="h-16 sm:h-20 lg:h-24 shrink-0 bg-white rounded-xl flex items-center justify-center shadow-md px-6 py-4">
						<img
							src="/inalum-logo-2.png"
							alt="PT Inalum"
							className="h-full w-auto object-contain"
						/>
					</div>

					<div className="flex flex-col gap-1.5 ml-3">
						<div className="flex items-baseline gap-4">
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-sm">
								IIA 5 ACTIVITY BOARD
							</h1>
							<span className="text-white/80 font-medium text-base sm:text-lg hidden md:inline-block">
								| PT Indonesia Asahan Aluminium (Persero)
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between items-end">
				<nav
					className="flex gap-3 overflow-x-auto scrollbar-hide pb-1 sm:pb-0"
					role="tablist"
				>
					{TABS.map((tab) => (
						<button
							key={tab.value}
							role="tab"
							aria-selected={activeTab === tab.value}
							onClick={() => onTabChange(tab.value)}
							className={`
                shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 font-bold text-xs sm:text-sm tracking-wide transition-all rounded-full outline-none border
                ${
									activeTab === tab.value
										? "bg-white text-[#0A2F66] border-white shadow-lg"
										: "bg-white/5 text-blue-100 border-white/10 hover:bg-white/10 hover:border-white/30"
								}
              `}
						>
							{tab.label}
							{tab.badge && (
								<span
									className={`
                  px-2 py-0.5 rounded-full text-[10px] font-bold tracking-normal
                  ${activeTab === tab.value ? "bg-blue-100 text-[#0A2F66]" : "bg-white/10 text-white"}
                `}
								>
									{tab.badge}
								</span>
							)}
						</button>
					))}
				</nav>

				<div className="hidden lg:flex items-center gap-6">
					{kioskData?.pic && (
						<div className="flex items-center gap-3 bg-[#082959] border border-[#163666] px-4 py-2 rounded-xl shadow-inner">
							<div className="text-right flex flex-col justify-center">
								<span className="text-[10px] text-blue-300 uppercase tracking-widest font-semibold leading-tight">
									Penanggung Jawab
								</span>
								<span className="text-white text-sm font-bold uppercase tracking-wide leading-tight mt-0.5">
									{kioskData.pic.name}
								</span>
							</div>
							<div className="w-9 h-9 rounded-full overflow-hidden bg-slate-800 border-2 border-blue-400/30 shrink-0 flex items-center justify-center text-sm font-bold shadow-md">
								{kioskData.pic.avatar_url ? (
									<img
										src={
											kioskData.pic.avatar_url.startsWith("http")
												? kioskData.pic.avatar_url
												: `http://localhost:8000${kioskData.pic.avatar_url}`
										}
										alt="PIC Avatar"
										className="w-full h-full object-cover"
									/>
								) : (
									<span className="text-blue-100">
										{kioskData.pic.name.charAt(0)}
									</span>
								)}
							</div>
						</div>
					)}

					<div className="bg-[#041530] border border-[#163666] px-5 py-2.5 rounded-xl flex items-center gap-4 shadow-inner">
						<div className="text-right">
							<p className="text-2xl font-bold font-mono tracking-widest leading-none text-white">
								{time}{" "}
								<span className="text-xs text-white/50 tracking-normal">
									WIB
								</span>
							</p>
							<p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mt-1 flex items-center gap-1.5">
								<Clock className="w-3 h-3 opacity-70" /> {date}
							</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
