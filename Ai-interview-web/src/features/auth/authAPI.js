import axiosInstance from '../../services/axiosInstance';

export const loginUserAPI = async (data) => {
  const res = await axiosInstance.post('auth/login', data, { withCredentials: true, });
  return res.data;
};

export const signupUserAPI = async (data) => {
  const res = await axiosInstance.post('auth/signup', data);
  return res.data;
};

export const verifyEmailOtpAPI = async (data) => {
  const res = await axiosInstance.post('auth/send-verify-otp', data, { withCredentials: true, });
  return res.data;
};
export const logoutAPI = async () => {
  const res = await axiosInstance.post('auth/logout',{},{
    withCredentials:true,
  });
  return res.data;
};


export const verifyEmailAPI = async ({ otp }) => {
  const res = await axiosInstance.post('auth/verify-account',{ otp },{
      withCredentials: true, // ✅ Use the cookie automatically
    }
  );
  return res;
};

export const resetPasswordAPI = async (data) => {
  const res = await axiosInstance.post('auth/reset-password', data);
  return res.data;
};

