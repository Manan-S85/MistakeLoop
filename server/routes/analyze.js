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

    console.log("Starting analysis for reflection:", reflection.substring(0, 100) + "...");

    // Call LLM first (core functionality)
    const prompt = buildPrompt(reflection, pastMistakes);
    console.log("Built prompt, calling LLM...");
    
    const llmOutput = await callLLM(prompt);
    console.log("Raw LLM response:", llmOutput);
    
    const validated = validateLLMResponse(llmOutput);

    if (!validated) {
      console.error("LLM validation failed for response:", llmOutput);
      return res.status(500).json({ 
        error: "Invalid LLM response - please try again",
        debug: process.env.NODE_ENV === 'development' ? llmOutput : undefined
      });
    }

    console.log("Validation successful:", validated);

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
          mistakes: validated.suggestions || [], // Map to new field names
          category: validated.category,
          severity: validated.confidence / 100, // Convert back to 0-1 scale
          recommendedActions: validated.actionItems || []
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
    console.error("Full error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Analysis failed";
    if (error.message.includes("OpenRouter")) {
      errorMessage = "AI service temporarily unavailable";
    } else if (error.message.includes("API key")) {
      errorMessage = "AI service not configured";
    } else if (error.message.includes("network") || error.message.includes("timeout")) {
      errorMessage = "Network error - please try again";
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
