export function buildPrompt(userReflection, pastMistakes = []) {
  return `
Candidate reflection:
"${userReflection}"

Past recurring issues:
${pastMistakes.length ? pastMistakes.join(", ") : "None"}

Analyze the reflection and return:
- mistakes (array)
- category
- severity (0 to 1)
- recommended_action

Return ONLY valid JSON.
`;
}
