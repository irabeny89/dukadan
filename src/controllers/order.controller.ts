import Elysia, { t } from "elysia";
import {
  Order,
  orderSchema,
  pageQuerySchema,
  patchSchema,
} from "../models/order.model";
import { permit } from "../services/permit.service";
import type { ResponseT } from "../types";

const API_DOC_TAG = "Order";
export const order = new Elysia({ name: "order" })
  .model("pageQuery", pageQuerySchema)
  .model("order", orderSchema)
  .model("patch", patchSchema)
  .model("params", t.Object({ id: t.Number({ minimum: 0 }) }))
  .use(permit)
  // #region get all orders
  .get(
    "/orders",
    ({ store, query }) => {
      const { data, metadata } =
        store.user.role === "customer"
          ? // customers get only their orders list
            Order.findAllByUserId(store.user.userId)
          : // other users get every order
            Order.findAll(query);
      const response: ResponseT = {
        success: true,
        message: "List of orders.",
        data,
        metadata,
      };

      return response;
    },
    {
      tags: [API_DOC_TAG],
      permit: ["owner", "admin", "driver", "customer"],
      query: "pageQuery",
    },
  )
  // #region get an order
  .get(
    "/orders/:id",
    ({ params, store }) => {
      const response: ResponseT = {
        success: true,
        message: "One order fetched.",
        data:
          store.user.role === "customer"
            ? // customer get only it order
              Order.findByIdForUser(params.id, store.user.userId)
            : // other users get any customer order
              Order.findById(params.id),
      };

      return response;
    },
    {
      tags: [API_DOC_TAG],
      permit: ["owner", "admin", "driver", "customer"],
      params: "params",
    },
  )
  // #region create order
  .post(
    "/orders",
    ({ body, store }) => {
      const res = new Order({ ...body, userId: store.user.userId }).save();
      const response: ResponseT = {
        success: true,
        message: "Order created successfully.",
        data: true,
      };

      return response;
    },
    {
      tags: [API_DOC_TAG],
      permit: ["customer"],
      body: "order",
    },
  )
  // #region update order status
  .patch(
    "/orders/:id",
    ({ body, params }) => {
      const response: ResponseT = {
        success: true,
        message: "Update successful.",
        data: Order.updateById(params.id, { status: body.status }),
      };

      return response;
    },
    {
      tags: [API_DOC_TAG],
      permit: ["owner", "admin"],
      body: "patch",
      params: "params",
    },
  );
