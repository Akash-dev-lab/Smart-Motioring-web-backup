import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Socket Connected:", socket.id);
});

socket.on("socket:ready", (data) => {
  console.log("✅ Socket ready:", data);
});

socket.on("monitor:status", (data) => {
  console.log("📡 Live Monitor Status received in Frontend:", data);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket Disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

export default socket;