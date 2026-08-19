export const ALLOWED_HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

export type AllowedHttpMethod = typeof ALLOWED_HTTP_METHODS[number];
