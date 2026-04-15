import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ["Alert", "News", "Safety Guide", "Update"], 
    default: "News" 
  },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  stationId: String,
  areaName: String, // Readable area name like "South Delhi"
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  severity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" }
}, { timestamps: true });

// Add 2dsphere index for location-based searching
AnnouncementSchema.index({ location: "2dsphere" });

export default mongoose.model("Announcement", AnnouncementSchema);
