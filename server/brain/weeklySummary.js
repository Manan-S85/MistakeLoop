export function generateWeeklySummary(patterns) {
  if (patterns.length === 0) {
    return {
      message: "No interviews logged this week. Stay consistent.",
      dominantIssue: null
    };
  }

  const topIssue = patterns[0];

  let message = `Your most recurring issue this week is "${topIssue.category}".`;

  if (topIssue.count >= 3) {
    message +=
      " This problem is repeating frequently and needs immediate attention.";
  } else if (topIssue.count === 2) {
    message +=
      " You should actively work on fixing this before your next interview.";
  } else {
    message +=
      " It appeared once, but keep an eye on it.";
  }

  return {
    dominantIssue: topIssue.category,
    message
  };
}
