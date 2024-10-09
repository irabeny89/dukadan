import { InternalServerError } from "elysia";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { envVar } from "../config";
import type { Customer } from "../models/customer";
import type { UserRoleT } from "../types";

export type TokenT = Record<"access" | "refresh", string>;
export type AccessDataT = {
  userId: number;
  username: string;
  role: UserRoleT;
};
export type RefreshDataT = {
  userId: number;
};

const setTokens = (userId: number, username: string) => {
  const data: AccessDataT = { userId, username, role: "customer" };
  const access = jwt.sign(data, envVar.secret, {
    expiresIn: 10000,
  });

  const refreshData: RefreshDataT = { userId };
  const refresh = jwt.sign(refreshData, envVar.secret2, {
    expiresIn: 10000,
  });

  return { access, refresh };
};

export const setAuthTokens = (user: Customer) => {
  if (user.id) {
    return setTokens(user.id, user.username);
  }
  throw new InternalServerError();
};

export const verifyToken = <T>(
  token: string,
  tokenType: "access" | "refresh" = "access",
) => {
  return tokenType === "access"
    ? (jwt.verify(token, envVar.secret) as JwtPayload & T)
    : (jwt.verify(token, envVar.secret2) as JwtPayload & T);
};
