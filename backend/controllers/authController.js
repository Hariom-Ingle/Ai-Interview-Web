import transporter from '../config/nodemailer.js';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
// Helper functions for validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 6;
};
// ********************************************* Register Function *******************************************************

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      generateToken(res, user._id);

      const mailOption = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Welcome to Ai Interview Coach',
        text: `Welcome to Ai Interview Coach website. Your account has been created  with email id:${email}`
      }
      await transporter.sendMail(mailOption)
      return res.status(201).json({
        success: true, message: "Signup Successfully !"
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// ********************************************* Login Function *******************************************************
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(password)
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      // console.log(token);
      return res.json({
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        success: true,
        message: "Logged in Sucessfully"
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ********************************************* GetUser Function *******************************************************

export const logout = async (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Strict',
    });

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error); 
    res.status(500).json({ message: 'Logout failed' });
  }
};


// ********************************************* SEND OTP Function *******************************************************


export const sendVerifyOtp = async (req, res) => {
  console.log('req.body:', req.userId); // 🔍 Debug log

   const userId = req.userId;
   console.log("api hit")

  try {
    const user = await User.findById(userId); //

    if (user.isAccountVerified) {
      return res.json({
        success: false, message: "Account Already verified"
      });
    }



    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.verifyOtp = otp;

    user.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000


    await user.save();
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account varification OTP',
      text: `Your OTP is ${otp}. Verify your account using this OTP`
    }
    await transporter.sendMail(mailOption)
    res.json({
      success: true, message: 'Verification OTP sent on your Email'
    })

  } catch (error) {
    console.log(error);
  }

}


// ******************************************** Verify Email Function *******************************************************

export const verifyEmail = async (req, res) => {

  const { otp } = req.body;
  const userId = req.userId;

  console.log(userId, otp)

  if (!userId || !otp) {

    return res.json({
      success: false, message: "Missing Details"
    });
  }
  try {

    const user = await User.findById(userId);

    if (!user) {
      return res.json({
        success: false, message: 'User not found'
      })
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {

      console.log("inside function")
      return res.json({
        success: false, message: 'Invalid OTP'
      })

    }

    if (user.verifyOtpExpireAt < Date.now) {
      return res.json({
        success: false, message: 'OTP Expired'
      })
    }

    user.isAccountVerified = true;
    user.verifyOtp = ''
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true, message: 'Email Verified Succesfully'
    })


  } catch (error) {

    console.log(error)

  }

}


// ********************************************* isAuthenticated Function *******************************************************

export const isAuthticated = async (req, res) => {

  try {
    res.json({
      success: true, message: "User Authenticated"
    })

  } catch (error) {
    console.log(error)
    res.json({
      success: false, message: error.message
    })
  }
}

//   
// ********************************************* RESET PASSWORD Function *******************************************************

 
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email, newPassword);

  if (!newPassword) {
    return res.json({
      success: false,
      message: "New Password are required"
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }   
   

    // Hash the new password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user details
    user.password = newPassword;
     

    // Save changes to the database
    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};

export const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);

  
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User not found"
      });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({
        success: false,
        message: "OTP Expired"
      });
    }

   
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    // Save changes to the database
    await user.save();

    return res.json({
      success: true,
      message: "OTP Verified Successfully"
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: error.message
    });
  }
};



//  reset password otp controller function 


export const sendResetyOTP = async (req, res) => {


  const { email } = req.body;

  if(!email){
    return res.json({
      success:false, message:"Please provide email"
    })
  }
  try {

    const user= await  User.findOne({email});

    if( !user){
       return res.json({
      success:false, message:"User not found"
    })
    }
       

    const otp = String(Math.floor(100000 + Math.random() * 900000))
    user.resetOtp = otp;

    user.resetOtpExpireAt = Date.now() + 60 * 60 * 1000


    await user.save();
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Account Password Reset OTP',
      text: `Your OTP is ${otp}. Reset your account password using this OTP`
    }
    await transporter.sendMail(mailOption)
    res.json({
      success: true, message: 'Reset Password OTP sent on your Email'
    })

  } catch (error) {
    console.log(error);
  }

}



// get  user controller function 

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
    console.log("--------- req user -----------")
    console.log(req.user)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};



