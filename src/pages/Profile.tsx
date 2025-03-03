import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { Mail, User, Lock, Shield, Award, BookOpen, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRoleLabel, formatDate } from '../lib/utils';
import AccountInfoCard from '../components/profile/AccountInfoCard';
import ProfileHeader from '../components/profile/ProfileHeader';
import AccountDetailsForm from '../components/profile/AccountDetailsForm';
import SecurityForm from '../components/profile/SecurityForm';

// 프로필 폼 데이터 인터페이스
interface ProfileFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

// 메인 프로필 컴포넌트
const Profile: React.FC = () => {
  const { user, updateProfile, isAdmin, isCreator, isSolver, refreshUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'security'>('account');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
      password: '',
      confirmPassword: '',
    },
  });

  // Update form values when user data changes
  React.useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        username: user.username || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

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
        setIsLoading(false);
        return;
      }

      await updateProfile(filteredData);

      // Immediately refresh user data to update UI
      if (!filteredData.password) {
        await refreshUserData();
      }

      toast.success('Profile updated successfully');

      // Reset password fields after successful update
      reset({
        email: data.email,
        username: data.username,
        password: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
      <div className="space-y-6">
        <ProfileHeader
            user={user}
            isAdmin={isAdmin}
            isCreator={isCreator}
            isSolver={isSolver}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <AccountInfoCard
                user={user}
                isCreator={isCreator}
                isSolver={isSolver}
            />
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
                      <AccountDetailsForm
                          user={user}
                          register={register}
                          errors={errors}
                          isAdmin={isAdmin}
                          isCreator={isCreator}
                          isSolver={isSolver}
                      />
                  )}

                  {activeTab === 'security' && (
                      <SecurityForm
                          register={register}
                          errors={errors}
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