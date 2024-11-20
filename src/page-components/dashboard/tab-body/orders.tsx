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

export function Orders({
	query,
	store: {
		user: { userId, role },
	},
}: OrderPropsT) {
	const orders = Order.findAllByUserId(userId);
	if (!orders.length) return renderNoOrderYet();

	const { data, metadata } = paginator(orders, {
		page: +(query.page ?? 1),
		pageSize: +(query.pagesize ?? 10),
	});
	const tableOrders = data.map(
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
	const headerTitles: string[] = createTitleFromObjectKeys(tableOrders[0]);
	const bodyRows = tableOrders.map(Object.values);

	return (
		<div>
			<Modal
				id="refill-dialog"
				closeBtnId="refill-dialog-close"
				title="Refill Order"
			>
				<OrderCreateForm />
			</Modal>

			<Table
				title="Orders"
				cssId="order-table"
				cssAddId="order-add"
				headerTitles={headerTitles}
				bodyRows={bodyRows}
				hasNextPage={metadata.hasNextPage}
				hasPrevPage={metadata.hasPrevPage}
				page={metadata.page}
				pageCount={metadata.pageCount}
				pageSize={metadata.pageSize}
				totalItems={metadata.totalItems}
				allowAdd={role === "customer"}
				allowDelete={false}
			/>
		</div>
	);
}
