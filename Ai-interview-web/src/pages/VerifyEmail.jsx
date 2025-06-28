import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '@/utils';
import { verifyEmail } from '../features/auth/authSlice';
import axios from 'axios';
function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (error) handleError(error);
    if (successMessage) handleSuccess(successMessage);
  }, [error, successMessage]);

 
const handleInitialSendOtp = async () => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/send-verify-otp',
      {}, // No body required, adjust if needed
      {
        withCredentials: true, // 🔑 Send cookies (like JWT from HTTP-only cookie)
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = response.data;

    if (data.success) {
      handleSuccess(data.message || 'OTP sent to your email.');
      setOtpSent(true);
    } else {
      handleError(data.message || 'Failed to send OTP.');
    }
  } catch (err) {
    console.error('Send OTP error:', err);
    handleError(err.response?.data?.message || 'Network error. Could not send OTP.');
  }
};

  const handleVerifyOtp = async () => {
    

    if (otp.length !== 6) {
      handleError('Please enter a complete 6-digit OTP.');
      return;
    }

    try {
      const result = await dispatch(verifyEmail({ otp }));

      if (verifyEmail.fulfilled.match(result)) {
        handleSuccess(result.payload.message || 'Email verified successfully!');
        navigate('/');
      } else {
        handleError(result.payload || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      handleError('Unexpected error during verification.');
    }
  };

  const handleResendOtp = async () => {
     

    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        handleSuccess(data.message || 'New OTP sent.');
        setOtp('');
      } else {
        handleError(data.message || 'Failed to resend OTP.');
      }
    } catch (err) {
      console.error('Resend error:', err);
      handleError('Could not resend OTP due to network error.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white border border-blue-100 shadow-md rounded-xl p-8 w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-blue-800">Verify Your Email</h2>
        <p className="text-sm text-blue-600">
          {otpSent
            ? 'A 6-digit OTP has been sent to your email address. Please enter it below.'
            : 'Click below to send an OTP to your registered email.'}
        </p>

        {!otpSent ? (
          <Button
            type="button"
            onClick={handleInitialSendOtp}
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="text-blue-500 " />
                  <InputOTPSlot index={1}className="text-blue-500 " />
                  <InputOTPSlot index={2} className="text-blue-500 " />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="text-blue-500 " />
                  <InputOTPSlot index={4} className="text-blue-500 " />
                  <InputOTPSlot index={5} className="text-blue-500 " />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <p className="text-sm text-blue-600">
              Didn’t receive the OTP?{' '}
              <Button
                variant="link"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-800 font-medium hover:underline p-0 h-auto"
              >
                Resend OTP
              </Button>
            </p>
          </>
        )}

        <p className="text-sm text-blue-600">
          <Link to="/login" className="text-blue-800 font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default VerifyEmail;
