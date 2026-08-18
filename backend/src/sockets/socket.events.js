import { joinUserRoom, leaveUserRoom } from "./socket.rooms.js";

export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",

    MONITOR_STATUS: "monitor:status",
    INCIDENT_CREATED: "incident:created",
    INCIDENT_RESOLVED: "incident:resolved",
};

export const registerSocketEvents = (socket) => {

    joinUserRoom(socket);

    socket.emit("socket:ready", {
        success: true,
        socketId: socket.id,
        userId: socket.user.userId,
        room: `user:${socket.user.userId}`,
        message: "Authenticated WebSocket connection established",
    });

    socket.on("disconnect", () => {
        leaveUserRoom(socket);
    });
};