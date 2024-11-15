import { Html } from "@elysiajs/html";
import type { QueryT } from "../../pages/dashboard";

type Props = Pick<QueryT, "tab">;
export const TabHeader = ({ tab }: Props) => {
  return (
    <div id="tabs">
      <link rel="stylesheet" href="public/css/tab-header.css" />

      <h5 id="orders-tab" class={tab === "orders" ? "active" : undefined}>
        Orders
      </h5>
    </div>
  );
};
