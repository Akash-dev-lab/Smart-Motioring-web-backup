export interface DashboardSummary {
  totalMonitors: number;
  activeIncidents: number;
  uptime: string | number;
}

export interface DashboardMonitorAnalytics {
  totalChecks: number;
  successRate: number;
  latency: (number | undefined)[];
}
