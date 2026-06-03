import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(express.json());

const QUEUE_KEY = "queue:emails";

app.post("/emails", async (req, res) => {
  const job = {
    to: req.body.to,
    subject: req.body.subject || "No Subject",
    body: req.body.body || "No Content",
    createdAt: new Date().toISOString(),
  };

  await redis.lpush(QUEUE_KEY, JSON.stringify(job));

  res.json({ message: "Email job added to queue", job });
});

app.get("/emails/process-one", async (req, res) => {
  const jobData = await redis.rpop(QUEUE_KEY);
  if (!jobData) {
    return res.json({ message: "No email jobs in queue" });
  }

  const job = JSON.parse(jobData);

  // Simulate email sending
  res.json({ message: "Email job processed", job });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
