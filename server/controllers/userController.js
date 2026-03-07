const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  sendWelcomeEmail,
  sendVerificationCode,
  sendPasswordResetCode,
} = require("../config/brevoMailer");
// Signup Controller
const Signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    // const mailOptions = {
    //   from: process.env.SENDER_EMAIL,
    //   to: email,
    //   subject: "Welcome To G&A - Ecommerce",
    //   text: `Welcome to G&A Ecommerce you have created the account on G&A with emial id : ${email}`,
    // };
    // // Send welcome email, but don't block signup if SMTP fails
    // transporter.sendMail(mailOptions).catch(err => console.log("Error sending welcome email:", err));;
    sendWelcomeEmail(email);
    return res.status(201).json({
      success: true,
      message: "User account created successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login Controller
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // include the MongoDB _id so downstream middleware/controllers can easily access it
      // use whichever environment variable is set for secret
      const jwtSecret = process.env.JWTSECRETKEY || process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT Secret not defined");
      }
      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: "7d" }
      );




      user.password = undefined;

      return res.status(200).json({
        success: true,
        message: "User logged in",
        token,
        userData: user,
      });
    }

    return res.status(404).json({
      success: false,
      message: "User does not exist",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const Allusers = async (req, res) => {
  try {
    const allUsers = await userModel.find().select("-password -resetToken");
    res.status(200).json({ message: "All users data fetched", allUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// Get current logged-in user profile
const getMe = async (req, res) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine current user",
      });
    }

    const user = await userModel
      .findOne({ email })
      .select("-password -resetToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const sendverificationcodemail = async (req, res) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine current user",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Your email is already verified.",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyotp = otp;
    user.verifyotpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendVerificationCode(email, otp);

    return res.status(200).json({
      success: true,
      message: "Verification code has been sent to your email address.",
      expiresAt: user.verifyotpExpiry,
    });
  } catch (error) {
    console.error("Error sending verification code email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const email = req.user?.email;
    const { otp } = req.body || {};

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine current user",
      });
    }

    if (!otp || typeof otp !== "string") {
      return res.status(400).json({
        success: false,
        message: "Verification code is required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        message: "Your email is already verified.",
        user,
      });
    }

    if (!user.verifyotp || !user.verifyotpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No active verification code found. Please request a new code.",
      });
    }

    if (user.verifyotp !== otp.trim()) {
      return res.status(400).json({
        success: false,
        message: "The verification code you entered is incorrect.",
      });
    }

    if (user.verifyotpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "This verification code has expired. Please request a new code.",
      });
    }

    user.isVerified = true;
    user.verifyotp = "";
    user.verifyotpExpiry = 0;

    const savedUser = await user.save();

    // ensure we don't send password/reset fields even if they exist
    const safeUser = await userModel
      .findById(savedUser._id)
      .select("-password -resetToken");

    return res.status(200).json({
      success: true,
      message: "Your email has been verified successfully.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    if (!user) {
      // For security, respond with generic message
      return res.status(200).json({
        success: true,
        message: "If an account exists for this email, a reset code has been sent.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "This account is blocked. Please contact support.",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();
    await sendPasswordResetCode(normalizedEmail, otp);

    return res.status(200).json({
      success: true,
      message: "If an account exists for this email, a reset code has been sent.",
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body || {};

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, verification code and new password are required",
      });
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail }).select(
      "+password"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or verification code",
      });
    }

    if (!user.resetOtp || !user.resetOtpExpiry) {
      return res.status(400).json({
        success: false,
        message: "No active reset code found. Please request a new code.",
      });
    }

    if (user.resetOtp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "The verification code you entered is incorrect.",
      });
    }

    if (user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "This verification code has expired. Please request a new code.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpiry = 0;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your password has been reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update basic profile fields for current user
const updateMe = async (req, res) => {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine current user",
      });
    }

    const updates = {};

    if (req.body.name !== undefined) {
      const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
      if (!name || name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 2 characters",
        });
      }
      updates.name = name;
    }

    if (req.body.phone !== undefined) {
      updates.phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    }

    if (req.body.avatar !== undefined) {
      updates.avatar = typeof req.body.avatar === "string" ? req.body.avatar.trim() : "";
    }

    if (req.body.dateOfBirth !== undefined) {
      if (req.body.dateOfBirth === null || req.body.dateOfBirth === "") {
        updates.dateOfBirth = null;
      } else {
        const d = new Date(req.body.dateOfBirth);
        if (isNaN(d.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid date of birth",
          });
        }
        updates.dateOfBirth = d;
      }
    }

    if (req.body.gender !== undefined) {
      const v = req.body.gender;
      if (v === null || v === "") {
        updates.gender = undefined;
      } else if (["male", "female", "other"].includes(v)) {
        updates.gender = v;
      }
    }

    if (req.body.preferences !== undefined && typeof req.body.preferences === "object") {
      updates.preferences = {};
      if (typeof req.body.preferences.newsletter === "boolean") {
        updates.preferences.newsletter = req.body.preferences.newsletter;
      }
      if (typeof req.body.preferences.currency === "string" && req.body.preferences.currency.trim()) {
        updates.preferences.currency = req.body.preferences.currency.trim();
      }
      if (typeof req.body.preferences.language === "string" && req.body.preferences.language.trim()) {
        updates.preferences.language = req.body.preferences.language.trim();
      }
    }

    // support updating address(es)
    if (req.body.addresses !== undefined) {
      if (!Array.isArray(req.body.addresses)) {
        return res.status(400).json({
          success: false,
          message: "Addresses must be an array",
        });
      }
      // basic validation for each address object
      const validAddrs = [];
      for (const addr of req.body.addresses) {
        if (typeof addr !== "object") continue;
        const sanitized = {};
        if (typeof addr.fullName === "string") sanitized.fullName = addr.fullName.trim();
        if (typeof addr.phone === "string") sanitized.phone = addr.phone.trim();
        if (typeof addr.street === "string") sanitized.street = addr.street.trim();
        if (typeof addr.city === "string") sanitized.city = addr.city.trim();
        if (typeof addr.state === "string") sanitized.state = addr.state.trim();
        if (typeof addr.postalCode === "string") sanitized.postalCode = addr.postalCode.trim();
        if (typeof addr.country === "string") sanitized.country = addr.country.trim();
        // we won't enforce required fields here, allow partial updates
        validAddrs.push(sanitized);
      }
      updates.addresses = validAddrs;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    const updatePayload = {};
    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.phone !== undefined) updatePayload.phone = updates.phone;
    if (updates.avatar !== undefined) updatePayload.avatar = updates.avatar;
    if (updates.dateOfBirth !== undefined) updatePayload.dateOfBirth = updates.dateOfBirth;
    if (updates.gender !== undefined) updatePayload.gender = updates.gender;
    const prefs = updates.preferences || {};
    if (typeof prefs.newsletter === "boolean") updatePayload["preferences.newsletter"] = prefs.newsletter;
    if (prefs.currency !== undefined) updatePayload["preferences.currency"] = prefs.currency;
    if (prefs.language !== undefined) updatePayload["preferences.language"] = prefs.language;
    if (updates.addresses !== undefined) updatePayload.addresses = updates.addresses;

    const updatedUser = await userModel
      .findOneAndUpdate({ email }, { $set: updatePayload }, { new: true })
      .select("-password -resetToken");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating current user:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  Signup,
  Login,
  Allusers,
  getMe,
  updateMe,
  sendverificationcodemail,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
};