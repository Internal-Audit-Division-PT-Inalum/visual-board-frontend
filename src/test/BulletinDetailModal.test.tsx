import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BulletinDetailModal } from "@/features/bulletin/components/BulletinDetailModal";
import type { Bulletin } from "@/types/api";

const sampleBulletin: Bulletin = {
	id: "bul-001",
	title: "Sosialisasi Audit 5R Triwulan IV",
	content:
		'<p>Harap seluruh unit menjaga kebersihan area.</p><script>window.__xss=1;</script><img src="https://cdn.inalum.id/img.jpg" onerror="window.__xss=2" />',
	type: "health_safety",
	image_url: null,
	document_url: null,
	published_at: "2026-11-10T08:00:00Z",
	expired_at: null,
	author: "Internal Audit IIA",
};

describe("BulletinDetailModal", () => {
	it("renders nothing when bulletin is null", () => {
		const { container } = render(
			<BulletinDetailModal
				bulletin={null}
				onClose={vi.fn()}
				onOpenViewer={vi.fn()}
			/>,
		);
		expect(container.innerHTML).toBe("");
	});

	it("renders sanitized HTML content without script tags or inline event handlers", () => {
		render(
			<BulletinDetailModal
				bulletin={sampleBulletin}
				onClose={vi.fn()}
				onOpenViewer={vi.fn()}
			/>,
		);

		expect(screen.getByText("Sosialisasi Audit 5R Triwulan IV")).toBeTruthy();
		expect(screen.getByText("Internal Audit IIA")).toBeTruthy();
		expect(
			screen.getByText("Harap seluruh unit menjaga kebersihan area."),
		).toBeTruthy();

		const dialog = screen.getByRole("dialog");
		expect(dialog.querySelector("script")).toBeNull();
		const renderedImg = dialog.querySelector("img");
		expect(renderedImg?.getAttribute("onerror")).toBeNull();
	});

	it("invokes onClose when Escape key is pressed", () => {
		const onClose = vi.fn();
		render(
			<BulletinDetailModal
				bulletin={sampleBulletin}
				onClose={onClose}
				onOpenViewer={vi.fn()}
			/>,
		);

		fireEvent.keyDown(window, { key: "Escape" });
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
