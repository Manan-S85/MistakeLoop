export function validateLLMResponse(text) {
  try {
    const parsed = JSON.parse(text);

    if (!parsed.mistakes || !Array.isArray(parsed.mistakes)) {
      throw new Error("Invalid mistakes format");
    }

    return parsed;
  } catch (err) {
    return null;
  }
}
