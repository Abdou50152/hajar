export interface User {
  id?: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'> {
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
