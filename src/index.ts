import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { html } from "@elysiajs/html";
import { setting as confSetting, config, envVar } from "./config";
import auth from "./controllers/auth.controller";
import feedback from "./controllers/feedback.controller";
import { order } from "./controllers/order.controller";
import { setting } from "./controllers/setting.controller";
import log from "./lib/logger";
import { Customer } from "./models/customer.model";
import { Feedback } from "./models/feedback.model";
import { Order } from "./models/order.model";
import { Owner } from "./models/owner.model";
import { Setting } from "./models/setting.model";
import { handleErr } from "./services/err-handler.service";
import { swaggerConfig } from "./services/swagger.service";
import { Admin } from "./models/admin.model";
import { Driver } from "./models/driver.model";
import Home from "./pages";

const welcome = `Welcome to ${config.appName} API. For API docs - '/swagger' endpoint.`;

const app = new Elysia()
  .onStart(({ server }) => {
    log({ value: `🚀 Server: ${server?.url.origin}` });
    log({ value: `\u{1F4F0} API Docs: ${server?.url.origin}/swagger` });

    // create tables & triggers
    Setting.createTable();
    Setting.createUpdatedAtTrigger();
    Owner.createTable();
    Owner.createUpdatedAtTrigger();
    Admin.createTable();
    Admin.createUpdatedAtTrigger();
    Driver.createTable();
    Driver.createUpdatedAtTrigger();
    Customer.createTable();
    Customer.createUpdatedAtTrigger();
    Feedback.createTable();
    Feedback.createUpdatedAtTrigger();
    Order.createTable();
    Order.createUpdatedAtTrigger();

    log({
      value: `\u{1F512} env-var: ${JSON.stringify(envVar, null, 2)}`,
      option: { color: "yellow", env: "development" },
    });
    log({
      value: `\u2699  settings: ${JSON.stringify(confSetting, null, 2)}`,
      option: { color: "yellow", env: "development" },
    });
  })
  .onTransform(({ cookie, body, params, path, request: { method } }) => {
    // TODO: log to file - "requests" txt or database
    log({ value: `${method} ${path}`, option: { env: "development" } });
    log({ value: { body, params, cookie }, option: { env: "development" } });
  })
  .onError(({ error, code }) => handleErr(error, code))
  .use(cors())
  .use(swaggerConfig)
  .use(staticPlugin())
  .use(html())
  .get("/", Home)
  .group("/api", (app) => app.use(auth).use(setting).use(feedback).use(order))
  .listen(+envVar.port);
