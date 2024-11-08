import { Html } from "@elysiajs/html";
import type { StoreT } from "../../pages/dashboard";

type PropsT = {
	store: StoreT;
};
export function Options({ store }: PropsT) {
	const isOwnerOrAdmin = ["owner", "admin"].includes(store.user.role);
	return (
		<div id="options">
			<small id="feedback-btn" title="Send a feedback">
				Feedback
			</small>
			<small id="setting-btn">{isOwnerOrAdmin ? "Settings" : ""}</small>
			<dialog id="feedback-dialog">
				<h4>
					<span>Feedback</span>
					<span id="feedback-dialog-close">Close</span>
				</h4>
				<form method="dialog">
					<textarea
						required
						name="feedback-msg"
						placeholder="Enter message here..."
					/>
					<button type="submit">send</button>
				</form>
				<div id="feedback-response">
					<p />
				</div>
			</dialog>
		</div>
	);
}
