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

export const verifyEmailOtpAPI = async (data) => {
  const res = await axios.post('/send-verify-otp', data);
  return res.data;
};


export const verifyEmailAPI = async ({ otp, token }) => {
  const res = await axios.post(
    'http://localhost:5000/api/auth/verify-account',
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return res; // keep `.data` access in the thunk
};
export const resetPasswordAPI = async (data) => {
  const res = await axios.post('/reset-password', data);
  return res.data;
};

