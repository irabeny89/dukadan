import { Html } from "@elysiajs/html";
import { Customer } from "../../../models/customer.model";
import { Order } from "../../../models/order.model";
import type { QueryT, StoreT } from "../../../pages/dashboard";
import { convertToNaira } from "../../../utils";
import AddIcon from "../../share/add-icon";
import Modal from "../../share/modal";
import { OrderCreateForm } from "../../share/order-create";
import Table from "../../share/table";
import RefillStatusUpdate from "./refill-status-update";

type OrderPropsT = {
  query: QueryT;
  store: StoreT;
};
const renderNoOrderYet = () => {
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
};

export function Orders({
  query,
  store: {
    user: { userId, role },
  },
}: OrderPropsT) {
  const isCustomer = role === "customer";

  const updatedQuery = {
    ...query,
    page: query.page ? +query.page : undefined,
    size: query.size ? +query.size : undefined,
  };
  const { data, metadata } = isCustomer
    ? Order.findAllByUserId(userId, updatedQuery)
    : Order.findAll(updatedQuery);

  if (!data.length) return renderNoOrderYet();

  const orderedList = data.map(
    ({
      id,
      updatedAt,
      userId,
      createdAt,
      pricePerKg,
      deliveryFee,
      price,
      status,
      quantity,
      cylinderUnit,
      address,
      phone,
      ...rest
    }) => {
      return {
        id,
        createdAt: new Date(createdAt ?? "").toLocaleString(),
        status,
        cylinderUnit,
        quantity,
        pricePerKg: convertToNaira(pricePerKg),
        price: convertToNaira(price),
        deliveryFee: convertToNaira(deliveryFee),
        address,
        phone,
        username: Customer.findById(userId)?.username,
        ...rest,
      };
    },
  );

  return (
    <div>
      <script type="module" src="public/js/order.js" />

      {isCustomer && (
        <Modal
          id="refill-dialog"
          closeBtnId="refill-dialog-close"
          title="Refill Order"
        >
          <OrderCreateForm />
        </Modal>
      )}
      {role !== "driver" && (
        <Modal
          title="Update Status"
          id="refill-status-dialog"
          closeBtnId="refill-status-close"
        >
          <RefillStatusUpdate />
        </Modal>
      )}

      <Table
        title="Orders"
        cssId="order-table"
        cssAddId="order-add"
        page={query.page}
        pageSize={query.size}
        data={orderedList}
        metadata={metadata}
        allowAdd={isCustomer}
        allowDelete={false}
      />
    </div>
  );
}
