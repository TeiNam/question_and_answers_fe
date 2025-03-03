import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Shield, Edit, CheckCircle, XCircle, Search, Filter, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth-service';
import { User } from '../../models/user';
import toast from 'react-hot-toast';
import { formatDate, getRoleLabel } from '../../lib/utils';

const Users: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      toast.error('You do not have permission to access this page');
    }
  }, [isAdmin, navigate]);

  const fetchUsers = async (role?: string) => {
    setIsLoading(true);
    try {
      const data = await authService.getUsers(role !== 'all' ? role : undefined);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (roleFilter !== 'all') {
      fetchUsers(roleFilter);
    } else {
      fetchUsers();
    }
  }, [roleFilter]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        user => 
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleRoleChange = async (userId: number, role: string) => {
    setIsUpdating(true);
    try {
      await authService.updateUserRole(userId, role);
      toast.success(`User role updated to ${getRoleLabel(role)}`);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId ? { ...user, role } : user
        )
      );
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAdminToggle = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    setIsUpdating(true);
    try {
      await authService.updateUserAdmin(userId, newStatus);
      toast.success(`Admin status ${newStatus === 'Y' ? 'granted' : 'revoked'}`);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId ? { ...user, is_admin: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating admin status:', error);
      toast.error('Failed to update admin status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleActiveToggle = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Y' ? 'N' : 'Y';
    setIsUpdating(true);
    try {
      await authService.updateUserActive(userId, newStatus);
      toast.success(`User ${newStatus === 'Y' ? 'activated' : 'deactivated'}`);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId ? { ...user, is_active: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadgeColor = (role: string, isAdmin: string) => {
    if (isAdmin === 'Y') return 'bg-purple-100 text-purple-800';
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'creator':
        return 'bg-blue-100 text-blue-800';
      case 'solver':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button 
          variant="outline" 
          leftIcon={<RefreshCw className="h-4 w-4" />}
          onClick={() => fetchUsers(roleFilter !== 'all' ? roleFilter : undefined)}
        >
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Role
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="creator">Question Creators</option>
              <option value="solver">Question Solvers</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search Users
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by username or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingUser?.user_id === user.user_id ? (
                            <div className="flex items-center space-x-2">
                              <select
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                              >
                                <option value="admin">Administrator</option>
                                <option value="creator">Question Creator</option>
                                <option value="solver">Question Solver</option>
                              </select>
                              <Button 
                                size="sm" 
                                variant="success"
                                isLoading={isUpdating}
                                onClick={() => handleRoleChange(user.user_id, newRole)}
                              >
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role, user.is_admin)}`}>
                              {getRoleLabel(user.role)}
                              {user.is_admin === 'Y' && (
                                <Shield className="ml-1 h-3 w-3" />
                              )}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleAdminToggle(user.user_id, user.is_admin)}
                            className="focus:outline-none"
                            disabled={isUpdating}
                          >
                            {user.is_admin === 'Y' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleActiveToggle(user.user_id, user.is_active)}
                            className="focus:outline-none"
                            disabled={isUpdating}
                          >
                            {user.is_active === 'Y' ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.create_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            className="text-blue-600 hover:text-blue-900 focus:outline-none"
                            onClick={() => {
                              setEditingUser(user);
                              setNewRole(user.role);
                            }}
                            disabled={isUpdating}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;