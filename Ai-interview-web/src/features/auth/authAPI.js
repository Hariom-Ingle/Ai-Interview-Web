import axios from '../../services/axiosInstance';

export const loginUserAPI = async (data) => {
  const res = await axios.post('/login', data);
  console.log("Login API Response:", res.data);
  return res.data;
};

export const signupUserAPI = async (data) => {
  const res = await axios.post('/signup', data);
  return res.data;
};
