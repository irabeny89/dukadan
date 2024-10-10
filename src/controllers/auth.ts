import { Elysia, t } from "elysia";
import {
  type RefreshDataT,
  type TokenT,
  setAuthTokens,
  verifyToken,
} from "../lib/token-mgr";
import {
  Customer,
  loginSchema,
  logoutSchema,
  refreshSchema,
  signupSchema,
} from "../models/customer";
import type { ResponseT } from "../types";
import { Owner } from "../models/owner";
import { permit } from "../services/permit";
import { maxUser } from "../services/max-user";
import { envVar } from "../config";

const auth = new Elysia({ name: "auth" })
  .model("signup", signupSchema)
  .model("login", loginSchema)
  .model("refresh", refreshSchema)
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
  .group("/customers", (app) =>
    app
      .onBeforeHandle(() => {
        Customer.createTable();
        Customer.createUpdatedAtTrigger();
      })
      // #region cust signup
      .post(
        "/signup",
        ({ body, error }) => {
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
          permit: ["customer"],
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
  )
  .group("/owners", (app) =>
    app
      .onBeforeHandle(() => {
        Owner.createTable();
        Owner.createUpdatedAtTrigger();
      })
      .use(maxUser)
      .post(
        "/signup",
        ({ body, error }) => {
          if (Owner.findBy("email", body.email)) {
            const errRes: ResponseT = {
              success: false,
              message: "User already exist",
            };

            return error("Conflict", errRes);
          }

          new Owner(body).save();
          const user = Owner.findBy("email", body.email) as Owner;

          const res: ResponseT<TokenT> = {
            success: true,
            message: "User created",
            data: setAuthTokens(user, "owner"),
          };

          return res;
        },
        {
          tags: ["Auth"],
          body: "signup",
          maxUser: [+envVar.maxOwner, "owner"],
        },
      ),
  );

export default auth;
