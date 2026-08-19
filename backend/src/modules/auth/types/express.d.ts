import type { UserRole } from "./index.js";

// Extend Express.Request with an optional `user` field.
// Optional (user?) because unauthenticated / public routes also use Request.
declare global {
  namespace Express {
    interface AuthenticatedUser {
      userId: string;
      role: UserRole;
    }

    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
