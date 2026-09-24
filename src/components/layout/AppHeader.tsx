import { Clock, Maximize2, ScanLine, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useBulletins } from "@/features/bulletin/api/useBulletins";
import { useKioskData } from "@/features/general/api/useKioskData";
import { useAttendanceSummary } from "@/features/organization/api/useAttendanceSummary";
import { useClock } from "@/hooks/useClock";
import { getBackendUrl } from "@/lib/utils";

export type TabSlug =
	| "general"
	| "schedule_5r"
	| "organization"
	| "department_hub"
	| "self_assessment";

interface AppHeaderProps {
	activeTab: TabSlug;
	onTabChange: (tab: TabSlug) => void;
}

export function AppHeader({ activeTab, onTabChange }: AppHeaderProps) {
	const { time, date } = useClock();

	const { data: kioskData } = useKioskData();
	const { data: attendanceData } = useAttendanceSummary();
	const { data: bulletinsData } = useBulletins(12);

	const [isQrModalOpen, setIsQrModalOpen] = useState(false);

	const getQrUrl = () => {
		return `${window.location.protocol}//${window.location.host}/presensi`;
	};

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
		{
			label: "SELF ASSESSMENT",
			value: "self_assessment",
		},
	];

	return (
		<header className="bg-gradient-to-r from-[#0C3B82] via-[#0D4494] to-[#0A2F66] text-white flex flex-col pt-5 pb-5 px-8 shadow-lg z-10 shrink-0 font-sans border-b-4 border-[#0F3D8C]">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b-4 border-white/20 mb-2">
				<div className="flex gap-4 items-center">
					<div className="h-16 sm:h-20 lg:h-24 shrink-0 flex items-center justify-center">
						<img
							src="/inalum-logo-2.png"
							alt="PT Inalum"
							className="h-full w-auto object-contain drop-shadow-sm scale-110 brightness-0 invert"
						/>
					</div>

					<div className="h-12 sm:h-16 w-px bg-white/20 ml-2 mr-1"></div>

					<div className="flex flex-col gap-1.5 ml-2">
						<div className="flex items-baseline gap-4">
							<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-sm">
								IIA 5R ACTIVITY BOARD
							</h1>
							<span className="text-white/80 font-medium text-base sm:text-lg hidden md:inline-block">
								| PT Indonesia Asahan Aluminium (Persero)
							</span>
						</div>
					</div>
				</div>

				<button
					onClick={() => setIsQrModalOpen(true)}
					className="hidden lg:flex bg-white p-2.5 rounded-xl border border-slate-200 shadow-md items-center gap-4 hover:border-blue-400 hover:shadow-lg transition-all group text-left cursor-pointer"
				>
					<div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-50 transition-colors relative">
						<QRCodeSVG value={getQrUrl()} size={52} className="rounded" />
						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
							<Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
						</div>
					</div>
					<div className="pr-2">
						<p className="text-xs font-black text-[#0A2F66] uppercase tracking-wider mb-1 flex items-center gap-1.5">
							<ScanLine className="w-4 h-4 text-blue-500" /> Presensi
						</p>
						<p className="text-[10px] text-slate-500 font-medium leading-tight">
							Scan QR ini
							<br />
							untuk Hadir
						</p>
					</div>
				</button>
			</div>

			<div className="flex justify-between items-center">
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

				<div className="hidden lg:flex items-stretch gap-4 mt-2">
					{kioskData?.pic && (
						<div className="flex items-center gap-3 bg-[#082959] border border-[#163666] px-4 py-2.5 rounded-xl shadow-inner h-[68px]">
							<div className="text-right flex flex-col justify-center">
								<span className="text-[10px] text-blue-300 uppercase tracking-widest font-semibold leading-tight">
									Penanggung Jawab
								</span>
								<span className="text-white text-sm font-bold uppercase tracking-wide leading-tight mt-0.5">
									{kioskData.pic.name}
								</span>
							</div>
							<div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border-2 border-blue-400/30 shrink-0 flex items-center justify-center text-sm font-bold shadow-md">
								{kioskData.pic.avatar_url ? (
									<img
										src={getBackendUrl(kioskData.pic.avatar_url)}
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

					<div className="bg-[#041530] border border-[#163666] px-5 py-2.5 rounded-xl flex flex-col justify-center gap-1 shadow-inner h-[68px]">
						<div className="text-right flex flex-col justify-center">
							<p className="text-2xl font-bold font-mono tracking-widest leading-none text-white">
								{time}{" "}
								<span className="text-xs text-white/50 tracking-normal">
									WIB
								</span>
							</p>
							<p className="text-[10px] text-blue-200 uppercase tracking-widest font-semibold mt-1 flex items-center justify-end gap-1.5 leading-none">
								<Clock className="w-3 h-3 opacity-70" /> {date}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* QR Code Modal (Fullscreen Popup) */}
			{isQrModalOpen &&
				createPortal(
					<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
						<div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-12 max-w-lg w-full flex flex-col items-center relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
							<button
								onClick={() => setIsQrModalOpen(false)}
								className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors"
							>
								<X className="w-5 h-5 sm:w-6 sm:h-6" />
							</button>

							<div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 sm:mb-6 shrink-0 shadow-inner border border-blue-100">
								<ScanLine className="w-8 h-8 sm:w-10 sm:h-10" />
							</div>

							<h3 className="text-2xl sm:text-3xl font-black text-[#0A2F66] mb-2 text-center tracking-tight">
								Presensi Digital
							</h3>
							<p className="text-sm sm:text-base text-slate-500 text-center font-medium mb-6 sm:mb-8">
								Buka kamera HP Anda dan scan QR Code di bawah ini untuk mencatat
								kehadiran hari ini.
							</p>

							<div className="w-full max-w-[200px] sm:max-w-[300px] aspect-square p-3 sm:p-4 bg-white border-4 border-slate-100 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.05)] flex items-center justify-center">
								<QRCodeSVG
									value={getQrUrl()}
									style={{ width: "100%", height: "100%" }}
									className="rounded-xl"
								/>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</header>
	);
}
