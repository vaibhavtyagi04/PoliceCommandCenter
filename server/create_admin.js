import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const email = "police@example.com";
    const password = "admin123";
    const batchNo = "P-7741";

    const existing = await User.findOne({ $or: [{ email }, { batchNo }] });
    if (existing) {
      console.log("Admin/Police user already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({
      name: "Admin Officer",
      email,
      batchNo,
      passwordHash,
      role: "police",
      stationId: "Zone-01",
      isVerified: true
    });

    console.log("Admin/Police user created successfully!");
    console.log("Email: police@example.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
