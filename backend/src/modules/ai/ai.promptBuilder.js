export const buildPrompt = ({ monitor, logs, incident }) => {
  const recentLogs = logs
    .slice(0, 5)
    .map((log) => {
      return [
        `Status: ${log.status}`,
        `Latency: ${log.responseTime}ms`,
        `Success: ${log.success}`,
      ].join(", ");
    })
    .join("\n");

  return `
You are an uptime monitoring AI.

Analyze the monitoring data below.

Monitor:
URL: ${monitor.url}
Method: ${monitor.method}
Interval: ${monitor.interval}ms

Recent Logs:
${recentLogs || "No logs available"}

Incident:
${incident ? incident.message : "No active incident"}

Tasks:
1. Determine whether the system is stable or unstable.
2. Identify the most likely root cause.
3. Provide practical corrective suggestions.

Return ONLY valid JSON.

Required format:
{
  "status": "STABLE or UNSTABLE",
  "reason": "short explanation",
  "suggestion": [
    "action 1",
    "action 2"
  ]
}
`;
};