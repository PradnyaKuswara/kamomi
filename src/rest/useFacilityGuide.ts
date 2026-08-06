import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { FacilityGuide } from '../types/facility-guide';
import type { Page } from '../types/rule';

export interface FacilityGuideRequest {
  name: string;
  icon: string;
  title: string;
  steps: string[];
}

export const getGuides = async (
  propertyId: number,
  page: number,
  size: number
): Promise<ApiResponse<Page<FacilityGuide>>> => {
  return ApiService.get<ApiResponse<Page<FacilityGuide>>>(
    `/api/properties/${propertyId}/facility-guides?page=${page}&size=${size}&sort=createdAt,desc`
  );
};

export const createGuide = async ({
  propertyId,
  data,
}: {
  propertyId: number;
  data: FacilityGuideRequest;
}): Promise<ApiResponse<FacilityGuide>> => {
  return ApiService.post<ApiResponse<FacilityGuide>>(`/api/properties/${propertyId}/facility-guides`, data);
};

export const updateGuide = async ({
  propertyId,
  guideId,
  data,
}: {
  propertyId: number;
  guideId: number;
  data: FacilityGuideRequest;
}): Promise<ApiResponse<FacilityGuide>> => {
  return ApiService.put<ApiResponse<FacilityGuide>>(`/api/properties/${propertyId}/facility-guides/${guideId}`, data);
};

export const deleteGuide = async ({
  propertyId,
  guideId,
}: {
  propertyId: number;
  guideId: number;
}): Promise<ApiResponse<void>> => {
  return ApiService.delete<ApiResponse<void>>(`/api/properties/${propertyId}/facility-guides/${guideId}`);
};

export function useGuidesQuery(propertyId: number | undefined, page = 0, size = 5) {
  return useQuery<ApiResponse<Page<FacilityGuide>>, Error>({
    queryKey: ['facility-guides', propertyId, page, size],
    queryFn: () => getGuides(propertyId!, page, size),
    enabled: !!propertyId,
  });
}

export function useCreateGuideMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<FacilityGuide>, Error, FacilityGuideRequest>({
    mutationFn: (data) => createGuide({ propertyId: propertyId!, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-guides', propertyId] });
    },
  });
}

export function useUpdateGuideMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<FacilityGuide>, Error, { guideId: number; data: FacilityGuideRequest }>({
    mutationFn: ({ guideId, data }) => updateGuide({ propertyId: propertyId!, guideId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-guides', propertyId] });
    },
  });
}

export function useDeleteGuideMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (guideId) => deleteGuide({ propertyId: propertyId!, guideId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facility-guides', propertyId] });
    },
  });
}
