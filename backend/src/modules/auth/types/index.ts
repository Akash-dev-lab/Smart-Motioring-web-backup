import { Document, Model } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isActive: boolean;
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

export type IUserModel = Model<IUserDocument>;

export interface AuthJwtPayload {
  userId: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// ── Service input types ──────────────────────────────────────────

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  email: string;
  password: string;
}

// ── Service result types ─────────────────────────────────────────

export interface AuthUserResult {
  user: IUserDocument;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshAccessTokenResult {
  accessToken: string;
}
