import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginUserAPI, logoutAPI, resetPasswordAPI, signupUserAPI, verifyEmailAPI } from './authAPI';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  successMessage: null,
  pendingVerificationUserId: null,
  initialAuthCheckComplete: false,
};

// Signup thunk
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (credentials, thunkAPI) => {
    try {
      const apiResponseData = await signupUserAPI(credentials);
      return apiResponseData;
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
      return responseData;
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
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
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

// Reset Password Thunk
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, thunkAPI) => {
    try {
      const response = await resetPasswordAPI(resetData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

// Logout User Thunk
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await logoutAPI();
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
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
      state.pendingVerificationUserId = null;
      state.initialAuthCheckComplete = false;
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
    },
    // New reducers to clear messages
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; // Clear previous messages
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAccountVerified: action.payload.isAccountVerified || false,
        };
        state.isAuthenticated = true;
        state.successMessage = action.payload.message || 'Account created successfully!';
        state.pendingVerificationUserId = action.payload._id || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
        state.pendingVerificationUserId = null;
        state.successMessage = null; // Clear success message on rejection
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; // Clear previous messages
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAccountVerified: action.payload.isAccountVerified || false,
        };
        state.isAuthenticated = true;
        state.successMessage = action.payload.message || "Logged in Successfully!";
        state.pendingVerificationUserId = action.payload._id || null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        state.pendingVerificationUserId = null;
        state.successMessage = null; // Clear success message on rejection
      })

      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; // Clear previous messages
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        state.initialAuthCheckComplete = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.initialAuthCheckComplete = true;
        state.successMessage = null; // Clear success message on rejection
      })

      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; // Clear previous messages
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Email verified successfully!";
        if (state.user) {
          state.user.isAccountVerified = true;
        }
        state.pendingVerificationUserId = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        if (state.user) {
          state.user.isAccountVerified = false;
        }
        state.successMessage = null; // Clear success message on rejection
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; // Clear previous messages
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || 'Password reset successfully!';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null; // Clear success message on rejection
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null; // Clear previous messages
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Logged out successfully.';
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.successMessage = null; // Clear success message on rejection
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
  clearError,         // Export new clearError reducer
  clearSuccessMessage // Export new clearSuccessMessage reducer
} = authSlice.actions;

export default authSlice.reducer;