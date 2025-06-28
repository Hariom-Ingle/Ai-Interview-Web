import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { generateInterviewQuestionsAPI } from '@/features/interview/interviewAPI';

const initialState = {
  loading: false,
  error: null,
  currentInterviewId: null,
  questions: [],
};

// Thunk to generate questions
export const generateQuestions = createAsyncThunk(
  'interview/generateQuestions',
  async (formData, thunkAPI) => {
    try {
      const response = await generateInterviewQuestionsAPI(formData);
      return response; // expect { interviewId, questions }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to generate questions'
      );
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    clearInterviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.currentInterviewId = null;
      state.questions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.currentInterviewId = action.payload.interviewId;
      })
      .addCase(generateQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInterviewState, loading } = interviewSlice.actions;
export default interviewSlice.reducer;
