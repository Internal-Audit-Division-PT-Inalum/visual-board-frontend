import { useState } from "react";
import { getHierarchyAvatarClass } from "@/features/organization/lib/hierarchy";
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

	return (
		<div
			className={`rounded-full bg-gradient-to-br flex items-center justify-center font-black uppercase shadow-sm shrink-0 border-2 border-white ring-2 transition-all overflow-hidden ${getHierarchyAvatarClass(
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
