import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Room } from '../types/room';
import type { Page } from '../types/rule';

export interface UserRoomAccess {
  userId: number;
  userName: string;
  userEmail: string;
  assignedRooms: Room[];
  lastLoginAt?: string;
  lastLogoutAt?: string;
  isOnline?: boolean;
  roleName?: 'ADMIN' | 'USER';
  isActive?: boolean;
  propertyNames?: string[];
  phoneNumber?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  roleName: 'ADMIN' | 'USER';
  isActive?: boolean;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  roleName?: 'ADMIN' | 'USER';
  isActive?: boolean;
}

export interface AssignUserRoomsRequest {
  userId: number;
  roomIds: number[];
}

// REST functions
export const getPropertyUsers = async (
  propertyId: number,
  page: number,
  size: number
): Promise<ApiResponse<Page<UserRoomAccess>>> => {
  return ApiService.get<ApiResponse<Page<UserRoomAccess>>>(
    `/api/properties/${propertyId}/user-access?page=${page}&size=${size}`
  );
};

export const createPropertyUser = async (data: CreateUserRequest): Promise<ApiResponse<any>> => {
  return ApiService.post<ApiResponse<any>>('/api/users', data);
};

export const assignUserRooms = async (
  propertyId: number,
  data: AssignUserRoomsRequest
): Promise<ApiResponse<UserRoomAccess>> => {
  return ApiService.post<ApiResponse<UserRoomAccess>>(`/api/properties/${propertyId}/user-access`, data);
};

export const removePropertyUser = async (
  propertyId: number,
  userId: number
): Promise<ApiResponse<void>> => {
  return ApiService.delete<ApiResponse<void>>(`/api/properties/${propertyId}/user-access/${userId}`);
};

// Hooks
export function usePropertyUsersQuery(propertyId: number | undefined, page = 0, size = 10) {
  return useQuery<ApiResponse<Page<UserRoomAccess>>, Error>({
    queryKey: ['propertyUsers', propertyId, page, size],
    queryFn: () => getPropertyUsers(propertyId!, page, size),
    enabled: !!propertyId,
  });
}

export function useCreatePropertyUserMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<any>, Error, CreateUserRequest>({
    mutationFn: createPropertyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propertyUsers', propertyId] });
    },
  });
}

export function useAssignUserRoomsMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<UserRoomAccess>, Error, AssignUserRoomsRequest>({
    mutationFn: (data) => assignUserRooms(propertyId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propertyUsers', propertyId] });
    },
  });
}

export function useRemovePropertyUserMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (userId) => removePropertyUser(propertyId!, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propertyUsers', propertyId] });
    },
  });
}

export const updatePropertyUser = async (
  userId: number,
  data: UpdateUserRequest
): Promise<ApiResponse<any>> => {
  return ApiService.put<ApiResponse<any>>(`/api/users/${userId}`, data);
};

export function useUpdatePropertyUserMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<any>, Error, { userId: number; data: UpdateUserRequest }>({
    mutationFn: ({ userId, data }) => updatePropertyUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propertyUsers', propertyId] });
    },
  });
}
