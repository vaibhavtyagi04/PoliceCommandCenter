import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import { corsOptions } from "./middleware/corsConfig.js";
import connectDB from "./db.js";
import { initSocket } from "./socket.js";
import rateLimit from "express-rate-limit";
import winston from "winston";

// Routes
import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import policeRoutes from "./routes/policeRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import uploadRoutes from "./routes/upload.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Initialize app
const app = express();
app.set("trust proxy", 1);
const server = http.createServer(app);

app.use(cors(corsOptions));

// =====================
// 📦 MIDDLEWARE
// =====================
app.use(express.json());

// =====================
// 📊 LOGGER (WINSTON)
// =====================
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

// =====================
// 🚦 RATE LIMITING
// =====================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: "Too many requests, please try again later."
});
app.use("/api/", limiter);

// =====================
// 🗄️ DATABASE CONNECTION
// =====================
connectDB();

// =====================
// 🔌 SOCKET INIT
// =====================
initSocket(server);

// =====================
// 📡 ROUTES
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);

// =====================
// ❤️ HEALTH CHECK
// =====================
app.get("/", (req, res) => {
  res.status(200).send({
    message: "Police Backend Running 🚔",
    status: "Healthy",
    timestamp: new Date()
  });
});

// =====================
// 🚀 START SERVER
// =====================
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});