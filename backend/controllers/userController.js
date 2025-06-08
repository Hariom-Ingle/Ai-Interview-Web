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
      return res.status(400).json({ success: false,message: 'All fields are required' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false,message: 'Invalid email format' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ success: false,message: 'Password must be at least 6 characters long' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false,message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, });

    if (user) {
      generateToken(res, user._id);
      return res.status(201).json({
        success: true,message:"Signup Successfully !"
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
      const token =generateToken(res, user._id);
      // console.log(token);
      return res.json({
       
        token,
        _id: user._id,
        name: user.name,
        email: user.email,
        success: true,
        message:"Logged in Sucessfully"
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({success: false, message: 'Server Error' });
  }
};

// ********************************************* GetUser Function *******************************************************

 
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
    console.log( "--------- req user -----------")
    console.log(req.user)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
