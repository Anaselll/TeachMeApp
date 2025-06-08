import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import Bcrypt from "bcrypt";

export const signup = async (req, res) => {
  console.log(req.body);
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });
    const newUser = await new User({
      fullName,
      email,
      password,
    });
 

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      });
    } else {
      return res.status(400).json({ message: "invalid user data" });
    }
  } catch (error) {
    console.log("error in signup controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(1)
    console.log(user.password)
    console.log(password);
    const isPasswordCorrect = await Bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect)
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(12)
    generateToken(user._id, res);
    console.log(user)
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const  checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user)
    }
    catch(error){
        console.log("error in check auth controller",error.message)
        return res.status(500).json({message:"Internal server error"})
    }
}

// Update profile picture
export const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pics',
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: result.secure_url },
      { new: true }
    ).select('-password');

    // Delete file from server after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Error updating profile picture" });
  }
};

// Update profile information
export const updateProfile = async (req, res) => {
  try {
    const { bio, subjects, education, location, contact,role } = req.body;
    console.log(role)

    const updateData = {
      ...(role ? { role } : {}),
      profile: {
        bio,
        subjects: Array.isArray(subjects) ? subjects : [],
        education: Array.isArray(education) ? education : [],
        location: location || {},
        contact: contact || {},
        
      },
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};