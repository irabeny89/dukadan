import { Html } from "@elysiajs/html";
import { Info } from "../page-components/dashboard/dash-info";
import { Greeting } from "../page-components/dashboard/greeting";
import { Options } from "../page-components/dashboard/options";
import { TabBody } from "../page-components/dashboard/tab-body";
import { TabHeader } from "../page-components/dashboard/tab-header";
import Footer from "../page-components/share/footer";
import Head from "../page-components/share/head";
import Header from "../page-components/share/header";
import type { UserT } from "../services/permit.service";
import { t } from "elysia";

export type QueryT = {
  tab: "orders";
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
  tab: t.UnionEnum(["orders"]),
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
          <script key="4" type="module" src="public/js/dashboard.js" />,
        ]}
      />
      <body>
        <Header />
        <Options store={store} />
        <div class="container">
          <Greeting store={store} />
          <Info role={store.user.role} />
          <TabHeader tab={query.tab} />
          <TabBody query={query} store={store} />
        </div>
        <Footer />
      </body>
    </html>
  );
}
