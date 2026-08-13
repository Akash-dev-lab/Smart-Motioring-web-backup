import User from "../auth/auth.model.js";
import Monitor from "../monitor/monitor.model.js";
import Incident from "../incident/incident.model.js";

export const getAllUsers = async ({
    page = 1,
    limit = 10,
} = {}) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        User.find({})
            .select("-password -refreshToken")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        User.countDocuments(),
    ]);

    return {
        users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};

export const disableUser = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            isActive: false,
            refreshToken: null,
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");
};

export const enableUser = async (userId) => {
    return await User.findByIdAndUpdate(
        userId,
        {
            isActive: true,
        },
        {
            new: true,
            runValidators: true,
        }
    ).select("-password -refreshToken");
};

export const updateUserRole = async (userId, role) => {
    const user = await User.findById(userId);

    if (!user) {
        return {
            type: 'NOT_FOUND',
        };
    }

    if (user.role === role) {
        return {
            type: 'NO_CHANGE',
            user,
        };
    }

    // Prevent removing the last admin from the system
    if (user.role === 'admin' && role === 'user') {
        const adminCount = await User.countDocuments({
            role: 'admin',
            isActive: true,
        });

        if (adminCount <= 1) {
            return {
                type: 'LAST_ADMIN',
            };
        }
    }

    user.role = role;

    // Force a fresh login/refresh token after role change
    user.refreshToken = null;

    await user.save();

    const safeUser = await User.findById(userId)
        .select('-password -refreshToken')
        .lean();

    return {
        type: 'UPDATED',
        user: safeUser,
    };
};

export const getMonitorStats = async () => {
    const result = await Monitor.aggregate([
        {
            $lookup: {
                from: "logs",
                let: {
                    monitorId: "$_id",
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$monitorId", "$$monitorId"],
                            },
                        },
                    },
                    {
                        $sort: {
                            createdAt: -1,
                        },
                    },
                    {
                        $limit: 1,
                    },
                    {
                        $project: {
                            _id: 0,
                            success: 1,
                            responseTime: 1,
                        },
                    },
                ],
                as: "latestLog",
            },
        },

        {
            $unwind: {
                path: "$latestLog",
                preserveNullAndEmptyArrays: true,
            },
        },

        {
            $group: {
                _id: null,

                totalMonitors: {
                    $sum: 1,
                },

                activeMonitors: {
                    $sum: {
                        $cond: [
                            { $eq: ["$active", true] },
                            1,
                            0,
                        ],
                    },
                },

                pausedMonitors: {
                    $sum: {
                        $cond: [
                            { $eq: ["$active", false] },
                            1,
                            0,
                        ],
                    },
                },

                healthyMonitors: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$active", true] },
                                    { $eq: ["$latestLog.success", true] },
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                failingMonitors: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$active", true] },
                                    { $eq: ["$latestLog.success", false] },
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                unknownMonitors: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$active", true] },
                                    {
                                        $eq: [
                                            {
                                                $type: "$latestLog",
                                            },
                                            "missing",
                                        ],
                                    },
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },

                averageResponseTime: {
                    $avg: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$active", true] },
                                    { $ne: ["$latestLog.responseTime", null] },
                                ],
                            },
                            "$latestLog.responseTime",
                            null,
                        ],
                    },
                },
            },
        },

        {
            $project: {
                _id: 0,
                totalMonitors: 1,
                activeMonitors: 1,
                pausedMonitors: 1,
                healthyMonitors: 1,
                failingMonitors: 1,
                unknownMonitors: 1,
                averageResponseTime: {
                    $round: [
                        {
                            $ifNull: ["$averageResponseTime", 0],
                        },
                        0,
                    ],
                },
            },
        },
    ]);

    return (
        result[0] || {
            totalMonitors: 0,
            activeMonitors: 0,
            pausedMonitors: 0,
            healthyMonitors: 0,
            failingMonitors: 0,
            unknownMonitors: 0,
            averageResponseTime: 0,
        }
    );
};

export const getAllIncidentsAdmin = async ({
    page = 1,
    limit = 10,
    status,
}) => {
    const skip = (page - 1) * limit;

    const filter = {};

    if (status) {
        filter.status = status;
    }

    const [incidents, total] = await Promise.all([
        Incident.find(filter)
            .populate(
                "monitorId",
                "url method userId active"
            )
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),

        Incident.countDocuments(filter),
    ]);

    return {
        incidents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
};