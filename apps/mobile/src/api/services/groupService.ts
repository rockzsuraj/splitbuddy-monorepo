import apiClient from "../apiClient";

export async function createGroup(groupName: string, groupDesc: string) {
    const response = await apiClient.post('/group',
        {
            group_name: groupName,
            description: groupDesc
        });
    return response.data.data;
}