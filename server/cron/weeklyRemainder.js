import cron from "node-cron";
import { getTone } from "../brain/toneSelector.js";
import { buildTonePrompt } from "../brain/tonePrompt.js";
import { generateToneMessage } from "../brain/aiToneEngine.js";
import Issue from "../models/issue.js";

async function sendWeeklyReminders() {
  try {
    console.log("🔔 Running weekly reminder check...");
    
    // Get all unresolved issues
    const issues = await Issue.find({ resolved: false });
    
    if (!issues.length) {
      console.log("✅ No unresolved issues found.");
      return;
    }

    for (const issue of issues) {
      const tone = getTone(issue);

      const prompt = buildTonePrompt({
        issueCategory: issue.category,
        weeksPersisted: issue.weeksPersisted,
        tone
      });

      const message = await generateToneMessage(prompt);

      console.log(`[AI REMINDER] ${message}`);
    }
  } catch (error) {
    console.error("❌ Error in weekly reminder:", error.message);
  }
}

export function startWeeklyReminder() {
  // Run every Sunday at 9 AM (0 9 * * 0)
  cron.schedule('0 9 * * 0', sendWeeklyReminders, {
    scheduled: true,
    timezone: "America/New_York"
  });
  
  console.log("⏰ Weekly reminder scheduled for Sundays at 9 AM");
}
