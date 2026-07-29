import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Room, RoomRequest } from '../types/room';
import type { Page } from '../types/rule';

// Fetch all rooms paginated
export const getRooms = async (
  propertyId: number,
  page: number,
  size: number
): Promise<ApiResponse<Page<Room>>> => {
  return ApiService.get<ApiResponse<Page<Room>>>(
    `/api/properties/${propertyId}/rooms?page=${page}&size=${size}&sort=roomNumber,asc`
  );
};

// Create a room
export const createRoom = async ({
  propertyId,
  data,
}: {
  propertyId: number;
  data: RoomRequest;
}): Promise<ApiResponse<Room>> => {
  return ApiService.post<ApiResponse<Room>>(`/api/properties/${propertyId}/rooms`, data);
};

// Update a room
export const updateRoom = async ({
  propertyId,
  roomId,
  data,
}: {
  propertyId: number;
  roomId: number;
  data: RoomRequest;
}): Promise<ApiResponse<Room>> => {
  return ApiService.put<ApiResponse<Room>>(`/api/properties/${propertyId}/rooms/${roomId}`, data);
};

// Delete a room
export const deleteRoom = async ({
  propertyId,
  roomId,
}: {
  propertyId: number;
  roomId: number;
}): Promise<ApiResponse<void>> => {
  return ApiService.delete<ApiResponse<void>>(`/api/properties/${propertyId}/rooms/${roomId}`);
};

// Fetch a single room
export const getRoom = async (propertyId: number, roomId: number): Promise<ApiResponse<Room>> => {
  return ApiService.get<ApiResponse<Room>>(`/api/properties/${propertyId}/rooms/${roomId}`);
};

// Hooks
export function useRoomsQuery(propertyId: number | undefined, page = 0, size = 5) {
  return useQuery<ApiResponse<Page<Room>>, Error>({
    queryKey: ['rooms', propertyId, page, size],
    queryFn: () => getRooms(propertyId!, page, size),
    enabled: !!propertyId,
  });
}

export function useRoomQuery(propertyId: number | undefined, roomId: number | undefined) {
  return useQuery<ApiResponse<Room>, Error>({
    queryKey: ['room', propertyId, roomId],
    queryFn: () => getRoom(propertyId!, roomId!),
    enabled: !!propertyId && !!roomId,
  });
}



export function useCreateRoomMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Room>, Error, RoomRequest>({
    mutationFn: (data) => createRoom({ propertyId: propertyId!, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', propertyId] });
    },
  });
}

export function useUpdateRoomMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Room>, Error, { roomId: number; data: RoomRequest }>({
    mutationFn: ({ roomId, data }) => updateRoom({ propertyId: propertyId!, roomId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', propertyId] });
    },
  });
}

export function useDeleteRoomMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (roomId) => deleteRoom({ propertyId: propertyId!, roomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms', propertyId] });
    },
  });
}
