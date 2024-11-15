import cors from "@elysiajs/cors";
import { Html, html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";
import { compression } from "elysia-compression";
import { getEnv, getSettings } from "./config";
import auth from "./controllers/auth.controller";
import feedback from "./controllers/feedback.controller";
import { order } from "./controllers/order.controller";
import { setting } from "./controllers/setting.controller";
import log from "./lib/logger";
import { Admin } from "./models/admin.model";
import { Customer } from "./models/customer.model";
import { Driver } from "./models/driver.model";
import { Feedback } from "./models/feedback.model";
import { Order } from "./models/order.model";
import { Owner } from "./models/owner.model";
import { Setting } from "./models/setting.model";
import HomePage from "./pages";
import NotFoundPage from "./pages/404";
import AuthPage from "./pages/auth";
import DashboardPage, { dashboardPropsSchema } from "./pages/dashboard";
import { handleErr } from "./services/err-handler.service";
import { helmetConf } from "./services/helmet.service";
import { jwtConfig } from "./services/jwt.service";
import { permit } from "./services/permit.service";
import { swaggerConfig } from "./services/swagger.service";

const envVar = getEnv();
const settings = getSettings();
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
      option: { env: "development" },
    });
    log({
      value: `\u2699  settings: ${JSON.stringify(settings, null, 2)}`,
      option: { env: "development" },
    });
  })
  .onTransform(
    ({ cookie, query, body, params, path, request: { method, headers } }) => {
      // TODO: log to file - "requests" txt or database
      log({ value: `${method} ${path}`, option: { env: "development" } });
      log({
        value: { headers, cookie, params, query, body },
        option: { env: "development" },
      });
    },
  )
  .onError(({ error, code }) => handleErr(error, code))
  .use(cors())
  .use(helmetConf)
  .use(compression())
  .use(staticPlugin())
  .use(swaggerConfig)
  .use(html())
  .use(jwtConfig)
  .get("/", HomePage, { tags: ["Home Page"] })
  .get("/auth", AuthPage, { tags: ["Customer Auth Page"] })
  .get("/404", NotFoundPage, { tags: ["Not Found Page"] })
  .use(permit)
  .get(
    "/dashboard",
    ({ query, store }) => {
      return DashboardPage({
        query: { ...query, pageSize: query.pagesize },
        store,
      });
    },
    {
      tags: ["Dashboard Page"],
      query: dashboardPropsSchema,
      permit: ["admin", "customer", "driver", "owner"],
    },
  )
  .group("/api", (app) => app.use(auth).use(setting).use(feedback).use(order))
  .listen(+envVar.port);
