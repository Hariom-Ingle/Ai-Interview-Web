import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-blue-900 px-4
                dark:bg-[#000336] dark:text-blue-200 transition-colors duration-300"> {/* Apply dark mode classes */}
      <AlertTriangle className="w-24 h-24 text-blue-600 dark:text-blue-400 mb-6" /> {/* Apply dark mode icon color */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-blue-300">404 - Page Not Found</h1> {/* Apply dark mode heading color */}
      <p className="text-lg md:text-xl text-blue-700 dark:text-gray-400 mb-6 text-center max-w-lg"> {/* Apply dark mode paragraph color */}
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm md:text-base hover:bg-blue-700 transition
                   dark:bg-blue-700 dark:hover:bg-blue-800" // Apply dark mode button colors
      >
        Go to Home
      </Link>
    </div>
  );
}