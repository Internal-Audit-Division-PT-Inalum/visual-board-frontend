import { api } from '@/lib/api';
import type { ApiSuccessResponse, KioskDashboardResponse } from '@/types/api';

interface KioskDataParams {
  month?: number;
  year?: number;
}

export async function getKioskData(params?: KioskDataParams): Promise<KioskDashboardResponse> {
  const query = new URLSearchParams();
  if (params?.month) query.append('month', params.month.toString());
  if (params?.year) query.append('year', params.year.toString());
  
  const url = query.toString() ? `/visual-board/kiosk?${query.toString()}` : '/visual-board/kiosk';
  
  const { data } = await api.get<ApiSuccessResponse<KioskDashboardResponse>>(url);
  return data.data;
}

