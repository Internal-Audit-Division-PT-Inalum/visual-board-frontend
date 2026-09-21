import { useQuery } from "@tanstack/react-query";
import { getKioskData } from "./getKioskData";

export function useKioskData(month?: number, year?: number) {
	return useQuery({
		queryKey: ["kiosk-dashboard", month, year],
		queryFn: () => getKioskData({ month, year }),
		refetchInterval: 15_000,
		staleTime: 10_000,
	});
}
