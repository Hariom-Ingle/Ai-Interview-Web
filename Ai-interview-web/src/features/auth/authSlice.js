import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUserAPI, resetPasswordAPI, signupUserAPI, verifyEmailAPI, verifyEmailOtpAPI } from './authAPI';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await loginUserAPI(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Signup thunk
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await signupUserAPI(credentials);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Get User Profile (for persisting login state)
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/users/data'); // This endpoint needs to be protected
      return response.data; // e.g., { _id, name, email, isAccountVerified }
    } catch (error) {
      // If the token is invalid/expired (401), treat as not logged in
      // Rejecting will trigger `getUserProfile.rejected` reducer
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


// Thunk to verify email
export const verifyEmailOTP = createAsyncThunk(
  'auth/verifyEmailOTP',
  async (credentials, thunkAPI) => {
    try {
      const response = await verifyEmailOtpAPI(credentials)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "verification OTP send failed");
    }
  }
);
// Thunk to verify email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (credentials, thunkAPI) => {
    try {
      const response = await verifyEmailAPI(credentials); // credentials = { otp, token }
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'OTP verification failed'
      );
    }
  }
);



// ✅ Reset Password Thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, thunkAPI) => {
    try {
      const response = await resetPasswordAPI(resetData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);


// --- NEW: Logout User Thunk ---
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Make API call to backend to clear HTTP-only cookie (if applicable)
      // If your backend has a /auth/logout endpoint that clears the cookie:
      await axios.post('/auth/logout');

      // Then clear the frontend Redux state and localStorage
      dispatch(authSlice.actions.clearAuth());
      return true; // Indicate success
    } catch (error) {
      // Even if the backend call fails, we should still clear frontend state
      console.error("Logout API failed, clearing frontend state anyway:", error);
      dispatch(authSlice.actions.clearAuth());
      // Optionally, re-throw or reject if you want to notify user about backend logout failure
      return rejectWithValue(error.response?.data?.message || 'Logout failed on server, but client state cleared.');
    }
  }
);






const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Sets user data and updates authentication status
    setUser: (state, action) => {
      state.user = action.payload;
     
      state.isAuthenticated = !!action.payload; // True if payload exists, false otherwise
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      if (action.payload) {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('userInfo');
      }
      // This assumes your login/signup APIs return the token as `action.payload.token`
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      } else {
        // If payload might not always contain a token, ensure it's cleared if it shouldn't be there
        localStorage.removeItem('token');
      }
    },
    // Clears all authentication-related state and localStorage
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.pendingVerificationUserId = null;
      state.initialAuthCheckComplete = false; // Reset this flag on explicit logout
      localStorage.removeItem('userInfo');
      localStorage.removeItem('pendingVerificationUserId');
      localStorage.removeItem('token'); // If you stored token in localStorage
    },
    // Sets general loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // Sets general error message
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.successMessage = null;
    },
    // Sets general success message
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
      state.error = null;
      state.loading = false;
    },
    // Marks the initial authentication check as complete
    setInitialAuthCheckComplete: (state, action) => {
      state.initialAuthCheckComplete = action.payload;
    },
    // For setting user ID during email verification flow
    setPendingVerificationUserId: (state, action) => {
      state.pendingVerificationUserId = action.payload;
      if (action.payload) {
        localStorage.setItem('pendingVerificationUserId', action.payload);
      } else {
        localStorage.removeItem('pendingVerificationUserId');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User Reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        
        state.successMessage = action.payload.message || "Logged in Successfully!";
        localStorage.setItem('token',action.payload.token);
        localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Persist user info
        // If login also sends _id for email verification flow:
        state.pendingVerificationUserId = action.payload._id;
        localStorage.setItem('pendingVerificationUserId', action.payload._id);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        localStorage.removeItem('userInfo');
        state.pendingVerificationUserId = null; // Clear if login failed
        localStorage.removeItem('pendingVerificationUserId');
      })


      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Profile Reducers (for persistence on refresh)
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.user.isAccountVerified = action.payload.isAccountVerified;

        state.isAuthenticated = true;
        state.error = null;
        state.initialAuthCheckComplete = true; // Mark check as complete
        localStorage.setItem('userInfo', JSON.stringify(action.payload)); // Update localStorage
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        // If profile fetch fails (e.g., token expired/invalid), user is not logged in.
        state.loading = false;
        // state.user = null;
        // state.isAuthenticated = false;
        // state.error = action.payload; // Error message from backend
        // state.initialAuthCheckComplete = true; // Mark check as complete
        // localStorage.removeItem('userInfo'); // Clear stale user info
        // state.pendingVerificationUserId = null; // Clear if not logged in
        // localStorage.removeItem('pendingVerificationUserId');
      })


      .addCase(verifyEmailOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(verifyEmailOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        // Store userId received from backend for subsequent verification
        state.pendingVerificationUserId = action.payload._id; // Backend should send this
        localStorage.setItem('pendingVerificationUserId', action.payload._id);
      })
      .addCase(verifyEmailOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔒 Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        // The clearAuth reducer (dispatched within the thunk) already handles state reset
        state.loading = false; // Set loading to false after completion
        state.successMessage = 'Logged out successfully.';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // The clearAuth reducer (dispatched within the thunk) already handles state reset
        state.loading = false; // Set loading to false after completion
        state.error = action.payload; // Show error from backend if any
      });
  },
});
export const {
  setUser,
  clearAuth,
  setLoading,
  setError,
  setSuccessMessage,
  setInitialAuthCheckComplete,
  setPendingVerificationUserId,
} = authSlice.actions;

export default authSlice.reducer;
