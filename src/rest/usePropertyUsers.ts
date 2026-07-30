import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Room } from '../types/room';

export interface UserRoomAccess {
  userId: number;
  userName: string;
  userEmail: string;
  assignedRooms: Room[];
  lastLoginAt?: string;
  lastLogoutAt?: string;
  isOnline?: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  roleName: 'ADMIN' | 'USER';
  isActive?: boolean;
}

export interface AssignUserRoomsRequest {
  userId: number;
  roomIds: number[];
}

// REST functions
export const getPropertyUsers = async (propertyId: number): Promise<ApiResponse<UserRoomAccess[]>> => {
  return ApiService.get<ApiResponse<UserRoomAccess[]>>(`/api/properties/${propertyId}/user-access`);
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
export function usePropertyUsersQuery(propertyId: number | undefined) {
  return useQuery<ApiResponse<UserRoomAccess[]>, Error>({
    queryKey: ['propertyUsers', propertyId],
    queryFn: () => getPropertyUsers(propertyId!),
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
