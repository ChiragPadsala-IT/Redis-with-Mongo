import { Worker } from "bullmq";
import { connection } from "./queue";

const emailWorker = new Worker(
  "emails",
  async (job) => {
    console.log("Processing email job...", job.id, job.name, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Email job completed!", job.id, job.name, job.data);
  },
  { connection },
);

emailWorker.on("completed", (job) => {
  console.log(
    "Email job completed event received!",
    job.id,
    job.name,
    job.data,
  );
});

emailWorker.on("failed", (job, err) => {
  console.error("Email job failed!", job.id, job.name, job.data, err);
});
