import { devices, expect, test } from "@playwright/test";
import {
	attachRuntimeErrorTracker,
	setupVisualBoardMocks,
} from "./helpers/setupMocks";

test.use({ ...devices["Pixel 7"] });

test.describe("E2E Mobile Attendance Scan Journey", () => {
	test("berhasil mengirim presensi digital (201) dan mereset form saat kembali", async ({
		page,
	}) => {
		const runtimeErrors = await attachRuntimeErrorTracker(page);
		const capturedPayloads: Array<{ namecode?: string; status?: string }> = [];

		await setupVisualBoardMocks(page, {
			onAttendanceScan: (payload) => {
				capturedPayloads.push(payload);
				return {
					status: 201,
					body: {
						success: true,
						message: "Presensi berhasil dicatat.",
					},
				};
			},
		});

		await page.goto("/presensi");

		await page.fill("#namecode", "K-1024");
		await page.getByRole("button", { name: "Dinas" }).click();
		await page.getByRole("button", { name: "Konfirmasi Kehadiran" }).click();

		await expect(
			page.getByRole("heading", { name: "Terima Kasih!" }),
		).toBeVisible();
		await expect(
			page.getByText(
				"Kehadiran Anda hari ini telah berhasil dicatat oleh sistem.",
			),
		).toBeVisible();
		await expect(page.getByText("Presensi berhasil dicatat!")).toBeVisible();

		expect(capturedPayloads).toEqual([
			{ namecode: "K-1024", status: "business_trip" },
		]);

		await page.getByRole("button", { name: "Kembali" }).click();
		await expect(page.locator("#namecode")).toHaveValue("");

		expect(runtimeErrors.pageErrors).toEqual([]);
		expect(await runtimeErrors.getUnhandledRejections()).toEqual([]);
	});

	test("menampilkan feedback error validasi / duplikasi dari server (422)", async ({
		page,
	}) => {
		const runtimeErrors = await attachRuntimeErrorTracker(page);

		await setupVisualBoardMocks(page, {
			onAttendanceScan: () => ({
				status: 422,
				body: {
					success: false,
					message: "Karyawan sudah melakukan presensi hari ini.",
				},
			}),
		});

		await page.goto("/presensi");

		await page.fill("#namecode", "K-1024");
		await page.getByRole("button", { name: "Konfirmasi Kehadiran" }).click();

		await expect(page.getByText("Presensi Gagal")).toBeVisible();
		await expect(
			page.getByText("Karyawan sudah melakukan presensi hari ini."),
		).toBeVisible();
		await expect(
			page.getByRole("heading", { name: "Terima Kasih!" }),
		).toBeHidden();

		expect(runtimeErrors.pageErrors).toEqual([]);
	});

	test("menampilkan feedback rate limit dari backend (429) dan memulihkan tombol submit", async ({
		page,
	}) => {
		const runtimeErrors = await attachRuntimeErrorTracker(page);

		await setupVisualBoardMocks(page, {
			onAttendanceScan: () => ({
				status: 429,
				headers: {
					"Retry-After": "60",
				},
				body: {
					success: false,
					message:
						"Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba kembali.",
					meta: {
						code: "RATE_LIMIT_EXCEEDED",
					},
				},
			}),
		});

		await page.goto("/presensi");

		await page.fill("#namecode", "SPAM-01");
		const submitBtn = page.getByRole("button", {
			name: "Konfirmasi Kehadiran",
		});
		await submitBtn.click();

		await expect(page.getByText("Presensi Gagal")).toBeVisible();
		await expect(
			page.getByText(
				"Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba kembali.",
			),
		).toBeVisible();
		await expect(submitBtn).toBeEnabled();

		expect(runtimeErrors.pageErrors).toEqual([]);
	});
});
