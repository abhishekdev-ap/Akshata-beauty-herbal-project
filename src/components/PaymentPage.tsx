import React, { useState } from 'react';
import { CheckCircle, Phone, ArrowLeft, X, Calendar } from 'lucide-react';
import { Appointment } from '../types';
import SMSService from '../services/smsService';

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

  const smsService = SMSService.getInstance();

  const handlePayment = async () => {
    setIsProcessing(true);

    // Different processing times based on payment method
    const processingTime = paymentMethod === 'cash' ? 1000 : 2000;

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, processingTime));

      // Update appointment with payment details
      const updatedAppointment = {
        ...appointment,
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'paid',
        paymentId: paymentMethod !== 'cash' ? `PAY_${Date.now()}` : undefined,
        completedAt: new Date().toISOString()
      };

      // Send payment confirmation SMS to Akshata
      if (paymentMethod !== 'cash') {
        try {
          const userData = JSON.parse(localStorage.getItem('akshata_users') || '{}');
          const userEmail = Object.keys(userData)[0] || 'customer@example.com';
          const userName = userData[userEmail]?.name || 'Customer';



          const paymentNotificationMessage = `💰 PAYMENT RECEIVED - AKSHATA BEAUTY HERBAL PARLOUR

Customer: ${userName}
Email: ${userEmail}

💳 Payment Method: ${paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
💰 Amount: ₹${appointment.totalPrice.toLocaleString()}
📋 Booking ID: ${appointment.id}
🆔 Payment ID: ${updatedAppointment.paymentId}

📅 Appointment: ${appointment.date} at ${appointment.time}
💄 Services: ${appointment.services.map(s => s.name).join(', ')}

✅ Payment confirmed and appointment secured!

- AKSHATA BEAUTY HERBAL PARLOUR System`;

          await smsService.sendSMSWithFallback({
            to: smsService.getAkshataNumber(),
            message: paymentNotificationMessage
          });

          console.log('✅ Payment confirmation sent to Akshata');
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
      // If no onBack prop, redirect to booking page
      window.location.reload();
    }
  };



  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with Navigation */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Back to Booking Button */}
              <button
                onClick={onBack || (() => window.location.reload())}
                className="text-white/80 hover:text-white font-medium flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Booking</span>
              </button>

              {/* Book New Appointment Link */}
              <div className="text-white/60">|</div>
              <button
                onClick={onBack || (() => window.location.reload())}
                className="text-white/80 hover:text-white font-medium flex items-center space-x-2 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Book New Appointment</span>
              </button>
            </div>

            {/* Cancel Payment Button */}
            <button
              onClick={handleCancelPayment}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Cancel Payment</span>
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-2">Complete Payment</h2>
          <p className="opacity-90">Choose your preferred payment method</p>
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
            <div className="flex justify-between text-lg font-bold text-pink-600 pt-2 border-t">
              <span>Total Amount:</span>
              <span>₹{appointment.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* SMS Notification Info */}
        <div className="p-6 border-b border-gray-200 bg-blue-50">
          <div className="flex items-center space-x-2 mb-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Instant Payment Notification</span>
          </div>
          <p className="text-sm text-blue-600">
            📱 Akshata will be notified immediately at <strong>{smsService.getAkshataNumber()}</strong> when payment is completed
          </p>
          <p className="text-sm text-blue-600 mt-1">
            ✅ Your appointment will be automatically confirmed upon successful payment
          </p>
        </div>

        {/* Simple Payment Info */}
        <div className="p-6">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-pink-200">
            <div className="text-center">
              {/* Phone Icon */}
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Phone className="w-10 h-10 text-white" />
              </div>

              {/* Main Message */}
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Pay to this Number</h3>
              <p className="text-gray-600 mb-6">Send payment via UPI, PhonePe, or Google Pay</p>

              {/* Phone Number */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100 mb-6">
                <p className="text-sm text-gray-500 mb-2">Payment Number</p>
                <p className="text-3xl font-bold text-pink-600 tracking-wide">9740303404</p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <a
                    href="tel:9740303404"
                    className="bg-pink-100 text-pink-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('9740303404');
                      alert('Number copied to clipboard!');
                    }}
                    className="bg-purple-100 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                  >
                    📋 Copy Number
                  </button>
                </div>
              </div>

              {/* Payment Apps */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <span className="text-sm text-gray-500">Pay using:</span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">PhonePe</span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">GPay</span>
              </div>

              {/* Amount to Pay */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-600 mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-green-600">₹{appointment.totalPrice}</p>
              </div>

              {/* Instructions */}
              <div className="text-left bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p className="font-semibold text-gray-800 mb-2">📝 Instructions:</p>
                <ul className="space-y-1">
                  <li>1. Open any UPI app (PhonePe, GPay)</li>
                  <li>2. Send ₹{appointment.totalPrice} to 9740303404</li>
                  <li>3. Take a screenshot of payment confirmation</li>
                  <li>4. Click the button below to confirm</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Confirm Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full mt-6 py-4 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Confirming Payment & Notifying Akshata...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>I've Paid ₹{appointment.totalPrice} - Confirm Booking</span>
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Akshata will be notified immediately when you confirm
          </div>
        </div>
      </div>

      {/* Cancel Payment Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Cancel Payment?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this payment? You'll be redirected back to the booking page and will need to start over.
              </p>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Continue Payment
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
    </div>
  );
};

export default PaymentPage;