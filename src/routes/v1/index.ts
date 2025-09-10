import config from "@/configs";
import { Router } from "express";

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

export default router;
