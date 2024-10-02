import { Elysia, t } from "elysia";
import { type TokenT, clearAuthTokens, setAuthTokens, verifyToken } from "../lib/token-mgr";
import { User, cookieSchema, loginSchema, logoutSchema, refreshSchema, signupSchema } from "../models/user";
import type { ResponseT } from "../types";

const auth = new Elysia({ name: "auth" })
	.model("cookie", cookieSchema)
	.model("signup", signupSchema)
	.model("login", loginSchema)
	.model("logout", logoutSchema)
	.model("refresh", refreshSchema)
	.onBeforeHandle(() => {
		User.createTable();
		User.createUpdatedAtTrigger();
	})
	.post(
		"/refresh",
		({ cookie, body, error }) => {
			// mobile app - no access to cookie i.e `body.refresh`
			// refresh token probably stored somewhere else
			// while web app - access to cookie i.e `cookie.refresh.value`
			let refresh: string | undefined = body.refresh || cookie.refresh.value

			if (!refresh) return error<401, ResponseT>(401, {
				success: false,
				message: "Unauthorized. Go and signup/login."
			})

			// * refresh token is id (literal string)
			const userId = verifyToken(refresh) as string
			const user = User.findById(+userId)

			return user
				? {
					message: "Token refresh successful.",
					success: true,
					data: setAuthTokens(cookie, user),
				}
				: error<404, ResponseT>(404, {
					success: false,
					message: "User not found."
				})
		},
		{ cookie: "cookie", tags: ["Auth"], body: "refresh" }
	)
	.post(
		"/logout",
		({ cookie }) => {
			clearAuthTokens(cookie);
			const res: ResponseT = {
				success: true,
				message: "Logout successful",
			};

			return res;
		},
		{
			cookie: "cookie",
			tags: ["Auth"],
			body: "logout",
		},
	)
	.group("/customer", (app) =>
		app
			.post(
				"/signup",
				async ({ cookie, body, error }) => {
					if (User.findBy("email", body.email)) {
						const errRes: ResponseT = {
							success: false,
							message: "User already exist",
						};
						return error("Conflict", errRes);
					}

					new User(body).save();
					const user = User.findBy("email", body.email) as User;

					const res: ResponseT<TokenT> = {
						message: "User created",
						success: true,
						data: setAuthTokens(cookie, user),
					};

					return res;
				},
				{
					tags: ["Auth"],
					body: "signup",
					cookie: "cookie",
				},
			)
			.post(
				"/login",
				({ cookie, body, error }) => {
					const user =
						"email" in body
							? User.findBy("email", body.email)
							: User.findBy("username", body.username);
					if (user) {
						// update user last seen(updatedAt) and save to db
						User.updateById(user.id as number, {
							updatedAt: Date.now().toString(),
						});

						const res: ResponseT<TokenT> = {
							success: true,
							message: "Login successful",
							data: setAuthTokens(cookie, user),
						};

						return res;
					}
					return error<404, ResponseT>(404, {
						success: false,
						message: "Incorrect email/username or password",
					});
				},
				{ tags: ["Auth"], cookie: "cookie", body: "login" },
			),
	);

export default auth;
