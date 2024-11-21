import { Html } from "@elysiajs/html";
import paginator from "../../../lib/paginator";
import { Customer } from "../../../models/customer.model";
import { Order } from "../../../models/order.model";
import type { QueryT, StoreT } from "../../../pages/dashboard";
import { convertToNaira, createTitleFromObjectKeys } from "../../../utils";
import AddIcon from "../../share/add-icon";
import Modal from "../../share/modal";
import { OrderCreateForm } from "../../share/order-create";
import Table from "../../share/table";

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

const RefillStatusUpdate = () => {
  return (
    <div>
      <div class="x-axis">
        <button id="pending-status-btn" type="button">
          PENDING
        </button>
        <button id="processing-status-btn" type="button">
          PROCESSING
        </button>
        <button id="done-status-btn" type="button">
          DONE
        </button>
      </div>
      <hr />
      <br />
      <small>Current Status:</small>
      <div id="status" />
      <br />
      <small>Address:</small>
      <div id="customer-address" />
      <br />
      <small>Cylinder Size:</small>
      <div id="cylinder-size" />
    </div>
  );
};
export function Orders({
  query: { tab, page, pagesize },
  store: {
    user: { userId, role },
  },
}: OrderPropsT) {
  const orders = Order.findAllByUserId(userId);
  if (!orders.length) return renderNoOrderYet();

  const data = orders.map(
    ({ id, updatedAt, userId, createdAt, deliveryFee, price, ...rest }) => {
      return {
        username: Customer.findById(userId)?.username,
        createdAt: new Date(createdAt ?? "").toLocaleString(),
        deliveryFee: convertToNaira(deliveryFee),
        price: convertToNaira(price),
        ...rest,
      };
    },
  );

  const isCustomer = role === "customer";
  const isOwnerOrAdmin = ["owner", "admin"].includes(role);

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
      {isOwnerOrAdmin && (
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
        page={page}
        pageSize={pagesize}
        data={data}
        allowAdd={isCustomer}
        allowDelete={false}
      />
    </div>
  );
}
