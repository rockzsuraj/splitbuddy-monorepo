// authService.ts

import { RegisterUser } from "../../Form/RegisterUserForm";
import { removeTokens, saveTokens, } from "../../lib/storage";
import apiClient from "../apiClient";

export async function login(credentials: { email?: string; username?: string }, password: string) {
    const response = await apiClient.post('/auth/login', { ...credentials, password }, { skipAuthRefresh: true });
    const { token, refreshToken, user } = response.data.data;
    if (token && refreshToken && user) {
        await saveTokens(token, refreshToken);
        return { token, refreshToken, user };
    }
    throw new Error('Login failed');
}

export async function logoutUser() {
    await apiClient.post('/auth/logout', {}, { skipAuthRefresh: true });
    await removeTokens();
}

export async function getCurrentUser() {
    const response = await apiClient.get('/users/profile'); // example endpoint
    return response.data.data;
}

export async function refreshAccessToken(refreshToken: string) {
    const response = await apiClient.post(`/auth/refresh-token/${refreshToken}`, {}, { skipAuthRefresh: true });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    console.log('response ', response);

    await saveTokens(accessToken, newRefreshToken);
    return response;
}

export async function deleteUser() {
    await apiClient.delete('/auth/delete');
    await removeTokens();
}

export async function registerUser(user: RegisterUser) {
    const response = await apiClient.post('/auth/register', user, { skipAuthRefresh: true });
    return response.data.data;
}

export async function changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    const response = await apiClient.post('/auth/change-password', {
        password: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    });
    await removeTokens();
    return response.data;
}

export async function resetPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', {
        email
    });
    return response.data.data;
}

export async function uploadAvatar({ uri, fileName, type }: { uri?: string, fileName?: string, type?: string }) {
    const formData = new FormData();

    formData.append('avatar', {
        uri,
        name: fileName || 'avatar.jpg',
        type: type || 'image/jpeg',
    });

    const response = await apiClient.patch('/auth/me/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
}