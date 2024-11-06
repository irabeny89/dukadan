import { Html } from "@elysiajs/html";
import { t } from "elysia";
import type { UserT } from "../services/permit.service";
import Head from "../page-components/share/head";
import Header from "../page-components/share/header";
import { TabBody } from "../page-components/dashboard/tab-body";
import { TabHeader } from "../page-components/dashboard/tab-header";
import { Info } from "../page-components/dashboard/dash-info";
import { Options } from "../page-components/dashboard/options";
import { Greeting } from "../page-components/dashboard/greeting";

type QueryT = {
  tab: "orders";
  page?: string;
  pageSize?: string;
};
export type StoreT = {
  user: UserT;
};
export type PropsT = {
  query: QueryT;
  store: StoreT;
};

export const dashboardPropsSchema = t.Object({
  tab: t.UnionEnum(["orders"]),
  page: t.Optional(t.String()),
  pageSize: t.Optional(t.String()),
});

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
        <Options store={store} />
        <div class="container">
          <Greeting store={store} />
          <Info />
          <TabHeader />
          <TabBody query={query} store={store} />
        </div>
      </body>
    </html>
  );
}
