import express from "express";
import { callLLM } from "../utils/openrouter.js";
import { buildPrompt } from "../brain/promptBuilder.js";
import { validateLLMResponse } from "../brain/validator.js";
import Reflection from "../models/Reflection.js";
import User from "../models/User.js";



const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { reflection, email, pastMistakes } = req.body;

    if (!reflection) {
      return res.status(400).json({ error: "Reflection text is required" });
    }

    // Call LLM first (core functionality)
    const prompt = buildPrompt(reflection, pastMistakes);
    const llmOutput = await callLLM(prompt);
    const validated = validateLLMResponse(llmOutput);

    if (!validated) {
      return res.status(500).json({ error: "Invalid LLM response" });
    }

    // Try to save to database if available and email provided
    let savedReflection = null;
    if (email && process.env.MONGODB_URI) {
      try {
        // Find or create user
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({ email });
        }

        // Save reflection
        savedReflection = await Reflection.create({
          userId: user._id,
          rawText: reflection,
          mistakes: validated.mistakes,
          category: validated.category,
          severity: validated.severity,
          recommendedActions: validated.recommended_action
        });
      } catch (dbError) {
        console.error("Database error:", dbError.message);
        // Continue without saving to DB
      }
    }

    // Return the analysis (with or without DB save)
    res.json({
      ...validated,
      id: savedReflection?._id,
      saved: !!savedReflection
    });

  } catch (error) {
    console.error("Analysis error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
