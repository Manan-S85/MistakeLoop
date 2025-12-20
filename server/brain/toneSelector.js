export function getTone(issue) {
  if (issue.weeksPersisted === 1) return "supportive";
  if (issue.weeksPersisted === 2) return "direct";
  return "strict";
}
