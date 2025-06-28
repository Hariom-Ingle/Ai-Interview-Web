// src/routes/AppRoutes.jsx

import { Route, Routes, Navigate } from "react-router-dom"; // Import Navigate
import React from 'react'; // Import React for the ProtectedRoute component
import { useSelector } from "react-redux"; // For accessing Redux state

// Import your page components
import About from '../pages/About';
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Feedback from "@/pages/Feedback";
import HomePage from "@/pages/HomePage";
import Howitwork from "@/pages/HowItwork";
import NotFound from "@/pages/NotFound";
import Practice from "@/pages/Practice";
import VerifyEmail from "@/pages/VerifyEmail";
import Header from "../components/common/Header";
import Upgrade from "../pages/Upgrade";
import ResetPassword from "@/pages/ResetPassword"; // Ensure this is imported
import InterviewerDashboard from "@/pages/InterviewMeeting/InterviewerDashboard";

// --- ProtectedRoute Component ---
// This component wraps routes that require authentication.
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

     
    if (!isAuthenticated) {
        
        return <Navigate to="/login" replace />;
    }

 
    return children;
};


function AppRoutes() {
    return (
        <>
            <Header /> {/* Show header on all pages */}
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/interbviewerdashboard" element={<InterviewerDashboard />} /> {/* Renamed from /sign-in for consistency */}
                <Route path="/login" element={<Login />} /> {/* Renamed from /sign-in for consistency */}
                <Route path="/register" element={<Signup />} /> {/* Renamed from /sign-up for clarity */}
                <Route path="/forgot-password" element={<ResetPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} /> {/* Route for token-based reset */}
                <Route path="/verify-email" element={<VerifyEmail />} /> {/* Route for email verification */}
                <Route path="/about" element={<About />} />
                <Route path="/upgrade" element={<Upgrade />} />
                <Route path="/howitwork" element={<Howitwork />} />


                {/* Protected Routes - Wrap with ProtectedRoute */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/practice/:interviewId"
                    element={
                        <ProtectedRoute>
                            <Practice />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/feedback/:interviewId"
                    element={
                        <ProtectedRoute>
                            <Feedback />
                        </ProtectedRoute>
                    }
                />
                {/* Add any other routes that should be protected here */}


                {/* Catch-all for Not Found pages */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default AppRoutes;