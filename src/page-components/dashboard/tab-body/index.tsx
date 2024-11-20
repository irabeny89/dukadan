import { Html } from "@elysiajs/html";
import type { PropsT } from "../../../pages/dashboard";
import { Orders } from "./orders";
import { Feedbacks } from "./feedbacks";

export const TabBody = ({
  query,
  store: {
    user: { userId },
  },
}: PropsT) => {
  if (query.tab === "orders") return <Orders query={query} userId={userId} />;
  if (query.tab === "feedbacks") return <Feedbacks query={query} />;
  return null;
};
