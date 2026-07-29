import { useQuery } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Faq } from '../types/faq';

export const getFaqs = async (): Promise<ApiResponse<Faq[]>> => {
  return ApiService.get<ApiResponse<Faq[]>>('/api/faqs');
};

export const getFaqsByCategory = async (category: string): Promise<ApiResponse<Faq[]>> => {
  return ApiService.get<ApiResponse<Faq[]>>(`/api/faqs/category/${encodeURIComponent(category)}`);
};
export function useFaqsQuery() {
  return useQuery<ApiResponse<Faq[]>, Error>({
    queryKey: ['faqs'],
    queryFn: getFaqs,
    staleTime: 1000 * 60 * 10, // cache 10 minutes
  });
}
