import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 text-blue-900 px-4">
      <AlertTriangle className="w-24 h-24 text-blue-600 mb-6" />
      <h1 className="text-4xl md:text-5xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg md:text-xl text-blue-700 mb-6 text-center max-w-lg">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm md:text-base hover:bg-blue-700 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}
