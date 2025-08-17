import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Trophy } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'organizer') navigate('/organizer');
      else navigate('/participant');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back</h1>
          <p className="text-neutral-700">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="card animate-scale-in">
          <div className="card-body">
            {errors.general && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <p className="text-danger-700 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email address
                </label>
                <input 
                  required 
                  type="email"
                  className="form-input" 
                  placeholder="Enter your email" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input 
                    required 
                    type={showPassword ? 'text' : 'password'}
                    className="form-input pr-12" 
                    placeholder="Enter your password" 
                    value={form.password} 
                    onChange={e => setForm({...form, password: e.target.value})} 
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full justify-center hover-scale"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-neutral-200"></div>
              <span className="px-4 text-sm text-neutral-500">or</span>
              <div className="flex-1 border-t border-neutral-200"></div>
            </div>

            {/* Sign up link */}
            <div className="text-center">
              <p className="text-neutral-700 text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-neutral-900 hover:text-neutral-700 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-neutral-500 text-sm">
            By signing in, you agree to our{' '}
            <a href="#" className="text-neutral-900 hover:text-neutral-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-neutral-900 hover:text-neutral-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
