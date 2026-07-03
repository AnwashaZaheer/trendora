import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, ChevronRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Find redirect path (e.g. from checkout or profile)
  const fromPath = location.state?.from?.pathname || '/';

  // Form states
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  // Inputs onChange
  const handleLoginChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleRegisterChange = (e) => {
    setRegisterData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  // Login Submit Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password) {
      setErrors({
        username: !loginData.username.trim() ? 'Username is required' : '',
        password: !loginData.password ? 'Password is required' : ''
      });
      return;
    }

    setLoading(true);
    try {
      await login(loginData.username, loginData.password);
      showToast('Logged in successfully! Welcome back.', 'success');
      navigate(fromPath, { replace: true });
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Register Submit Handler
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate inputs
    if (!registerData.username.trim()) newErrors.username = 'Username is required';
    if (!registerData.email.trim()) newErrors.email = 'Email is required';
    if (!registerData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!registerData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!registerData.password) newErrors.password = 'Password is required';
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await register(registerData);
      showToast('Account registered successfully! Please log in.', 'success');
      
      // Seed login username
      setLoginData({ username: registerData.username, password: '' });
      setActiveTab('login');
      setRegisterData({
        username: '',
        email: '',
        firstname: '',
        lastname: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950/20">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-lg text-left">
        
        {/* Logo and Greeting */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-brand-50 dark:bg-brand-950/40 p-3 rounded-2xl text-brand-600 dark:text-brand-400 mb-2">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Welcome to trendora
          </h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            {activeTab === 'login' ? 'Sign in to access your bag, profile and order history.' : 'Create an account to grab special deals and coupons.'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/50 pb-px mb-6">
          <button
            onClick={() => { setActiveTab('login'); setErrors({}); }}
            className={`w-1/2 text-sm font-bold pb-3.5 border-b-2 transition-all ${
              activeTab === 'login'
                ? 'text-brand-600 border-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrors({}); }}
            className={`w-1/2 text-sm font-bold pb-3.5 border-b-2 transition-all ${
              activeTab === 'register'
                ? 'text-brand-600 border-brand-600 dark:text-brand-400 dark:border-brand-400'
                : 'text-slate-400 border-transparent hover:text-slate-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form rendering */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <Input
              label="Username"
              id="login-username"
              name="username"
              placeholder="e.g. john_doe"
              value={loginData.username}
              onChange={handleLoginChange}
              error={errors.username}
              required
            />
            
            <div className="relative">
              <Input
                label="Password"
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={loginData.password}
                onChange={handleLoginChange}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[39px] text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Test credentials helper hint */}
            <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <p className="font-bold uppercase tracking-wider text-[10px] text-brand-600 dark:text-brand-400">Demo Logins</p>
              <div className="flex justify-between">
                <span>Username: <code className="px-1 bg-slate-200/50 rounded font-mono dark:bg-slate-800">john_doe</code></span>
                <span>Password: <code className="px-1 bg-slate-200/50 rounded font-mono dark:bg-slate-800">password123</code></span>
              </div>
              <div className="flex justify-between">
                <span>Username: <code className="px-1 bg-slate-200/50 rounded font-mono dark:bg-slate-800">johnd</code></span>
                <span>Password: <code className="px-1 bg-slate-200/50 rounded font-mono dark:bg-slate-800">m38rmF_</code></span>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 flex items-center justify-center gap-2"
            >
              Sign In <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                id="firstname"
                name="firstname"
                placeholder="John"
                value={registerData.firstname}
                onChange={handleRegisterChange}
                error={errors.firstname}
                required
              />
              <Input
                label="Last Name"
                id="lastname"
                name="lastname"
                placeholder="Doe"
                value={registerData.lastname}
                onChange={handleRegisterChange}
                error={errors.lastname}
                required
              />
            </div>
            
            <Input
              label="Username"
              id="register-username"
              name="username"
              placeholder="john_doe"
              value={registerData.username}
              onChange={handleRegisterChange}
              error={errors.username}
              required
            />
            
            <Input
              label="Email Address"
              id="register-email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={registerData.email}
              onChange={handleRegisterChange}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                id="register-password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={registerData.password}
                onChange={handleRegisterChange}
                error={errors.password}
                required
              />
              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 mt-2 flex items-center justify-center gap-2"
            >
              Register Account <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
