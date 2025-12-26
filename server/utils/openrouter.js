import axios from "axios";

export async function callLLM(prompt) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY?.trim();
    
    if (!apiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    // Try multiple models for better reliability
    const models = [
      "meta-llama/llama-3.1-8b-instruct:free",
      "microsoft/wizardlm-2-8x22b:free", 
      "mistralai/mistral-7b-instruct:free"
    ];
    
    let lastError = null;
    
    for (const model of models) {
      try {
        console.log(`Calling OpenRouter API with model: ${model}`);
        console.log(`API Key present: ${apiKey ? 'Yes' : 'No'}`);
        console.log(`API Key length: ${apiKey ? apiKey.length : 0}`);

        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: model,
            messages: [
              {
                role: "system",
                content: "You are an interview diagnostic AI. You must respond ONLY with valid JSON containing: category (string), confidence (number 0-100), suggestions (array of strings), actionItems (array of strings). No explanations, no markdown, just JSON."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 3000,
            top_p: 0.9
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:5000",
              "X-Title": "MistakeLoop Interview Analysis"
            },
            timeout: 45000
          }
        );

        console.log(`API Response Status: ${response.status}`);
        console.log(`API Response Data:`, JSON.stringify(response.data, null, 2));

        if (!response.data?.choices?.[0]?.message?.content) {
          console.error("Invalid OpenRouter response structure:", response.data);
          throw new Error("Invalid response structure from OpenRouter API");
        }

        const content = response.data.choices[0].message.content.trim();
        console.log(`OpenRouter response received from ${model}, length:`, content.length);
        console.log(`Response content preview:`, content.substring(0, 200) + '...');
        
        if (content.length < 10) {
          throw new Error(`Response too short from ${model}: "${content}"`);
        }
        
        return content;
        
      } catch (modelError) {
        console.error(`Error with model ${model}:`, modelError.message);
        lastError = modelError;
        
        // If it's an API key or rate limit issue, don't try other models
        if (modelError.response?.status === 401 || modelError.response?.status === 403) {
          break;
        }
        
        // Continue to next model for other errors
        continue;
      }
    }
    
    // If all models failed, throw the last error
    throw lastError || new Error("All models failed");
    
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
