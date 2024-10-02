import { type Cookie, InternalServerError } from "elysia";
import jwt from "jsonwebtoken";
import type { User } from "../models/user";

type CookieT = Record<string, Cookie<string | undefined>> & {
	refresh: Cookie<string | undefined>;
};

const SECRET = Bun.env.SECRET || "SECRET"
const REFRESH_EXP = +(Bun.env.REFRESH_EXP || 0);
const ACCESS_EXP = +(Bun.env.ACCESS_EXP || 0);

export type TokenT = Record<"access" | "refresh", string>;

const setTokens = (cookie: CookieT, userId: number, username: string) => {
	// set refresh token
	const refresh = cookie.refresh.set({
		maxAge: REFRESH_EXP,
		secure: true,
		sameSite: "lax",
		httpOnly: true,
		value: jwt.sign(userId.toString(), SECRET),
	}).value as string;

	const access = jwt.sign({ userId, username }, SECRET, {
		audience: "customer",
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

export const verifyToken = (token: string) => {
	return jwt.verify(token, SECRET)
}

export const clearAuthTokens = (cookie: CookieT) => cookie.refresh.remove();
