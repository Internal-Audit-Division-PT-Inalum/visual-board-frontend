/**
 * Canonical PT INALUM 7-Level Position Hierarchy Helpers
 *
 * Mirrors `App\Domains\HR\Models\Position` constants in the Laravel backend:
 * - Level 1: Dewan Direksi, Dewan Komisaris (executive)
 * - Level 2: Kepala Grup (executive)
 * - Level 3: Kepala Divisi (executive)
 * - Level 4: Kepala Departemen (department_head)
 * - Level 5: Kepala Seksi (section_head)
 * - Level 6: Staff (staff)
 * - Level 7: Operator, Administrasi (operational)
 */

export type HierarchyTier =
	| "executive"
	| "department_head"
	| "section_head"
	| "staff";

export const HIERARCHY_EXECUTIVE_MAX = 3;
export const HIERARCHY_DEPARTMENT_HEAD = 4;
export const HIERARCHY_SECTION_HEAD = 5;
export const HIERARCHY_LEADERSHIP_MAX = 5;

export function resolveHierarchyTier(level?: number | null): HierarchyTier {
	if (typeof level !== "number" || !Number.isFinite(level) || level <= 0) {
		return "staff";
	}

	if (level <= HIERARCHY_EXECUTIVE_MAX) {
		return "executive";
	}

	if (level === HIERARCHY_DEPARTMENT_HEAD) {
		return "department_head";
	}

	if (level === HIERARCHY_SECTION_HEAD) {
		return "section_head";
	}

	return "staff";
}

/**
 * Leadership roles (Levels 1..5: Direksi through Kepala Seksi) span full width
 * above functional/operational staff cards in the department employee grid.
 */
export function isLeadershipLevel(level?: number | null): boolean {
	return (
		typeof level === "number" &&
		Number.isFinite(level) &&
		level > 0 &&
		level <= HIERARCHY_LEADERSHIP_MAX
	);
}

export function getHierarchyBorderClass(level?: number | null): string {
	switch (resolveHierarchyTier(level)) {
		case "executive":
			return "bg-amber-400 group-hover:bg-amber-500";
		case "department_head":
			return "bg-emerald-500 group-hover:bg-emerald-600";
		case "section_head":
			return "bg-sky-500 group-hover:bg-sky-600";
		default:
			return "bg-slate-300 group-hover:bg-blue-500";
	}
}

export function getHierarchyAvatarClass(level?: number | null): string {
	switch (resolveHierarchyTier(level)) {
		case "executive":
			return "from-amber-500 to-amber-700 ring-amber-100 group-hover:ring-amber-200 text-amber-50";
		case "department_head":
			return "from-emerald-500 to-emerald-700 ring-emerald-100 group-hover:ring-emerald-200 text-emerald-50";
		case "section_head":
			return "from-sky-500 to-blue-700 ring-sky-100 group-hover:ring-sky-200 text-sky-50";
		default:
			return "from-[#0A2F66] to-[#1E40AF] ring-blue-100 group-hover:ring-blue-200 text-blue-50";
	}
}

export interface HierarchyTierGroup<T> {
	tier: HierarchyTier;
	employees: T[];
	fullWidthCards: boolean;
}

const TIER_ORDER: readonly HierarchyTier[] = [
	"executive",
	"department_head",
	"section_head",
	"staff",
];

/**
 * Group employees inside a department into ordered visual hierarchy bands so peer
 * leadership levels (e.g., two Level 5 Lead Auditors) align side-by-side in their own
 * dedicated row without mixing horizontally with Level 6-7 staff cards.
 */
export function groupEmployeesByHierarchyTier<
	T extends {
		hierarchy_level?: number | null;
		namecode?: string | null;
		name: string;
	},
>(employees: readonly T[]): HierarchyTierGroup<T>[] {
	const sorted = sortEmployeesByHierarchy(employees);
	const buckets: Record<HierarchyTier, T[]> = {
		executive: [],
		department_head: [],
		section_head: [],
		staff: [],
	};

	for (const emp of sorted) {
		buckets[resolveHierarchyTier(emp.hierarchy_level)].push(emp);
	}

	return TIER_ORDER.filter((tier) => buckets[tier].length > 0).map((tier) => ({
		tier,
		employees: buckets[tier],
		fullWidthCards:
			tier === "executive" ||
			tier === "department_head" ||
			(tier === "section_head" && buckets[tier].length === 1),
	}));
}

export function sortEmployeesByHierarchy<
	T extends {
		hierarchy_level?: number | null;
		namecode?: string | null;
		name: string;
	},
>(employees: readonly T[]): T[] {
	return [...employees].sort((a, b) => {
		const levelA = a.hierarchy_level ?? 99;
		const levelB = b.hierarchy_level ?? 99;

		if (levelA !== levelB) {
			return levelA - levelB;
		}

		const codeA = a.namecode?.trim() ?? "";
		const codeB = b.namecode?.trim() ?? "";
		if (codeA !== "" && codeB !== "" && codeA !== codeB) {
			return codeA.localeCompare(codeB, "id", { numeric: true });
		}

		return a.name.localeCompare(b.name, "id");
	});
}
