// store/slices/interviewFlowSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentView: 'setup', // 'setup', 'prerequisiteCheck', 'practice'
    interviewId: null,
};

const interviewFlowSlice = createSlice({
    name: 'interviewFlow',
    initialState,
    reducers: {
        setInterviewId: (state, action) => {
            state.interviewId = action.payload;
        },
        setCurrentView: (state, action) => {
            state.currentView = action.payload;
        },
        resetInterviewFlow: (state) => {
            state.currentView = 'setup';
            state.interviewId = null;
        },
    },
});

export const { setInterviewId, setCurrentView, resetInterviewFlow } = interviewFlowSlice.actions;

export default interviewFlowSlice.reducer;