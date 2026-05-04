import express from "express";
import Station from "../models/Station.js";

const router = express.Router();

/**
 * @route   GET /api/stations/nearby
 * @desc    Get police stations near a location with distance calculation
 * @params  lat, lng, distance (in km)
 */
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, distance } = req.query;

    // Validation
    if (!lat || !lng) {
      return res.status(400).json({ 
        message: "Latitude and longitude are required for nearby search." 
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const maxDistanceKm = parseFloat(distance) || 25; // Default 25km

    const stations = await Station.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          distanceField: "distance", // This will hold the distance in meters
          maxDistance: maxDistanceKm * 1000, // Distance in meters
          spherical: true
        }
      },
      { $limit: 20 }, // Added limit for performance
      {
        $project: {
          name: 1,
          address: 1,
          phone: 1,
          location: 1,
          distance: { $divide: ["$distance", 1000] } // Convert meters to km
        }
      }
    ]);

    res.json({
      success: true,
      count: stations.length,
      stations
    });
  } catch (error) {
    console.error("Error fetching nearby stations:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching nearby stations",
      error: error.message 
    });
  }
});

export default router;
