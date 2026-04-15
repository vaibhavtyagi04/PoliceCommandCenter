import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  role: { type: String, enum: ["citizen", "police"], required: true },
  aadhaarHash: String,
  phone: String,
  name: String,
  email: { type: String, unique: true },
  batchNo: String,
  passwordHash: { type: String, required: true },
  stationId: String,
  isVerified: { type: Boolean, default: false },
  
  // NEW PROFILE FIELDS
  profileImage: { type: String, default: "" },
  address: { type: String, default: "" },
  emergencyContacts: [{
    name: String,
    phone: String,
    relation: String
  }],
  refreshToken: String
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
