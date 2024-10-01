import { type Cookie, InternalServerError } from "elysia";
import jwt from "jsonwebtoken";
import type { User } from "../models/user";

type CookieT = Record<string, Cookie<string | undefined>> & {
	refresh: Cookie<string | undefined>;
};

export type TokenT = Record<"access" | "refresh", string>;

const setTokens = (cookie: CookieT, userId: number, username: string) => {
	const tokenExp = +(Bun.env.EXP || 0);

	// set refresh token
	const refresh = cookie.refresh.set({
		maxAge: tokenExp,
		secure: true,
		sameSite: "lax",
		httpOnly: true,
		value: jwt.sign(userId.toString(), Bun.env.SECRET || "SECRET"),
	}).value as string;

	const access = jwt.sign({ userId, username }, Bun.env.SECRET || "SECRET", {
		audience: "customer",
		expiresIn: tokenExp,
	});

	return { access, refresh };
};

export const setAuthTokens = (cookie: CookieT, user: User) => {
	if (user.id) {
		return setTokens(cookie, user.id, user.username);
	}
	throw new InternalServerError();
};

export const clearAuthTokens = (cookie: CookieT) => cookie.refresh.remove();
