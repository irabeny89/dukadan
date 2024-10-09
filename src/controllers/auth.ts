import { Elysia, t } from "elysia";
import {
	type RefreshDataT,
	type TokenT,
	setAuthTokens,
	verifyToken,
} from "../lib/token-mgr";
import {
	Customer,
	cookieSchema,
	loginSchema,
	logoutSchema,
	refreshSchema,
	signupSchema,
} from "../models/customer";
import type { ResponseT } from "../types";

const auth = new Elysia({ name: "auth" })
	.model("signup", signupSchema)
	.model("login", loginSchema)
	.model("refresh", refreshSchema)
	.onBeforeHandle(() => {
		Customer.createTable();
		Customer.createUpdatedAtTrigger();
	})
	// #region refresh
	.post(
		"/refresh",
		({ body, error }) => {
			const refresh: string = body.refresh;
			// * refresh token is id (literal string)
			const data = verifyToken<RefreshDataT>(refresh, "refresh");
			const user = Customer.findById(data.userId);

			return user
				? {
						message: "Token refresh successful.",
						success: true,
						data: setAuthTokens(user),
					}
				: error<404, ResponseT>(404, {
						success: false,
						message: "User not found.",
					});
		},
		{ tags: ["Auth"], body: "refresh" },
	)
	.group("/customer", (app) =>
		app
			// #region cust signup
			.post(
				"/signup",
				async ({ body, error }) => {
					if (Customer.findBy("email", body.email)) {
						const errRes: ResponseT = {
							success: false,
							message: "User already exist",
						};

						return error("Conflict", errRes);
					}

					new Customer(body).save();
					const user = Customer.findBy("email", body.email) as Customer;

					const res: ResponseT<TokenT> = {
						success: true,
						message: "User created",
						data: setAuthTokens(user),
					};

					return res;
				},
				{
					tags: ["Auth"],
					body: "signup",
				},
			)
			// #region cust login
			.post(
				"/login",
				({ body, error }) => {
					const user =
						"email" in body
							? Customer.findBy("email", body.email)
							: Customer.findBy("username", body.username);

					if (!user)
						return error<404, ResponseT>(404, {
							success: false,
							message: "Incorrect email/username or password",
						});

					// update user last seen(updatedAt) and save to db
					Customer.updateById(user.id as number, {
						updatedAt: Date.now().toString(),
					});

					const res: ResponseT<TokenT> = {
						success: true,
						message: "Login successful",
						data: setAuthTokens(user),
					};

					return res;
				},
				{ tags: ["Auth"], body: "login" },
			),
	);

export default auth;
