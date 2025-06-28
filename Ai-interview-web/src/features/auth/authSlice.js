import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginUserAPI, logoutAPI, resetPasswordAPI, signupUserAPI, verifyEmailAPI } from './authAPI';

// With Redux Persist, initial state from localStorage is mostly handled by Persist.
// These functions are simplified/removed as Redux Persist becomes the source of truth.
// The initialState will mainly define the *default* state if no persisted state is found.
const initialState = {
  user: null,
 
  isAuthenticated: false, // Will be set to true if 'token' is loaded by persist
  loading: false, // Default loading state
  error: null,
  successMessage: null,
  pendingVerificationUserId: null,
  initialAuthCheckComplete: false, // Flag to indicate if initial auth check (e.g., getUserProfile) has run
};

// Signup thunk
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (credentials, thunkAPI) => {
    try {
      const apiResponseData = await signupUserAPI(credentials);
      return apiResponseData; // action.payload will be the full response object
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// Login thunk
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const responseData = await loginUserAPI(credentials);
      return responseData; // action.payload will be the full response object
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Get User Profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get('/users/data');
      return response.data; // Assuming response.data is the user object (e.g., {_id, name, email, isAccountVerified})
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        // If token invalid/expired, clear state via clearAuth
        dispatch(authSlice.actions.clearAuth());
        dispatch(authSlice.actions.setError("Your session has expired. Please log in again."));
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Thunk to verify email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (credentials, thunkAPI) => {
    try {
      const response = await verifyEmailAPI(credentials);
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
      return response.data; // action.payload will be the full response object
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// --- Logout User Thunk ---
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutAPI(); // ✅ fixed
      dispatch(authSlice.actions.clearAuth());
      return true;
    } catch (error) {
      console.error("Logout API failed:", error);
      dispatch(authSlice.actions.clearAuth());
      return rejectWithValue(
        error.response?.data?.message || 'Logout failed on server, but client state cleared.'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // This reducer is for manually setting user (e.g., on initial load if not using persist, or specific updates)
    // IMPORTANT: It should update the Redux state, which Redux Persist will then save.
    setUser: (state, action) => {
      state.user = action.payload; // action.payload should be the user object
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    // Clears all authentication-related state in Redux. Redux Persist will then save this null state.
    clearAuth: (state) => {
      state.user = null;
      
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.pendingVerificationUserId = null;
      state.initialAuthCheckComplete = false; // Reset this flag on explicit logout
      // NO localStorage.removeItem() here, Redux Persist handles it.
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.successMessage = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
      state.error = null;
      state.loading = false;
    },
    setInitialAuthCheckComplete: (state, action) => {
      state.initialAuthCheckComplete = action.payload;
    },
    setPendingVerificationUserId: (state, action) => {
      state.pendingVerificationUserId = action.payload;
      // NO localStorage.setItem/removeItem() here, Redux Persist handles it.
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup User Reducers
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        // CORRECTED based on your API response: action.payload is the direct response object
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAccountVerified: action.payload.isAccountVerified || false, // Ensure this field is handled if present
        };
       
        state.isAuthenticated = true;

        state.successMessage = action.payload.message || 'Account created successfully!';
        state.pendingVerificationUserId = action.payload._id || null;
        // NO localStorage.setItem() here, Redux Persist handles it.
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Clear state on failed signup, Redux Persist will save this null state
        state.user = null;
       
        state.isAuthenticated = false;
        state.pendingVerificationUserId = null;
      })

      // Login User Reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
       
        // CORRECTED based on your API response: action.payload is the direct response object
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAccountVerified: action.payload.isAccountVerified || false, // Ensure this field is handled if present
        };
        state.isAuthenticated = true;
        

        state.successMessage = action.payload.message || "Logged in Successfully!";
        state.pendingVerificationUserId = action.payload._id || null;
        // NO localStorage.setItem() here, Redux Persist handles it.
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        
        state.isAuthenticated = false;
        state.error = action.payload;
        state.pendingVerificationUserId = null;
        // NO localStorage.removeItem() here, Redux Persist handles it.
      })

      // Get User Profile Reducers (for persistence on refresh)
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Assuming getUserProfile returns just the user object
        state.isAuthenticated = true;
        state.error = null;
        state.initialAuthCheckComplete = true;
        // NO localStorage.setItem() here, Redux Persist handles it.
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialAuthCheckComplete = true;
        // No explicit state clearing here, as `clearAuth` is dispatched in the thunk if needed.
      })

      // ✅ Verify Email (OTP or Link)
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Email verified successfully!";

        if (state.user) {
          state.user.isAccountVerified = true; // Update Redux state
          // NO manual localStorage.setItem() here for userInfo update, Redux Persist will save state.user
        }
        state.pendingVerificationUserId = null;
        // NO localStorage.removeItem() here, Redux Persist handles it.
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        if (state.user) {
          state.user.isAccountVerified = false; // Update Redux state
          // NO manual localStorage.setItem() here for userInfo update, Redux Persist will save state.user
        }
      })

      // 🔒 Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Password reset successfully!';
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
        state.loading = false;
        state.successMessage = 'Logged out successfully.';
        // The clearAuth reducer (dispatched within the thunk) already handles state reset
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // The clearAuth reducer (dispatched within the thunk) already handles state reset
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