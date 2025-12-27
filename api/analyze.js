import { connectDB } from "../server/utils/db.js";
import { callLLM } from "../server/utils/openrouter.js";
import { buildPrompt } from "../server/brain/promptBuilder.js";
import { validateLLMResponse, generateFallbackResponse } from "../server/brain/validator.js";
import Reflection from "../server/models/Reflection.js";
import User from "../server/models/User.js";

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

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
      
      const llmResponse = await callLLM(prompt);
      console.log("LLM response received, validating...");
      
      validated = validateLLMResponse(llmResponse);
      console.log("Response validated successfully");
      
    } catch (llmError) {
      console.error("LLM processing failed:", llmError.message);
      
      // Fallback to pattern analysis
      console.log("Falling back to pattern analysis...");
      validated = generateFallbackResponse(reflection, pastMistakes);
      console.log("Fallback analysis completed");
    }

    // Save reflection
    if (email) {
      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({ email, name: email.split('@')[0] });
          await user.save();
        }

        const newReflection = new Reflection({
          userId: user._id,
          reflection,
          analysis: validated,
          createdAt: new Date()
        });

        await newReflection.save();
        console.log("Reflection saved to database");
      } catch (dbError) {
        console.error("Database save failed:", dbError.message);
      }
    }

    res.json(validated);
    
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
}