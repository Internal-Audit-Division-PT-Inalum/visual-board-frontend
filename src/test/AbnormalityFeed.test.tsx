import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AbnormalityFeed } from "@/features/general/components/AbnormalityFeed";
import type { Abnormality } from "@/types/api";

function makeAbnormality(overrides: Partial<Abnormality> = {}): Abnormality {
	return {
		id: "01jtestabnormality00000001",
		zone_name: "Zona 3",
		finder_name: "Putri Nurmawati",
		group_name: "Tim 5R",
		description: "Penutup kabel duct di sudut ruangan hilang",
		countermeasure_plan: "Pembelian penutup kabel duct baru",
		countermeasure_actual: null,
		date_found: "2026-11-23",
		planned_date: "2026-11-26",
		actual_date: null,
		status: "open",
		progress_percentage: 0,
		pic_name: "Thaofan D. E. Saputro",
		is_kaizen: false,
		signed_by_staff: null,
		signed_by_ms: null,
		evidence_photos: [],
		resolution_photos: [],
		created_at: "2026-11-23T08:00:00.000Z",
		resolved_at: null,
		...overrides,
	};
}

describe("AbnormalityFeed photo thumbnails and lightbox modal", () => {
	it("renders a clean empty indicator when abnormality has no photos", () => {
		render(
			<AbnormalityFeed
				items={[makeAbnormality()]}
				isLoading={false}
				isError={false}
				onRetry={vi.fn()}
			/>,
		);

		expect(screen.getByText("Foto")).toBeTruthy();
		expect(
			screen.queryByRole("button", { name: /Lihat foto temuan/i }),
		).toBeNull();
	});

	it("renders evidence photo thumbnail with multi-photo counter and opens lightbox with keyboard Escape", async () => {
		const user = userEvent.setup();
		const item = makeAbnormality({
			evidence_photos: [
				{
					id: 1,
					url: "/storage/1/before-1.jpg",
					thumb_url: "/storage/1/conversions/before-1-thumb.webp",
					name: "before-1.jpg",
				},
				{
					id: 2,
					url: "/storage/2/before-2.jpg",
					thumb_url: "/storage/2/conversions/before-2-thumb.webp",
					name: "before-2.jpg",
				},
			],
		});

		render(
			<AbnormalityFeed
				items={[item]}
				isLoading={false}
				isError={false}
				onRetry={vi.fn()}
			/>,
		);

		const trigger = screen.getByRole("button", {
			name: /Lihat 2 foto temuan Zona 3/i,
		});
		expect(trigger).toBeTruthy();
		expect(screen.getByText("+1")).toBeTruthy();

		await user.click(trigger);

		const dialog = screen.getByRole("dialog", {
			name: /Dokumentasi Foto Temuan Zona 3/i,
		});
		expect(dialog).toBeTruthy();
		expect(screen.getByText("Foto 1 dari 2")).toBeTruthy();

		await user.keyboard("{ArrowRight}");
		expect(screen.getByText("Foto 2 dari 2")).toBeTruthy();

		await user.keyboard("{Escape}");
		expect(
			screen.queryByRole("dialog", {
				name: /Dokumentasi Foto Temuan Zona 3/i,
			}),
		).toBeNull();
	});

	it("opens directly into Before/After comparison mode when both evidence and resolution photos exist", async () => {
		const user = userEvent.setup();
		const item = makeAbnormality({
			status: "resolved",
			progress_percentage: 100,
			countermeasure_actual: "Penutup kabel duct telah dipasang kembali",
			evidence_photos: [
				{
					id: 10,
					url: "/storage/10/before.jpg",
					thumb_url: "/storage/10/conversions/before-thumb.webp",
					name: "before.jpg",
				},
			],
			resolution_photos: [
				{
					id: 11,
					url: "/storage/11/after.jpg",
					thumb_url: "/storage/11/conversions/after-thumb.webp",
					name: "after.jpg",
				},
			],
		});

		render(
			<AbnormalityFeed
				items={[item]}
				isLoading={false}
				isError={false}
				onRetry={vi.fn()}
			/>,
		);

		const trigger = screen.getByRole("button", {
			name: /Bandingkan foto sebelum & sesudah Zona 3/i,
		});
		await user.click(trigger);

		const dialog = screen.getByRole("dialog", {
			name: /Dokumentasi Foto Temuan Zona 3/i,
		});
		const compareTab = within(dialog).getByRole("tab", {
			name: /Bandingkan \(Before \/ After\)/i,
		});
		expect(compareTab.getAttribute("aria-selected")).toBe("true");
		expect(within(dialog).getByText("Sebelum (1/1)")).toBeTruthy();
		expect(within(dialog).getByText("Sesudah (1/1)")).toBeTruthy();
		expect(
			within(dialog).getByText("Penutup kabel duct telah dipasang kembali"),
		).toBeTruthy();
	});
});
