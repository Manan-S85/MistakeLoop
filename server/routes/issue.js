import express from "express";
import Issue from "../models/issue.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get active issues
router.get("/", auth, async (req, res) => {
  const issues = await Issue.find({
    userId: req.userId,
    resolved: false
  });

  res.json(issues);
});

// MARK ISSUE AS FIXED ✅
router.patch("/:id/resolve", auth, async (req, res) => {
  const issue = await Issue.findOne({
    _id: req.params.id,
    userId: req.userId
  });

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  issue.resolved = true;
  await issue.save();

  res.json({ message: "Issue marked as resolved" });
});

export default router;
