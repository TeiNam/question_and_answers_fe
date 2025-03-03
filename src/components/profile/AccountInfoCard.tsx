import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { User, Calendar, Shield, BookOpen, Award, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { User as UserType } from '../../models/user';

interface AccountInfoCardProps {
  user: UserType;
  isCreator: boolean;
  isSolver: boolean;
}

const AccountInfoCard: React.FC<AccountInfoCardProps> = ({ user, isCreator, isSolver }) => {
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
                  {user.is_admin === 'Y' ? (
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

export default AccountInfoCard;