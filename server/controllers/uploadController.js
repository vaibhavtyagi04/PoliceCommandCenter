import imagekit from "../services/imageService.js";

export const uploadImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: file.buffer,
      fileName: `police_system_${Date.now()}_${file.originalname}`,
      folder: "/police_reporting_system",
    });

    res.status(200).json({
      success: true,
      url: result.url,
      fileId: result.fileId,
      thumbnailUrl: result.thumbnailUrl,
    });

  } catch (error) {
    console.error("Upload controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};
