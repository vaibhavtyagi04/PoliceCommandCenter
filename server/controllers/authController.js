import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// IN-MEMORY OTP STORE FOR LOCAL TESTING WITHOUT FIREBASE
const otpStore = new Map(); // phone -> { otp, expiresAt }

const createToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "15m" // Short lived access token
  });

const createRefreshToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password required" });
    }

    // Find user by email OR phone OR batchNo (for police)
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phone: identifier },
        { batchNo: identifier }
      ]
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = createToken(user);
    const refreshToken = createRefreshToken(user);
    
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ 
      message: "Logged in successfully", 
      user, 
      token,
      refreshToken
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deprecated: OTP flows (kept as stubs if needed, or but login will be primary)
export const sendOtp = async (req, res) => res.status(410).json({ message: "OTP flow deprecated. Use password login." });
export const otpLogin = async (req, res) => res.status(410).json({ message: "OTP flow deprecated. Use password login." });

export const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    // Check if phone or email already exists
    const existing = await User.findOne({ $or: [{ phone }, { email }] });
    if (existing) {
      return res.status(400).json({ message: "User with this phone or email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      role: "citizen",
      name,
      phone,
      email,
      passwordHash,
      isVerified: true // Set to true by default for simple login
    });

    res.json({ message: "Registered successfully. You can now login.", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    // Verify OTP explicitly
    const record = otpStore.get(phone);
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please register first." });
    }

    user.isVerified = true;
    await user.save();
    
    // Clear OTP
    otpStore.delete(phone);

    const token = createToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ message: "Verified successfully", user, token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;
    
    // Verify OTP explicitly
    const record = otpStore.get(phone);
    if (!record || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ phone });
    
    if (!user) return res.status(404).json({ message: "User not found" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Clear OTP
    otpStore.delete(phone);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Support either email or batchNo to ensure police can still log in
    const user = await User.findOne({ 
      $or: [{ email: email }, { batchNo: email }],
      role: "police" 
    });

    if (!user) return res.status(400).json({ message: "Invalid admin credentials" });

    const token = createToken(user);
    const refreshToken = createRefreshToken(user);
    
    user.refreshToken = refreshToken;
    await user.save();

    // Output token
    res.json({ user, token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const registerPolice = async (req, res) => {
  try {
    const { name, batchNo, email, password, stationId } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      role: "police",
      name,
      batchNo,
      email,
      passwordHash,
      stationId,
      isVerified: true
    });

    const token = createToken(user);
    const refreshToken = createRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({ user, token, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, profileImage, address, emergencyContacts } = req.body;
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (email) user.email = email;
    if (profileImage) user.profileImage = profileImage;
    if (address) user.address = address;
    if (emergencyContacts) user.emergencyContacts = emergencyContacts;
    
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token required" });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    
    const newToken = createToken(user);
    res.json({ token: newToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
