import { Html } from "@elysiajs/html";
import type { PropsT } from "../../../pages/dashboard";
import { Feedbacks } from "./feedbacks";
import { Orders } from "./orders";

export const TabBody = ({ query, store }: PropsT) => {
	if (query.tab === "orders") return <Orders query={query} store={store} />;
	if (query.tab === "feedbacks" && store.user.role === "owner")
		return <Feedbacks query={query} />;
	return null;
};
