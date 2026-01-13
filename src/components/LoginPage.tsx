import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, X, Scissors } from 'lucide-react';
import AuthService from '../services/authService';
import AnimatedDarkModeToggle from './AnimatedDarkModeToggle';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onForgotPassword: () => void;
  onRegisterBusiness?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

// Declare google global for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onForgotPassword,
  onRegisterBusiness,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  // Demo credentials pre-filled for easy login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  const [name, setName] = useState('');

  const authService = AuthService.getInstance();



  useEffect(() => {
    const timer1 = setTimeout(() => setIsVisible(true), 100);
    const timer2 = setTimeout(() => setAnimateForm(true), 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Google Sign-In handler (Simulated with Password Check)
  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);

    try {
      // 1. Direct email prompt
      const googleEmail = prompt('Enter your Google email address:');
      if (!googleEmail) {
        setIsGoogleLoading(false);
        return;
      }

      if (!validateEmail(googleEmail)) {
        setError('Please enter a valid Google email address');
        setIsGoogleLoading(false);
        return;
      }

      // 2. Password prompt (Security Feature)
      const googlePassword = prompt('Enter your password to continue:');
      if (!googlePassword) {
        setIsGoogleLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));

      let result;
      // 3. Authenticate via Service
      if (isLoginMode) {
        result = await authService.login({ email: googleEmail, password: googlePassword });
      } else {
        // Format name from email if registering
        const formattedName = googleEmail
          .split('@')[0]
          .replace(/[^a-zA-Z0-9]/g, ' ')
          .split(' ')
          .filter((w: string) => w.length > 0)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ') || 'User';

        result = await authService.register({ email: googleEmail, password: googlePassword }, formattedName);
      }

      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        const errorMsg = result.error || (isLoginMode ? 'Login failed' : 'Registration failed');
        setError(errorMsg);

        // Auto-switch to Sign Up if user not found (Reuse smart logic)
        if (isLoginMode && errorMsg.includes('Sign Up first')) {
          setTimeout(() => {
            toggleMode();
          }, 1500);
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Failed to sign in. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!isLoginMode && !name) {
      setError('Please enter your full name');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      let result;
      if (isLoginMode) {
        result = await authService.login({ email, password });
      } else {
        result = await authService.register({ email, password }, name);
      }

      if (result.success && result.user) {
        onLogin(result.user);
      } else {
        const errorMsg = result.error || (isLoginMode ? 'Login failed' : 'Registration failed');
        setError(errorMsg);

        // Auto-switch to Sign Up if user not found
        if (isLoginMode && errorMsg.includes('Sign Up first')) {
          setTimeout(() => {
            toggleMode();
            // Keep email filled for them
            // setName(''); // Name will be empty, they need to fill it
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    // Clear Demo Credentials if switching to Register mode to avoid confusion
    if (isLoginMode) {
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${isDarkMode
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200'
      }`}>
      {/* Main Container with Split Layout */}
      <div className={`w-full max-w-6xl mx-auto rounded-[40px] overflow-hidden shadow-2xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${isDarkMode
          ? 'bg-gray-800 shadow-black/50'
          : 'bg-white shadow-gray-400/30'
        }`}
        style={{ minHeight: '85vh' }}
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Form */}
          <div className={`lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center relative ${isDarkMode
            ? 'bg-gradient-to-b from-gray-800 via-gray-800 to-amber-900/20'
            : 'bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-100'
            }`}>
            {/* Logo */}
            <div className={`mb-8 transition-all duration-700 delay-100 ${animateForm ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}>
              <div className={`inline-flex items-center justify-center px-6 py-3 rounded-full border-2 ${isDarkMode
                ? 'border-amber-400/30 bg-gray-700/50'
                : 'border-amber-300/50 bg-white/80'
                } shadow-lg backdrop-blur-sm`}>
                <Scissors className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <span className={`text-lg font-semibold tracking-wide ${isDarkMode ? 'text-amber-400' : 'text-amber-700'
                  }`}>AKSHATA</span>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            {onToggleDarkMode && (
              <div className="absolute top-6 right-6">
                <AnimatedDarkModeToggle
                  isDarkMode={isDarkMode}
                  onToggle={onToggleDarkMode}
                  size="sm"
                />
              </div>
            )}

            {/* Welcome Text */}
            <div className={`mb-8 transition-all duration-700 delay-200 ${animateForm ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}>
              <h1 className={`text-4xl lg:text-5xl font-bold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                {isLoginMode ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {isLoginMode ? 'Sign in to book your beauty appointment' : 'Create an account to get started'}
              </p>
            </div>

            {/* Authentication Mode Tabs */}
            <div className={`flex p-1 mb-8 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <button
                type="button"
                onClick={() => {
                  if (!isLoginMode) toggleMode();
                }}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${isLoginMode
                  ? isDarkMode
                    ? 'bg-amber-500 text-gray-900 shadow-lg'
                    : 'bg-white text-gray-900 shadow-md'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isLoginMode) toggleMode();
                }}
                className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${!isLoginMode
                  ? isDarkMode
                    ? 'bg-amber-500 text-gray-900 shadow-lg'
                    : 'bg-white text-gray-900 shadow-md'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${isDarkMode
                ? 'bg-red-900/30 border border-red-700/50 text-red-300'
                : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input - Only for Registration */}
              {!isLoginMode && (
                <div className={`transition-all duration-700 delay-300 ${animateForm ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                  }`}>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${isDarkMode
                      ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500'
                      }`}
                  />
                </div>
              )}

              {/* Email Input */}
              <div className={`transition-all duration-700 delay-400 ${animateForm ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${isDarkMode
                      ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500'
                      } ${email && validateEmail(email)
                        ? isDarkMode ? 'border-green-400' : 'border-green-500'
                        : ''
                      }`}
                    required
                  />
                  {email && validateEmail(email) && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className={`transition-all duration-700 delay-500 ${animateForm ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
                }`}>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full px-5 py-4 pr-14 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-0 ${isDarkMode
                      ? 'bg-gray-700/50 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-amber-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500'
                      }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all duration-200 hover:scale-110 ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email || !password || !validateEmail(email)}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${animateForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                  } ${isDarkMode
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-gray-900 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/25'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 hover:from-amber-500 hover:to-amber-600 shadow-lg shadow-amber-400/30'
                  }`}
                style={{ transitionDelay: '600ms' }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>{isLoginMode ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  isLoginMode ? 'Sign In' : 'Sign Up'
                )}
              </button>
            </form>

            {/* Demo Credentials Info - Only in Login Mode */}


            {/* Social Login */}
            <div className={`mt-6 transition-all duration-700 delay-700 ${animateForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
              <div className="flex items-center justify-center mb-4">
                <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                <span className={`px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>or continue with</span>
                <div className={`flex-1 h-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className={`flex items-center justify-center space-x-3 px-12 py-3 rounded-xl border-2 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode
                    ? 'border-gray-600 bg-gray-700/50 text-gray-200 hover:border-gray-500'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                    }`}>
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <span className="font-medium">{isGoogleLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>

            {/* Footer Links */}
            <div className={`mt-10 flex flex-col items-center justify-center space-y-4 text-sm transition-all duration-700 delay-800 ${animateForm ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>

              {/* Toggle Login/Register - Removed in favor of top tabs */}
              <div className="flex items-center space-x-2 opacity-0 pointer-events-none absolute">
                {/* Hidden but kept in DOM to avoid layout shifts if any style depends on it, actually cleaner to remove completely but I will just comment out the visible parts or render nothing */}
              </div>

              {isLoginMode && (
                <div className="flex w-full justify-between px-4">
                  <button
                    onClick={onForgotPassword}
                    className={`hover:underline transition-colors ${isDarkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'
                      }`}
                  >
                    Forgot Password?
                  </button>
                  <a href="#" className={`hover:underline transition-colors ${isDarkMode ? 'text-gray-400 hover:text-amber-400' : 'text-gray-600 hover:text-amber-600'
                    }`}>
                    Terms & Conditions
                  </a>
                </div>
              )}

              {/* Salon Owner Registration Link */}
              {onRegisterBusiness && (
                <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600 w-full text-center">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Own a salon?{' '}
                    <button
                      onClick={onRegisterBusiness}
                      className={`font-semibold hover:underline ${isDarkMode ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'}`}
                    >
                      Register Your Business →
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Image/Visual */}
          <div className="lg:w-1/2 relative overflow-hidden hidden lg:block">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974&auto=format&fit=crop')`,
              }}
            >
              <div className={`absolute inset-0 ${isDarkMode
                ? 'bg-gradient-to-br from-gray-900/60 via-purple-900/40 to-amber-900/40'
                : 'bg-gradient-to-br from-black/20 via-transparent to-amber-900/20'
                }`}></div>
            </div>

            {/* Close Button */}
            <button className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode
              ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700'
              : 'bg-white/80 text-gray-700 hover:bg-white'
              } backdrop-blur-sm shadow-lg`}>
              <X className="w-5 h-5" />
            </button>

            {/* Floating Cards/Info */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              {/* Top Card - Service Info */}
              <div className={`self-start transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
                }`}>
                <div className={`px-5 py-3 rounded-xl backdrop-blur-md shadow-xl ${isDarkMode
                  ? 'bg-amber-500/90 text-gray-900'
                  : 'bg-amber-400/90 text-gray-900'
                  }`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="font-semibold">Premium Beauty Services</span>
                  </div>
                  <p className="text-sm opacity-80 mt-1">Open: 09:00am - 10:00pm</p>
                </div>
              </div>

              {/* Bottom Section - Calendar Card */}
              <div className={`self-end transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                {/* Mini Calendar */}
                <div className={`p-4 rounded-2xl backdrop-blur-md shadow-xl mb-4 ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/90'
                  }`}>
                  <div className="flex items-center justify-between mb-3">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className={`text-xs font-medium px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    {[22, 23, 24, 25, 26, 27, 28].map((date) => (
                      <div
                        key={date}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all ${date === 25
                          ? isDarkMode
                            ? 'bg-amber-500 text-gray-900'
                            : 'bg-amber-400 text-gray-900'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Appointment Card */}
                <div className={`p-4 rounded-2xl backdrop-blur-md shadow-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/90'
                  }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        Your Appointment
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        12:00pm - 01:00pm
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-500'}`}></div>
                  </div>
                  <div className="flex items-center mt-3 -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-gray-800 bg-gradient-to-br from-pink-400 to-purple-400' : 'border-white bg-gradient-to-br from-pink-300 to-purple-300'
                          }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Profile Avatars */}
            <div className={`absolute top-1/3 right-8 transition-all duration-1000 delay-600 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              }`}>
              <div className="flex flex-col space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-full border-3 shadow-lg ${isDarkMode
                      ? 'border-gray-700 bg-gradient-to-br from-amber-400 to-orange-400'
                      : 'border-white bg-gradient-to-br from-pink-400 to-purple-400'
                      }`}
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;