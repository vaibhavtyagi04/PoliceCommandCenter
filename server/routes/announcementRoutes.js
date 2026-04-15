import express from "express";
import auth, { checkRole } from "../middleware/auth.js";
import { createAnnouncement, getAnnouncements } from "../controllers/announcementController.js";

const router = express.Router();

// Publicly viewable alerts, but auth required to track location proximity if needed
router.get("/", auth, getAnnouncements);

// Only police can broadcast updates
router.post("/", auth, checkRole(["police"]), createAnnouncement);

export default router;
