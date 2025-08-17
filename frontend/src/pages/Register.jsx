import React, { useContext, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Trophy, Users, Shield, Check } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const roleParam = params.get('role') || '';

  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: roleParam });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = async (e) => {
    e.preventDefault();
    if (!form.role) {
      setErrors({ role: 'Please select a role' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const res = await API.post('/auth/signup', form);
      login(res.data.token, res.data.user);
      if (res.data.user.role === 'organizer') navigate('/organizer');
      else navigate('/participant');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'organizer',
      title: 'Organizer',
      description: 'Create and manage tournaments',
      icon: Trophy,
      color: 'from-neutral-600 to-neutral-700',
      features: ['Create tournaments', 'Manage registrations', 'Track participants', 'Generate reports']
    },
    {
      id: 'participant',
      title: 'Participant',
      description: 'Join tournaments and compete',
      icon: Users,
      color: 'from-neutral-700 to-neutral-800',
      features: ['Browse tournaments', 'Register for events', 'Track your progress', 'Connect with others']
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Join Champo</h1>
          <p className="text-neutral-700">Create your account and start your journey</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Role Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Choose your role</h2>
            {roles.map((role) => (
              <div
                key={role.id}
                className={`card cursor-pointer transition-all duration-300 hover-lift ${
                  form.role === role.id 
                    ? 'ring-2 ring-neutral-700 bg-neutral-50' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => {
                  setForm({ ...form, role: role.id });
                  setErrors({ ...errors, role: null });
                }}
              >
                <div className="card-body">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <role.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-neutral-900">{role.title}</h3>
                        {form.role === role.id && (
                          <Check className="w-5 h-5 text-neutral-700" />
                        )}
                      </div>
                      <p className="text-neutral-700 text-sm mb-3">{role.description}</p>
                      <ul className="space-y-1">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-neutral-700">
                            <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {errors.role && (
              <p className="text-danger-600 text-sm mt-2">{errors.role}</p>
            )}
          </div>

          {/* Registration Form */}
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Create your account</h2>
            <div className="card">
              <div className="card-body">
                {errors.general && (
                  <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                    <p className="text-danger-700 text-sm">{errors.general}</p>
                  </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full name
                    </label>
                    <input 
                      required 
                      className="form-input" 
                      placeholder="Enter your full name" 
                      value={form.name} 
                      onChange={e => setForm({...form, name: e.target.value})} 
                    />
                  </div>

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
                        placeholder="Create a strong password" 
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
                    disabled={isLoading || !form.role}
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner"></div>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create account
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

                {/* Sign in link */}
                <div className="text-center">
                  <p className="text-neutral-700 text-sm">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-neutral-900 hover:text-neutral-700 font-medium transition-colors"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-neutral-500 text-sm">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-neutral-900 hover:text-neutral-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-neutral-900 hover:text-neutral-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
