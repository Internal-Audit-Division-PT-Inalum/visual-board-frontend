import { useQuery } from '@tanstack/react-query';
import type { QuickLink, ApiSuccessResponse } from '@/types/api';
import { api } from '@/lib/api';

export function useQuickLinks() {
  return useQuery({
    queryKey: ['quick_links'],
    queryFn: async () => {
      const response = await api.get<ApiSuccessResponse<QuickLink[]>>('/portal/kiosk/quick-links');
      return response.data.data;
    },
    refetchInterval: 60_000, 
    staleTime: 30_000,
  });
}
