import { api } from "@/lib/api";
import type {
	KioskInventoryResponse,
	KioskLocationWithItems,
} from "@/types/api";

/**
 * Mengambil data inventaris publik untuk layar Kiosk TV
 * Endpoint: GET /api/v1/inventory/kiosk/locations
 */
export async function getKioskInventory(): Promise<KioskLocationWithItems[]> {
	const { data } = await api.get<KioskInventoryResponse>(
		"/inventory/kiosk/locations",
	);
	return data.data;
}
