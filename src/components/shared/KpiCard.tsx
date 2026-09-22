import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
	title: string;
	value: string | number;
	valueClassName?: string;
	icon: LucideIcon;
	colorTheme?: "primary" | "success" | "warning" | "danger";
	isLoading?: boolean;

	tagText?: string;
	tagColor?: "red" | "emerald" | "blue" | "amber";

	bottomLeftText?: React.ReactNode;
	bottomRightText?: React.ReactNode;
	bottomRightColor?: string;

	showProgressBar?: boolean;
	progressValue?: number;
}

export function KpiCard({
	title,
	value,
	valueClassName,
	icon: Icon,
	colorTheme = "primary",
	isLoading = false,
	tagText,
	tagColor = "blue",
	bottomLeftText,
	bottomRightText,
	bottomRightColor = "text-slate-500",
	showProgressBar = false,
	progressValue = 0,
}: KpiCardProps) {
	if (isLoading) {
		return (
			<div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/60 flex flex-col gap-4 animate-pulse h-40">
				<div className="flex justify-between items-center">
					<div className="h-4 bg-slate-200 rounded w-1/2"></div>
					<div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
				</div>
				<div className="h-10 bg-slate-200 rounded w-1/3 mt-auto"></div>
			</div>
		);
	}

	const themes = {
		primary: {
			icon: "text-[#0A2F66]",
			bg: "bg-[#0A2F66]/10",
			border: "border-[#0A2F66]/20",
		},
		success: {
			icon: "text-emerald-600",
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/20",
		},
		warning: {
			icon: "text-amber-500",
			bg: "bg-amber-500/10",
			border: "border-amber-500/20",
		},
		danger: {
			icon: "text-red-500",
			bg: "bg-red-500/10",
			border: "border-red-500/20",
		},
	};

	const tagColors = {
		red: "bg-red-50 text-red-600 border-red-200",
		emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
		blue: "bg-blue-50 text-blue-600 border-blue-200",
		amber: "bg-amber-50 text-amber-600 border-amber-200",
	};

	const theme = themes[colorTheme] || themes.primary;
	const tagClass = tagColors[tagColor] || tagColors.blue;

	return (
		<div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all h-full">
			<div className="flex justify-between items-start mb-2">
				<h3 className="text-slate-500 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
					{title}
				</h3>
				<div
					className={cn(
						"p-2.5 sm:p-3 rounded-xl border flex items-center justify-center",
						theme.bg,
						theme.border,
					)}
				>
					<Icon
						className={cn("w-5 h-5 sm:w-6 sm:h-6", theme.icon)}
						strokeWidth={2.5}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-3 sm:gap-4 mt-[-10px]">
				<div className="flex items-end gap-3">
					<div
						className={cn(
							"text-4xl sm:text-5xl font-black text-slate-800 leading-none tracking-tighter",
							valueClassName,
						)}
					>
						{value}
					</div>
					{tagText && (
						<div
							className={cn(
								"px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold border whitespace-nowrap mb-1",
								tagClass,
							)}
						>
							{tagText}
						</div>
					)}
				</div>

				{showProgressBar && (
					<div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
						<div
							className={cn(
								"h-full rounded-full transition-all duration-1000",
								colorTheme === "success" ? "bg-emerald-500" : "bg-[#0A2F66]",
							)}
							style={{ width: `${Math.min(progressValue, 100)}%` }}
						/>
					</div>
				)}

				{(bottomLeftText || bottomRightText) && (
					<div className="flex justify-between items-center text-[10px] sm:text-xs pt-1">
						<div className="font-semibold text-slate-400 tracking-wide">
							{bottomLeftText}
						</div>
						<div className={cn("font-bold tracking-wide", bottomRightColor)}>
							{bottomRightText}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
