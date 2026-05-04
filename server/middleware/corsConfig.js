// server/middleware/corsConfig.js

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://police-command-center.vercel.app",
  "http://localhost:3000"
];

export const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const isVercelPreview = origin.includes("vercel.app") && origin.includes("police-command-center");
    
    if (allowedOrigins.indexOf(origin) !== -1 || isVercelPreview) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};
