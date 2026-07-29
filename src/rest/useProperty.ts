import { useMutation } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Property } from '../types/property';

export interface CreatePropertyRequest {
  propertyType: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
}

export const createProperty = async (data: CreatePropertyRequest): Promise<ApiResponse<Property>> => {
  return ApiService.post<ApiResponse<Property>>('/api/properties', data);
};

export function useCreatePropertyMutation() {
  return useMutation<ApiResponse<Property>, Error, CreatePropertyRequest>({
    mutationFn: createProperty,
  });
}
