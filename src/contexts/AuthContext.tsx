import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, ProfileUpdateData } from '../models/user';
import { authService } from '../services/auth-service';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  isSolver: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set token in axios headers
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Function to fetch user data
  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of user data
  useEffect(() => {
    fetchUser();
  }, [token]);

  // Function to refresh user data
  const refreshUserData = async () => {
    if (!token) return;

    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setToken(response.access_token);
      setUser(response.user);
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      await authService.register(userData);
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success('You have been logged out');
  };

  const updateProfile = async (data: ProfileUpdateData) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);

      // If password was updated, force logout
      if (data.password) {
        setTimeout(() => {
          logout();
          toast.info('Please log in again with your new password');
        }, 1500);
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.is_admin === 'Y';
  const isCreator = user?.role === 'creator';
  const isSolver = user?.role === 'solver';

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            isAuthenticated,
            isAdmin,
            isCreator,
            isSolver,
            login,
            register,
            logout,
            updateProfile,
            refreshUserData,
          }}
      >
        {!loading && children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};