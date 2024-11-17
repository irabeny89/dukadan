import { Elysia, t } from "elysia";
import { getSettings } from "../config";
import { type TokenT, cookieSchema, createCookie } from "../lib/token-mgr";
import { Admin } from "../models/admin.model";
import { Customer, loginSchema, signupSchema } from "../models/customer.model";
import { Driver } from "../models/driver.model";
import { Owner } from "../models/owner.model";
import { jwtConfig } from "../services/jwt.service";
import { maxUser } from "../services/max-user.service";
import type { UserT } from "../services/permit.service";
import type { ResponseT, UserRoleT } from "../types";

const setting = getSettings();
const API_DOC_TAG = "Auth";
const auth = new Elysia({
  name: "auth",
})
  .model("signup", signupSchema)
  .model("login", loginSchema)
  .model("cookie", cookieSchema)
  // .model("refresh", refreshSchema)
  .use(jwtConfig)
  .get(
    "/logout",
    async ({ cookie }) => {
      const res: ResponseT<boolean> = {
        success: true,
        message: "Logged out successfully",
        data: true,
      };
      cookie.auth.remove();
      return res;
    },
    { tags: [API_DOC_TAG] },
  )
  // #region refresh
  // .post(
  //   "/refresh",
  //   ({ body, error }) => {
  //     const refresh: string = body.refresh;
  //     // * refresh token is id (literal string)
  //     const data = verifyToken<TokenDataT>(refresh, "refresh");

  //     const userTemplate: {
  //       [k: string]: () => Owner | Admin | Customer | null;
  //     } = {
  //       owner: () => Owner.findById(data.userId),
  //       admin: () => Admin.findById(data.userId),
  //       driver: () => Driver.findById(data.userId),
  //       customer: () => Customer.findById(data.userId),
  //     };
  //     const user = userTemplate[data.role]();

  //     return user
  //       ? {
  //           message: "Token refresh successful.",
  //           success: true,
  //           data: setAuthTokens(user, data.role),
  //         }
  //       : error<404, ResponseT>(404, {
  //           success: false,
  //           message: "User not found.",
  //         });
  //   },
  //   { tags: [API_DOC_TAG], body: "refresh" },
  // )
  .group("/owners", (app) =>
    app
      .onBeforeHandle(() => {
        Owner.createTable();
        Owner.createUpdatedAtTrigger();
      })
      .use(maxUser)
      // #region owner signup
      .post(
        "/signup",
        async ({ body, error, jwt, cookie }) => {
          if (Owner.findBy("email", body.email)) {
            const errRes: ResponseT = {
              success: false,
              message: "User already exist",
            };

            return error("Conflict", errRes);
          }

          new Owner(body).save();
          const user = Owner.findBy("email", body.email) as Owner;

          const role: UserRoleT = "owner";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Signup successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        {
          tags: [API_DOC_TAG],
          body: "signup",
          maxUser: [setting.maxOwner, "owner"],
        },
      )
      // #region owner login
      .post(
        "/login",
        async ({ body, error, jwt, cookie }) => {
          const user =
            "email" in body
              ? Owner.findBy("email", body.email.trim().toLowerCase())
              : Owner.findBy("username", body.username.trim().toLowerCase());

          if (!user || !Bun.password.verifySync(body.password, user.password))
            return error<404, ResponseT>(404, {
              success: false,
              message: "Incorrect email/username or password",
            });

          const role: UserRoleT = "owner";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Login successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        { tags: [API_DOC_TAG], body: "login" },
      ),
  )
  .group("/admins", (app) =>
    app
      .onBeforeHandle(() => {
        Admin.createTable();
        Admin.createUpdatedAtTrigger();
      })
      .use(maxUser)
      // #region admin signup
      .post(
        "/signup",
        async ({ body, error, jwt, cookie }) => {
          if (Admin.findBy("email", body.email)) {
            const errRes: ResponseT = {
              success: false,
              message: "User already exist",
            };

            return error("Conflict", errRes);
          }

          new Admin(body).save();
          const user = Admin.findBy("email", body.email) as Admin;

          const role: UserRoleT = "admin";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Signup successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        {
          tags: [API_DOC_TAG],
          body: "signup",
          maxUser: [setting.maxAdmin, "admin"],
        },
      )
      // #region admin login
      .post(
        "/login",
        async ({ body, error, jwt, cookie }) => {
          const user =
            "email" in body
              ? Admin.findBy("email", body.email.trim().toLowerCase())
              : Admin.findBy("username", body.username.trim().toLowerCase());

          if (!user || !Bun.password.verifySync(body.password, user.password))
            return error<404, ResponseT>(404, {
              success: false,
              message: "Incorrect email/username or password",
            });

          const role: UserRoleT = "admin";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Login successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        { tags: [API_DOC_TAG], body: "login" },
      ),
  )
  .group("/drivers", (app) =>
    app
      .onBeforeHandle(() => {
        Driver.createTable();
        Driver.createUpdatedAtTrigger();
      })
      .use(maxUser)
      // #region driver signup
      .post(
        "/signup",
        async ({ body, error, jwt, cookie }) => {
          if (Driver.findBy("email", body.email)) {
            const errRes: ResponseT = {
              success: false,
              message: "User already exist",
            };

            return error("Conflict", errRes);
          }

          new Driver(body).save();
          const user = Driver.findBy("email", body.email) as Driver;

          const role: UserRoleT = "driver";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Signup successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        {
          tags: [API_DOC_TAG],
          body: "signup",
          maxUser: [setting.maxDriver, "driver"],
        },
      )
      // #region driver login
      .post(
        "/login",
        async ({ body, error, jwt, cookie }) => {
          const user =
            "email" in body
              ? Driver.findBy("email", body.email.trim().toLowerCase())
              : Driver.findBy("username", body.username.trim().toLowerCase());

          if (!user || !Bun.password.verifySync(body.password, user.password))
            return error<404, ResponseT>(404, {
              success: false,
              message: "Incorrect email/username or password",
            });

          const role: UserRoleT = "driver";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Login successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        { tags: [API_DOC_TAG], body: "login" },
      ),
  )
  .group("/customers", (app) =>
    app
      // #region cust signup
      .post(
        "/signup",
        async ({ body, error, jwt, cookie }) => {
          if (Customer.findBy("email", body.email)) {
            const errRes: ResponseT = {
              success: false,
              message: "User already exist",
            };

            return error("Conflict", errRes);
          }

          // save new user
          new Customer(body).save();
          const user = Customer.findBy("email", body.email) as Customer;

          const role: UserRoleT = "customer";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Signup successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        {
          tags: [API_DOC_TAG],
          body: "signup",
        },
      )
      // #region cust login
      .post(
        "/login",
        async ({ body, error, jwt, cookie }) => {
          const user =
            "email" in body
              ? Customer.findBy("email", body.email.trim().toLowerCase())
              : Customer.findBy("username", body.username.trim().toLowerCase());

          if (!user || !Bun.password.verifySync(body.password, user.password))
            return error<404, ResponseT>(404, {
              success: false,
              message: "Incorrect email/username or password",
            });

          const role: UserRoleT = "customer";
          // set auth cookie
          cookie.auth.set(
            await createCookie(user.id ?? 0, user.username, role, jwt),
          );

          const res: ResponseT<UserT> = {
            success: true,
            message: "Login successful",
            data: {
              userId: user.id ?? 0,
              username: user.username,
              role,
            },
          };

          return res;
        },
        { tags: [API_DOC_TAG], body: "login" },
      ),
  );

export default auth;
