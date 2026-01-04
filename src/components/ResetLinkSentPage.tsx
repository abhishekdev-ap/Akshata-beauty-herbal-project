import React, { useState, useEffect } from 'react';
import { Mail, Clock, RefreshCw, ArrowLeft, CheckCircle } from 'lucide-react';
import AuthService from '../services/authService';

interface ResetLinkSentPageProps {
  email: string;
  onBack: () => void;
  onResendLink: () => void;
  isDarkMode?: boolean;
}

const ResetLinkSentPage: React.FC<ResetLinkSentPageProps> = ({
  email,
  onBack,
  onResendLink,
  isDarkMode = false
}) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const authService = AuthService.getInstance();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = async () => {
    setIsResending(true);
    setTimeLeft(60);
    setCanResend(false);

    try {
      const result = await authService.requestPasswordReset(email);
      if (result.success) {
        onResendLink();
      } else {
        alert(result.error || 'Failed to resend email. Please try again.');
      }
    } catch (error) {
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmailProviderUrl = (email: string): string => {
    const domain = email.split('@')[1]?.toLowerCase();
    switch (domain) {
      case 'gmail.com':
        return 'https://mail.google.com';
      case 'yahoo.com':
      case 'yahoo.co.in':
        return 'https://mail.yahoo.com';
      case 'outlook.com':
      case 'hotmail.com':
      case 'live.com':
        return 'https://outlook.live.com';
      default:
        return '#';
    }
  };

  // Development helper - show stored email data
  const showDevelopmentInfo = () => {
    const storedEmail = authService.getStoredResetEmail();
    if (storedEmail && storedEmail.to === email) {
      if (window.confirm(`Reset Link:\n${storedEmail.resetLink}\n\nClick OK to copy.`)) {
        navigator.clipboard.writeText(storedEmail.resetLink).catch(() => {
          console.log('Reset link:', storedEmail.resetLink);
        });
      }
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

          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2`}>
              Check Your Email
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              We sent a password reset link to
            </p>
            <p className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mt-1`}>
              {email}
            </p>
          </div>

          {/* Open Email Button */}
          <a
            href={getEmailProviderUrl(email)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 mb-4"
          >
            <Mail className="w-5 h-5" />
            <span>Open Email</span>
          </a>

          {/* Development Helper */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={showDevelopmentInfo}
              className="w-full bg-amber-500 text-white py-3 px-6 rounded-xl font-medium mb-4"
            >
              Dev: Show Reset Link
            </button>
          )}

          {/* Resend Section */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
              Didn't receive the email?
            </p>

            {!canResend ? (
              <div className={`flex items-center justify-center space-x-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <Clock className="w-4 h-4" />
                <span className="text-sm">Resend in {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-pink-600 hover:text-pink-700 font-medium flex items-center space-x-2 mx-auto disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend Email</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Simple Tip */}
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-center mt-4`}>
            Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetLinkSentPage;