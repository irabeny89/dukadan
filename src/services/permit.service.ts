import Elysia, { type Cookie } from "elysia";
import log from "../lib/logger";
import { verifyCookie } from "../lib/token-mgr";
import type { Jwt, TokenDataT, UserRoleT } from "../types";
import { jwtConfig } from "./jwt.service";

export type UserT = TokenDataT & Record<"role", string | undefined>;
type HandlePermissionT = {
  cookie: Record<string, Cookie<string | undefined>>;
  jwt: Jwt;
  store: Record<"user", UserT>;
  roles: UserRoleT[];
  respondUnauthorized: () => unknown;
  respondForbidden: () => unknown;
};

const handlePermission = async ({
  jwt,
  cookie,
  roles,
  store,
  respondForbidden,
  respondUnauthorized,
}: HandlePermissionT) => {
  if (!cookie.auth.value) {
    log({
      value: "no Authorization Bearer token",
      option: { env: "development" },
    });
    return respondUnauthorized();
  }
  try {
    const payload = await verifyCookie<TokenDataT>(cookie.auth.value, jwt);

    log({
      value: `::tokenPayload:: ${JSON.stringify(payload, null, 2)}`,
      option: { env: "development" },
    });

    if (!roles.includes(payload.role)) {
      log({
        value: `::allowed roles:: ${roles}`,
        option: { env: "development" },
      });
      return respondForbidden();
    }

    store.user.userId = payload.userId;
    store.user.username = payload.username;
    store.user.role = payload.role;
  } catch (error) {
    log({ value: error, option: { env: "development" } });
    return respondUnauthorized();
  }
};

export const permit = new Elysia({ name: "extract-access-token" })
  .use(jwtConfig)
  .state({ user: {} as UserT })
  .macro(({ onBeforeHandle }) => ({
    permit(roles: UserRoleT[]) {
      if (roles.length) {
        // only for selected roles
        onBeforeHandle(({ cookie, store, error, jwt }) => {
          const success = false;
          const respondForbidden = () =>
            error(403, {
              success,
              message: "Forbidden. Your role doesn't permit.",
            });
          const respondUnauthorized = () =>
            error(401, { success, message: "Unauthorized. Try Signup/login." });

          return handlePermission({
            jwt,
            cookie,
            roles,
            store,
            respondForbidden,
            respondUnauthorized,
          });
        });
      }
    },
  }));
