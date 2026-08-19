import type { UserRole } from "../../auth/types/index.js";

export type AdminUserRole = UserRole | string;

export interface AdminPaginationOptions {
  page?: number;
  limit?: number;
}

export interface SafeUser {
  _id: unknown;
  name?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export interface PaginatedUsersResult {
  users: SafeUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateUserRoleNotFoundResult {
  type: "NOT_FOUND";
}

export interface UpdateUserRoleNoChangeResult {
  type: "NO_CHANGE";
  user: unknown;
}

export interface UpdateUserRoleLastAdminResult {
  type: "LAST_ADMIN";
}

export interface UpdateUserRoleUpdatedResult {
  type: "UPDATED";
  user: SafeUser | null;
}

export type UpdateUserRoleResult =
  | UpdateUserRoleNotFoundResult
  | UpdateUserRoleNoChangeResult
  | UpdateUserRoleLastAdminResult
  | UpdateUserRoleUpdatedResult;

export interface MonitorStats {
  totalMonitors: number;
  activeMonitors: number;
  pausedMonitors: number;
  healthyMonitors: number;
  failingMonitors: number;
  unknownMonitors: number;
  averageResponseTime: number;
}

export interface AdminIncidentQueryOptions extends AdminPaginationOptions {
  status?: string;
}

export interface PopulatedIncident {
  _id: unknown;
  monitorId: unknown;
  status: string;
  error?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

export interface PaginatedIncidentsResult {
  incidents: PopulatedIncident[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SystemStats {
  users: {
    total: number;
    active: number;
    disabled: number;
    admins: number;
    users: number;
  };
  monitors: {
    total: number;
    active: number;
    paused: number;
    healthy: number;
    failing: number;
    unknown: number;
  };
  incidents: {
    total: number;
    open: number;
    resolved: number;
  };
  logs: {
    totalChecks: number;
    successfulChecks: number;
    failedChecks: number;
    uptime: number;
  };
}
