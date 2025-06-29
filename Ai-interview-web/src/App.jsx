// src/App.js

import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Approuts"; // Your routes definition
import { useDispatch, useSelector } from "react-redux";
import { getUserProfile, setInitialAuthCheckComplete } from "./features/auth/authSlice"; // Import the thunk and action
import { ToastContainer } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Styles for react-toastify

 
function App() {
    const dispatch = useDispatch();
    const { initialAuthCheckComplete, loading } = useSelector((state) => state.auth);
    const currentTheme = useSelector((state) => state.theme.theme);

    useEffect(() => {
        // This effect runs only once when the App component mounts
        // to initiate the authentication check.
        if (initialAuthCheckComplete) {
            dispatch(getUserProfile()); // Attempt to fetch user profile
            // The `setInitialAuthCheckComplete` action is dispatched by the thunk
            // in its fulfilled/rejected states to mark the check as done.
        }
    }, [dispatch, initialAuthCheckComplete]); // Dependencies for the effect


     useEffect(() => {
    // Apply the theme class to the HTML element when the component mounts or theme changes
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);
    // Render a loading state until the initial authentication check is complete
    // if (!initialAuthCheckComplete || loading) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen bg-blue-50 text-blue-700 text-xl font-semibold">
    //             Loading Application...
    //         </div>
    //     );
    // }

    // Render the main application content once the auth check is complete
    return (
        <Router>
       <div className="min-h-scree bg-gradient-to-br from-[#eef4ff] via-white to-[#dbeafe] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
             <AppRoutes />
            {/* ToastContainer for global notifications */}
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
             </div>
        </Router>
    );
}

export default App;