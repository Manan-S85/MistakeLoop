import Reflection from "../models/Reflection.js";

/**
 * Analyze recent reflections and find recurring issues
 */
export async function analyzePatterns(userId, days = 7) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  // Fetch recent reflections
  const reflections = await Reflection.find({
    userId,
    createdAt: { $gte: sinceDate }
  });

  const frequencyMap = {};
  const severityMap = {};

  // Count mistakes
  reflections.forEach(reflection => {
    reflection.mistakes.forEach(mistake => {
      const category = mistake.category;

      frequencyMap[category] = (frequencyMap[category] || 0) + 1;
      severityMap[category] =
        (severityMap[category] || 0) + (mistake.severity || 0);
    });
  });

  // Build summary
  const summary = Object.keys(frequencyMap).map(category => ({
    category,
    count: frequencyMap[category],
    avgSeverity:
      severityMap[category] / frequencyMap[category]
  }));

  // Sort by importance
  summary.sort((a, b) => {
    if (b.count === a.count) {
      return b.avgSeverity - a.avgSeverity;
    }
    return b.count - a.count;
  });

  return summary;
}
