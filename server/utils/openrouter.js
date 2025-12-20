import axios from "axios";

export async function callLLM(prompt) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OpenRouter API key not configured");
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "You are an interview diagnostic AI. Respond ONLY in valid JSON with fields: mistakes (array), category (string), severity (number 0-1), recommended_action (string)."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from OpenRouter API");
    }

    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.response) {
      throw new Error(`OpenRouter API error: ${error.response.status} - ${error.response.data?.error?.message || error.response.statusText}`);
    }
    throw new Error(`OpenRouter request failed: ${error.message}`);
  }
}
