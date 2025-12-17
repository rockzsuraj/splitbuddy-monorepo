// authService.t
import apiClient from "../apiClient";

export async function updateProfile(values: { first_name: string; last_name: string; email: string; username: string; }) {
    const response = await apiClient.patch('/users/updateProfile', values);
    return response.data.data;
}