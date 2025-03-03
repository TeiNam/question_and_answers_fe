import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: 'solver',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Set a user-friendly error message
      if (error.response && error.response.status === 422) {
        if (error.response.data && error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            const firstError = error.response.data.detail[0];
            setError(`${firstError.loc.join('.')}: ${firstError.msg}`);
          } else {
            setError(error.response.data.detail);
          }
        } else {
          setError('Invalid input. Please check your information.');
        }
      } else if (error.response && error.response.status === 409) {
        setError('Email already exists. Please use a different email address.');
      } else if (!navigator.onLine) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Registration failed. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          id="username"
          type="text"
          label="Username"
          placeholder="Choose a username"
          leftIcon={<User className="h-5 w-5" />}
          error={errors.username?.message}
          fullWidth
          {...register('username', {
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username must be at least 3 characters',
            },
            maxLength: {
              value: 20,
              message: 'Username must be at most 20 characters',
            },
          })}
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.password?.message}
          fullWidth
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          leftIcon={<Lock className="h-5 w-5" />}
          error={errors.confirmPassword?.message}
          fullWidth
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            {...register('role')}
          >
            <option value="solver">Question Solver</option>
            <option value="creator">Question Creator</option>
          </select>
        </div>

        <div>
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;