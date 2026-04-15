export const validateFiles = (options = {}) => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ["image/jpeg", "image/png", "video/mp4"] } = options;

  return (req, res, next) => {
    // This assumes files are already uploaded via multer/imagekit 
    // or we are checking a payload of URLs (common in this project's ImageKit flow)
    
    if (req.body.images && Array.isArray(req.body.images)) {
      // Logic for URL-based validation if needed (e.g. limit count)
      if (req.body.images.length > 5) {
        return res.status(400).json({ message: "Maximum 5 images allowed" });
      }
    }
    
    // If we had buffered files (Multer):
    if (req.files) {
      const filesArr = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
      for (const file of filesArr) {
        if (file.size > maxSize) {
          return res.status(400).json({ message: `File ${file.originalname} is too large. Max 5MB.` });
        }
        if (!allowedTypes.includes(file.mimetype)) {
          return res.status(400).json({ message: `File type ${file.mimetype} of ${file.originalname} is not allowed.` });
        }
      }
    }
    
    next();
  };
};
