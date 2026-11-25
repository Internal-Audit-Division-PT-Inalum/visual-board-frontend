import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InventoryBoard } from "@/features/inventory/components/InventoryBoard";
import {
	compareRackCodes,
	countDistinctRacks,
	filterKioskItemsByStatus,
	getRackCompartmentLayout,
	groupKioskItemsByRack,
} from "@/features/inventory/lib/rackGrouping";
import type { KioskInventoryItem, KioskLocationWithItems } from "@/types/api";

const makeItem = (
	overrides: Partial<KioskInventoryItem>,
): KioskInventoryItem => ({
	id: overrides.id ?? "item-1",
	name: overrides.name ?? "Barang Uji",
	sku: overrides.sku ?? "SKU-01",
	rack_code: overrides.rack_code ?? null,
	type: overrides.type ?? "consumable",
	unit: overrides.unit ?? "Pcs",
	image_url: null,
	current_stock: overrides.current_stock ?? 5,
	minimum_stock: overrides.minimum_stock ?? 1,
	stock_status: overrides.stock_status ?? "ok",
	borrowed_quantity:
		overrides.borrowed_quantity ?? (overrides.type === "asset" ? 0 : null),
});

describe("Cabinet -> Multi-Rack Inventory Matrix", () => {
	it("orders IIA rack codes physically with -I before -A", () => {
		const unsorted = [
			"B4",
			"A3-A",
			"B1-A",
			"A2-A",
			"B1-I",
			"A1",
			"A3-I",
			"A2-I",
			"A4",
			"B2-A",
			"B2-I",
			"B3-A",
			"B3-I",
		];

		expect([...unsorted].sort(compareRackCodes)).toEqual([
			"A1",
			"A2-I",
			"A2-A",
			"A3-I",
			"A3-A",
			"A4",
			"B1-I",
			"B1-A",
			"B2-I",
			"B2-A",
			"B3-I",
			"B3-A",
			"B4",
		]);
	});

	it("groups items inside a cabinet by rack_code and assigns adaptive compartment spans", () => {
		const locations: KioskLocationWithItems[] = [
			{
				id: "loc-a",
				name: "Lemari A",
				code: "LEMARI-A",
				items: [
					makeItem({ id: "a1", name: "Snack (A1)", rack_code: "A1" }),
					makeItem({
						id: "a3a",
						name: "Piring",
						rack_code: "A3-A",
						type: "asset",
					}),
					makeItem({
						id: "a3i",
						name: "Sendok Garpu",
						rack_code: "A3-I",
						type: "asset",
					}),
				],
			},
			{
				id: "loc-b",
				name: "Lemari B",
				code: "LEMARI-B",
				items: [
					makeItem({
						id: "b2i",
						name: "Tipex",
						rack_code: "B2-I",
						stock_status: "low",
					}),
					makeItem({
						id: "b3a",
						name: "Tisu",
						rack_code: "B3-A",
						stock_status: "low",
					}),
				],
			},
		];

		const groupedA = groupKioskItemsByRack(locations[0].items);
		expect(groupedA.map((g) => g.rackCode)).toEqual(["A1", "A3-I", "A3-A"]);
		expect(countDistinctRacks(locations)).toBe(5);

		expect(getRackCompartmentLayout(1).containerSpanClass).toBe("col-span-1");
		expect(getRackCompartmentLayout(8).containerSpanClass).toContain(
			"xl:col-span-2",
		);
		expect(getRackCompartmentLayout(16).containerSpanClass).toContain(
			"xl:col-span-3",
		);
	});

	it("filters kiosk items accurately by ok, attention, and borrowed statuses", () => {
		const items = [
			makeItem({ id: "1", stock_status: "ok" }),
			makeItem({ id: "2", stock_status: "low" }),
			makeItem({ id: "3", stock_status: "empty", current_stock: 0 }),
			makeItem({
				id: "4",
				type: "asset",
				stock_status: "ok",
				borrowed_quantity: 2,
			}),
		];

		expect(filterKioskItemsByStatus(items, "ok")).toHaveLength(2);
		expect(filterKioskItemsByStatus(items, "attention")).toHaveLength(2);
		expect(
			filterKioskItemsByStatus(items, "borrowed").map((i) => i.id),
		).toEqual(["4"]);
	});

	it("renders Compact Matrix by default, switches to Cards mode, and supports interactive KPI filtering", () => {
		const locations: KioskLocationWithItems[] = [
			{
				id: "loc-a",
				name: "Lemari A",
				code: "LEMARI-A",
				items: [
					makeItem({
						id: "a1",
						name: "Snack (A1)",
						rack_code: "A1",
						stock_status: "ok",
					}),
					makeItem({
						id: "a4",
						name: "APD Helm & Sepatu (A4)",
						rack_code: "A4",
						type: "asset",
						stock_status: "ok",
						borrowed_quantity: 1,
					}),
				],
			},
			{
				id: "loc-b",
				name: "Lemari B",
				code: "LEMARI-B",
				items: [
					makeItem({
						id: "b2i",
						name: "Tipex",
						rack_code: "B2-I",
						stock_status: "low",
					}),
				],
			},
		];

		render(<InventoryBoard locations={locations} />);

		// Default view is Compact Matrix (compact rows rendered, no giant placeholder cards)
		expect(screen.getAllByTestId("compact-item-row")).toHaveLength(3);
		expect(screen.getByText("Lemari (3 Rak)")).toBeTruthy();

		// Click "Perlu Restock" KPI card -> filters down to low/empty items only
		fireEvent.click(screen.getByRole("button", { name: /Perlu Restock/i }));
		expect(screen.getByText("Tipex")).toBeTruthy();
		expect(screen.queryByText("Snack (A1)")).toBeNull();

		// Click "Perlu Restock" again -> resets filter to show all items
		fireEvent.click(screen.getByRole("button", { name: /Perlu Restock/i }));
		expect(screen.getByText("Snack (A1)")).toBeTruthy();

		// Click "Aset Dipinjam" KPI card -> shows only borrowed asset
		fireEvent.click(screen.getByRole("button", { name: /Aset Dipinjam/i }));
		expect(screen.getByText("APD Helm & Sepatu (A4)")).toBeTruthy();
		expect(screen.queryByText("Tipex")).toBeNull();

		// Reset filter & switch view mode to "Kartu"
		fireEvent.click(screen.getByRole("button", { name: /Total Katalog/i }));
		fireEvent.click(screen.getByRole("button", { name: "Kartu" }));
		expect(screen.queryAllByTestId("compact-item-row")).toHaveLength(0);
		expect(screen.getByText("Snack (A1)")).toBeTruthy();
		expect(screen.getByText("Tipex")).toBeTruthy();
	});
});
