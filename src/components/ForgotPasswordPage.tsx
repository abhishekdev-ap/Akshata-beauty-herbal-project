import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Key, Copy } from 'lucide-react';
import AuthService from '../services/authService';

interface ForgotPasswordPageProps {
  onBack: () => void;
  onResetSent: (email: string) => void;
  isDarkMode?: boolean;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onBack,
  onResetSent,
  isDarkMode = false
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [copied, setCopied] = useState(false);

  const authService = AuthService.getInstance();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResetLink('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.requestPasswordReset(email);

      if (result.success) {
        // Get the stored reset link
        const storedEmail = authService.getStoredResetEmail();
        if (storedEmail && storedEmail.resetLink) {
          setResetLink(storedEmail.resetLink);
        }
      } else {
        setError(result.error || 'Failed to generate reset link. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(resetLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleOpenLink = () => {
    // Extract the token from the reset link and navigate
    const tokenMatch = resetLink.match(/token=([^&]+)/);
    if (tokenMatch) {
      window.location.href = resetLink;
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'} flex items-center justify-center p-4`}>
      <div className="max-w-md w-full">
        <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} rounded-3xl shadow-2xl p-8 border`}>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="mb-6 text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
              Reset Password
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter your email to get a reset link
            </p>
          </div>

          {/* Reset Link Generated */}
          {resetLink && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2 text-green-700 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Reset Link Generated!</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Click the button below to reset your password:
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleOpenLink}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  Reset Password Now
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                  title="Copy Link"
                >
                  {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form - Only show if no reset link generated */}
          {!resetLink && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent ${isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    required
                    disabled={isLoading}
                  />
                  {email && validateEmail(email) && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email || !validateEmail(email)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Get Reset Link</span>
                )}
              </button>
            </form>
          )}

          {/* Try again button - Only show after reset link generated */}
          {resetLink && (
            <button
              onClick={() => {
                setResetLink('');
                setEmail('');
              }}
              className={`w-full mt-4 py-3 px-6 rounded-xl font-medium ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all`}
            >
              Use Different Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;