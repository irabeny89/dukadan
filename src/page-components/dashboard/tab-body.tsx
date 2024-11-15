import { Html } from "@elysiajs/html";
import paginator from "../../lib/paginator";
import { Customer } from "../../models/customer.model";
import { Order } from "../../models/order.model";
import type { PropsT } from "../../pages/dashboard";
import { camelCaseToTitleCase, convertToNaira } from "../../utils";
import { OrderCreateForm } from "../share/order-create";
import Table from "../share/table";
import Modal from "../share/modal";
import AddIcon from "../share/add-icon";

type TabPropsT = PropsT;
const renderOrderTable = ({ query, store }: TabPropsT) => {
  const page = +(query.page ?? 1);
  const pageSize = +(query.pageSize ?? 10);
  const orders = Order.findAllByUserId(store.user.userId);
  if (!orders.length)
    return (
      <div style="text-align:center">
        <p>No order yet.</p>
        <button
          id="order-add"
          type="button"
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          Order a refill now <AddIcon />
        </button>
      </div>
    );
  const { data, metadata } = paginator(orders, {
    page,
    pageSize,
  });
  const tableOrders = data.map(
    ({ id, updatedAt, userId, createdAt, ...rest }) => {
      return {
        username: Customer.findById(userId)?.username,
        createdAt: new Date(createdAt ?? "").toLocaleString(),
        ...rest,
      };
    },
  );
  const headerTitles: string[] = Object.keys(tableOrders[0]).map(
    camelCaseToTitleCase,
  );
  const bodyRows = tableOrders.map((item) => {
    item.deliveryFee = convertToNaira(item.deliveryFee);
    item.price = convertToNaira(item.price);
    item.createdAt = item.createdAt?.toLocaleString();
    return Object.values(item);
  });
  return (
    <Table
      cssId="order-table"
      cssAddId="order-add"
      headerTitles={headerTitles}
      bodyRows={bodyRows}
      hasNextPage={metadata.hasNextPage}
      hasPrevPage={metadata.hasPrevPage}
      page={metadata.page}
      pageCount={metadata.pageCount}
      pageSize={metadata.pageSize}
      title="Orders"
      totalItems={metadata.totalItems}
      allowAdd={true}
      allowDelete={false}
    />
  );
};

export const TabBody = ({ query, store }: TabPropsT) => {
  if (query.tab === "orders")
    return (
      <div>
        <Modal
          id="refill-dialog"
          closeBtnId="refill-dialog-close"
          title="Refill Order"
        >
          <OrderCreateForm />
        </Modal>

        {renderOrderTable({ query, store })}
      </div>
    );
  return null;
};
