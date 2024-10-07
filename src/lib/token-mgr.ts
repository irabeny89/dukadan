import { type Cookie, InternalServerError } from "elysia";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { envVar } from "../config";
import type { User } from "../models/user";
import type { UserRoleT } from "../types";

type CookieT = Record<string, Cookie<string | undefined>> & {
	refresh: Cookie<string | undefined>;
};

export type TokenT = Record<"access" | "refresh", string>;
export type AccessDataT = {
	userId: number;
	username: string;
	role: UserRoleT;
};

const SECRET = envVar.secret;
const REFRESH_EXP = +envVar.refreshExp;
const ACCESS_EXP = +envVar.accessExp;

const setTokens = (cookie: CookieT, userId: number, username: string) => {
	// set refresh token
	const refresh = cookie.refresh.set({
		maxAge: REFRESH_EXP,
		secure: true,
		sameSite: "lax",
		httpOnly: true,
		value: jwt.sign(userId.toString(), SECRET),
	}).value as string;

	const data: AccessDataT = { userId, username, role: "customer" };
	const access = jwt.sign(data, SECRET, {
		expiresIn: ACCESS_EXP,
	});

	return { access, refresh };
};

export const setAuthTokens = (cookie: CookieT, user: User) => {
	if (user.id) {
		return setTokens(cookie, user.id, user.username);
	}
	throw new InternalServerError();
};

export const verifyToken = <T>(token: string) => {
	return jwt.verify(token, SECRET) as JwtPayload & T;
};

export const clearAuthTokens = (cookie: CookieT) => cookie.refresh.remove();
