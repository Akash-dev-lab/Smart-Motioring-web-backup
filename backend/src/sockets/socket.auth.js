import jwt from "jsonwebtoken";
import User from "../modules/auth/auth.model.js";

const getCookieValue = (cookieHeader, name) => {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(";");

    for (const cookie of cookies) {
        const [key, ...valueParts] = cookie.trim().split("=");

        if (key === name) {
            return decodeURIComponent(valueParts.join("="));
        }
    }

    return null;
};

export const authenticateSocket = async (
    socket,
    next
) => {
    try {
        // const token = socket.handshake.auth?.token;
        const token = getCookieValue(
            socket.handshake.headers.cookie,
            "accessToken"
        );

        if (!token) {
            return next(new Error("Authentication required"));
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded.userId).select(
            "_id role isActive"
        );

        if (!user) {
            return next(new Error("User not found"));
        }

        if (!user.isActive) {
            return next(new Error("Account is disabled"));
        }

        socket.user = {
            userId: user._id.toString(),
            role: user.role,
        };

        next();
    } catch (error) {
        console.error(
            "❌ Socket authentication failed:",
            error.message
        );

        next(new Error("Invalid or expired authentication"));
    }
};