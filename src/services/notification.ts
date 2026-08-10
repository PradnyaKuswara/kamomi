import ApiService, { type ApiResponse } from './api';
import type { Notification, Page } from '../types/notification';

export const getNotifications = async (
  page = 0,
  size = 20
): Promise<ApiResponse<Page<Notification>>> => {
  return ApiService.get<ApiResponse<Page<Notification>>>(
    `/api/notifications?page=${page}&size=${size}`
  );
};

export const getUnreadNotificationCount = async (): Promise<ApiResponse<number>> => {
  return ApiService.get<ApiResponse<number>>('/api/notifications/unread-count');
};

export const markNotificationAsRead = async (
  id: number
): Promise<ApiResponse<Notification>> => {
  return ApiService.put<ApiResponse<Notification>>(`/api/notifications/${id}/read`, {});
};

export const markAllNotificationsAsRead = async (): Promise<ApiResponse<void>> => {
  return ApiService.put<ApiResponse<void>>('/api/notifications/read-all', {});
};

export const deleteNotification = async (id: number): Promise<ApiResponse<void>> => {
  return ApiService.delete<ApiResponse<void>>(`/api/notifications/${id}`);
};
