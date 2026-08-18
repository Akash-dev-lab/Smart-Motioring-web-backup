import { Server } from "socket.io";
import { registerSocketEvents } from "./socket.events.js";
import { authenticateSocket } from "./socket.auth.js";

let io;

export const initializeSocketServer = (httpServer) => {
    if (io) {
        return io;
    }

    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            credentials: true,
        },

        transports: ["websocket", "polling"],
    });

    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        console.log(
            `🔌 Authenticated socket connected: ${socket.id} | user=${socket.user.userId}`
        );

        registerSocketEvents(socket, io);

        socket.on("disconnect", (reason) => {
            console.log(
                `🔌 Socket disconnected: ${socket.id} | ${reason}`
            );
        });
    });

    console.log("🟢 Socket.IO server initialized");

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized"
        );
    }

    return io;
};