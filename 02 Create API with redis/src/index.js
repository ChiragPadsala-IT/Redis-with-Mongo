import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  const { banner } = req.body;
  await redis.set(BANNER_KEY, banner);
  res.json({ message: "Banner updated" });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
