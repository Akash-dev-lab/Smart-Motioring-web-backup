import type { Server } from "socket.io";
import { joinUserRoom, leaveUserRoom } from "./socket.rooms.js";
import type { AuthenticatedSocket } from "./types/index.js";

export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  MONITOR_STATUS: "monitor:status",
  INCIDENT_CREATED: "incident:created",
  INCIDENT_RESOLVED: "incident:resolved",
} as const;

export type SocketEventType =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export const registerSocketEvents = (
  socket: AuthenticatedSocket,
  _io?: Server
): void => {
  joinUserRoom(socket);

  const userId = socket.user?.userId;

  socket.emit("socket:ready", {
    success: true,
    socketId: socket.id,
    userId,
    room: userId ? `user:${userId}` : "",
    message: "Authenticated WebSocket connection established",
  });

  socket.on("disconnect", () => {
    leaveUserRoom(socket);
  });
};
