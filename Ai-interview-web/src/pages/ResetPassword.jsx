import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Loader, Loader2 } from 'lucide-react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { handleError, handleSuccess } from '@/utils';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify'; // Include if not already globally
import 'react-toastify/dist/ReactToastify.css';
function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);


  const handleSendOtp = async () => {
    if (!email) return handleError('Please enter your email.');

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/send-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        handleSuccess(data.message || 'OTP sent successfully!');
        setStep(2);
      } else {
        handleError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      handleError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return handleError('Please enter a valid 6-digit OTP.');

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        handleSuccess('OTP Verified. Please reset your password.');
        setResetToken(data.token);
        setStep(3);
      } else {
        handleError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      handleError('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (password.length < 6) return handleError('Password must be at least 6 characters.');
    if (password !== confirm) return handleError('Passwords do not match.');

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        handleSuccess('Password reset successfully!');
        // Reset all fields
        setStep(1);
        setEmail('');
        setOtp('');
        setPassword('');
        setConfirm('');
        setResetToken('');
        setStep(3);
        setTimeout(() => {

          navigate('/sign-in')

        }, 1000)
      } else {
        handleError(data.message || 'Reset failed.');
      }
    } catch (error) {
      handleError('Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white border border-blue-100 shadow-md rounded-xl p-8 w-full max-w-md space-y-6 text-center">
        <h2 className="text-2xl font-semibold text-blue-800">Reset Password</h2>

        {step === 1 && (
          <>
            <p className="text-sm text-blue-600 mb-4">Enter your email to receive an OTP.</p>
            <Input

              className="text-blue-800 shadow-sm shadow-blue-800"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white"
            >
             {loading ?(  <span className="flex items-center">
            <Loader className="mr-2 h-4 w-4 animate-spin" /> {/* Spinning icon */}
            Sending...
        </span>): 'Send OTP'}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-sm text-blue-600 mb-4">Enter the OTP sent to your email <span className='text-blue-900 font-medium'>
              {email} </span></p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={(val) => setOtp(val)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="text-blue-800 shadow-sm shadow-blue-800" />
                  <InputOTPSlot index={1} className="text-blue-800 shadow-sm shadow-blue-800" />
                  <InputOTPSlot index={2} className="text-blue-800 shadow-sm shadow-blue-800" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="text-blue-800 shadow-sm shadow-blue-800" />
                  <InputOTPSlot index={4} className="text-blue-800 shadow-sm shadow-blue-800" />
                  <InputOTPSlot index={5} className="text-blue-800 shadow-sm shadow-blue-800" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyOtp}
              disabled={ otp.length !== 6}
              className="w-full bg-blue-600 text-white mt-4"
            >
              {loading ?(  <span className="flex items-center">
            <Loader className="mr-2 h-4 w-4 animate-spin" /> {/* Spinning icon */}
            Verifying...
        </span>): 'Verify OTP'}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="text-sm text-blue-600 mb-4">Enter your new password.</p>

            <div className="relative">
              <Input
                className="text-blue-800 shadow-sm shadow-blue-800 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative mt-4">
              <Input
                className="text-blue-800 shadow-sm shadow-blue-800 pr-10"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              onClick={handleResetPassword}
               
              className="w-full bg-blue-600 text-white mt-4"
            >
              {loading ? (  <span className="flex items-center">
            <Loader className="mr-2 h-4 w-4 animate-spin" /> {/* Spinning icon */}
            Resetting...
        </span>) : 'Reset Password'}
            </Button>
          </>
        )}

      </div>
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
