// src/hooks/useGroups.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createGroupApi,
  getGroupByIdApi,
  updateGroupApi,
  deleteGroupApi,
  fetchGroupsForUserApi,
  addMemberApi,
  removeMemberApi,
  CreateGroupPayload,
  AddMemberPayload,
  fetchGroupBalancesApi,
  AddExpensePayload,
  CreateSettlementPayload,
  addExpenseApi,
  createSettlementApi,
  // <- added imports for expense update/delete
  updateExpenseApi,
  deleteExpenseApi,
  UpdateExpensePayload, // optional - include if defined in groupApi types
} from '../groupApi';
import { Group } from '../../../types/group';

// ---- QUERY KEYS ----
const GROUPS_KEY = ['groups'] as const;
const GROUP_KEY = (groupID: number |string | number) => ['group', groupID] as const;
const USER_GROUPS_KEY = (userID: string) => ['user-groups', userID] as const;
const GROUP_BALANCES_KEY = (groupID: number |string | number) =>
  ['group', groupID, 'balances'] as const;

export type SplitMode = 'splitwise' | 'tricount';


// ---- HOOKS ----

// 1. Create Group
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroupPayload) => createGroupApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    },
  });
};

export function useGroup(groupID: number |string | number) {
  return useQuery({
    queryKey: ['group', groupID],           // 🔥 include mode
    queryFn: () => getGroupByIdApi(String(groupID)), // 🔥 pass mode to API
  });
}

// 3. Update group
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupID: number |string; data: Partial<Group> }) =>
      updateGroupApi(params.groupID, params.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(variables.groupID) });
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    },
  });
};

// 4. Delete group
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupID: number |string) => deleteGroupApi(groupID),
    onSuccess: (_data, groupID) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(groupID) });
    },
  });
};

// 5. Fetch groups for a user
export const useUserGroups = (userID?: string) => {
  const key = userID ?? 'unknown';
  return useQuery<Group[]>({
    queryKey: USER_GROUPS_KEY(key),
    enabled: !!userID,
    queryFn: () => fetchGroupsForUserApi(userID as string),
  });
};

// 6. Add member to group
export const useAddMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupID: number |string; payload: AddMemberPayload }) =>
      addMemberApi(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(variables.groupID) });
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    },
  });
};

// 7. Remove member from group
export const useRemoveMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { groupID: number |string; userID: string }) =>
      removeMemberApi(params),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(variables.groupID) });
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    },
  });
};

// ---- EXPENSE + SETTLEMENT HOOKS ----

export function useGroupBalances(groupID: number |string | number, mode: SplitMode = 'tricount') {
  return useQuery({
    queryKey: ['group-balances', groupID, mode],                 // 🔥 include mode
    queryFn: () => fetchGroupBalancesApi(groupID, mode),         // 🔥 pass mode
  });
}


export const useAddExpense = (groupID: number |string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add-expense', groupID],
    mutationFn: (payload: AddExpensePayload) => addExpenseApi(groupID, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(groupID) });
      queryClient.invalidateQueries({ queryKey: GROUP_BALANCES_KEY(groupID) });
    },
  });
};

export const useCreateSettlement = (groupID: number |string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-settlement', groupID],
    mutationFn: (payload: CreateSettlementPayload) =>
      createSettlementApi(groupID, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(groupID) });
      queryClient.invalidateQueries({ queryKey: GROUP_BALANCES_KEY(groupID) });
    },
  });
};

/* -----------------------------
   NEW: Update Expense + Delete Expense
   ----------------------------- */

/**
 * useUpdateExpense(groupID)
 * mutationFn expects: { expenseId: string | number; payload: Partial<UpdateExpensePayload> }
 * calls: updateExpenseApi(groupID, expenseId, payload)
 */
export const useUpdateExpense = (groupID: number |string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-expense', groupID],
    mutationFn: (params: { expenseId: string | number; payload: Partial<UpdateExpensePayload> }) =>
      updateExpenseApi(groupID, params.expenseId, params.payload),
    onSuccess: () => {
      // invalidate group and balances so UI updates
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(groupID) });
      queryClient.invalidateQueries({ queryKey: GROUP_BALANCES_KEY(groupID) });
    },
  });
};

/**
 * useDeleteExpense(groupID)
 * mutationFn expects: expenseId: string | number
 * calls: deleteExpenseApi(groupID, expenseId)
 */
export const useDeleteExpense = (groupID: number |string | number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-expense', groupID],
    mutationFn: (expenseId: string | number) => deleteExpenseApi(groupID, expenseId),
    onSuccess: () => {
      // invalidate group and balances so UI updates
      queryClient.invalidateQueries({ queryKey: GROUP_KEY(groupID) });
      queryClient.invalidateQueries({ queryKey: GROUP_BALANCES_KEY(groupID) });
    },
  });
};
