import type { JWTPayloadSpec } from "@elysiajs/jwt";
import { InternalServerError, t } from "elysia";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { getEnv } from "../config";
import type { Customer } from "../models/customer.model";
import type { Owner } from "../models/owner.model";
import type { Jwt, TokenDataT, UserRoleT } from "../types";

export type TokenT = Record<"access" | "refresh", string>;

export type RefreshDataT = {
	userId: number;
};

export const cookieSchema = t.Object({
	auth: t.Object({
		userId: t.Number(),
		username: t.String(),
		role: t.UnionEnum(["owner", "admin", "driver", "customer"]),
	}),
});

const envVar = getEnv();
// #region setTokens
const setTokens = (userId: number, username: string, role: UserRoleT) => {
	const data: TokenDataT = { userId, username, role };
	const access = jwt.sign(data, envVar.secret, {
		expiresIn: envVar.accessExp,
	});
	const refresh = jwt.sign(data, envVar.secret2, {
		expiresIn: envVar.refreshExp,
	});

	return { access, refresh };
};

// #region setAuthtokens
export const setAuthTokens = (user: Customer | Owner, role: UserRoleT) => {
	if (user.id) {
		return setTokens(user.id, user.username, role);
	}
	throw new InternalServerError();
};

// #region verifyToken
export const verifyToken = <T>(
	token: string,
	tokenType: "access" | "refresh" = "access",
) => {
	return tokenType === "access"
		? (jwt.verify(token, envVar.secret) as JwtPayload & T)
		: (jwt.verify(token, envVar.secret2) as JwtPayload & T);
};

export const createCookie = async (
	userId: number,
	username: string,
	role: UserRoleT,
	jwt: Jwt,
) => {
	const value: TokenDataT = {
		role,
		userId: userId ?? 0,
		username: username,
	};
	// set auth cookie
	return {
		value: await jwt.sign(value),
		httpOnly: true,
		secure: true,
		maxAge: envVar.accessExp,
	};
};

export const verifyCookie = async <T>(cookie: string, jwt: Jwt) => {
	return (await jwt.verify(cookie)) as T;
};
