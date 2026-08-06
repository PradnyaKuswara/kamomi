import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Contact, ContactRequest } from '../types/contact';
import type { Page } from '../types/rule';

// Fetch all contacts paginated
export const getContacts = async (
  propertyId: number,
  page: number,
  size: number
): Promise<ApiResponse<Page<Contact>>> => {
  return ApiService.get<ApiResponse<Page<Contact>>>(
    `/api/properties/${propertyId}/contacts?page=${page}&size=${size}&sort=createdAt,desc`
  );
};

// Create a contact
export const createContact = async ({
  propertyId,
  data,
}: {
  propertyId: number;
  data: ContactRequest;
}): Promise<ApiResponse<Contact>> => {
  return ApiService.post<ApiResponse<Contact>>(`/api/properties/${propertyId}/contacts`, data);
};

// Update a contact
export const updateContact = async ({
  propertyId,
  contactId,
  data,
}: {
  propertyId: number;
  contactId: number;
  data: ContactRequest;
}): Promise<ApiResponse<Contact>> => {
  return ApiService.put<ApiResponse<Contact>>(`/api/properties/${propertyId}/contacts/${contactId}`, data);
};

// Delete a contact
export const deleteContact = async ({
  propertyId,
  contactId,
}: {
  propertyId: number;
  contactId: number;
}): Promise<ApiResponse<void>> => {
  return ApiService.delete<ApiResponse<void>>(`/api/properties/${propertyId}/contacts/${contactId}`);
};

// Hooks
export function useContactsQuery(propertyId: number | undefined, page = 0, size = 5) {
  return useQuery<ApiResponse<Page<Contact>>, Error>({
    queryKey: ['contacts', propertyId, page, size],
    queryFn: () => getContacts(propertyId!, page, size),
    enabled: !!propertyId,
  });
}

export function useCreateContactMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Contact>, Error, ContactRequest>({
    mutationFn: (data) => createContact({ propertyId: propertyId!, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', propertyId] });
    },
  });
}

export function useUpdateContactMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Contact>, Error, { contactId: number; data: ContactRequest }>({
    mutationFn: ({ contactId, data }) => updateContact({ propertyId: propertyId!, contactId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', propertyId] });
    },
  });
}

export function useDeleteContactMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (contactId) => deleteContact({ propertyId: propertyId!, contactId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts', propertyId] });
    },
  });
}
