import { useState } from "react";
import DepartmentHub from "@/pages/DepartmentHub";
import General from "@/pages/General";
import Organization from "@/pages/Organization";
import Schedule5R from "@/pages/Schedule5R";
import { AppHeader, type TabSlug } from "./AppHeader";
import { BottomTicker } from "./BottomTicker";

export function AppShell() {
	const [activeTab, setActiveTab] = useState<TabSlug>("general");

	return (
		<div className="h-screen w-screen flex flex-col bg-[#F8F9FA] overflow-hidden">
			<AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

			<main className="flex-1 overflow-x-hidden overflow-y-auto pb-8 lg:pb-12">
				{activeTab === "general" && <General />}
				{activeTab === "schedule_5r" && <Schedule5R />}
				{activeTab === "organization" && <Organization />}
				{activeTab === "department_hub" && <DepartmentHub />}
			</main>

			<BottomTicker />
		</div>
	);
}
