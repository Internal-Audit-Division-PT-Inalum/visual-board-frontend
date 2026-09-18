import { useQuery } from '@tanstack/react-query';
import type { OrganizationDocument, ApiSuccessResponse } from '@/types/api';
import { api } from '@/lib/api';

export function useOrganizationDocuments(category: 'structure' | 'map_area' = 'structure') {
  const { data, isLoading, error } = useQuery({
    queryKey: ['organization-documents', category],
    queryFn: async () => {
      
      
      const response = await api.get<ApiSuccessResponse<OrganizationDocument[]>>('/hr/kiosk/organization-documents', {
        params: { category }
      });
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, 
  });

  return { 
    documents: data || [], 
    isLoading, 
    error: error as Error | null 
  };
}

