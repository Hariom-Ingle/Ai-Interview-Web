import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { handleError, handleSuccess } from '@/utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { clearError, clearSuccessMessage, verifyEmail } from '../features/auth/authSlice'; // Import new actions

function VerifyEmail() {
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successMessage } = useSelector((state) => state.auth);

  // Consider if you need token from localStorage.
  // With HTTP-only cookies and Redux Persist for user info, you might not.
  // If the server checks auth via cookie, this might be redundant for API calls.
  // const token = localStorage.getItem('token'); 

  useEffect(() => {
    if (error) {
      handleError(error);
      dispatch(clearError()); // Clear the error after showing it
    }
    if (successMessage) {
      handleSuccess(successMessage);
      dispatch(clearSuccessMessage()); // Clear the success message after showing it
    }
  }, [error, successMessage, dispatch]); // Add dispatch to dependency array

  const handleInitialSendOtp = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/send-verify-otp',
        {},
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      if (data.success) {
        handleSuccess(data.message || 'OTP sent to your email.');
        // dispatch(setSuccessMessage(data.message || 'OTP sent to your email.')); // Optionally update state immediately
        setOtpSent(true);
      } else {
        handleError(data.message || 'Failed to send OTP.');
        dispatch(setError(data.message || 'Failed to send OTP.')); // Optionally update state immediately
      }
    } catch (err) {
      console.error('Send OTP error:', err);
      handleError(err.response?.data?.message || 'Network error. Could not send OTP.');
      dispatch(setError(err.response?.data?.message || 'Network error. Could not send OTP.')); // Optionally update state immediately
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      handleError('Please enter a complete 6-digit OTP.');
      // dispatch(setError('Please enter a complete 6-digit OTP.')); // Optionally update state immediately
      return;
    }

    try {
      const result = await dispatch(verifyEmail({ otp }));

      if (verifyEmail.fulfilled.match(result)) {
        // handleSuccess and navigate are already here,
        // the successMessage in state will be cleared by the useEffect
        handleSuccess(result.payload.message || 'Email verified successfully!');
        navigate('/');
      } else {
        // The error will be handled by the useEffect after state update
        handleError(result.payload || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Verification error:', err);
      handleError('Unexpected error during verification.');
      dispatch(setError('Unexpected error during verification.')); // Optionally update state immediately
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If you're using HTTP-only cookies, you might not need to send 'Authorization' header here.
          // The `withCredentials: true` in axios for send-verify-otp should handle session.
          // Re-evaluate if your backend truly needs this header or if the cookie is sufficient.
          // Authorization: `Bearer ${token}`, 
        },
        withCredentials: true, // Crucial for sending cookies with fetch
      });

      const data = await response.json();

      if (response.ok && data.success) {
        handleSuccess(data.message || 'New OTP sent.');
        dispatch(setSuccessMessage(data.message || 'New OTP sent.')); // Optionally update state immediately
        setOtp('');
      } else {
        handleError(data.message || 'Failed to resend OTP.');
        dispatch(setError(data.message || 'Failed to resend OTP.')); // Optionally update state immediately
      }
    } catch (err) {
      console.error('Resend error:', err);
      handleError('Could not resend OTP due to network error.');
      dispatch(setError('Could not resend OTP due to network error.')); // Optionally update state immediately
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4
                    dark:bg-[#000336]"> {/* Primary dark background */}
      <div className="bg-white border border-blue-100 shadow-md rounded-xl p-8 w-full max-w-md space-y-6 text-center
                      dark:bg-gray-800 dark:border-gray-700 dark:shadow-lg dark:shadow-blue-950"> {/* Card background and border */}
        <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-300">Verify Your Email</h2>
        <p className="text-sm text-blue-600 dark:text-gray-300">
          {otpSent
            ? 'A 6-digit OTP has been sent to your email address. Please enter it below.'
            : 'Click below to send an OTP to your registered email.'}
        </p>

        {!otpSent ? (
          <Button
            type="button"
            onClick={handleInitialSendOtp}
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                        dark:bg-blue-700 dark:hover:bg-blue-800`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                <InputOTPGroup>
                  <InputOTPSlot
                    index={0}
                    className="text-blue-500 dark:text-blue-300 dark:bg-gray-700 dark:border-gray-600 focus:dark:ring-blue-500"
                  />
                  <InputOTPSlot
                    index={1}
                    className="text-blue-500 dark:text-blue-300 dark:bg-gray-700 dark:border-gray-600 focus:dark:ring-blue-500"
                  />
                  <InputOTPSlot
                    index={2}
                    className="text-blue-500 dark:text-blue-300 dark:bg-gray-700 dark:border-gray-600 focus:dark:ring-blue-500"
                  />
                </InputOTPGroup>
                <InputOTPSeparator className="dark:text-gray-400" /> {/* Separator color */}
                <InputOTPGroup>
                  <InputOTPSlot
                    index={3}
                    className="text-blue-500 dark:text-blue-300 dark:bg-gray-700 dark:border-gray-600 focus:dark:ring-blue-500"
                  />
                  <InputOTPSlot
                    index={4}
                    className="text-blue-500 dark:text-blue-300 dark:bg-gray-700 dark:border-gray-600 focus:dark:ring-blue-500"
                  />
                  <InputOTPSlot
                    index={5}
                    className="text-blue-500 dark:text-blue-300 dark:bg-gray-700 dark:border-gray-600 focus:dark:ring-blue-500"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              type="button"
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200
                          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                          dark:bg-blue-700 dark:hover:bg-blue-800`}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <p className="text-sm text-blue-600 dark:text-gray-300">
              Didn’t receive the OTP?{' '}
              <Button
                variant="link"
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-800 font-medium hover:underline p-0 h-auto
                           dark:text-blue-300 dark:hover:text-blue-200"
              >
                Resend OTP
              </Button>
            </p>
          </>
        )}

        <p className="text-sm text-blue-600 dark:text-gray-300">
          <Link to="/login" className="text-blue-800 font-medium hover:underline dark:text-blue-300 dark:hover:text-blue-200">
            Back to Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default VerifyEmail;