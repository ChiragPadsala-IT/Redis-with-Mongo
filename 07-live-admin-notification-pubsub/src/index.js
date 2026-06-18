import express from "express";
import Res from "ioredis";

const app = express();

app.use(express.json());

const publisher = new Res(process.env.REDIS_URL || "redis://localhost:6379");

app.post("/notifications", async (req, res) => {
  const payload = {
    title: req.body.title || "Default title",
    createdAt: new Date().toISOString(),
  };

  const receivers = await publisher.publish(
    "notifications",
    JSON.stringify(payload),
  );

  res.status(200).json({
    message: `Notification published to ${receivers} subscribers`,
    payload,
  });
});

app.listen(3000, () => {
  console.log("API server is running on port 3000");
});
