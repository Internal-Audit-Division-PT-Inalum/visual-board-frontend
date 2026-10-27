import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Visual Board Layout Components", () => {
	describe("Footer Component", () => {
		it("renders Inalum corporate branding and Division IIA title", () => {
			render(<Footer />);

			expect(screen.getByText("DIVISI IIA")).toBeDefined();
			expect(
				screen.getByText(
					/Mewujudkan tata kelola operasional yang bersih, transparan/i,
				),
			).toBeDefined();
		});

		it("renders operational office address and contact channels", () => {
			render(<Footer />);

			expect(screen.getByText("Kantor Divisi IIA")).toBeDefined();
			expect(screen.getByText(/Gedung STO Tanjung Gading/i)).toBeDefined();
			expect(screen.getByText("sia@inalum.id")).toBeDefined();
			expect(screen.getByText("www.inalum.id")).toBeDefined();
		});

		it("renders dynamic copyright notice for PT Indonesia Asahan Aluminium", () => {
			render(<Footer />);

			const year = new Date().getFullYear();
			expect(
				screen.getByText(new RegExp(`© ${year} PT Indonesia Asahan Aluminium`)),
			).toBeDefined();
		});
	});
});
