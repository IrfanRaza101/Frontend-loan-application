import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/ReduxAuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Info, 
  Phone, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  User,
  Shield,
  CreditCard
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/about', label: 'About', icon: Info },
    { path: '/apply', label: 'Apply', icon: FileText },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Irfan Loans
              </span>
              <div className="text-xs text-muted-foreground -mt-1">
                Your Financial Partner
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/5 ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10 shadow-sm'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/5 ${
                    isActive('/dashboard')
                      ? 'text-primary bg-primary/10 shadow-sm'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Admin Panel Link - Only for Admins */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-red-50 ${
                      isActive('/admin')
                        ? 'text-red-600 bg-red-100 shadow-sm'
                        : 'text-red-500 hover:text-red-600'
                    }`}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Panel</span>
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                      Admin
                    </Badge>
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-gray-900">
                        {user?.name || user?.firstName || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive('/dashboard')
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive('/admin')
                          ? 'text-red-600 bg-red-100'
                          : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <Shield className="h-5 w-5" />
                      <span>Admin Panel</span>
                      <Badge variant="destructive" className="text-xs">
                        Admin
                      </Badge>
                    </Link>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-base font-medium text-gray-900">
                          {user?.name || user?.firstName || 'User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 w-full transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    Admin Login
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary rounded-lg transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;