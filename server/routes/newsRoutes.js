import express from "express";
import axios from "axios";

const router = express.Router();

// FREE NEWS API PROXY
router.get("/", async (req, res) => {
  try {
    // Using a public-friendly news query
    // You can get a free key at newsapi.org and add it to your .env as NEWS_API_KEY
    const apiKey = process.env.NEWS_API_KEY || "d369f62c0b434c4f923b88599426f8d0"; // Temporary demo key
    const response = await axios.get(`https://newsapi.org/v2/everything?q=police+crime+safety&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`);
    
    res.json({ news: response.data.articles });
  } catch (error) {
    console.error("News Fetch Error:", error.message);
    // Fallback data if API fails or limit reached
    res.json({ 
      news: [
        {
          title: "Interpol warns of increase in financial scams",
          description: "Global law enforcement agencies report a surge in digital fraud targeting elderly citizens.",
          url: "https://www.interpol.int",
          urlToImage: "https://images.unsplash.com/photo-1557597774-9d2739f85a94?w=800",
          publishedAt: new Date().toISOString()
        },
        {
          title: "New AI tools helping solve cold cases",
          description: "Modern forensic technology is allowing investigators to re-examine evidence from decades ago.",
          url: "https://www.justice.gov",
          urlToImage: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800",
          publishedAt: new Date().toISOString()
        }
      ] 
    });
  }
});

export default router;
