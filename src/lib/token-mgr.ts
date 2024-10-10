import { InternalServerError } from "elysia";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { envVar } from "../config";
import type { Customer } from "../models/customer";
import type { Owner } from "../models/owner";
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

// #region setTokens
const setTokens = (userId: number, username: string, role: UserRoleT) => {
	const data: AccessDataT = { userId, username, role };
	const access = jwt.sign(data, envVar.secret, {
		expiresIn: envVar.accessExp,
	});

	const refreshData: RefreshDataT = { userId };
	const refresh = jwt.sign(refreshData, envVar.secret2, {
		expiresIn: envVar.refreshExp,
	});

	return { access, refresh };
};

// #region setAuthtokens
export const setAuthTokens = (
	user: Customer | Owner,
	role: UserRoleT = "customer",
) => {
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
