import Elysia, { t } from "elysia";
import { Setting, settingSchema } from "../models/setting.model";
import { permit } from "../services/permit.service";
import type { ResponseT } from "../types";

const API_DOC_TAG = "Setting";
export const setting = new Elysia({ name: "setting" })
  .model("setting", settingSchema)
  .model("params", t.Object({ id: t.Number({ minimum: 0 }) }))
  .use(permit)
  // #region get all settings
  .get(
    "/settings",
    () => {
      const response: ResponseT = {
        success: true,
        message: "List of settings",
        data: Setting.findAll(),
      };

      return response;
    },
    {
      tags: [API_DOC_TAG],
      permit: ["owner", "admin", "driver", "customer"],
    },
  )
  .patch(
    "/settings/:id",
    ({ body, params }) => {
      const response: ResponseT = {
        success: true,
        message: "Update successful",
        data: Setting.updateById(params.id, body),
      };

      return response;
    },
    {
      tags: [API_DOC_TAG],
      permit: ["owner", "admin"],
      body: "setting",
      params: "params",
    },
  );
