import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

async function getPrice(gamePassId) {
  try {
    const r = await fetch(`https://economy.roblox.com/v1/game-pass/${gamePassId}`);
    const json = await r.json();
    return json.price ?? null;
  } catch (err) {
    console.error("Price fetch error:", err);
    return null;
  }
}

app.get("/passes/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // get passes owned by user
    const url = `https://catalog.roblox.com/v1/search/items?creatorTargetId=${userId}&creatorType=User&categories=GamePass&limit=30`;
    const r = await fetch(url);
    const data = await r.json();

    // enrich with REAL price
    for (let item of data.data || []) {
      item.realPrice = await getPrice(item.id);
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(10000, () => console.log("API running on port 10000"));
