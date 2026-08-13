import { getAllUsers } from "./admin.service.js";
import { disableUser, enableUser } from "./admin.service.js";
import mongoose from "mongoose";

export const getAllUsersController = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 10,
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        if (!Number.isInteger(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive integer",
            });
        }

        if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
            return res.status(400).json({
                success: false,
                message: "Limit must be between 1 and 100",
            });
        }

        const result = await getAllUsers({
            page,
            limit,
        });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            count: result.users.length,
            data: result.users,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
                hasNextPage: result.page < result.totalPages,
                hasPreviousPage: result.page > 1,
            },
        });
    } catch (err) {
        console.error("Admin get users error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const disableUserController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        if (id === req.user.userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "Admin cannot disable their own account",
            });
        }

        const user = await disableUser(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User disabled successfully",
            data: user,
        });
    } catch (err) {
        console.error("Disable user error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const enableUserController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const user = await enableUser(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User enabled successfully",
            data: user,
        });
    } catch (err) {
        console.error("Enable user error:", err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};