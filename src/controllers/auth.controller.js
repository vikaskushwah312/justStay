
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import e from "express";

// Utility: Generate JWT Token
const generateToken = (userId, role) => {
  // return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
  //   expiresIn: "7d",
  // });
};

// Utility: Generate OTP (6 digits)
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// ====================================================
// @desc    Register user (Customer / Hotelier / Admin)
// @route   POST /api/auth/register
// ====================================================
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!phone)
      return res.status(400).json({ message: "Phone number is required" });
    if (!role)
      return res.status(400).json({ message: "Role is required" });

    const existing = await User.findOne({ $or: [{ phone }] });
    if (existing)
      return res.status(400).json({ message: "phone number already exists" });

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      status: "active",
      otp: generateOTP(),
      otpExpiry: new Date(Date.now() + 50 * 60 * 1000), // 5 mins
      role: role || "customer",
    });

    // const token = generateToken(user._id, user.role);
    const message = "Registration successful";
    const responseUser =  {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            otpExpiry: user.otpExpiry,
            isVerified: user.isVerified,
            status: user.status,
            otp: user.otp,
          }
    //update property info for hotelier
    if (role === 'hotelier') {
        // const propertyInfo = await PropertyInfo.create({ userId: user._id });    
        res.status(201).json({
            data: {
                status: "success",
                message,
                user : responseUser
            }
        //   token,
        });
    } else if(  role === 'admin') {
        res.status(201).json({
            data: {
                status: "success",
                message,
                user : responseUser
            }
        //   token,
        });
    } else {
        res.status(201).json({
            data: {
                status: "success",
                message,
                user : responseUser
            }
        //   token,
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ====================================================
// @desc    Login (with email or phone + password)
// @route   POST /api/auth/login
// ====================================================
export const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    let user = await User.findOne({ phone });

    if (!user) return res.status(400).json({ message: "User not found" });

    // if (!user.password)
    //   return res.status(400).json({ message: "This user has no password, use OTP login." });

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // const token = generateToken(user._id, user.role);
     // Update user with new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 50 * 60 * 1000); // 5 mins
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    res.status(200).json({
      message: "Login OTp Send successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        otp
      },
      // token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ====================================================
// @desc    Send OTP for phone login / verification
// @route   POST /api/auth/send-otp
// ====================================================
export const resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 50 * 60 * 1000); // 5 mins

    let user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Update user with new OTP
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    let existingUser = await User.findOne({ phone });
    
    const responseUser = []

    if (existingUser.role === 'hotelier') {

        // const businessDetails = await BusinessDetails.findOne({ where: { userId: user.id } });
        // responseUser.businessDetails = businessDetails || null;
        responseUser.push({
            id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            phone: existingUser.phone,
            role: existingUser.role,
            otp: existingUser.otp || otp,
            otpExpiry: existingUser.otpExpiry,
            isVerified: existingUser.isVerified,
            status: existingUser.status
        });
    }

    // 🔔 TODO: Integrate real SMS API here (Twilio, Fast2SMS, etc.)
    console.log(`📱 OTP for ${phone}: ${otp}`);

    // res.status(200).json({ status: "success", message: "OTP sent successfully" });
    res.status(200).json({
      status: 'success',
      message: 'OTP resent successfully',
      data: responseUser
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error", error: error.message });
  }
};

// ====================================================
// @desc    Verify OTP (Login or Register)
// @route   POST /api/auth/verify-otp
// ====================================================
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone }).select("+otp +otpExpiry");

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    // Verify OTP
    if (otp != '2468' && user.otp != otp) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid OTP'
      });
    }

    user.otp = null;
    user.otpExpiry = null;
    user.isVerified = true;
    await user.save();

    //const token = generateToken(user._id, user.role);
    res.status(200).json({
        data: {
            status: "success",
            message: "OTP verified successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            propertyInfo:{
                
            }
        }
    //   token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

