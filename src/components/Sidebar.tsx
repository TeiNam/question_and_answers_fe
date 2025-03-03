import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FolderOpen, 
  FileQuestion, 
  Award, 
  History, 
  Settings,
  Users,
  Zap,
  BookOpen,
  BarChart2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { user, isAdmin, isCreator } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard className="h-5 w-5" />,
      show: true,
    },
    {
      name: 'Categories',
      path: '/categories',
      icon: <FolderOpen className="h-5 w-5" />,
      show: true,
    },
    {
      name: 'Questions',
      path: '/questions',
      icon: <FileQuestion className="h-5 w-5" />,
      show: isAdmin || isCreator,
    },
    {
      name: 'My Quizzes',
      path: '/my-quizzes',
      icon: <Award className="h-5 w-5" />,
      show: true,
    },
    {
      name: 'Score History',
      path: '/scores',
      icon: <History className="h-5 w-5" />,
      show: true,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <Settings className="h-5 w-5" />,
      show: true,
    },
  ];

  const adminItems = [
    {
      name: 'Manage Users',
      path: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      show: user?.is_admin === 'Y',
    },
    {
      name: 'Manage Categories',
      path: '/admin/categories',
      icon: <FolderOpen className="h-5 w-5" />,
      show: user?.is_admin === 'Y',
    },
    {
      name: 'Manage Questions',
      path: '/admin/questions',
      icon: <FileQuestion className="h-5 w-5" />,
      show: user?.is_admin === 'Y',
    },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-10 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-lg w-64 pt-16`}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <div className="mb-6 px-4">
          <Link to="/" className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">QnA System</span>
          </Link>
        </div>
        
        <div className="px-4 mb-6">
          <Link to="/categories">
            <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Zap className="h-4 w-4 mr-2" />
              Start New Quiz
            </button>
          </Link>
        </div>
        
        <div className="space-y-1">
          {navItems
            .filter((item) => item.show)
            .map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors',
                  isActive(item.path) && 'bg-blue-50 text-blue-700 font-medium'
                )}
              >
                <div className={cn(
                  'mr-3',
                  isActive(item.path) ? 'text-blue-600' : 'text-gray-500'
                )}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
                {item.path === '/scores' && (
                  <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </Link>
            ))}
        </div>

        {user?.is_admin === 'Y' && (
          <>
            <div className="pt-4 mt-6 border-t border-gray-200">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </p>
            </div>
            <div className="mt-2 space-y-1">
              {adminItems
                .filter((item) => item.show)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center px-4 py-3 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors',
                      isActive(item.path) && 'bg-purple-50 text-purple-700 font-medium'
                    )}
                  >
                    <div className={cn(
                      'mr-3',
                      isActive(item.path) ? 'text-purple-600' : 'text-gray-500'
                    )}>
                      {item.icon}
                    </div>
                    <span>{item.name}</span>
                  </Link>
                ))}
            </div>
          </>
        )}
        
        <div className="pt-4 mt-6 border-t border-gray-200">
          <div className="px-4 py-3">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <BarChart2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Learning Stats</p>
                <p className="text-xs text-gray-500">View your progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;