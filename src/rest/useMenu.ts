import { useQuery } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Menu, MenuSection } from '../types/menu';

export const getUserSidebarMenus = async (userId: number): Promise<ApiResponse<MenuSection[]>> => {
  return ApiService.get<ApiResponse<MenuSection[]>>(`/api/menus/user/${userId}/sidebar`);
};

export function useUserSidebarMenusQuery(userId: number | undefined) {
  return useQuery<ApiResponse<MenuSection[]>, Error>({
    queryKey: ['sidebar-menus', userId],
    queryFn: () => getUserSidebarMenus(userId!),
    enabled: !!userId,
  });
}
