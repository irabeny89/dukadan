import { Html } from "@elysiajs/html";
import type { QueryT } from "../../pages/dashboard";
import type { UserRoleT } from "../../types";

type Props = {
  tab: QueryT["tab"];
  role: UserRoleT;
};
export const TabHeader = ({ tab, role }: Props) => {
  return (
    <div id="tabs">
      <link rel="stylesheet" href="public/css/tab-header.css" />

      <a href="/dashboard?tab=orders">
        <h5 id="orders-tab" class={tab === "orders" ? "active" : undefined}>
          Orders
        </h5>
      </a>
      {role === "owner" && (
        <a href="/dashboard?tab=feedbacks">
          <h5
            id="feedbacks-tab"
            class={tab === "feedbacks" ? "active" : undefined}
          >
            Feedbacks
          </h5>
        </a>
      )}
    </div>
  );
};
