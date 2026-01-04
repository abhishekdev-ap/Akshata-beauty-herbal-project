import { useState, useEffect, Suspense, lazy } from 'react';
import AuthService from './services/authService';
import { isAdmin } from './config/admin';
import { User, Appointment, Review } from './types';
import { mockReviews } from './data/mockReviews';

// Lazy load components
const LoginPage = lazy(() => import('./components/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./components/ForgotPasswordPage'));
const ResetLinkSentPage = lazy(() => import('./components/ResetLinkSentPage'));
const ResetPasswordPage = lazy(() => import('./components/ResetPasswordPage'));
const PasswordResetSuccessPage = lazy(() => import('./components/PasswordResetSuccessPage'));
const Header = lazy(() => import('./components/Header'));
const HomePage = lazy(() => import('./components/HomePage'));
const BookingPage = lazy(() => import('./components/BookingPage'));
const PaymentPage = lazy(() => import('./components/PaymentPage'));
const ReviewPage = lazy(() => import('./components/ReviewPage'));
const ThankYouPage = lazy(() => import('./components/ThankYouPage'));
const CustomerReviewsPage = lazy(() => import('./components/CustomerReviewsPage'));
const WriteReviewPage = lazy(() => import('./components/WriteReviewPage'));
const EditReviewPage = lazy(() => import('./components/EditReviewPage'));
const AccountSettingsPage = lazy(() => import('./components/AccountSettingsPage'));
const PaymentHistoryPage = lazy(() => import('./components/PaymentHistoryPage'));
const AdminDashboardPage = lazy(() => import('./components/AdminDashboardPage'));
const BusinessSettingsPage = lazy(() => import('./components/BusinessSettingsPage'));

