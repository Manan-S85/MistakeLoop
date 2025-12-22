export function buildPrompt(userReflection, pastMistakes = []) {
  return `
Analyze this interview reflection and provide feedback in EXACTLY this JSON format:

{
  "category": "string (e.g., 'Technical Skills', 'Communication', 'Preparation')",
  "severity": 0.7,
  "mistakes": ["specific mistake 1", "specific mistake 2"],
  "recommended_action": ["actionable advice 1", "actionable advice 2"]
}

Candidate reflection:
"${userReflection}"

Past recurring issues:
${pastMistakes.length ? pastMistakes.join(', ') : 'None provided'}

Provide specific, actionable feedback. Return ONLY valid JSON, no explanations or markdown.
`;
}
