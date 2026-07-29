import { useMutation, useQuery } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';

import type { UserData, UserSubscription } from '../types/user';


export const checkMe = async (): Promise<ApiResponse<UserData>> => {
  return ApiService.get<ApiResponse<UserData>>('/api/auth/me');
};
export function useCheckMeMutation() {
  return useMutation<ApiResponse<UserData>, Error, void>({
    mutationFn: checkMe
  }); 
}

export function useCheckMeQuery(options = {}) {
  return useQuery<ApiResponse<UserData>, Error>({
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
