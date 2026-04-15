import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    // Return notifications relevant to the user's role or station
    // For now, return latest 20 notifications
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    // In a full production env, you'd track read status per user
    // For this project, we'll return success to clear the frontend badge
    res.json({ message: "Notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
