import { useSearchParams } from "react-router-dom";
import { useKioskAutoPlay } from "@/hooks/useKioskAutoPlay";
import Assessment from "@/pages/Assessment";
import DepartmentHub from "@/pages/DepartmentHub";
import General from "@/pages/General";
import Organization from "@/pages/Organization";
import Schedule5R from "@/pages/Schedule5R";
import { AppHeader, type TabSlug } from "./AppHeader";
import { Footer } from "./Footer";

export function AppShell() {
	const [searchParams, setSearchParams] = useSearchParams();
	const activeTab = (searchParams.get("tab") as TabSlug) || "general";
	const { isKioskMode, isIdle } = useKioskAutoPlay();

	const handleTabChange = (tab: TabSlug) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set("tab", tab);
		newParams.delete("sub"); // Reset subtab when changing main tab
		setSearchParams(newParams);
	};

	return (
		<div className="h-screen w-screen flex flex-col bg-[#F8F9FA] overflow-hidden">
			<AppHeader activeTab={activeTab} onTabChange={handleTabChange} />

			<div
				id="kiosk-scroll-container"
				className="flex-1 overflow-x-hidden overflow-y-auto relative"
			>
				<main className="flex flex-col min-h-full">
					<div className="flex-1 pb-8 lg:pb-12 flex flex-col">
						{activeTab === "general" && <General />}
						{activeTab === "schedule_5r" && <Schedule5R />}
						{activeTab === "organization" && <Organization />}
						{activeTab === "department_hub" && <DepartmentHub />}
						{activeTab === "self_assessment" && <Assessment />}
					</div>
					<Footer />
				</main>
			</div>

			{/* Kiosk Mode Indicator */}
			{isKioskMode && (
				<div
					className={`fixed bottom-16 right-6 px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all duration-500 backdrop-blur-md z-50 flex items-center gap-2 ${isIdle ? "bg-blue-500/80 text-white border border-blue-400" : "bg-amber-500/80 text-white border border-amber-400"}`}
				>
					{isIdle ? (
						<>
							<span className="relative flex h-2 w-2 mr-1">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
							</span>
							Auto-Play: ON
						</>
					) : (
						<>
							<span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
							Auto-Play: PAUSED (IDLE)
						</>
					)}
				</div>
			)}
		</div>
	);
}
