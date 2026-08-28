import { schedule } from "@netlify/functions";

// Netlify Scheduled Function to trigger the cron/reminders route
const handler = schedule("@hourly", async (event) => {
  // Use the internal URL to trigger the next.js route
  const appUrl = process.env.URL || "http://localhost:3000";
  
  try {
    const response = await fetch(`${appUrl}/api/v1/cron/reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass a secure token so the route knows it's a legitimate request
        "Authorization": `Bearer ${process.env.CRON_SECRET}`,
      }
    });
    
    if (!response.ok) {
      console.error(`Cron trigger failed with status: ${response.status}`);
      return { statusCode: response.status };
    }
    
    const data = await response.json();
    console.log("Reminders processed successfully:", data);
    return { statusCode: 200 };
  } catch (err) {
    console.error("Error triggering reminders cron:", err);
    return { statusCode: 500 };
  }
});

export { handler };
