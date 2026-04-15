import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./db.js";
import { initSocket } from "./socket.js";
import rateLimit from "express-rate-limit";
import winston from "winston";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import policeRoutes from "./routes/policeRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import uploadRoutes from "./routes/upload.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

console.log("ENV CHECK:", process.env.IMAGEKIT_PUBLIC_KEY);

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ],
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later"
});
app.use("/api/", limiter);

connectDB();
initSocket(server);

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/police", policeRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/notifications", notificationRoutes);


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
