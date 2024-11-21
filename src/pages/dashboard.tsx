import { Html } from "@elysiajs/html";
import { t } from "elysia";
import { Info } from "../page-components/dashboard/dash-info";
import { Greeting } from "../page-components/dashboard/greeting";
import { Options } from "../page-components/dashboard/options";
import { TabBody } from "../page-components/dashboard/tab-body";
import { TabHeader } from "../page-components/dashboard/tab-header";
import Footer from "../page-components/share/footer";
import Head from "../page-components/share/head";
import Header from "../page-components/share/header";
import type { UserT } from "../services/permit.service";

export type QueryT = {
	tab: "orders" | "feedbacks";
	page?: string;
	pagesize?: string; // queries are lowercased
};
export type StoreT = {
	user: UserT;
};
export type PropsT = {
	query: QueryT;
	store: StoreT;
};

export const dashboardPropsSchema = t.Object({
	tab: t.UnionEnum(["orders", "feedbacks"]),
	page: t.Optional(t.String()),
	/**N.B: url queries are usually in lower case */
	pagesize: t.Optional(t.String()),
});

export default function DashboardPage({ query, store }: PropsT) {
	return (
		<html lang="en">
			<Head
				heads={[
					<title key="1">Dukadan | Dashboard</title>,
					<link key="2" rel="stylesheet" href="public/css/global.css" />,
					<link key="3" rel="stylesheet" href="public/css/dashboard.css" />,
				]}
			/>
			<body>
				<Header />
				<Options store={store} />
				<div class="container">
					<Greeting store={store} />
					<Info role={store.user.role} />
					<TabHeader tab={query.tab} role={store.user.role} />
					<TabBody query={query} store={store} />
				</div>
				<Footer />
			</body>
		</html>
	);
}
