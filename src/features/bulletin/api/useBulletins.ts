import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiSuccessResponse, Bulletin } from "@/types/api";

export function useBulletins(limit: number = 20, category?: string) {
	return useQuery({
		queryKey: ["bulletins", limit, category],
		queryFn: async () => {
			const response = await api.get<ApiSuccessResponse<Bulletin[]>>(
				"/portal/kiosk/bulletins",
				{
					params: { limit, type: category },
				},
			);
			return response.data.data;
		},
		refetchInterval: 30_000,
		staleTime: 20_000,
	});
}
