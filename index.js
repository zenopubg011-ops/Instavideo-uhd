import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Fetch Video Info (Instagram / YouTube etc.)
app.get("/api/video-info", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing video URL" });

  try {
    const response = await fetch(
      `https://www.a2zconverter.com/api/files/new-proxy?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    if (data.code !== 0 || !data.data) {
      return res.status(500).json({ error: "Failed to fetch video info" });
    }

    res.json({
      title: data.data.title,
      thumbnail: data.data.cover,
      formats: data.data.items,
    });
  } catch (err) {
    console.error("Error fetching video info:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Merge Video + Audio
app.post("/api/merge", async (req, res) => {
  const { video, audio } = req.body;
  if (!video || !audio) {
    return res.status(400).json({ error: "Video and audio URLs are required" });
  }

  try {
    const response = await fetch("https://www.a2zconverter.com/api/files/video-merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video, audio }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error merging video/audio:", err);
    res.status(500).json({ error: "Merge request failed" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
