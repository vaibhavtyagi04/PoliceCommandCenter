import express from "express";
import imagekit from "../services/imageService.js";
import { uploadImage } from "../controllers/uploadController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// FRONTEND uses this for client-side upload signatures
router.get("/auth", (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.json({
      signature: result.signature,
      token: result.token,
      expire: result.expire,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get ImageKit auth" });
  }
});

// SERVER-SIDE UPLOAD using multer
router.post("/", upload.single("image"), uploadImage);

export default router;
