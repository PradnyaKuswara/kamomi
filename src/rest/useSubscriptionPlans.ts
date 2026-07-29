import { useQuery } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { SubscriptionPlan } from '../types/subscription-plan';


export const fetchActiveSubscriptionPlans = async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
  return ApiService.get<ApiResponse<SubscriptionPlan[]>>('/api/subscription-plans/active');
};

export function useActiveSubscriptionPlansQuery() {
  return useQuery<ApiResponse<SubscriptionPlan[]>, Error>({
    queryKey: ['activeSubscriptionPlans'],
    queryFn: fetchActiveSubscriptionPlans,
    staleTime: 1000 * 60 * 5, // Cache 5 menit
  });
}
