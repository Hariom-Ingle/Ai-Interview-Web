// src/api/interviewAPI.js
import axiosInstance from '../../services/axiosInstance';

export const generateInterviewQuestionsAPI = async (formData) => {
  const response = await axiosInstance.post('interview/generate-questions', formData);
  return response.data; // should return { questions, interviewId }
};
