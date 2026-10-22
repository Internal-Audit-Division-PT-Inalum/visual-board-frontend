import { useState } from "react";
import { getBackendUrl } from "@/lib/utils";

interface EmployeeAvatarProps {
	src?: string | null;
	name: string;
	className?: string;
	level?: number;
}

export function EmployeeAvatar({
	src,
	name,
	className = "w-14 h-14",
	level,
}: EmployeeAvatarProps) {
	const [hasError, setHasError] = useState(false);
	const [prevSrc, setPrevSrc] = useState(src);

	if (prevSrc !== src) {
		setPrevSrc(src);
		setHasError(false);
	}

	const finalSrc = src ? getBackendUrl(src) : null;

	const getInitials = (fullName: string) => {
		if (!fullName) return "?";
		const parts = fullName.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	};

	const getAvatarStyle = (lvl?: number) => {
		if (lvl === 1) {
			return "from-amber-500 to-amber-700 ring-amber-100 group-hover:ring-amber-200 text-amber-50";
		}
		if (lvl === 2) {
			return "from-emerald-500 to-emerald-700 ring-emerald-100 group-hover:ring-emerald-200 text-emerald-50";
		}
		return "from-[#0A2F66] to-[#1E40AF] ring-blue-100 group-hover:ring-blue-200 text-blue-50";
	};

	return (
		<div
			className={`rounded-full bg-gradient-to-br flex items-center justify-center font-black uppercase shadow-sm shrink-0 border-2 border-white ring-2 transition-all overflow-hidden ${getAvatarStyle(
				level,
			)} ${className}`}
		>
			{finalSrc && !hasError ? (
				<img
					src={finalSrc}
					alt={name}
					onError={() => setHasError(true)}
					className="w-full h-full object-cover"
					loading="lazy"
				/>
			) : (
				<span className="text-sm font-bold tracking-wider select-none">
					{getInitials(name)}
				</span>
			)}
		</div>
	);
}
