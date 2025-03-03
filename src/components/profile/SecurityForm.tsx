import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../ui/Input';
import { Lock, AlertCircle } from 'lucide-react';

interface ProfileFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface SecurityFormProps {
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  password: string;
}

const SecurityForm: React.FC<SecurityFormProps> = ({ register, errors, password }) => {
  return (
    <div className="space-y-4">
      <Input
        id="password"
        type="password"
        label="New Password"
        placeholder="Enter new password (leave blank to keep current)"
        leftIcon={<Lock className="h-5 w-5" />}
        error={errors.password?.message}
        fullWidth
        {...register('password', {
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        })}
      />

      <Input
        id="confirmPassword"
        type="password"
        label="Confirm New Password"
        placeholder="Confirm new password"
        leftIcon={<Lock className="h-5 w-5" />}
        error={errors.confirmPassword?.message}
        fullWidth
        {...register('confirmPassword', {
          validate: (value) => 
            !password || value === password || 'Passwords do not match',
        })}
      />
      
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              For security reasons, you'll need to log in again after changing your password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityForm;