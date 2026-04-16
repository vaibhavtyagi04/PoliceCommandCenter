import { Server } from "socket.io";
import { corsOptions } from "./middleware/corsConfig.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js"; 

export let io = null;

export function initSocket(server) {
  io = new Server(server, { cors: corsOptions });

  io.on("connection", (socket) => {
    const token = socket.handshake.auth?.token;

    async function tryAuth(t) {
      try {
        if (!t) {
          socket.emit("auth:error", "no token");
          return;
        }
        const payload = jwt.verify(t, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).lean();
        if (!user) {
          socket.emit("auth:error", "user not found");
          return;
        }
        socket.join(`user:${user._id}`);
        if (user.role === "police") {
          socket.join("police");
          if (user.stationId) socket.join(`station:${user.stationId}`);
        }
        socket.emit("auth:ok", { id: user._id, role: user.role, stationId: user.stationId });
      } catch (err) {
        socket.emit("auth:error", "invalid token");
      }
    }

    tryAuth(token);
    
    // EMERGENCY SOS HANDLER
    socket.on("sos:trigger", (data) => {
      console.log(`🆘 SOS TRIGGERED by ${data.userName} at ${data.location.latitude}, ${data.location.longitude}`);
      
      // Broadcast to all police officers
      io.to("police").emit("sos:alert", {
        ...data,
        id: `SOS-${Date.now()}`
      });
      
      // Optionally broadcast to users in the same station area (future)
    });

    socket.on("sos:location_update", (data) => {
      // Broadcast updated coordinates to police
      io.to("police").emit("sos:location_moved", data);
    });

    socket.on("disconnect", () => {});
  });
}
