import { useState } from "react";
import Assessment from "@/pages/Assessment";
import DepartmentHub from "@/pages/DepartmentHub";
import General from "@/pages/General";
import Organization from "@/pages/Organization";
import Schedule5R from "@/pages/Schedule5R";
import { AppHeader, type TabSlug } from "./AppHeader";
import { Footer } from "./Footer";

export function AppShell() {
	const [activeTab, setActiveTab] = useState<TabSlug>("general");

	return (
		<div className="h-screen w-screen flex flex-col bg-[#F8F9FA] overflow-hidden">
			<AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

			<div className="flex-1 overflow-x-hidden overflow-y-auto relative">
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
		</div>
	);
}
