import type { Socket } from "socket.io";

export interface SocketUser {
  userId: string;
  role?: string;
}

export interface AuthenticatedSocket extends Socket {
  user?: SocketUser;
}

export interface MonitorStatusPubSubPayload {
  userId: string;
  monitorId: string;
  targetId?: string;
  region?: string;
  regionName?: string;
  provider?: string;
  status?: number;
  responseTime?: number;
  success?: boolean;
  error?: string | null;
  checkedAt?: string;
  [key: string]: unknown;
}
