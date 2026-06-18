import express from "express";
import { emailQueue } from "./queue.js";

const app = express();

app.use(express.json());

app.post("/welcome-email", async (req, res) => {
  const job = await emailQueue.add(
    "send-welcome-email",
    {
      to: req.body.to,
      name: req.body.name || "Learner",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );

  console.log(`Added job ${job.id} to the email queue`);

  res.status(202).json({
    message: "Welcome email job has been added to the queue",
    jobId: job.id,
  });
});

app.listen(3000, () => {
  console.log("API server is running on port 3000");
});
