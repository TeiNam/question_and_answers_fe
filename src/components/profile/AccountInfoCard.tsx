import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { User, Calendar, Shield, BookOpen, Award, CheckCircle, XCircle } from 'lucide-react';
import { formatDate, getRoleLabel } from '../../lib/utils';
import { User as UserType } from '../../models/user';

interface AccountInfoCardProps {
  user: UserType;
  isAdmin: boolean;
  isCreator: boolean;
  isSolver: boolean;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user, isAdmin, isCreator, isSolver }) => {
  const getRoleIcon = () => {
    if (isAdmin) return <Shield className="h-5 w-5 text-purple-600 mr-2" />;
    if (isCreator) return <BookOpen className="h-5 w-5 text-blue-600 mr-2" />;
    if (isSolver) return <Award className="h-5 w-5 text-green-600 mr-2" />;
    return <User className="h-5 w-5 text-gray-600 mr-2" />;
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
                    {getRoleIcon()}
                    <span className="text-sm text-gray-600">Role</span>
                  </div>
                  <span className="text-sm font-medium">
                  {isAdmin ? 'Administrator' : getRoleLabel(user.role)}
                    {isAdmin && user.is_admin !== 'Y' && ' (Custom)'}
                </span>
                </div>

                {user.is_admin === 'Y' && (
                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600 mr-2" />
                      <span className="text-sm text-purple-700">
                    You have administrator privileges
                  </span>
                    </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
};

export default AccountInfoCard;