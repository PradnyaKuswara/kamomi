import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ApiService, { type ApiResponse } from '../services/api';
import type { Rule, RuleRequest, Page } from '../types/rule';

// Fetch all rules paginated
export const getRules = async (
  propertyId: number,
  page: number,
  size: number
): Promise<ApiResponse<Page<Rule>>> => {
  return ApiService.get<ApiResponse<Page<Rule>>>(
    `/api/properties/${propertyId}/rules?page=${page}&size=${size}&sort=sequence,asc`
  );
};

// Create a rule
export const createRule = async ({
  propertyId,
  data,
}: {
  propertyId: number;
  data: RuleRequest;
}): Promise<ApiResponse<Rule>> => {
  return ApiService.post<ApiResponse<Rule>>(`/api/properties/${propertyId}/rules`, data);
};

// Update a rule
export const updateRule = async ({
  propertyId,
  ruleId,
  data,
}: {
  propertyId: number;
  ruleId: number;
  data: RuleRequest;
}): Promise<ApiResponse<Rule>> => {
  return ApiService.put<ApiResponse<Rule>>(`/api/properties/${propertyId}/rules/${ruleId}`, data);
};

// Delete a rule
export const deleteRule = async ({
  propertyId,
  ruleId,
}: {
  propertyId: number;
  ruleId: number;
}): Promise<ApiResponse<void>> => {
  return ApiService.delete<ApiResponse<void>>(`/api/properties/${propertyId}/rules/${ruleId}`);
};

// Hooks
export function useRulesQuery(propertyId: number | undefined, page = 0, size = 5) {
  return useQuery<ApiResponse<Page<Rule>>, Error>({
    queryKey: ['rules', propertyId, page, size],
    queryFn: () => getRules(propertyId!, page, size),
    enabled: !!propertyId,
  });
}


export function useCreateRuleMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Rule>, Error, RuleRequest>({
    mutationFn: (data) => createRule({ propertyId: propertyId!, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules', propertyId] });
    },
  });
}

export function useUpdateRuleMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Rule>, Error, { ruleId: number; data: RuleRequest }>({
    mutationFn: ({ ruleId, data }) => updateRule({ propertyId: propertyId!, ruleId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules', propertyId] });
    },
  });
}

export function useDeleteRuleMutation(propertyId: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, Error, number>({
    mutationFn: (ruleId) => deleteRule({ propertyId: propertyId!, ruleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules', propertyId] });
    },
  });
}
