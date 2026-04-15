import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";
import { io } from "../socket.js";
import { postTransparencyUpdate } from "../services/twitterService.js";

export const fileComplaint = async (req, res) => {
  console.log("POST /api/complaints - Start");
  try {
    const { userId, title, description, category, location, emergency, images, isAnonymous, priority } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      location, // { latitude, longitude }
      images,
      userId: userId || req.user._id,
      assignedToStation: req.body.assignedToStation || "station-001",
      emergency: !!emergency,
      isAnonymous: !!isAnonymous,
      priority: priority || "Medium",
      statusHistory: [{
        status: "Submitted",
        notes: "Complaint filed successfully.",
        date: new Date(),
        updatedBy: "System"
      }]
    });

    console.log("Complaint created:", complaint._id);
    await Notification.create({ title: "New complaint", body: `${title} - ${category}` });

    io.to("police").emit("complaint:created", complaint);
    io.to(`user:${req.user._id}`).emit("complaint:ack", { complaintId: complaint._id });

    // Transparency Integration
    if (req.body.shareToTwitter) {
      await postTransparencyUpdate(complaint);
    }

    console.log("POST /api/complaints - Success");
    res.status(201).json({ complaint });
  } catch (err) {
    console.error("POST /api/complaints - Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = { userId: req.params.id };
    
    if (status && status !== "All") query.status = status;
    if (category && category !== "All") query.category = category;
    if (search) query.title = { $regex: search, $options: "i" };

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    let query = {};
    
    if (status && status !== "All") query.status = status;
    if (category && category !== "All") query.category = category;
    if (priority && priority !== "All") query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate("userId", "name phone email")
      .sort({ createdAt: -1 });
    
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateComplaintStatus = async (req, res) => {
  console.log(`PUT /api/complaints/${req.params.id} - Start`);
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      console.log(`PUT /api/complaints/${id} - Not found`);
      return res.status(404).json({ message: "Not found" });
    }

    if (status) {
      complaint.status = status;
      complaint.statusHistory.push({
        status,
        notes: note || `Status updated to ${status}`,
        date: new Date(),
        updatedBy: req.user.name || "Police Officer"
      });
    }
    
    // Support officer assignment
    if (req.body.assignedOfficerId) {
      complaint.assignedOfficerId = req.body.assignedOfficerId;
      complaint.officerName = req.body.officerName;
    }

    if (req.body.estimatedCompletion) {
      complaint.estimatedCompletion = req.body.estimatedCompletion;
    }

    if (note && !status) { // If only a note is added without a status change
      complaint.policeNotes.push({
        text: note,
        author: req.user.name || "Police Officer",
        createdAt: new Date()
      });
    }

    await complaint.save();
    console.log(`PUT /api/complaints/${id} - Success`);

    io.to(`user:${complaint.userId}`).emit("complaint:updated", complaint);
    io.to("police").emit("complaint:updated", complaint);

    res.json({ complaint });
  } catch (err) {
    console.error("PUT /api/complaints/:id - Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("userId", "name phone email")
      .populate("assignedOfficerId", "name phone batchNo");
    if (!complaint) return res.status(404).json({ message: "Not found" });
    res.json({ complaint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
