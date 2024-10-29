import { InternalServerError } from "elysia";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { getEnv } from "../config";
import type { Customer } from "../models/customer.model";
import type { Owner } from "../models/owner.model";
import type { UserRoleT } from "../types";

export type TokenT = Record<"access" | "refresh", string>;
export type TokenDataT = {
	userId: number;
	username: string;
	role: UserRoleT;
};
export type RefreshDataT = {
	userId: number;
};

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
