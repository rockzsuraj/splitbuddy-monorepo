export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  image_url: string
  role: string
  verified: boolean
  status: string
  last_login: string
  created_at: string
  updated_at: string
  refresh_token_expires_at: string
  token_signature: string
  google_id: any
}