import { Html } from "@elysiajs/html";
import Modal from "./modal";

const FeedbackForm = () => (
	<>
		<form method="dialog">
			<textarea
				required
				name="feedback-msg"
				placeholder="Enter message here..."
				rows="5"
			/>
			<button type="submit">send</button>
		</form>
	</>
);
export function FeedbackOption() {
	return (
		<div>
			<script type="module" src="public/js/feedback-form.js" />
			<link rel="stylesheet" href="public/css/feedback.css" />
			<Modal
				title="Feedback"
				id="feedback-dialog"
				closeBtnId="feedback-dialog-close"
			>
				<FeedbackForm />
			</Modal>
			<small id="feedback-btn" title="Send a feedback">
				Feedback
			</small>
		</div>
	);
}
