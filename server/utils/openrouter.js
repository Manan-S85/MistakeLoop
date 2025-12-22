import axios from "axios";

export async function callLLM(prompt) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    console.log("Calling OpenRouter API with model: mistralai/mistral-7b-instruct");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an interview diagnostic AI. You must respond ONLY with valid JSON containing: category (string), severity (number 0-1), mistakes (array of strings), recommended_action (array of strings). No explanations, no markdown, just JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 2000
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
          "X-Title": "MistakeLoop Interview Analysis"
        },
        timeout: 30000
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      console.error("Invalid OpenRouter response structure:", response.data);
      throw new Error("Invalid response structure from OpenRouter API");
    }

    const content = response.data.choices[0].message.content;
    console.log("OpenRouter response received, length:", content.length);
    
    return content;
  } catch (error) {
    console.error("OpenRouter API Error:", error.message);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      console.error("OpenRouter API Error Response:", errorData);
      
      if (status === 401) {
        throw new Error("Invalid OpenRouter API key");
      } else if (status === 429) {
        throw new Error("OpenRouter API rate limit exceeded");
      } else if (status === 500) {
        throw new Error("OpenRouter API server error");
      } else {
        throw new Error(`OpenRouter API error: ${status} - ${errorData?.error?.message || error.response.statusText}`);
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("OpenRouter API request timeout");
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error("Cannot connect to OpenRouter API");
    }
    
    throw new Error(`OpenRouter request failed: ${error.message}`);
  }
}
