export function generateEscalatedMessage(issue) {
  if (issue.weeksPersisted === 1) {
    return `You struggled with "${issue.category}" this week. Start working on it before your next interview.`;
  }

  if (issue.weeksPersisted === 2) {
    return `This is the second week you're facing "${issue.category}". You are not improving yet.`;
  }

  return `You have failed repeatedly due to "${issue.category}" for ${issue.weeksPersisted} weeks. Ignoring this will keep costing you interviews.`;
}
