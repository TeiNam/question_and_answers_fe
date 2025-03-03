export interface User {
  user_id: number;
  email: string;
  username: string;
  is_active: string;
  is_admin: string;
  role: string;
  create_at?: string;
  update_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  role?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface ProfileUpdateData {
  email?: string;
  username?: string;
  password?: string;
}