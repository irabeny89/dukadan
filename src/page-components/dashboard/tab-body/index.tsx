import { Html } from "@elysiajs/html";
import type { PropsT } from "../../../pages/dashboard";
import { Feedbacks } from "./feedbacks";
import { Orders } from "./orders";

export const TabBody = ({
	query,
	store: {
		user: { userId, role },
	},
}: PropsT) => {
	if (query.tab === "orders") return <Orders query={query} userId={userId} />;
	if (query.tab === "feedbacks" && role === "owner")
		return <Feedbacks query={query} />;
	return null;
};
