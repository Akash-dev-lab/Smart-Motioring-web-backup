/**
 * Truly cross-module, shared types used across multiple independent modules.
 * Note: Module-specific types belong in src/modules/<module-name>/types/
 */

export interface PaginationQuery {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  pagination?: PaginationMeta;
  error?: string;
}
