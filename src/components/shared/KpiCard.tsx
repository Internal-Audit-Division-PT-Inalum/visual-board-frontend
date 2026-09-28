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

	const tagColors = {
		red: "bg-red-500/20 text-red-100 border-red-500/30",
		emerald: "bg-emerald-500/20 text-emerald-100 border-emerald-500/30",
		blue: "bg-white/20 text-white border-white/30",
		amber: "bg-amber-500/20 text-amber-100 border-amber-500/30",
	};

	const theme = {
		bg: "bg-white/10 backdrop-blur-md",
		border: "border-white/20",
		icon: "text-white",
	};
	const tagClass = tagColors[tagColor] || tagColors.blue;

	return (
		<div className="relative overflow-hidden bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(37,99,235,0.2)] border border-[#3b82f6]/40 flex flex-col justify-between hover:shadow-[0_12px_40px_rgb(37,99,235,0.4)] hover:-translate-y-1 transition-all duration-500 h-full group z-10">
			{/* Decorative Glowing Orbs */}
			<div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-400 rounded-full blur-3xl opacity-40 group-hover:opacity-60 group-hover:scale-125 transition-all duration-700 -z-10" />
			<div className="absolute -top-16 -left-16 w-40 h-40 bg-cyan-300 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-all duration-700 -z-10" />

			<div className="flex justify-between items-start mb-2">
				<h3 className="text-white/80 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
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
							"text-4xl sm:text-5xl font-black text-white leading-none tracking-tighter drop-shadow-sm",
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
						<div className="font-semibold text-white/60 tracking-wide">
							{bottomLeftText}
						</div>
						<div
							className={cn(
								"font-bold tracking-wide drop-shadow-sm",
								bottomRightColor,
							)}
						>
							{bottomRightText}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
