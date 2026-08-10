import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/notification';
import type { ApiResponse } from '../services/api';
import type { Notification, Page } from '../types/notification';

export function useNotificationsQuery(page = 0, size = 20) {
  return useQuery<ApiResponse<Page<Notification>>, Error>({
    queryKey: ['notifications', page, size],
    queryFn: () => getNotifications(page, size),
  });
}

export function useUnreadCountQuery() {
  return useQuery<ApiResponse<number>, Error>({
    queryKey: ['unreadNotificationCount'],
    queryFn: () => getUnreadNotificationCount(),
    refetchInterval: 60000, // Fallback refetch every 60s
  });
}

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Notification>, Error, number>({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, void>({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}

export function useDeleteNotificationMutation() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationCount'] });
    },
  });
}
