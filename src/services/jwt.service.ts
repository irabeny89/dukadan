import jwt from "@elysiajs/jwt";

export const jwtConfig = jwt({
	secret: Bun.env.SECRET ?? "SECRET",
});
