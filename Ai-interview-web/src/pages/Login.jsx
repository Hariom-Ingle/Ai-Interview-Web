import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
// Ensure these utility functions `handleError` and `handleSuccess` are compatible with dark theme or theme-agnostic.
import { handleError, handleSuccess } from '@/utils';
import { NavLink, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/features/auth/authSlice';

// Import 'react-toastify' styles if not already in your global CSS
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get loading, error from auth slice and current theme from theme slice
  const { loading, error } = useSelector((state) => state.auth);
  const currentTheme = useSelector((state) => state.theme.theme); // Get current theme

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError('Email and password are required');
    }

    const result = await dispatch(loginUser(loginInfo));

    // Using .match(result) is more robust for checking thunk status
    if (loginUser.fulfilled.match(result)) {
      handleSuccess('Login successful, Welcome Back!');
      setTimeout(() => {
        navigate('/'); // Redirect after a short delay for toast to show
      }, 1000);
    } else {
      // Use the error from the result payload or the Redux state if the payload is generic
      handleError(result.payload || error || "Login failed. Please try again.");
    }
  };

 

  return (
    // Outer container: Overall background and default text color
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-950 px-4 transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="
          bg-white dark:bg-gray-800
          border border-blue-100 dark:border-gray-700
          shadow-md dark:shadow-lg dark:shadow-gray-700/50
          rounded-xl p-8 w-full max-w-md space-y-6
          transition-colors duration-300
        "
      >
        <h2 className="text-2xl font-semibold text-center text-blue-800 dark:text-blue-300">
          Login
        </h2>
        <p className="text-sm text-center text-blue-600 dark:text-gray-300">
          Access your account
        </p>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-blue-800 dark:text-gray-200">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 dark:text-gray-400">
              <Mail className="w-5 h-5" />
            </span>
            <input
              type="email"
              id="email"
              name="email"
              value={loginInfo.email}
              onChange={handleOnChange}
              placeholder="you@example.com"
              className="
                pl-10 pr-3 py-2 w-full
                border border-blue-200 dark:border-gray-700
                rounded-lg
                text-blue-900 dark:text-gray-100
                text-sm
                focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                focus:outline-none
                bg-white dark:bg-gray-700
                transition-colors duration-300
              "
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-blue-800 dark:text-gray-200">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 dark:text-gray-400">
              <Lock className="w-5 h-5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={loginInfo.password}
              onChange={handleOnChange}
              placeholder="••••••••"
              className="
                pl-10 pr-10 py-2 w-full
                border border-blue-200 dark:border-gray-700
                rounded-lg
                text-blue-900 dark:text-gray-100
                text-sm
                focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                focus:outline-none
                bg-white dark:bg-gray-700
                transition-colors duration-300
              "
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400 dark:text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <NavLink to="/reset-password" className="text-blue-600 dark:text-blue-400 font-normal text-sm hover:underline">
            Forgot password?
          </NavLink>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full bg-blue-600 dark:bg-blue-700
              hover:bg-blue-700 dark:hover:bg-blue-800
              text-white font-medium py-2 rounded-lg
              transition duration-200
              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Signup Link */}
        <p className="text-sm text-center text-blue-600 dark:text-gray-300">
          Don’t have an account?{' '}
          <Link to="/sign-up" className="text-blue-800 dark:text-blue-400 font-medium hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
      {/* ToastContainer now supports `theme` prop */}
      <ToastContainer position="bottom-right" theme={currentTheme} />
    </div>
  );
}