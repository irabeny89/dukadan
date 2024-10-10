import Elysia from "elysia";
import log from "../lib/logger";
import { type AccessDataT, verifyToken } from "../lib/token-mgr";
import type { UserRoleT } from "../types";

type UserT = AccessDataT & Record<"role", string | undefined>;
type HandlePermissionT = {
  headers: Record<string, string | undefined>;
  store: Record<"user", UserT>;
  roles: UserRoleT[];
  respondUnauthorized: () => unknown;
  respondForbidden: () => unknown;
};

const handlePermission = ({
  headers,
  roles,
  store,
  respondForbidden,
  respondUnauthorized,
}: HandlePermissionT) => {
  const auth = headers.authorization;
  if (!auth) {
    log("no Authorization Bearer token");
    return respondUnauthorized();
  }
  const token = auth.replace("Bearer ", "");
  try {
    const payload = verifyToken<AccessDataT>(token);

    log(payload, "::tokenPayload::", "inline");

    if (!roles.includes(payload.role as UserRoleT)) {
      log(roles, "allowed roles", "inline");
      return respondForbidden();
    }

    store.user.userId = payload.userId;
    store.user.username = payload.username;
    store.user.role = payload.role;
  } catch (error) {
    log(error);
    return respondUnauthorized();
  }
};

export const permit = new Elysia({ name: "extract-access-token" })
  .state({ user: {} as UserT })
  .macro(({ onBeforeHandle }) => ({
    permit(roles: UserRoleT[]) {
      if (roles.length) {
        // only for selected roles
        onBeforeHandle(({ headers, store, error }) => {
          const success = false;
          const respondForbidden = () =>
            error(403, {
              success,
              message:
                "Forbidden. Your role doesn't have permission to access.",
            });
          const respondUnauthorized = () =>
            error(401, { success, message: "Unauthorized. Try Signup/login." });

          return handlePermission({
            headers,
            roles,
            store,
            respondForbidden,
            respondUnauthorized,
          });
        });
      }
    },
  }));
