import { Elysia } from "elysia";
import { User, cookieSchema, signupInputSchema } from "../models/user";
import type { ResponseT } from "../types";

const auth = new Elysia({ prefix: "/api", name: "auth" })
	.model("signup", signupInputSchema)
	.model("cookie", cookieSchema)
	.onBeforeHandle(() => {
		User.createTable();
	})
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

			new User(body).save()
			const user = User.findBy("email", body.email)!
			
			cookie.token.set({
				maxAge: +(Bun.env.EXP || 0),
				secure: true,
				sameSite: true,
				httpOnly: true,
				value: { userId: user.id, role: "customer" },
			});

			const res: ResponseT<Pick<User, "id" | "username" | "email">> = {
				message: "User created",
				success: true,
				data: {
					id: user.id,
					username: body.username,
					email: body.email
				},
			};

			return res;
		},
		{
			tags: ["Auth"],
			body: "signup",
			cookie: "cookie",
		},
	);

export default auth;
