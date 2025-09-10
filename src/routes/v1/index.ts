import config from "@/configs";
import { Router } from "express";

import authRoutes from "@/routes/v1/auth";

const router = Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    message: "Server is live",
    status: "ok",
    app: config.appName,
    version: config.appVersion,
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);

export default router;
