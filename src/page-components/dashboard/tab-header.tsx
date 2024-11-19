import { Html } from "@elysiajs/html";
import type { QueryT } from "../../pages/dashboard";

type Props = Pick<QueryT, "tab">;
export const TabHeader = ({ tab }: Props) => {
  return (
    <div id="tabs">
      <link rel="stylesheet" href="public/css/tab-header.css" />

      <a href="/dashboard?tab=orders">
        <h5 id="orders-tab" class={tab === "orders" ? "active" : undefined}>
          Orders
        </h5>
      </a>
      <a href="/dashboard?tab=feedbacks">
        <h5
          id="feedbacks-tab"
          class={tab === "feedbacks" ? "active" : undefined}
        >
          Feedbacks
        </h5>
      </a>
    </div>
  );
};
