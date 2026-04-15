import Announcement from "../models/Announcement.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, description, category, location, areaName, severity } = req.body;
    
    // location should be { type: "Point", coordinates: [lng, lat] }
    const announcement = await Announcement.create({
      title,
      description,
      category,
      location,
      areaName,
      severity,
      createdBy: req.user._id,
      stationId: req.user.stationId
    });
    
    res.status(201).json({ announcement });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { lng, lat, radius = 50 } = req.query; // radius in KM
    let query = {};
    
    if (lng && lat) {
      query.location = {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: radius * 1000 // Convert KM to meters
        }
      };
    }
    
    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
