import { useMutation, useQuery } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';

export interface UserProfileData {
  name: string;
  email: string;
}

// Fetcher function
export const checkMe = async (): Promise<ApiResponse<UserProfileData>> => {
  return ApiService.get<ApiResponse<UserProfileData>>('/api/auth/me');
};

// Hook using useMutation (as requested for mutateAsync mechanism)
export function useCheckMeMutation() {
  return useMutation<ApiResponse<UserProfileData>, Error, void>({
    mutationFn: checkMe
  });
}

// Hook using useQuery (standard React Query fetch mechanism)
export function useCheckMeQuery(options = {}) {
  return useQuery<ApiResponse<UserProfileData>, Error>({
    queryKey: ['currentUser'],
    queryFn: checkMe,
    ...options
  });
}

// Logout fetcher
export const logout = async (): Promise<ApiResponse<void>> => {
  return ApiService.post<ApiResponse<void>>('/api/auth/logout', {});
};

// Logout mutation hook
export function useLogoutMutation() {
  return useMutation<ApiResponse<void>, Error, void>({
    mutationFn: logout
  });
}
