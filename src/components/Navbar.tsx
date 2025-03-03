import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, Menu, X, Bell, Search, ChevronDown, Shield } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  // Update username when user data changes
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                  type="button"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
                  onClick={toggleMenu}
              >
                <span className="sr-only">Open menu</span>
                {isMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
              <button
                  type="button"
                  className="hidden md:inline-flex p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  onClick={toggleSidebar}
              >
                <Menu className="block h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex-shrink-0 flex items-center ml-2">
                <Link to="/" className="flex items-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <span className="ml-2 text-xl font-bold text-gray-900">QnA System</span>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex md:items-center md:ml-6 space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search questions..."
                />
              </div>

              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div className="ml-3 relative">
                <div>
                  <button
                      type="button"
                      className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="user-menu-button"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {user?.is_admin === 'Y' ? (
                          <Shield className="h-5 w-5" />
                      ) : (
                          <User className="h-5 w-5" />
                      )}
                    </div>
                    <span className="ml-2 text-gray-700">{username}</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {isProfileOpen && (
                    <div
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="user-menu-button"
                    >
                      <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                      >
                        Your Profile
                      </Link>
                      {user?.is_admin === 'Y' && (
                          <Link
                              to="/admin/users"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              role="menuitem"
                              onClick={() => setIsProfileOpen(false)}
                          >
                            Admin Dashboard
                          </Link>
                      )}
                      <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                      >
                        Sign out
                      </button>
                    </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <div className="flex items-center space-x-3">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>
                <div className="relative">
                  <button
                      type="button"
                      className="flex items-center"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      {user?.is_admin === 'Y' ? (
                          <Shield className="h-5 w-5" />
                      ) : (
                          <User className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  {isProfileOpen && (
                      <div
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu"
                      >
                        <Link
                            to="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                        >
                          Your Profile
                        </Link>
                        {user?.is_admin === 'Y' && (
                            <Link
                                to="/admin/users"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsProfileOpen(false)}
                            >
                              Admin Dashboard
                            </Link>
                        )}
                        <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                        >
                          Sign out
                        </button>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <div className="relative mb-3 px-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search questions..."
                  />
                </div>

                <Link
                    to="/"
                    className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                    to="/categories"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                    to="/my-quizzes"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                >
                  My Quizzes
                </Link>
                <Link
                    to="/scores"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Score History
                </Link>
                <Link
                    to="/profile"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {user?.is_admin === 'Y' && (
                    <Link
                        to="/admin/users"
                        className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-purple-600 hover:bg-gray-50 hover:border-purple-300 hover:text-purple-800"
                        onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                )}
              </div>
            </div>
        )}
      </nav>
  );
};

export default Navbar;