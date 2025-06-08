import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/auth/authSlice';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, token } = useSelector((state) => state.auth);

  console.log("Token",token)
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    dispatch(loginUser(loginInfo));
  };

  useEffect(() => {
    if (token) {
      handleSuccess('Login successful!');
      navigate('/dashboard'); // Or your desired route
    }
  }, [token, navigate]);

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-blue-100 shadow-md rounded-xl p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-800">Login</h2>
        <p className="text-sm text-center text-blue-600">Access your account</p>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-blue-800">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              value={loginInfo.email}
              onChange={handleOnChange}
              placeholder="you@example.com"
              className="pl-10 pr-3 py-2 w-full border border-blue-200 rounded-lg text-blue-900 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-blue-800">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
              <Lock className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={loginInfo.password}
              onChange={handleOnChange}
              placeholder="••••••••"
              className="pl-10 pr-10 py-2 w-full border border-blue-200 rounded-lg text-blue-900 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-sm text-center text-blue-600">
          Don’t have an account?{' '}
          <Link to="/sign-up" className="text-blue-800 font-medium hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}
