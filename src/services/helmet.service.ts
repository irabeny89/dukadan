import { helmet } from "elysia-helmet";

export const helmetConf = helmet({
  contentSecurityPolicy:
    Bun.env.NODE_ENV === "production"
      ? {
          useDefaults: true,
        }
      : { reportOnly: true },
});
