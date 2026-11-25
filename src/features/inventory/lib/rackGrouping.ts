import type { KioskInventoryItem, KioskLocationWithItems } from "@/types/api";

export type InventoryViewMode = "compact" | "cards";
export type InventoryStockFilter = "all" | "ok" | "attention" | "borrowed";

export interface RackGroup<T extends { rack_code?: string | null }> {
	rackCode: string | null;
	label: string;
	items: T[];
}

export interface KioskRackGroup extends RackGroup<KioskInventoryItem> {
	safeCount: number;
	attentionCount: number;
}

const RACK_PATTERN = /^([A-Za-z]+)(\d+)(?:-([A-Za-z0-9]+))?$/;

/**
 * Physical shelf suffix priority matching Divisi IIA cabinet posters:
 * `-I` (Induk / left compartment) always precedes `-A` (Anak / right compartment).
 */
function suffixRank(suffix: string): number {
	const normalized = suffix.toUpperCase();
	if (normalized === "") return 0;
	if (normalized === "I") return 1;
	if (normalized === "A") return 2;
	return 3;
}

/**
 * Natural physical comparator for IIA rack codes:
 * A1 < A2-I < A2-A < A3-I < A3-A < A4 < B1-I < B1-A < B2-I < B2-A < B3-I < B3-A < B4.
 */
export function compareRackCodes(a?: string | null, b?: string | null): number {
	const cleanA = a?.trim() ?? "";
	const cleanB = b?.trim() ?? "";

	if (cleanA === cleanB) return 0;
	if (cleanA === "") return 1;
	if (cleanB === "") return -1;

	const matchA = RACK_PATTERN.exec(cleanA);
	const matchB = RACK_PATTERN.exec(cleanB);

	if (matchA && matchB) {
		const prefixCmp = matchA[1]
			.toUpperCase()
			.localeCompare(matchB[1].toUpperCase());
		if (prefixCmp !== 0) return prefixCmp;

		const numA = Number.parseInt(matchA[2], 10);
		const numB = Number.parseInt(matchB[2], 10);
		if (numA !== numB) return numA - numB;

		const sufA = matchA[3] ?? "";
		const sufB = matchB[3] ?? "";
		const rankDiff = suffixRank(sufA) - suffixRank(sufB);
		if (rankDiff !== 0) return rankDiff;

		return sufA.localeCompare(sufB, "id", { numeric: true });
	}

	return cleanA.localeCompare(cleanB, "id", { numeric: true });
}

export function groupKioskItemsByRack(
	items: readonly KioskInventoryItem[],
): KioskRackGroup[] {
	const bucketMap = new Map<string, KioskInventoryItem[]>();

	for (const item of items) {
		const key = item.rack_code?.trim() || "";
		const existing = bucketMap.get(key);
		if (existing) {
			existing.push(item);
		} else {
			bucketMap.set(key, [item]);
		}
	}

	const sortedKeys = Array.from(bucketMap.keys()).sort((a, b) =>
		compareRackCodes(a || null, b || null),
	);

	return sortedKeys.map((key) => {
		const groupItems = [...(bucketMap.get(key) ?? [])].sort((a, b) =>
			a.name.localeCompare(b.name, "id"),
		);

		const safeCount = groupItems.filter((i) => i.stock_status === "ok").length;
		const attentionCount = groupItems.filter(
			(i) => i.stock_status === "low" || i.stock_status === "empty",
		).length;

		return {
			rackCode: key || null,
			label: key ? `Rak ${key}` : "Umum",
			items: groupItems,
			safeCount,
			attentionCount,
		};
	});
}

export function countDistinctRacks(
	locations: readonly KioskLocationWithItems[],
): number {
	const rackKeys = new Set<string>();

	for (const loc of locations) {
		for (const item of loc.items) {
			const code = item.rack_code?.trim();
			if (code) {
				rackKeys.add(`${loc.id}:${code}`);
			}
		}
	}

	return rackKeys.size;
}

export function filterKioskItemsByStatus(
	items: readonly KioskInventoryItem[],
	stockFilter: InventoryStockFilter,
): KioskInventoryItem[] {
	if (stockFilter === "all") {
		return [...items];
	}

	if (stockFilter === "ok") {
		return items.filter((item) => item.stock_status === "ok");
	}

	if (stockFilter === "attention") {
		return items.filter(
			(item) => item.stock_status === "low" || item.stock_status === "empty",
		);
	}

	return items.filter(
		(item) => item.type === "asset" && (item.borrowed_quantity ?? 0) > 0,
	);
}

/**
 * Adaptive grid sizing for cabinet shelf compartments in Compact 5R Matrix mode:
 * - Dense shelves (>= 11 items, e.g. B2-I / B2-A): full 3-column shelf band with 3 internal columns.
 * - Medium shelves (7..10 items, e.g. B3-A): 2-column shelf band with 2 internal columns.
 * - Compact shelves (1..6 items, e.g. A1..A4, B1-I, B1-A, B3-I, B4): 1-column shelf compartment.
 */
export function getRackCompartmentLayout(
	itemCount: number,
	isSingleSelectedRack = false,
): { containerSpanClass: string; innerGridClass: string } {
	if (isSingleSelectedRack || itemCount >= 11) {
		return {
			containerSpanClass: "md:col-span-2 xl:col-span-3",
			innerGridClass: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
		};
	}

	if (itemCount >= 7) {
		return {
			containerSpanClass: "md:col-span-2 xl:col-span-2",
			innerGridClass: "grid-cols-1 sm:grid-cols-2",
		};
	}

	return {
		containerSpanClass: "col-span-1",
		innerGridClass: "grid-cols-1",
	};
}
