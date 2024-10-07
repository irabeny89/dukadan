import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { config, envVar } from "./config";
import auth from "./controllers/auth";
import feedback from "./controllers/feedback";
import log from "./lib/logger";
import { handleErr } from "./services/err-handler";
import { swaggerConfig } from "./services/swagger";

const welcome = `Welcome to ${config.appName} API. For API docs - '/swagger' endpoint.`;

const app = new Elysia({
  cookie: {
    secrets: [envVar.secret, envVar.secret2],
    sign: ["refresh"],
  },
})
  .onStart(({ server }) => {
    console.log(`🚀 Server: ${server?.url}`);
    console.log(`\u2139\uFE0F  API Docs: ${server?.url}swagger`);
  })
  .onTransform(({ cookie, body, params, path, request: { method } }) => {
    // TODO: log to file - "requests" txt or database
    log({ body, params, cookie }, `${method} ${path}`);
  })
  .onError(({ error, code }) => handleErr(error, code))
  .use(cors())
  .use(swaggerConfig)
  .get("/", welcome)
  .group("/api", (app) => app.use(auth).use(feedback))
  .listen(+envVar.port);
