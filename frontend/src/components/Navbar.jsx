import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Trophy, User, LogOut, Menu, X, Crown, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const doLogout = () => {
    logout();
    nav('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-50 shadow-lg shadow-neutral-900/5">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between w-full">
          {/* Full Left Side - Logo and Title */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center gap-4 group relative">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <Trophy className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-700 bg-clip-text text-transparent group-hover:from-neutral-700 group-hover:to-neutral-900 transition-all duration-300">
                  Champo
                </span>
                <span className="text-sm text-neutral-500 font-medium -mt-1 group-hover:text-neutral-700 transition-colors duration-300">
                  Tournament Hub
                </span>
              </div>
            </Link>
          </div>

          {/* Full Right Side - All Buttons and User Actions */}
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link 
                  to="/register" 
                  className="relative px-8 py-3 text-neutral-700 font-medium rounded-xl border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300 hover:scale-105 hover:shadow-md group"
                >
                  <span className="relative z-10">Sign up</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <Link 
                  to="/login" 
                  className="relative px-8 py-3 text-white font-medium rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <span className="relative z-10">Log in</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            ) : (
              <>
                {/* User Profile Section */}
                <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200/50 shadow-sm">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {/* Role indicator */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-sm">
                      {user.role === 'organizer' ? (
                        <Crown className="w-3 h-3 text-white" />
                      ) : (
                        <Users className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-900">Hi, {user.name}</span>
                    <span className="text-xs text-neutral-500 capitalize">{user.role}</span>
                  </div>
                </div>
                
                {/* Navigation Links */}
                {user.role === 'organizer' ? (
                  <Link 
                    className="relative px-6 py-3 text-white font-medium rounded-xl bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group" 
                    to="/organizer"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Dashboard
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-700 to-secondary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                ) : (
                  <Link 
                    className="relative px-6 py-3 text-white font-medium rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group" 
                    to="/participant"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Tournaments
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                )}
                
                {/* Logout Button */}
                <button 
                  className="relative px-5 py-3 text-danger-600 font-medium rounded-xl border-2 border-danger-200 hover:border-danger-300 hover:bg-danger-50 transition-all duration-300 hover:scale-105 hover:shadow-md group" 
                  onClick={doLogout}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-danger-50 to-danger-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative p-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-all duration-300 hover:scale-105 group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-neutral-700 group-hover:text-neutral-900 transition-colors duration-300" />
                ) : (
                  <Menu className="w-6 h-6 text-neutral-700 group-hover:text-neutral-900 transition-colors duration-300" />
                )}
                {/* Ripple effect */}
                <div className="absolute inset-0 bg-neutral-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-neutral-200/50 animate-fade-in">
            <nav className="flex flex-col gap-3 pt-4">
              {!user ? (
                <>
                  <Link 
                    to="/register" 
                    className="relative px-6 py-3 text-neutral-700 font-medium rounded-xl border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all duration-300 hover:scale-105 hover:shadow-md group text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Sign up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-100 to-neutral-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="relative px-6 py-3 text-white font-medium rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 transition-all duration-300 hover:scale-105 hover:shadow-lg group text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Log in</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-neutral-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200/50 shadow-sm">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-full flex items-center justify-center shadow-md">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      {/* Role indicator */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-sm">
                        {user.role === 'organizer' ? (
                          <Crown className="w-3 h-3 text-white" />
                        ) : (
                          <Users className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-neutral-900">Hi, {user.name}</span>
                      <span className="text-xs text-neutral-500 capitalize">{user.role}</span>
                    </div>
                  </div>
                  
                  {user.role === 'organizer' ? (
                    <Link 
                      className="relative px-5 py-3 text-white font-medium rounded-xl bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group text-center" 
                      to="/organizer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="relative z-10 flex items-center gap-2 justify-center">
                        <Crown className="w-4 h-4" />
                        Dashboard
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary-700 to-secondary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ) : (
                    <Link 
                      className="relative px-5 py-3 text-white font-medium rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-300 hover:scale-105 hover:shadow-lg group text-center" 
                      to="/participant"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="relative z-10 flex items-center gap-2 justify-center">
                        <Trophy className="w-4 h-4" />
                        Tournaments
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  )}
                  
                  <button 
                    className="relative px-4 py-3 text-danger-600 font-medium rounded-xl border-2 border-danger-200 hover:border-danger-300 hover:bg-danger-50 transition-all duration-300 hover:scale-105 hover:shadow-md group text-center" 
                    onClick={() => {
                      doLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-danger-50 to-danger-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
