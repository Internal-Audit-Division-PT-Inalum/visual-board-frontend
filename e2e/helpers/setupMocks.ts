import type { Page } from "@playwright/test";
import type { Bulletin } from "@/types/api";
import {
	MOCK_ATTENDANCE_SUMMARY,
	MOCK_CLEAN_BULLETIN,
	MOCK_INVENTORY_LOCATIONS,
	MOCK_KIOSK_DASHBOARD,
	MOCK_ORGANIZATION_DOCUMENTS,
	MOCK_QUICK_LINKS,
} from "../fixtures/mockData";

export interface AttendanceScanMockResponse {
	status: number;
	body: Record<string, unknown>;
	headers?: Record<string, string>;
}

export interface SetupVisualBoardMockOptions {
	bulletins?: Bulletin[];
	onAttendanceScan?: (payload: {
		namecode?: string;
		status?: string;
	}) => AttendanceScanMockResponse;
}

export interface RuntimeErrorTracker {
	pageErrors: string[];
	getUnhandledRejections: () => Promise<string[]>;
}

export async function attachRuntimeErrorTracker(
	page: Page,
): Promise<RuntimeErrorTracker> {
	const pageErrors: string[] = [];

	page.on("pageerror", (error) => {
		pageErrors.push(error.message);
	});

	await page.addInitScript(() => {
		const win = window as Window & { __pwUnhandledRejections?: string[] };
		win.__pwUnhandledRejections = [];
		window.addEventListener("unhandledrejection", (event) => {
			win.__pwUnhandledRejections?.push(String(event.reason));
		});
	});

	return {
		pageErrors,
		getUnhandledRejections: async () => {
			return page.evaluate(() => {
				const win = window as Window & { __pwUnhandledRejections?: string[] };
				return win.__pwUnhandledRejections ?? [];
			});
		},
	};
}

export async function setupVisualBoardMocks(
	page: Page,
	options: SetupVisualBoardMockOptions = {},
): Promise<void> {
	const bulletins = options.bulletins ?? [MOCK_CLEAN_BULLETIN];

	await page.route("**/api/v1/visual-board/kiosk*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				success: true,
				message: "OK",
				data: MOCK_KIOSK_DASHBOARD,
			}),
		});
	});

	await page.route("**/api/v1/hr/kiosk/attendance-summary", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				success: true,
				message: "OK",
				data: MOCK_ATTENDANCE_SUMMARY,
			}),
		});
	});

	await page.route("**/api/v1/portal/kiosk/bulletins*", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				success: true,
				message: "OK",
				data: bulletins,
			}),
		});
	});

	await page.route("**/api/v1/portal/kiosk/quick-links", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				success: true,
				message: "OK",
				data: MOCK_QUICK_LINKS,
			}),
		});
	});

	await page.route("**/api/v1/inventory/kiosk/locations", async (route) => {
		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify({
				success: true,
				data: MOCK_INVENTORY_LOCATIONS,
				meta: {
					generated_at: "2026-11-13T08:00:00Z",
				},
			}),
		});
	});

	await page.route(
		"**/api/v1/hr/kiosk/organization-documents*",
		async (route) => {
			await route.fulfill({
				status: 200,
				contentType: "application/json",
				body: JSON.stringify({
					success: true,
					message: "OK",
					data: MOCK_ORGANIZATION_DOCUMENTS,
				}),
			});
		},
	);

	await page.route("**/api/v1/hr/kiosk/attendances/scan", async (route) => {
		const body = route.request().postDataJSON() as {
			namecode?: string;
			status?: string;
		};

		if (options.onAttendanceScan) {
			const res = options.onAttendanceScan(body);
			await route.fulfill({
				status: res.status,
				contentType: "application/json",
				headers: res.headers,
				body: JSON.stringify(res.body),
			});
			return;
		}

		await route.fulfill({
			status: 201,
			contentType: "application/json",
			body: JSON.stringify({
				success: true,
				message: "Presensi berhasil dicatat.",
			}),
		});
	});
}
