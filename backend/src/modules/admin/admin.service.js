import User from "../auth/auth.model.js";

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
