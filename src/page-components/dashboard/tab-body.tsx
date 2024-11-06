import { Html } from "@elysiajs/html";
import paginator from "../../lib/paginator";
import { Customer } from "../../models/customer.model";
import { Order } from "../../models/order.model";
import { camelCaseToTitleCase, convertToNaira } from "../../utils";
import Table from "../share/table";
import type { PropsT } from "../../pages/dashboard";

type TabPropsT = PropsT;
const renderOrderTable = ({ query, store }: TabPropsT) => {
  const page = +(query.page ?? 1);
  const pageSize = +(query.pageSize ?? 10);
  const orders = Order.findAllByUserId(store.user.userId);
  const { data, metadata } = paginator(orders, {
    page,
    pageSize,
  });
  const tableOrders = data.map(
    ({ id, userId, createdAt, updatedAt, ...rest }) => {
      return {
        username: Customer.findById(userId)?.username,
        createdAt: new Date(createdAt ?? "").toLocaleString(),
        updatedAt: new Date(updatedAt ?? "").toLocaleString(),
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
    item.updatedAt = item.updatedAt?.toLocaleString();
    return Object.values(item);
  });
  return (
    <Table
      cssId="order"
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
  if (query.tab === "orders") return renderOrderTable({ query, store });
  return null;
};
