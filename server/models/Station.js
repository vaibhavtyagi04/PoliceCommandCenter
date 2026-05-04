import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
}, { timestamps: true });

// Add 2dsphere index for geospatial queries
StationSchema.index({ location: "2dsphere" });

export default mongoose.model("Station", StationSchema);
