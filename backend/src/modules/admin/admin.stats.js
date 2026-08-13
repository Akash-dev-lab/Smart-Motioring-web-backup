import User from "../auth/auth.model.js";
import Monitor from "../monitor/monitor.model.js";
import Incident from "../incident/incident.model.js";
import Log from "../logs/log.model.js";
import { getMonitorStats } from "./admin.service.js";

export const getSystemStats = async () => {
    const [
        totalUsers,
        activeUsers,
        adminUsers,
        totalMonitors,
        activeMonitors,
        totalIncidents,
        openIncidents,
        totalLogs,
        successfulLogs,
        monitorStats,
    ] = await Promise.all([
        User.countDocuments(),

        User.countDocuments({
            isActive: true,
        }),

        User.countDocuments({
            role: "admin",
        }),

        Monitor.countDocuments(),

        Monitor.countDocuments({
            active: true,
        }),

        Incident.countDocuments(),

        Incident.countDocuments({
            status: "OPEN",
        }),

        Log.countDocuments(),

        Log.countDocuments({
            success: true,
        }),

        getMonitorStats(),
    ]);

    const disabledUsers = totalUsers - activeUsers;
    const normalUsers = totalUsers - adminUsers;

    const pausedMonitors = totalMonitors - activeMonitors;
    const failedLogs = totalLogs - successfulLogs;

    const uptime =
        totalLogs > 0
            ? Number(((successfulLogs / totalLogs) * 100).toFixed(2))
            : 0;

    const resolvedIncidents = totalIncidents - openIncidents;

    return {
        users: {
            total: totalUsers,
            active: activeUsers,
            disabled: disabledUsers,
            admins: adminUsers,
            users: normalUsers,
        },

        monitors: {
            total: totalMonitors,
            active: activeMonitors,
            paused: pausedMonitors,
            healthy: monitorStats.healthyMonitors,
            failing: monitorStats.failingMonitors,
            unknown: monitorStats.unknownMonitors,
        },

        incidents: {
            total: totalIncidents,
            open: openIncidents,
            resolved: resolvedIncidents,
        },

        logs: {
            totalChecks: totalLogs,
            successfulChecks: successfulLogs,
            failedChecks: failedLogs,
            uptime,
        },
    };
};