import "dotenv/config";
import { sendEmailAlert } from "../src/modules/alert/email.service.js";

const run = async () => {
    try {
        console.log("📧 Testing email alert...");

        const result = await sendEmailAlert({
            to: process.env.ALERT_EMAIL,
            subject: "Smart Monitoring - Test Alert",
            text: `
This is a test alert from Smart Monitoring.

If you received this email, the Gmail/Nodemailer configuration is working correctly.

Time: ${new Date().toISOString()}
      `,
        });

        console.log("✅ Email sent successfully");
        console.log("Message ID:", result.messageId);
    } catch (error) {
        console.error("❌ Email failed");
        console.error(error.message);
    }
};

run();