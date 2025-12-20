import Issue from "../models/issue.js";

/**
 * Update persistent issues based on weekly patterns
 */
export async function updateIssues(userId, patterns) {
  const activeCategories = patterns.map(p => p.category);

  // 1. Update existing issues
  const existingIssues = await Issue.find({
    userId,
    resolved: false
  });

  for (const issue of existingIssues) {
    if (activeCategories.includes(issue.category)) {
      issue.weeksPersisted += 1;
      issue.lastSeen = new Date();
      await issue.save();
    } else {
      issue.resolved = true;
      await issue.save();
    }
  }

  // 2. Add new issues
  for (const category of activeCategories) {
    const exists = await Issue.findOne({
      userId,
      category,
      resolved: false
    });

    if (!exists) {
      await Issue.create({
        userId,
        category
      });
    }
  }
}
