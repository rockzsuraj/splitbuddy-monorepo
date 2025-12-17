import EncryptedStorage from 'react-native-encrypted-storage';

// Save sensitive token securely
export async function saveAuthToken(token: string) {
  await EncryptedStorage.setItem('auth_token', token);
}

// // Save sensitive token securely
// export async function saveAuthTokenExpireAt(tokenExpireAt: string) {
//   await EncryptedStorage.setItem('auth_token_expire_at', tokenExpireAt);
// }

// Retrieve sensitive token securely
export async function getAuthToken() {
  return await EncryptedStorage.getItem('auth_token');
}

// export async function getAuthTokenExpireAt() {
//   return await EncryptedStorage.getItem('auth_token_expire_at');
// }

// Save sensitive token securely
export async function saveAuthRefreshToken(token: string) {
  await EncryptedStorage.setItem('refresh_token', token);
}

//delete token 
export async function deleteAuthRefreshToken() {
  await EncryptedStorage.removeItem('refresh_token');
}

export async function deleteAuthToken() {
  await EncryptedStorage.removeItem('auth_token');
}

// export async function deleteAuthTokenExpireAt() {
//   await EncryptedStorage.removeItem('auth_token_expire_at');
// }

// Retrieve sensitive token securely
export async function getAuthRefreshToken() {
  return await EncryptedStorage.getItem('refresh_token');
}

// Save non-sensitive preference
export async function saveThemePreference(theme: string) {
  await EncryptedStorage.setItem('user_theme', theme);
}

// Get non-sensitive preference
export async function getThemePreference() {
  return await EncryptedStorage.getItem('user_theme');
}


// /src/storage/tokenStorage.ts

export async function getTokens() {
  const accessToken = await EncryptedStorage.getItem('auth_token');
  const refreshToken = await EncryptedStorage.getItem('refresh_token');
  return { accessToken, refreshToken };
}

export async function saveTokens(accessToken: string, refreshToken: string) {
  await EncryptedStorage.setItem('auth_token', accessToken);
  await EncryptedStorage.setItem('refresh_token', refreshToken);
}

export async function removeTokens() {
  await EncryptedStorage.removeItem('auth_token');
  await EncryptedStorage.removeItem('refresh_token');
  // await EncryptedStorage.removeItem('auth_token_expire_at');
}
