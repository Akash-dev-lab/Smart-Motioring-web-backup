import Alert from "./alert.model.js";
import { sendEmailAlert } from "./email.service.js";
import AIInsight from "../ai/ai.model.js";
import type { TriggerAlertInput } from "./types/index.js";

export const triggerAlert = async ({
  monitorId,
  incident,
}: TriggerAlertInput): Promise<void> => {
  try {
    const recipient = process.env.ALERT_EMAIL || "";

    // 🧠 GET AI DATA
    const ai = await AIInsight.findOne({
      incidentId: incident._id,
    }).sort({ createdAt: -1 });

    // 🔥 SAFE SUGGESTION HANDLING
    const suggestions: string[] = Array.isArray(ai?.suggestion)
      ? (ai.suggestion as string[])
      : typeof ai?.suggestion === "string"
        ? [ai.suggestion]
        : [];

    const formattedSuggestions = suggestions.length
      ? suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")
      : "No suggestions available";

    // 🎯 SUBJECT
    const subject = ai
      ? `🚨 Website Down (${ai.status?.toUpperCase() || "UNKNOWN"})`
      : "🚨 Website Down";

    // 📩 EMAIL BODY
    const message = `
🚨 WEBSITE ALERT

🔗 Monitor ID: ${incident.monitorId}
❌ Failures: ${incident.failCount}

${
  ai
    ? `
🧠 AI ANALYSIS
Status: ${ai.status}

Reason:
${ai.reason}

Suggestions:
${formattedSuggestions}
`
    : "⚠️ AI analysis not available"
}
`;

    // 📤 SEND EMAIL
    await sendEmailAlert({
      to: recipient,
      subject,
      text: message,
    });

    // 💾 SAVE ALERT
    await Alert.create({
      monitorId,
      incidentId: incident._id,
      status: "SENT",
      message,
      ai: ai
        ? {
            status: ai.status,
            reason: ai.reason,
            suggestion: suggestions,
          }
        : null,
    });

    console.log("🚨 Smart Alert sent");
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Alert failed:", errorMessage);

    await Alert.create({
      monitorId,
      incidentId: incident._id,
      status: "FAILED",
      message: errorMessage,
    });
  }
};
