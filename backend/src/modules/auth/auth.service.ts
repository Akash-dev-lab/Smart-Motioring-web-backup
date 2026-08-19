import User from "./auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type {
  IUserDocument,
  AuthJwtPayload,
  RegisterUserInput,
  LoginUserInput,
  AuthUserResult,
  RefreshAccessTokenResult,
} from "./types/index.js";

// ── Internal JWT helper ───────────────────────────────────────────────────────

interface GeneratedTokens {
  accessToken: string;
  refreshToken: string;
}

const generateTokens = (user: IUserDocument): GeneratedTokens => {
  const accessPayload: AuthJwtPayload = {
    userId: user._id.toString(),
    role: user.role!,
  };

  const accessToken = jwt.sign(accessPayload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  const refreshToken = jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

// ── 🔐 REGISTER ───────────────────────────────────────────────────────────────

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserInput): Promise<AuthUserResult> => {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Generate tokens for immediate login after registration
  const { accessToken, refreshToken } = generateTokens(user);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

// ── 🔐 LOGIN ──────────────────────────────────────────────────────────────────

export const loginUser = async ({
  email,
  password,
}: LoginUserInput): Promise<AuthUserResult> => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password as string);
  if (!isMatch) throw new Error("Invalid credentials");

  if (!user.isActive) {
    throw new Error("Account is disabled. Please contact admin.");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

// ── 🔁 REFRESH TOKEN ─────────────────────────────────────────────────────────

export const refreshAccessToken = async (
  token: string
): Promise<RefreshAccessTokenResult> => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      throw new Error("Invalid refresh token");
    }

    if (!user.isActive) {
      throw new Error("Account is disabled. Please contact admin.");
    }

    const { accessToken } = generateTokens(user);

    return { accessToken };
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message === "Account is disabled. Please contact admin."
    ) {
      throw err;
    }

    throw new Error("Invalid refresh token");
  }
};

// ── 🚪 LOGOUT ─────────────────────────────────────────────────────────────────

export const logoutUser = async (userId: string): Promise<void> => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
