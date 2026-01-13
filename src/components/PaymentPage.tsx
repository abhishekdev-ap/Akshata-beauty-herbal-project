import React, { useState } from 'react';
import { CheckCircle, Phone, ArrowLeft, X, Calendar, Smartphone } from 'lucide-react';
import { Appointment } from '../types';
import SMSService from '../services/smsService';
import UPIPaymentService from '../services/upiPaymentService';
import BusinessStore from '../services/businessStore';

interface PaymentPageProps {
  appointment: Appointment;
  onPaymentComplete: () => void;
  onBack?: () => void;
  isDarkMode?: boolean;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ appointment, onPaymentComplete, onBack }) => {
  const [paymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const smsService = SMSService.getInstance();
  const upiService = UPIPaymentService.getInstance();
  const businessStore = BusinessStore.getInstance();
  const settings = businessStore.getSettings();

  // Get UPI ID from settings or use phone number
  const upiId = settings.upiId || '9740303404@ybl';
  const paymentPhone = settings.contactNumber?.replace('+91', '') || '9740303404';

  // Handle GPay payment
  const handleGPayPayment = async () => {
    setPaymentInitiated(true);

    const paymentOptions = {
      amount: appointment.totalPrice,
      orderId: `ORDER_${appointment.id}`,
      customerName: 'Customer',
      note: `Payment for ${appointment.services.map(s => s.name).join(', ')}`
    };

    // Generate GPay URL and open
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(settings.parlorName)}&am=${appointment.totalPrice}&cu=INR&tn=${encodeURIComponent(paymentOptions.note)}`;

    // Try to open GPay
    window.location.href = upiUrl;
  };

  // Handle PhonePe payment
  const handlePhonePePayment = async () => {
    setPaymentInitiated(true);

    const note = `Payment for ${appointment.services.map(s => s.name).join(', ')}`;

    // PhonePe specific URL
    const phonePeUrl = `phonepe://pay?pa=${upiId}&pn=${encodeURIComponent(settings.parlorName)}&am=${appointment.totalPrice}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Also try generic UPI as fallback
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(settings.parlorName)}&am=${appointment.totalPrice}&cu=INR&tn=${encodeURIComponent(note)}`;

    // Try PhonePe first, then fallback to generic UPI
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = phonePeUrl;
    document.body.appendChild(iframe);

    setTimeout(() => {
      window.location.href = upiUrl;
      document.body.removeChild(iframe);
    }, 500);
  };

  // Handle any UPI payment
  const handleUPIPayment = async () => {
    setPaymentInitiated(true);

    const note = `Payment for ${appointment.services.map(s => s.name).join(', ')}`;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(settings.parlorName)}&am=${appointment.totalPrice}&cu=INR&tn=${encodeURIComponent(note)}`;

    window.location.href = upiUrl;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    const processingTime = paymentMethod === 'cash' ? 1000 : 2000;

    try {
      await new Promise(resolve => setTimeout(resolve, processingTime));

      const updatedAppointment = {
        ...appointment,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        paymentId: paymentMethod !== 'cash' ? `PAY_${Date.now()}` : undefined,
        completedAt: new Date().toISOString()
      };

      if (paymentMethod !== 'cash') {
        try {
          const userData = JSON.parse(localStorage.getItem('akshata_users') || '{}');
          const userEmail = Object.keys(userData)[0] || 'customer@example.com';
          const userName = userData[userEmail]?.name || 'Customer';

          const paymentNotificationMessage = `💰 PAYMENT RECEIVED - ${settings.parlorName}

Customer: ${userName}
Email: ${userEmail}

💳 Payment Method: UPI Payment (GPay/PhonePe)
💰 Amount: ₹${appointment.totalPrice.toLocaleString()}
📋 Booking ID: ${appointment.id}
🆔 Payment ID: ${updatedAppointment.paymentId}

📅 Appointment: ${appointment.date} at ${appointment.time}
💄 Services: ${appointment.services.map(s => s.name).join(', ')}

✅ Payment confirmed and appointment secured!

- ${settings.parlorName} System`;

          await smsService.sendSMSWithFallback({
            to: smsService.getAkshataNumber(),
            message: paymentNotificationMessage
          });

          console.log('✅ Payment confirmation sent');
        } catch (smsError) {
          console.error('❌ Failed to send payment confirmation SMS:', smsError);
        }
      }

      setIsProcessing(false);
      onPaymentComplete();
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      alert('Payment processing failed. Please try again.');
    }
  };

  const handleCancelPayment = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelPayment = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 sm:p-6 text-white">
          {/* Mobile: Stack buttons, Desktop: Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4">
              <button
                onClick={onBack || (() => window.location.reload())}
                className="text-white/90 hover:text-white font-medium flex items-center space-x-1 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <div className="text-white/40 hidden sm:block">|</div>
              <button
                onClick={onBack || (() => window.location.reload())}
                className="text-white/90 hover:text-white font-medium flex items-center space-x-1 transition-colors text-sm"
              >
                <Calendar className="w-4 h-4" />
                <span>New Booking</span>
              </button>
              {/* Cancel button - visible on mobile in same row */}
              <button
                onClick={handleCancelPayment}
                className="sm:hidden bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Cancel</span>
              </button>
            </div>
            {/* Cancel button - desktop only */}
            <button
              onClick={handleCancelPayment}
              className="hidden sm:flex bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mb-1">💳 Pay with GPay / PhonePe</h2>
          <p className="opacity-90 text-sm sm:text-base">Secure UPI Payment</p>
        </div>

        {/* Appointment Summary */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time:</span>
              <span className="font-medium">{appointment.date} at {appointment.time}</span>
            </div>
            <div className="space-y-2">
              <span className="text-gray-600">Services:</span>
              {appointment.services.map((service, index) => (
                <div key={index} className="flex justify-between ml-4">
                  <span className="text-sm">{service.name}</span>
                  <span className="text-sm font-medium">₹{service.price}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xl font-bold text-pink-600 pt-2 border-t">
              <span>Total Amount:</span>
              <span>₹{appointment.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* UPI Payment Buttons */}
        <div className="p-6">
          <div className="text-center mb-6">
            <Smartphone className="w-12 h-12 text-pink-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Choose Payment App</h3>
            <p className="text-sm text-gray-500">Tap to open your payment app directly</p>
          </div>

          {/* GPay Button */}
          <button
            onClick={handleGPayPayment}
            className="w-full mb-4 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 bg-white border-2 border-gray-200 text-gray-800 hover:border-blue-400 hover:bg-blue-50 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            {/* Google Pay Logo - Official Colors */}
            <svg className="w-10 h-10" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span className="text-lg font-medium">Pay ₹{appointment.totalPrice} with GPay</span>
          </button>

          {/* PhonePe Button */}
          <button
            onClick={handlePhonePePayment}
            className="w-full mb-4 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 bg-[#5f259f] text-white hover:bg-[#4a1d7a] shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {/* PhonePe Logo - Clean Circle with Icon */}
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#5f259f">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#5f259f">पे</text>
              </svg>
            </div>
            <span className="text-lg font-medium">Pay ₹{appointment.totalPrice} with PhonePe</span>
          </button>

          {/* Any UPI App Button - Coming Soon */}
          <button
            onClick={() => setShowComingSoon(true)}
            className="w-full mb-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 border-2 border-gray-300 text-gray-500 hover:border-gray-400 cursor-pointer"
          >
            <span>Pay with Any UPI App</span>
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Soon</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or pay manually</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Manual Payment Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Send payment to UPI ID:</p>
            <p className="text-lg font-bold text-gray-800 mb-2">{upiId}</p>
            <p className="text-sm text-gray-500">or Phone: {paymentPhone}</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(upiId);
                alert('UPI ID copied!');
              }}
              className="mt-2 text-sm text-pink-600 font-medium hover:underline"
            >
              📋 Copy UPI ID
            </button>
          </div>

          {/* Confirm Payment Button */}
          {paymentInitiated && (
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Confirming Payment...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>I've Completed Payment - Confirm Booking</span>
                </>
              )}
            </button>
          )}

          {!paymentInitiated && (
            <p className="text-center text-sm text-gray-500">
              Click a payment button above to start payment
            </p>
          )}

          {/* Security Notice */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 inline mr-1 text-green-500" />
            Secure UPI Payment • Bank Verified
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cancel Payment?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={confirmCancelPayment}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Modal */}
      {showComingSoon && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Coming Soon!</h3>
            <p className="text-gray-600 mb-6">
              This feature will be available soon. For now, please use GPay or PhonePe to make payments.
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;