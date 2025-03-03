import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import Input from '../ui/Input';
import { Mail, User, AlertCircle } from 'lucide-react';
import { getRoleLabel } from '../../lib/utils';
import { User as UserType } from '../../models/user';

interface ProfileFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface AccountDetailsFormProps {
  user: UserType;
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  isAdmin: boolean;
  isCreator: boolean;
  isSolver: boolean;
}

const AccountDetailsForm: React.FC<AccountDetailsFormProps> = ({
  user,
  register,
  errors,
  isAdmin,
  isCreator,
  isSolver
}) => {
  return (
    <>
      <div className="space-y-4">
        <Input
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          fullWidth
          {...register('email', {
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
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Your account type is <strong>{getRoleLabel(user.role)}</strong>. 
              {isAdmin && " As an administrator, you have full access to manage the system."}
              {isCreator && " As a creator, you can create and manage questions."}
              {isSolver && " As a solver, you can take quizzes and track your progress."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDetailsForm;