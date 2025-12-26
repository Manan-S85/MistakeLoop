import express from "express";
import { callLLM } from "../utils/openrouter.js";
import { buildPrompt } from "../brain/promptBuilder.js";
import { validateLLMResponse, generateFallbackResponse } from "../brain/validator.js";
import Reflection from "../models/Reflection.js";
import User from "../models/User.js";



const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { reflection, email, pastMistakes, userContext } = req.body;

    if (!reflection) {
      return res.status(400).json({ error: "Reflection text is required" });
    }

    console.log("Starting analysis for reflection:", reflection.substring(0, 100) + "...");
    if (userContext) {
      console.log("User context provided:", userContext);
    }

    let validated = null;
    
    try {
      // Try LLM first (core functionality)
      const prompt = buildPrompt(reflection, pastMistakes, userContext);
      console.log("Built prompt with context, calling LLM...");
      
      const llmOutput = await callLLM(prompt);
      console.log("Raw LLM response:", llmOutput);
      
      validated = validateLLMResponse(llmOutput);
      
      if (validated) {
        console.log("LLM validation successful:", validated);
      } else {
        console.warn("LLM validation failed, falling back to structured response");
        throw new Error("LLM validation failed");
      }
    } catch (llmError) {
      console.error("LLM error:", llmError.message);
      console.log("Using fallback response system...");
      
      // Use fallback response
      validated = generateFallbackResponse(userContext, reflection);
      console.log("Fallback response generated:", validated);
    }

    if (!validated) {
      console.error("Both LLM and fallback failed");
      return res.status(500).json({ 
        error: "Analysis system temporarily unavailable - please try again later"
      });
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

        // Save reflection with user context
        savedReflection = await Reflection.create({
          userId: user._id,
          rawText: reflection,
          mistakes: validated.suggestions || [],
          category: validated.category,
          severity: validated.confidence / 100,
          recommendedActions: validated.actionItems || [],
          userContext: userContext || {} // Save user context
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
