import express from "express";
import Redis from "ioredis";

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(express.json());

const otpKey = (phone) => `otp:${phone}`;

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redis.set(otpKey(phone), otp, "EX", 30); // oTP expires in 30 seconds
  res.json({ message: `OTP sent to ${phone}`, otp }); // In real app, don't send OTP in response
});

app.post("/otp-verify", async (req, res) => {
  const { phone, otp } = req.body;
  const storedOtp = await redis.get(otpKey(phone));

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await redis.del(otpKey(phone)); // Remove OTP after successful verification
  res.json({ message: "OTP verified successfully" });
});

app.get("/otp/:phone/ttl", async (req, res) => {
  const { phone } = req.params;
  const ttl = await redis.ttl(otpKey(phone));
  res.json({ phone, ttl });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
