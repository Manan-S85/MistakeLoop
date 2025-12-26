export function validateLLMResponse(text) {
  try {
    // Clean up common LLM response issues
    let cleanedText = text.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Remove any leading/trailing non-JSON text
    const jsonStart = cleanedText.indexOf('{');
    const jsonEnd = cleanedText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanedText = cleanedText.substring(jsonStart, jsonEnd + 1);
    }

    const parsed = JSON.parse(cleanedText);

    // Validate required fields and normalize structure
    const normalized = {
      category: parsed.category || "General Interview Issues",
      confidence: Math.round((parsed.severity || 0.5) * 100),
      suggestions: [],
      actionItems: []
    };

    // Handle mistakes field - convert to suggestions
    if (parsed.mistakes && Array.isArray(parsed.mistakes)) {
      normalized.suggestions = parsed.mistakes.map(mistake => 
        typeof mistake === 'string' ? mistake : String(mistake)
      );
    } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
      normalized.suggestions = parsed.suggestions.map(suggestion => 
        typeof suggestion === 'string' ? suggestion : String(suggestion)
      );
    }

    // Handle recommended_action field - convert to actionItems
    if (parsed.recommended_action) {
      if (Array.isArray(parsed.recommended_action)) {
        normalized.actionItems = parsed.recommended_action.map(action => 
          typeof action === 'string' ? action : String(action)
        );
      } else if (typeof parsed.recommended_action === 'string') {
        // Split by common separators if it's a single string
        normalized.actionItems = parsed.recommended_action
          .split(/[\n•-]|\.\s+/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
    } else if (parsed.actionItems && Array.isArray(parsed.actionItems)) {
      normalized.actionItems = parsed.actionItems.map(item => 
        typeof item === 'string' ? item : String(item)
      );
    } else if (parsed.action_items && Array.isArray(parsed.action_items)) {
      normalized.actionItems = parsed.action_items.map(item => 
        typeof item === 'string' ? item : String(item)
      );
    }

    // Ensure we have some content
    if (normalized.suggestions.length === 0 && normalized.actionItems.length === 0) {
      throw new Error("No useful content found in response");
    }

    return normalized;
  } catch (err) {
    console.error("LLM Response validation error:", err.message);
    console.error("Raw response:", text);
    return null;
  }
}

// Fallback function to provide structured response when LLM fails
export function generateFallbackResponse(userContext, reflection) {
  const fallbackResponse = {
    category: "Interview Skills Development",
    confidence: 60,
    suggestions: [],
    actionItems: []
  };

  // Generate context-based suggestions
  if (userContext?.sentiment && userContext.sentiment.toLowerCase().includes('nervous')) {
    fallbackResponse.suggestions.push(
      "I noticed you mentioned feeling nervous - this is completely normal! The key is transforming that nervous energy into focused preparation.",
      "Practice the STAR method (Situation, Task, Action, Result) for behavioral questions to build confidence in your storytelling.",
      "Record yourself answering common interview questions and review them to identify areas for improvement."
    );
  }

  if (userContext?.skills) {
    fallbackResponse.suggestions.push(
      `For ${userContext.skills} interviews, focus on hands-on technical preparation and building a portfolio of relevant projects.`,
      "Research the company's tech stack and be prepared to discuss how your experience aligns with their needs."
    );
  }

  // Generate universal action items
  fallbackResponse.actionItems = [
    "This Week: Practice 3 behavioral questions daily using the STAR method. Record yourself and refine your answers.",
    "Week 2-3: Complete 2-3 technical assessments or coding challenges to sharpen your problem-solving skills.",  
    "Month 2: Schedule mock interviews with career services or peers to get feedback on your performance.",
    "Daily Routine: Morning (30 min): Review company research and role requirements. Evening (45 min): Practice technical skills or behavioral questions.",
    "Resource Toolkit: Use Glassdoor for company insights, LeetCode/HackerRank for technical prep, and Pramp for mock interviews.",
    "Track Progress: Keep an interview journal noting what went well, areas for improvement, and lessons learned from each experience."
  ];

  return fallbackResponse;
}
