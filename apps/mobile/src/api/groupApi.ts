import { Group, GroupsRes } from "../../types/group";
import apiClient from "./apiClient";
import { SplitMode } from './hooks/useGroups';


const api = apiClient

export interface CreateGroupPayload {
  group_name: string;
  description?: string;
  group_icon?: string;
  split_mode?: SplitMode;
}

export interface AddMemberPayload {
  email: string; // depends on your validation schema
}
// ----- types -----

export type UpdateGroupPayload = Partial<CreateGroupPayload>;

export type AddExpensePayload = {
  amount: number;
  description: string;
  expense_date?: string; // yyyy-mm-dd
  paidBy?: string | number;
};

export type CreateSettlementPayload = {
  from_user_id: number;
  to_user_id: number;
  amount: number;
};

export type UpdateExpensePayload = Partial<{
  amount: number;
  description: string;
  expense_date: string;   // yyyy-mm-dd
  paidBy: string | number;
}>;


// ---- API calls mapping to your routes ----

// POST /groups
export const createGroupApi = async (data: CreateGroupPayload): Promise<Group> => {
  console.log('dta', data);

  const res = await api.post('/groups', data);
  return res.data;
};

// GET /groups/:groupID
export const getGroupByIdApi = async (
  groupID: number |string,
  mode: SplitMode = 'tricount'
): Promise<GroupsRes> => {
  const res = await api.get(`/groups/${groupID}`);
  return res.data;
};


// PATCH /groups/:groupID
export const updateGroupApi = async (
  groupID: number |string,
  data: Partial<Group>,
): Promise<Group> => {
  const res = await api.patch(`/groups/${groupID}`, data);
  return res.data;
};

// DELETE /groups/:groupID
export const deleteGroupApi = async (groupID: number |string): Promise<void> => {
  await api.delete(`/groups/${groupID}`);
};

// GET /groups/user/:userID
export const fetchGroupsForUserApi = async (userID: string): Promise<Group[]> => {
  const res = await api.get(`/groups/user/${userID}`);
  return res.data;
};

// POST /groups/:groupID/members
export const addMemberApi = async ({
  groupID,
  payload,
}: {
  groupID: number |string;
  payload: AddMemberPayload;
}): Promise<Group> => {
  const res = await api.post(`/groups/${groupID}/members`, payload);
  return res.data;
};

// DELETE /groups/:groupID/members/:userID
export const removeMemberApi = async (params: {
  groupID: number |string;
  userID: string;
}): Promise<Group> => {
  const { groupID, userID } = params;
  const res = await api.delete(`/groups/${groupID}/members/${userID}`);
  return res.data;
};

// ----- expense + settlement APIs -----
export async function fetchGroupBalancesApi(
  groupID: number |string | number,
  mode: SplitMode = 'tricount'
) {
  const { data } = await api.get(`/groups/${groupID}/balances`, {
    params: { mode }, // 🔹 ?mode=splitwise|tricount
  });
  return data; // { balances: [...] }
}


export async function addExpenseApi(groupID: number |string | number, payload: AddExpensePayload) {
  const { data } = await api.post(`/groups/${groupID}/expenses`, payload);
  return data; // { success, expense, sharePerUser, ... }
}

export async function createSettlementApi(
  groupID: number |string | number,
  payload: CreateSettlementPayload
) {
  const { data } = await api.post(`/groups/${groupID}/settlements`, payload);
  return data; // { success, settlement }
}

export async function updateExpenseApi(
  groupID: number | string | number,
  expenseID: number | string,
  payload: UpdateExpensePayload
) {
  const { data } = await api.patch(
    `/groups/${groupID}/expenses/${expenseID}`,
    payload
  );
  return data; // { success, expense }
}


// ---- DELETE EXPENSE ----
export async function deleteExpenseApi(
  groupID: number | string | number,
  expenseID: number | string
) {
  const { data } = await api.delete(
    `/groups/${groupID}/expenses/${expenseID}`
  );
  return data; // { success: true }
}