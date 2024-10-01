import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { config } from "./config";
import auth from "./controllers/auth";
import { handleErr } from "./services/err-handler";
import { swaggerConfig } from "./services/swagger";

const welcome = `Welcome to ${config.appName} API. For API docs - '/swagger' endpoint.`;

const app = new Elysia({
	cookie: {
		secrets: [Bun.env.SECRET || "secret", Bun.env.SECRET2 || "secret2"],
		sign: ["refresh"],
	},
})
	.onStart(({ server }) => {
		console.log(`🚀 Server: ${server?.url}`);
		console.log(`\u2139\uFE0F  API Docs: ${server?.url}swagger`);
	})
	.onTransform(({ cookie, body, params, path, request: { method } }) => {
		// TODO: log to file - "requests"
		Bun.env.NODE_ENV !== "production" &&
			console.log(`${method} ${path}`, { body, params, cookie });
	})
	.onError(({ error, code }) => handleErr(error, code))
	.use(cors())
	.use(swaggerConfig)
	.get("/", welcome)
	.group("/api", (app) => app.use(auth))
	.listen(Bun.env.PORT ?? 3000);
