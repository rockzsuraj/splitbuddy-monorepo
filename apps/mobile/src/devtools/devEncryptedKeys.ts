export const DEV_ENCRYPTED_KEYS = [
  {
    key: 'auth_token',
    label: 'Access Token',
    sensitive: true,
  },
  {
    key: 'refresh_token',
    label: 'Refresh Token',
    sensitive: true,
  },
  {
    key: 'user_theme',
    label: 'Theme',
    sensitive: false,
  },
] as const;