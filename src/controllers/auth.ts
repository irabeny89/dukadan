import { Elysia, t } from "elysia";
import { type TokenT, clearAuthTokens, setAuthTokens } from "../lib/token-mgr";
import { User, cookieSchema, loginSchema, signupSchema } from "../models/user";
import type { ResponseT } from "../types";

const auth = new Elysia({ name: "auth" })
	.model("cookie", cookieSchema)
	.model("signup", signupSchema)
	.model("login", loginSchema)
	.onBeforeHandle(() => User.createTable())
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
			body: t.Object({
				action: t.Boolean(),
			}),
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
						User.update(user.id as number, {
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
