import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// --- Get User Gamepasses ---
app.get("/passes/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const url = `https://catalog.roblox.com/v1/search/items?creatorTargetId=${userId}&creatorType=User&categories=GamePass&limit=30`;

    const r = await fetch(url);
    const data = await r.json();

    // Return only the array of items
    res.json(data);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- RUN ---
app.listen(10000, () => console.log("API running on port 10000"));
