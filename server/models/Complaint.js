import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  images: [String],
  status: { 
    type: String, 
    enum: ["Submitted", "Verified", "Assigned", "Under Investigation", "Resolved", "Closed"], 
    default: "Submitted" 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedOfficerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  officerName: String,
  assignedToStation: String,
  policeNotes: [{ text: String, author: String, createdAt: Date }],
  statusHistory: [{
    status: String,
    notes: String,
    date: { type: Date, default: Date.now },
    updatedBy: String
  }],
  estimatedCompletion: Date,
  emergency: { type: Boolean, default: false },
  isAnonymous: { type: Boolean, default: false },
  priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" }
}, { timestamps: true });

export default mongoose.model("Complaint", ComplaintSchema);
