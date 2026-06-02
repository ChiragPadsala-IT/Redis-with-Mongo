import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(express.json());

app.post("/user/:id/json", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  await redis.set(`user:${id}`, JSON.stringify({ name, email }));

  res.json({ message: "User profile updated" });
});

app.get("/user/:id/json", async (req, res) => {
  const { id } = req.params;
  const userData = await redis.get(`user:${id}`);
  res.json({ user: userData ? JSON.parse(userData) : null });
});

app.post("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  await redis.hset(`user:${id}:hash`, "name", name, "email", email);

  res.json({ message: "User profile updated" });
});

app.get("/user/:id/hash", async (req, res) => {
  const { id } = req.params;
  const userData = await redis.hgetall(`user:${id}:hash`);
  res.json({ user: Object.keys(userData).length ? userData : null });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
