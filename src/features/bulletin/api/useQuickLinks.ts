import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccessResponse, QuickLink } from "@/types/api";

export function useQuickLinks() {
	return useQuery({
		queryKey: ["quick_links"],
		queryFn: async () => {
			const response = await api.get<ApiSuccessResponse<QuickLink[]>>(
				"/portal/kiosk/quick-links",
			);
			return response.data.data;
		},
		refetchInterval: 60_000,
		staleTime: 30_000,
	});
}
