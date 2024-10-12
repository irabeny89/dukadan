import { Elysia, t } from "elysia";
import { envVar, setting } from "../config";
import {
  type TokenDataT,
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
} from "../models/customer.model";
import { Owner } from "../models/owner.model";
import { maxUser } from "../services/max-user.service";
import { permit } from "../services/permit.service";
import type { ResponseT } from "../types";
import { Admin } from "../models/admin.model";

const API_DOC_TAG = "Auth";
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
      const data = verifyToken<TokenDataT>(refresh, "refresh");

      const userTemplate: {
        [k: string]: () => Owner | Admin | Customer | null;
      } = {
        owner: () => Owner.findById(data.userId),
        admin: () => Admin.findById(data.userId),
        customer: () => Customer.findById(data.userId),
      };
      const user = userTemplate[data.role]();

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
    { tags: [API_DOC_TAG], body: "refresh" },
  )
  .group("/customers", (app) =>
    app
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
          tags: [API_DOC_TAG],
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
        { tags: [API_DOC_TAG], body: "login" },
      ),
  )
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
          tags: [API_DOC_TAG],
          body: "signup",
          maxUser: [setting.maxOwner, "owner"],
        },
      )
      // #region owner login
      .post(
        "/login",
        ({ body, error }) => {
          const user =
            "email" in body
              ? Owner.findBy("email", body.email)
              : Owner.findBy("username", body.username);

          if (!user)
            return error<404, ResponseT>(404, {
              success: false,
              message: "Incorrect email/username or password",
            });

          // update user last seen(updatedAt) and save to db
          Owner.updateById(user.id as number, {
            updatedAt: Date.now().toString(),
          });

          const res: ResponseT<TokenT> = {
            success: true,
            message: "Login successful",
            data: setAuthTokens(user),
          };

          return res;
        },
        { tags: [API_DOC_TAG], body: "login" },
      ),
  );

export default auth;
