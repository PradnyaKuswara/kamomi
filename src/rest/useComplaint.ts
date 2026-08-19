import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Complaint, UpdateComplaintStatusRequest, CreatePublicComplaintRequest, Page } from '../types/complaint';

export const getComplaints = async (
  propertyId: number,
  page: number,
  size: number,
  status?: string
): Promise<ApiResponse<Page<Complaint>>> => {
  const statusParam = status && status !== 'ALL' ? `&status=${encodeURIComponent(status)}` : '';
  return ApiService.get<ApiResponse<Page<Complaint>>>(
    `/api/properties/${propertyId}/complaints?page=${page}&size=${size}&sort=createdAt,desc${statusParam}`
  );
};

export const createPublicComplaint = async (
  data: CreatePublicComplaintRequest
): Promise<ApiResponse<Complaint>> => {
  return ApiService.post<ApiResponse<Complaint>>('/api/public/complaints', data);
};

export const updateComplaintStatus = async ({
  propertyId,
  complaintId,
  data,
}: {
  propertyId: number;
  complaintId: number;
  data: UpdateComplaintStatusRequest;
}): Promise<ApiResponse<Complaint>> => {
  return ApiService.put<ApiResponse<Complaint>>(
    `/api/properties/${propertyId}/complaints/${complaintId}/status`,
    data
  );
};

export const deleteComplaint = async ({
  propertyId,
  complaintId,
}: {
  propertyId: number;
  complaintId: number;
}): Promise<ApiResponse<void>> => {
  return ApiService.delete<ApiResponse<void>>(
    `/api/properties/${propertyId}/complaints/${complaintId}`
  );
};

export function useComplaintsQuery(
  propertyId: number | undefined,
  page = 0,
  size = 10,
  status = 'ALL'
) {
  return useQuery<ApiResponse<Page<Complaint>>, Error>({
    queryKey: ['complaints', propertyId, page, size, status],
    queryFn: () => getComplaints(propertyId!, page, size, status),
    enabled: !!propertyId,
  });
}

export function useCreatePublicComplaintMutation() {
  return useMutation<ApiResponse<Complaint>, Error, CreatePublicComplaintRequest>({
    mutationFn: (data) => createPublicComplaint(data),
  });
}

export function useUpdateComplaintStatusMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Complaint>, Error, { complaintId: number; data: UpdateComplaintStatusRequest }>({
    mutationFn: ({ complaintId, data }) => updateComplaintStatus({ propertyId: propertyId!, complaintId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints', propertyId] });
    },
  });
}

export function useDeleteComplaintMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (complaintId) => deleteComplaint({ propertyId: propertyId!, complaintId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints', propertyId] });
    },
  });
}
