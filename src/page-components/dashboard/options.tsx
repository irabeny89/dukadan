import { Html } from "@elysiajs/html";
import type { StoreT } from "../../pages/dashboard";
import { FeedbackOption } from "../share/feedback-option";
import Logout from "../share/logout";

type PropsT = {
	store: StoreT;
};
export function Options({ store }: PropsT) {
	const isCustomer = "customer" === store.user.role;
	return (
		<div id="options">
			{isCustomer && <FeedbackOption />}
			<Logout />
		</div>
	);
}
