import { Html } from "@elysiajs/html";
import { t } from "elysia";
import paginator from "../lib/paginator";
import { Order } from "../models/order.model";
import type { UserT } from "../services/permit.service";
import Head from "./share/head";
import Header from "./share/header";
import Table from "./share/table";

type QueryT = {
	tab: "orders";
	page?: string;
	pageSize?: string;
};
type StoreT = {
	user: UserT;
};
type PropsT = {
	query: QueryT;
	store: StoreT;
};
type TabPropsT = PropsT;

export const dashboardPropsSchema = t.Object({
	tab: t.UnionEnum(["orders"]),
	page: t.Optional(t.String()),
	pageSize: t.Optional(t.String()),
});

const TabHeader = () => {
	return (
		<div class="tabs">
			<input type="radio" id="radio-1" name="tabs" checked />
			<label class="tab" for="radio-1">
				Orders
				{/* <span class="notification">2</span> */}
			</label>
			{/* <input type="radio" id="radio-2" name="tabs" />
<label class="tab" for="radio-2">
  Profile
</label> */}
			{/* <input type="radio" id="radio-3" name="tabs" />
							<label class="tab" for="radio-3">
								Completed
							</label> */}
			<span class="glider" />
		</div>
	);
};
const TabBody = ({ query, store }: TabPropsT) => {
	if (query.tab === "orders") {
		const page = +(query.page ?? 1);
		const pageSize = +(query.pageSize ?? 10);
		const orders = Order.findAllByUserId(store.user.userId);
		const { data, metadata } = paginator(orders, {
			page,
			pageSize,
		});
		return (
			<Table
				cssId="order"
				bodyRows={[]}
				hasNextPage={metadata.hasNextPage}
				hasPrevPage={metadata.hasPrevPage}
				headerTitles={[]}
				page={metadata.page}
				pageCount={metadata.pageCount}
				pageSize={metadata.pageSize}
				title="Orders"
				totalItems={metadata.totalItems}
				allowAdd={true}
				allowDelete={false}
			/>
		);
	}
	return null;
};

export default function DashboardPage({ query, store }: PropsT) {
	return (
		<html lang="en">
			<Head
				heads={[
					<title key="1">Dukadan | Dashboard</title>,
					<link key="2" rel="stylesheet" href="public/css/dashboard.css" />,
					<script key="3" type="module" src="public/js/dashboard.js" />,
				]}
			/>
			<body>
				<Header />
				<div id="options">
					<small id="feedback-btn" title="Send a feedback">
						Feedback
					</small>
					<small id="setting-btn">Settings</small>
				</div>
				<div class="container">
					<h4 id="greeting">
						Welcome <span id="username" />
					</h4>
					<dialog id="feedback-dialog">
						<h4>
							<span>Feedback</span>
							<span id="feedback-dialog-close">Close</span>
						</h4>
						<form method="dialog">
							<textarea
								required
								name="feedback-msg"
								placeholder="Enter message here..."
							/>
							<button type="submit">send</button>
						</form>
						<div id="feedback-response">
							<p />
						</div>
					</dialog>
					<TabHeader />
					{/* <TabBody query={query} store={store} /> */}
				</div>
			</body>
		</html>
	);
}
