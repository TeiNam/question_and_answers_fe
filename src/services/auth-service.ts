import axios from 'axios';
import { api } from '../lib/api';
import { User, LoginCredentials, RegisterData, LoginResponse, ProfileUpdateData } from '../models/user';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  /**
   * Login user with email and password
   * @param credentials Login credentials
   * @returns Promise with login response
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      // Use axios directly to avoid interceptors for login
      const response = await axios.post<LoginResponse>(
        `${API_URL}/api/v1/auth/login`, 
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      return response.data;
    } catch (error: any) {
      // Handle specific error cases
      if (error.response && error.response.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response && error.response.data && error.response.data.detail) {
        throw new Error(error.response.data.detail);
      } else if (!navigator.onLine) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw new Error('Login failed. Please try again later.');
    }
  },

  /**
   * Register a new user
   * @param userData User registration data
   */
  register: async (userData: RegisterData): Promise<void> => {
    try {
      await api.post('/api/v1/auth/register', userData);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        if (error.response.data && error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            const firstError = error.response.data.detail[0];
            throw new Error(`${firstError.loc.join('.')}: ${firstError.msg}`);
          } else {
            throw new Error(error.response.data.detail);
          }
        }
        throw new Error('Invalid input. Please check your information.');
      } else if (error.response && error.response.status === 409) {
        throw new Error('Email already exists. Please use a different email address.');
      }
      
      throw error;
    }
  },

  /**
   * Get current user information
   * @returns Promise with user data
   */
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get('/api/v1/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   * @param data Profile update data
   * @returns Promise with updated user data
   */
  updateProfile: async (data: ProfileUpdateData): Promise<User> => {
    try {
      const response = await api.put('/api/v1/auth/me', data);
      return response.data;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },

  /**
   * Get all users (admin only)
   * @param role Optional role filter
   * @returns Promise with list of users
   */
  getUsers: async (role?: string): Promise<User[]> => {
    try {
      const response = await api.get('/api/v1/auth/users', { 
        params: { role } 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  /**
   * Update user role (admin only)
   * @param userId User ID
   * @param role New role
   */
  updateUserRole: async (userId: number, role: string): Promise<void> => {
    try {
      await api.put(`/api/v1/auth/users/${userId}/role`, { role });
    } catch (error) {
      console.error('Failed to update user role:', error);
      throw error;
    }
  },

  /**
   * Update user admin status (admin only)
   * @param userId User ID
   * @param isAdmin New admin status ('Y' or 'N')
   */
  updateUserAdmin: async (userId: number, isAdmin: string): Promise<void> => {
    try {
      await api.put(`/api/v1/auth/users/${userId}/admin`, { is_admin: isAdmin });
    } catch (error) {
      console.error('Failed to update admin status:', error);
      throw error;
    }
  },

  /**
   * Update user active status (admin only)
   * @param userId User ID
   * @param isActive New active status ('Y' or 'N')
   */
  updateUserActive: async (userId: number, isActive: string): Promise<void> => {
    try {
      await api.put(`/api/v1/auth/users/${userId}/active`, { is_active: isActive });
    } catch (error) {
      console.error('Failed to update user status:', error);
      throw error;
    }
  }
};