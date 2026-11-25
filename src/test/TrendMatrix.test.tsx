import { describe, expect, it } from "vitest";
import { resolveMonthData } from "@/features/general/components/TrendMatrix";
import type { TrendMonthData } from "@/types/api";

describe("TrendMatrix month mapping (anti off-by-one)", () => {
	it("maps canonical 1..12 JSON object keys accurately for January, October, November, and December", () => {
		const monthsMap: Record<string, TrendMonthData> = {
			"1": { temuan: 2, tindak_lanjut: 2, belum_selesai: 0 },
			"10": { temuan: null, tindak_lanjut: null, belum_selesai: null },
			"11": { temuan: 1, tindak_lanjut: 0, belum_selesai: 1 },
			"12": { temuan: 3, tindak_lanjut: 1, belum_selesai: 2 },
		};

		expect(resolveMonthData(monthsMap, 1)).toEqual({
			temuan: 2,
			tindak_lanjut: 2,
			belum_selesai: 0,
		});
		expect(resolveMonthData(monthsMap, 10)).toEqual({
			temuan: null,
			tindak_lanjut: null,
			belum_selesai: null,
		});
		expect(resolveMonthData(monthsMap, 11)).toEqual({
			temuan: 1,
			tindak_lanjut: 0,
			belum_selesai: 1,
		});
		expect(resolveMonthData(monthsMap, 12)).toEqual({
			temuan: 3,
			tindak_lanjut: 1,
			belum_selesai: 2,
		});
	});

	it("defensively maps 0-indexed arrays without shifting months left by one", () => {
		const monthsArray: TrendMonthData[] = Array.from({ length: 12 }, () => ({
			temuan: null,
			tindak_lanjut: null,
			belum_selesai: null,
		}));
		monthsArray[0] = { temuan: 4, tindak_lanjut: 4, belum_selesai: 0 }; // Jan
		monthsArray[10] = { temuan: 1, tindak_lanjut: 0, belum_selesai: 1 }; // Nov
		monthsArray[11] = { temuan: 2, tindak_lanjut: 1, belum_selesai: 1 }; // Dec

		expect(resolveMonthData(monthsArray, 1).temuan).toBe(4);
		expect(resolveMonthData(monthsArray, 10).temuan).toBeNull();
		expect(resolveMonthData(monthsArray, 11).temuan).toBe(1);
		expect(resolveMonthData(monthsArray, 12).temuan).toBe(2);
	});
});
