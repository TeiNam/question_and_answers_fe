import React from 'react';
import { Shield, BookOpen, Award, User } from 'lucide-react';
import { getRoleLabel } from '../../lib/utils';
import { User as UserType } from '../../models/user';

interface ProfileHeaderProps {
  user: UserType;
  isAdmin: boolean;
  isCreator: boolean;
  isSolver: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isAdmin, isCreator, isSolver }) => {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
          {getRoleIcon()}
          {isAdmin ? 'Administrator' : getRoleLabel(user.role)}
        </div>
      </div>
  );
};

export default ProfileHeader;