import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DivisionEmployees } from "@/features/organization/components/DivisionEmployees";
import {
	getHierarchyAvatarClass,
	getHierarchyBorderClass,
	groupEmployeesByHierarchyTier,
	isLeadershipLevel,
	resolveHierarchyTier,
	sortEmployeesByHierarchy,
} from "@/features/organization/lib/hierarchy";
import type { DivisionEmployee } from "@/types/api";

describe("7-Level PT INALUM Position Hierarchy", () => {
	it("maps all 7 canonical hierarchy levels to the correct tiers", () => {
		expect(resolveHierarchyTier(1)).toBe("executive");
		expect(resolveHierarchyTier(2)).toBe("executive");
		expect(resolveHierarchyTier(3)).toBe("executive");
		expect(resolveHierarchyTier(4)).toBe("department_head");
		expect(resolveHierarchyTier(5)).toBe("section_head");
		expect(resolveHierarchyTier(6)).toBe("staff");
		expect(resolveHierarchyTier(7)).toBe("staff");
		expect(resolveHierarchyTier(undefined)).toBe("staff");
	});

	it("marks levels 1..5 as leadership and levels 6..7 as non-leadership", () => {
		expect(isLeadershipLevel(1)).toBe(true);
		expect(isLeadershipLevel(3)).toBe(true);
		expect(isLeadershipLevel(4)).toBe(true);
		expect(isLeadershipLevel(5)).toBe(true);
		expect(isLeadershipLevel(6)).toBe(false);
		expect(isLeadershipLevel(7)).toBe(false);
		expect(isLeadershipLevel(null)).toBe(false);
	});

	it("assigns distinct visual border and avatar classes per leadership tier", () => {
		expect(getHierarchyBorderClass(3)).toContain("amber");
		expect(getHierarchyBorderClass(4)).toContain("emerald");
		expect(getHierarchyBorderClass(5)).toContain("sky");
		expect(getHierarchyBorderClass(6)).toContain("slate");

		expect(getHierarchyAvatarClass(3)).toContain("amber");
		expect(getHierarchyAvatarClass(4)).toContain("emerald");
		expect(getHierarchyAvatarClass(5)).toContain("sky");
		expect(getHierarchyAvatarClass(6)).toContain("#0A2F66");
	});

	it("renders Kepala Departemen (L4) full-width at the top of the department above Staff (L6) and Administrasi (L7)", () => {
		const employees: DivisionEmployee[] = [
			{
				user_id: "emp-admin",
				name: "Putri Nurmawati",
				role_label: "Administrasi",
				unit: "SIA (Smelter Internal Audit)",
				hierarchy_level: 7,
				avatar_url: undefined,
			},
			{
				user_id: "emp-staff",
				name: "Arrye Genap Parhusip",
				role_label: "Staff",
				unit: "SIA (Smelter Internal Audit)",
				hierarchy_level: 6,
				avatar_url: undefined,
			},
			{
				user_id: "emp-kadep",
				name: "Hafidz Arif Purwanto",
				role_label: "Kepala Departemen",
				unit: "SIA (Smelter Internal Audit)",
				hierarchy_level: 4,
				avatar_url: undefined,
			},
		];

		render(<DivisionEmployees employees={employees} />);

		const buttons = screen.getAllByRole("button");
		expect(buttons).toHaveLength(3);
		expect(buttons[0].textContent).toContain("Hafidz Arif Purwanto");
		expect(buttons[0].className).toContain("sm:col-span-2");

		expect(buttons[1].textContent).toContain("Arrye Genap Parhusip");
		expect(buttons[1].className).not.toContain("sm:col-span-2");

		expect(buttons[2].textContent).toContain("Putri Nurmawati");
		expect(buttons[2].className).not.toContain("sm:col-span-2");
	});

	it("sorts employees by ascending hierarchy level then Indonesian alphabetical name", () => {
		const sorted = sortEmployeesByHierarchy([
			{ name: "Thaofan", hierarchy_level: 6 },
			{ name: "Putri", hierarchy_level: 7 },
			{ name: "Maria", hierarchy_level: 5 },
			{ name: "Arrye", hierarchy_level: 6 },
			{ name: "Hafidz", hierarchy_level: 4 },
		]);

		expect(sorted.map((item) => item.name)).toEqual([
			"Hafidz",
			"Maria",
			"Arrye",
			"Thaofan",
			"Putri",
		]);
	});

	it("groups peer Level 5 Lead Auditors into their own balanced band between L4 and L6-7", () => {
		const groups = groupEmployeesByHierarchyTier([
			{ name: "Putri", hierarchy_level: 7 },
			{ name: "Arrye", hierarchy_level: 6 },
			{ name: "Tengku Amrizal Azwin", hierarchy_level: 5 },
			{ name: "Maria Fransiska Sitepu", hierarchy_level: 5 },
			{ name: "Hafidz Arif Purwanto", hierarchy_level: 4 },
		]);

		expect(groups.map((g) => g.tier)).toEqual([
			"department_head",
			"section_head",
			"staff",
		]);
		expect(groups[0].fullWidthCards).toBe(true);
		expect(groups[1].fullWidthCards).toBe(false);
		expect(groups[1].employees.map((e) => e.name)).toEqual([
			"Maria Fransiska Sitepu",
			"Tengku Amrizal Azwin",
		]);
		expect(groups[2].fullWidthCards).toBe(false);
	});

	it("orders peer Level 4 department heads by ascending PT INALUM namecode seniority (Hafidz #1 before Gede Vidi #2)", () => {
		const sorted = sortEmployeesByHierarchy([
			{ name: "Gede Vidi Wuragi", namecode: "38826028", hierarchy_level: 4 },
			{
				name: "Hafidz Arif Purwanto",
				namecode: "38626004",
				hierarchy_level: 4,
			},
			{
				name: "Maria Fransiska Sitepu",
				namecode: "39214143",
				hierarchy_level: 5,
			},
		]);

		expect(sorted.map((item) => item.name)).toEqual([
			"Hafidz Arif Purwanto",
			"Gede Vidi Wuragi",
			"Maria Fransiska Sitepu",
		]);
	});
});