type AppState =
  | 'login'
  | 'forgot-password'
  | 'reset-link-sent'
  | 'reset-password'
  | 'password-reset-success'
  | 'home'
  | 'booking'
  | 'payment'
  | 'review'
  | 'thankyou'
  | 'customer-reviews'
  | 'write-review'
  | 'edit-review'
  | 'account-settings'
  | 'payment-history'
  | 'admin-dashboard'
  | 'business-settings';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentAppointment, setCurrentAppointment] = useState<Appointment | null>(null);
  const [_userReviews, setUserReviews] = useState<Review[]>([]);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const authService = AuthService.getInstance();

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('akshata_dark_mode');
    if (savedDarkMode) {
      const darkMode = JSON.parse(savedDarkMode);
      setIsDarkMode(darkMode);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('akshata_dark_mode', JSON.stringify(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setCurrentState('home');
      }
      setIsLoading(false);
    };

    // Check for reset token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setCurrentState('reset-password');
      setIsLoading(false);
      return;
    }

    checkExistingSession();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentState('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentAppointment(null);
    setUserReviews([]);
    setEditingReview(null);
    setResetEmail('');
    setResetToken('');
    setCurrentState('login');
  };

  const handleForgotPassword = () => {
    setCurrentState('forgot-password');
  };

  const handleBackToLogin = () => {
    setResetEmail('');
    setResetToken('');
    setCurrentState('login');
  };

  const handleResetLinkSent = (email: string) => {
    setResetEmail(email);
    setCurrentState('reset-link-sent');
  };

  const handleResendResetLink = async () => {
    try {
      const result = await authService.requestPasswordReset(resetEmail);
      if (result.success) {
        console.log('Reset link resent successfully');
      } else {
        console.error('Failed to resend reset link:', result.error);
      }
    } catch (error) {
      console.error('Error resending reset link:', error);
    }
  };

  const handlePasswordReset = () => {
    setCurrentState('password-reset-success');
  };

  const handleBookingComplete = (appointment: Appointment) => {
    setCurrentAppointment(appointment);
    setCurrentState('payment');
  };

  const handlePaymentComplete = () => {
    setCurrentState('review');
  };

  const handleBackToBooking = () => {
    setCurrentAppointment(null);
    setCurrentState('booking');
  };

  const handleReviewSubmit = (review: Review) => {
    console.log('Review submitted:', review);
    mockReviews.push(review);
    setUserReviews(prev => [...prev, review]);
    setCurrentState('thankyou');
  };

  const handleBackToHome = () => {
    setCurrentAppointment(null);
    setCurrentState('home');
  };

  const handleGoToBooking = () => {
    setCurrentState('booking');
  };

  const handleViewReviews = () => {
    setCurrentState('customer-reviews');
  };

  const handleBackFromReviews = () => {
    setCurrentState('home');
  };

  const handleWriteReview = () => {
    setCurrentState('write-review');
  };

  const handleBackFromWriteReview = () => {
    setCurrentState('customer-reviews');
  };

  const handleManualReviewSubmit = (review: Review) => {
    console.log('Manual review submitted:', review);
    mockReviews.push(review);
    setUserReviews(prev => [...prev, review]);
  };

  const handleEditReview = (review: Review) => {
    setEditingReview(review);
    setCurrentState('edit-review');
  };

  const handleBackFromEditReview = () => {
    setEditingReview(null);
    setCurrentState('customer-reviews');
  };

  const handleReviewUpdate = (updatedReview: Review) => {
    console.log('Review updated:', updatedReview);

    const reviewIndex = mockReviews.findIndex(r => r.id === updatedReview.id);
    if (reviewIndex !== -1) {
      mockReviews[reviewIndex] = updatedReview;
    }

    setUserReviews(prev =>
      prev.map(r => r.id === updatedReview.id ? updatedReview : r)
    );

    setEditingReview(null);
  };

  const handleAccountSettings = () => {
    setCurrentState('account-settings');
  };

  const handleBackFromAccountSettings = () => {
    setCurrentState('home');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handlePaymentHistory = () => {
    setCurrentState('payment-history');
  };

  const handleBackFromPaymentHistory = () => {
    setCurrentState('home');
  };

  const handleAdminDashboard = () => {
    setCurrentState('admin-dashboard');
  };

  const handleBackFromAdminDashboard = () => {
    setCurrentState('home');
  };

  const handleBusinessSettings = () => {
    setCurrentState('business-settings');
  };

  const handleBackFromBusinessSettings = () => {
    setCurrentState('home');
  };

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
          <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>AKSHATA BEAUTY HERBAL PARLOUR</h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Loading your session...</p>
        </div>
      </div>
    );
  }

  const LoadingFallback = () => (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      {/* Password Recovery Flow */}
      {currentState === 'login' && (
        <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      )}

      {currentState === 'forgot-password' && (
        <ForgotPasswordPage onBack={handleBackToLogin} onResetSent={handleResetLinkSent} isDarkMode={isDarkMode} />
      )}

      {currentState === 'reset-link-sent' && (
        <ResetLinkSentPage
          email={resetEmail}
          onBack={handleBackToLogin}
          onResendLink={handleResendResetLink}
          isDarkMode={isDarkMode}
        />
      )}

      {currentState === 'reset-password' && (
        <ResetPasswordPage
          email={resetEmail}
          token={resetToken}
          onPasswordReset={handlePasswordReset}
          onBack={() => setCurrentState('reset-link-sent')}
          isDarkMode={isDarkMode}
        />
      )}

      {currentState === 'password-reset-success' && (
        <PasswordResetSuccessPage onBackToLogin={handleBackToLogin} isDarkMode={isDarkMode} />
      )}

      {/* Main App Flow */}
      {user && !['login', 'forgot-password', 'reset-link-sent', 'reset-password', 'password-reset-success'].includes(currentState) && (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {currentState !== 'home' && currentState !== 'customer-reviews' && currentState !== 'write-review' && currentState !== 'edit-review' && currentState !== 'account-settings' && currentState !== 'payment-history' && (
            <Header
              user={user}
              onLogout={handleLogout}
              onAccountSettings={handleAccountSettings}
              onPaymentHistory={handlePaymentHistory}
              onAdminDashboard={handleAdminDashboard}
              isUserAdmin={isAdmin(user.email)}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {currentState === 'home' && (
            <HomePage
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onBookNow={handleGoToBooking}
              onAdminDashboard={handleAdminDashboard}
              onLogout={handleLogout}
              isUserAdmin={isAdmin(user.email)}
            />
          )}

          {currentState === 'booking' && (
            <BookingPage
              onBookingComplete={handleBookingComplete}
              onViewReviews={handleViewReviews}
              onGoHome={handleBackToHome}
              userId={user.id}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {currentState === 'payment' && currentAppointment && (
            <PaymentPage
              appointment={currentAppointment}
              onPaymentComplete={handlePaymentComplete}
              onBack={handleBackToBooking}
              isDarkMode={isDarkMode}
            />
          )}

          {currentState === 'review' && currentAppointment && (
            <ReviewPage
              appointment={currentAppointment}
              onReviewSubmit={handleReviewSubmit}
              isDarkMode={isDarkMode}
            />
          )}

          {currentState === 'thankyou' && (
            <ThankYouPage onBackToHome={handleBackToHome} isDarkMode={isDarkMode} />
          )}

          {currentState === 'customer-reviews' && (
            <CustomerReviewsPage
              onBack={handleBackFromReviews}
              onWriteReview={handleWriteReview}
              onEditReview={handleEditReview}
              currentUserId={user?.id}
              isDarkMode={isDarkMode}
              isAdmin={user ? isAdmin(user.email) : false}
            />
          )}

          {currentState === 'write-review' && (
            <WriteReviewPage
              onBack={handleBackFromWriteReview}
              onReviewSubmit={handleManualReviewSubmit}
              userId={user?.id}
              isDarkMode={isDarkMode}
            />
          )}

          {currentState === 'edit-review' && editingReview && (
            <EditReviewPage
              review={editingReview}
              onBack={handleBackFromEditReview}
              onReviewUpdate={handleReviewUpdate}
              userId={user?.id}
              isDarkMode={isDarkMode}
            />
          )}

          {currentState === 'account-settings' && (
            <AccountSettingsPage
              user={user}
              onBack={handleBackFromAccountSettings}
              onUserUpdate={handleUserUpdate}
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
            />
          )}

          {currentState === 'payment-history' && (
            <PaymentHistoryPage
              user={user}
              onBack={handleBackFromPaymentHistory}
              isDarkMode={isDarkMode}
            />
          )}

          {currentState === 'admin-dashboard' && (
            <AdminDashboardPage
              onBack={handleBackFromAdminDashboard}
              onBusinessSettings={handleBusinessSettings}
              isDarkMode={isDarkMode}
            />
          )}

          {currentState === 'business-settings' && (
            <BusinessSettingsPage
              onBack={handleBackFromBusinessSettings}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      )}
    </Suspense>
  );
}

export default App;