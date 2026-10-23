import { useQuery } from "@tanstack/react-query";
import { getKioskInventory } from "./getKioskInventory";

/**
 * Custom React Query hook untuk konsumsi data inventaris Kiosk
 * Auto-refetch setiap 60 detik, staleTime 30 detik
 */
export function useKioskInventory() {
	return useQuery({
		queryKey: ["kiosk-inventory-locations"],
		queryFn: getKioskInventory,
		refetchInterval: 60_000,
		staleTime: 30_000,
	});
}
