import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { Mail, User, Lock, Shield, Award, BookOpen, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRoleLabel, formatDate } from '../lib/utils';

// 프로필 폼 데이터 인터페이스
interface ProfileFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// 계정 정보 컴포넌트
const AccountInfoCard: React.FC<{ user: any }> = ({ user }) => {
  const { isAdmin, isCreator, isSolver } = useAuth();

  const getRoleBadgeColor = () => {
    if (isAdmin) return 'bg-purple-100 text-purple-800';
    if (isCreator) return 'bg-blue-100 text-blue-800';
    if (isSolver) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = () => {
    if (isAdmin) return <Shield className="h-5 w-5 mr-2" />;
    if (isCreator) return <BookOpen className="h-5 w-5 mr-2" />;
    if (isSolver) return <Award className="h-5 w-5 mr-2" />;
    return <User className="h-5 w-5 mr-2" />;
  };

  return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">{user.username}</h3>
            <p className="text-gray-500">{user.email}</p>

            <div className="mt-4 w-full">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Joined</span>
                  </div>
                  <span className="text-sm font-medium">{formatDate(user.create_at)}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Admin</span>
                  </div>
                  <span>
                  {isAdmin ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Creator</span>
                  </div>
                  <span>
                  {isCreator ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">Solver</span>
                  </div>
                  <span>
                  {isSolver ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

// 계정 상세 정보 탭 컴포넌트
const AccountDetailsTab: React.FC<{
  user: any;
  errors: any;
  register: any;
}> = ({ user, errors, register }) => {
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
                {user.is_admin === 'Y' && " As an administrator, you have full access to manage the system."}
                {user.role === 'creator' && " As a creator, you can create and manage questions."}
                {user.role === 'solver' && " As a solver, you can take quizzes and track your progress."}
              </p>
            </div>
          </div>
        </div>
      </>
  );
};

// 보안 탭 컴포넌트
const SecurityTab: React.FC<{
  errors: any;
  register: any;
  password: string;
}> = ({ errors, register, password }) => {
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

// 메인 프로필 컴포넌트
const Profile: React.FC = () => {
  const { user, updateProfile, isAdmin, isCreator, isSolver } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'security'>('account');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...updateData } = data;

      // Only include non-empty fields
      const filteredData = Object.entries(updateData).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      if (Object.keys(filteredData).length === 0) {
        toast.error('No changes to update');
        return;
      }

      await updateProfile(filteredData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  const getRoleBadgeColor = () => {
    if (isAdmin) return 'bg-purple-100 text-purple-800';
    if (isCreator) return 'bg-blue-100 text-blue-800';
    if (isSolver) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = () => {
    if (isAdmin) return <Shield className="h-5 w-5 mr-2" />;
    if (isCreator) return <BookOpen className="h-5 w-5 mr-2" />;
    if (isSolver) return <Award className="h-5 w-5 mr-2" />;
    return <User className="h-5 w-5 mr-2" />;
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
            {getRoleIcon()}
            {getRoleLabel(user.role)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <AccountInfoCard user={user} />
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex space-x-4">
                  <button
                      className={`pb-4 px-1 ${
                          activeTab === 'account'
                              ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                              : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('account')}
                  >
                    Account Details
                  </button>
                  <button
                      className={`pb-4 px-1 ${
                          activeTab === 'security'
                              ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                              : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => setActiveTab('security')}
                  >
                    Security
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {activeTab === 'account' && (
                      <AccountDetailsTab
                          user={user}
                          errors={errors}
                          register={register}
                      />
                  )}

                  {activeTab === 'security' && (
                      <SecurityTab
                          errors={errors}
                          register={register}
                          password={password}
                      />
                  )}

                  <div className="flex justify-end">
                    <Button
                        type="submit"
                        isLoading={isLoading}
                    >
                      Update Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default Profile;