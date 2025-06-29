import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '@/features/auth/authSlice';
import { handleError, handleSuccess } from '@/utils';

// Import 'react-toastify' styles if not already in your global CSS
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: '',
  });

  const { loading } = useSelector((state) => state.auth); // Destructure loading from auth state

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError('Name, email, and password are required');
    }

    // Dispatch the signupUser thunk and handle the promise
    dispatch(signupUser(signupInfo))
      .unwrap() // unwraps the fulfilled value or throws the rejected value
      .then((res) => {
        handleSuccess(res.message || 'Signup successful');
        setSignupInfo({ name: '', email: '', password: '' }); // Clear form on success
        setTimeout(() => navigate('/login'), 1500); // Redirect after a short delay
      })
      .catch((errMsg) => {
        handleError(errMsg || 'Signup failed. Please try again.'); // Catch and display error message
      });
  };

  return (
    // Main container: Applies the deep navy background in dark mode
    <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-[#000336] px-4 transition-colors duration-300">
      <form
        className="bg-white dark:bg-gray-900 border border-blue-100 dark:border-gray-700 shadow-md dark:shadow-lg dark:shadow-blue-950 rounded-xl p-8 w-full max-w-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center text-blue-800 dark:text-blue-300">
          Sign Up
        </h2>
        <p className="text-sm text-center text-blue-600 dark:text-gray-400">
          Create your account to get started
        </p>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-blue-800 dark:text-gray-200">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400 dark:text-gray-400">
              <User className="w-5 h-5" />
            </span>
            <input
              type="text"
              id="name"
              onChange={handleOnchange}
              name="name"
              value={signupInfo.name}
              placeholder=""
              autoFocus
              className="pl-10 pr-3 py-2 w-full border border-blue-200 rounded-lg
                         text-blue-900 dark:text-gray-100 text-sm
                         focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                         focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
          </div>
        </div>

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
              onChange={handleOnchange}
              name="email"
              value={signupInfo.email}
              placeholder=""
              className="pl-10 pr-3 py-2 w-full border border-blue-200 rounded-lg
                         text-blue-900 dark:text-gray-100 text-sm
                         focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                         focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
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
              onChange={handleOnchange}
              name="password"
              value={signupInfo.password}
              placeholder=" "
              className="pl-10 pr-10 py-2 w-full border border-blue-200 rounded-lg
                         text-blue-900 dark:text-gray-100 text-sm
                         focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500
                         focus:outline-none bg-white dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-400 dark:text-gray-400"
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
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200
                       dark:bg-blue-700 dark:hover:bg-blue-800
                       ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </div>

        {/* Login Link */}
        <p className="text-sm text-center cursor-pointer text-blue-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-800 dark:text-blue-400 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}