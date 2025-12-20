import express from "express";
import User from "../models/User.js";
import { analyzePatterns } from "../brain/patternAnalyzer.js";
import { generateWeeklySummary } from "../brain/weeklySummary.js";

const router = express.Router();

router.get("/weekly", async (req, res) => {
  const { email } = req.query;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const patterns = await analyzePatterns(user._id);
    const summary = generateWeeklySummary(patterns);

    res.json({
      patterns,
      summary
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
