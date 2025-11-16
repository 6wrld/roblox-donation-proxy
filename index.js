import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

// --- Get price + name for each pass ---
async function getPassInfo(passId) {
  try {
    const r = await fetch(`https://economy.roblox.com/v1/game-pass/${passId}`);
    const json = await r.json();
    return {
      id: passId,
      name: json.name || "Gamepass",
      price: json.price || null
    };
  } catch (err) {
    console.log("Info error:", err);
    return null;
  }
}

// --- Main endpoint: get passes from user ---
app.get("/passes/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const searchUrl = `https://apis.roblox.com/game-passes/v1/users/${userId}/game-passes?limit=30`;
    const r = await fetch(searchUrl);
    const data = await r.json();

    // If no passes or error
    if (!data || !data.data) {
      return res.json({ data: [] });
    }

    // Build full info list
    const final = [];
    for (const item of data.data) {
      const info = await getPassInfo(item.id);
      if (info) final.push(info);
    }

    res.json({ data: final });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- RUN ---
app.listen(10000, () => console.log("API running on port 10000"));
